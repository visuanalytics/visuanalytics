import contextlib
import json
import logging
import os
import shutil
import time
import traceback
from datetime import datetime

from visuanalytics.analytics.apis.api import api_request, api
from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.precondition.precondition import precondition
from visuanalytics.analytics.processing.audio.audio import generate_audios
from visuanalytics.analytics.processing.image.visualization import generate_all_images
from visuanalytics.analytics.sequence.sequence import link
from visuanalytics.analytics.storing.storing import storing
from visuanalytics.analytics.thumbnail.thumbnail import thumbnail
from visuanalytics.analytics.transform.transform import transform
from visuanalytics.analytics.util.video_delete import delete_video
from visuanalytics.server.db.job import insert_log, update_log_finish, update_log_error
from visuanalytics.util import resources
from visuanalytics.util.resources import DATE_FORMAT

logger = logging.getLogger(__name__)


class Pipeline(object):
    """Enthält alle Informationen zu einer Pipeline und führt alle Steps aus.

    Benötigt beim Erstellen eine id und eine Instanz der Klasse :class:`Steps` bzw. einer Unterklasse von :class:`Steps`.
    Bei dem Aufruf von Start werden alle Steps der Reihe nach ausgeführt.
    """
    __steps = {-2: {"name": "Error"},
               -1: {"name": "Not Started"},
               0: {"name": "Precondition", "call": precondition},
               1: {"name": "Apis", "call": api},
               2: {"name": "Transform", "call": transform},
               3: {"name": "Storing", "call": storing},
               4: {"name": "Images", "call": generate_all_images},
               5: {"name": "Thumbnail", "call": thumbnail},
               6: {"name": "Audios", "call": generate_audios},
               7: {"name": "Sequence", "call": link},
               8: {"name": "Ready"}}
    __steps_max = 8
    __log_states = {"running": 0, "finished": 1, "error": -1}

    def __init__(self, job_id: int, pipeline_id: str, step_name: str, steps_config=None, log_to_db=False,
                 attach_mode=False, no_tmp_dir=False):
        if steps_config is None:
            steps_config = {}

        self.__step_name = step_name
        self.steps_config = steps_config
        self.__start_time = 0.0
        self.__end_time = 0.0
        self.__job_id = job_id
        self.__id = pipeline_id
        self.__config = {}
        self.__current_step = -1
        self.__log_to_db = log_to_db
        self.__log_id = None
        self.__attach_mode = attach_mode
        self.__no_tmp_dir = no_tmp_dir
        self.__log_name = 'Pipeline' if not attach_mode else 'Attached Pipeline'

    @property
    def start_time(self):
        """float: Startzeit der Pipeline. Wird erst bei dem Aufruf von :func:`start` initialisiert."""
        return self.__start_time

    @property
    def end_time(self):
        """float: Endzeit der Pipeline. Wird erst nach Beendigung der Pipeline initialisiert."""
        return self.__end_time

    @property
    def config(self):
        """float: config der pipeline. Wird erst nach Beendigung der Pipeline initialisiert."""
        return self.__config

    @property
    def current_step(self):
        """int: Aktueller Step der pipeline. Wird erst nach Beendigung der Pipeline initialisiert."""
        return self.__current_step

    @property
    def id(self):
        """str: id der Pipeline."""
        return self.__id

    def progress(self):
        """Fortschritt der Pipeline.

        :return: Anzahl der schon ausgeführten Schritte, Anzahl aller Schritte.
        :rtype: int, int
        """
        return self.__current_step + 1, self.__steps_max + 1

    def current_step_name(self):
        """Gibt den Namen des aktuellen Schritts zurück.

        :return: Name des aktuellen Schritts.
        :rtype: str
        """
        return self.__steps[self.__current_step]["name"]

    def __get_default_config(self, run_config: dict):
        default_config = {}
        for c, v in run_config.items():
            # If config has sub_params: include all sub_params
            if v["type"] == "sub_params":
                default_config.update(self.__get_default_config(v["sub_params"]))

            default_config[c] = v.get("default_value", None)

        return default_config

    def __setup(self):
        logger.info(f"Initializing {self.__log_name} {self.id}...")

        self.__start_time = time.time()

        # Insert job into Table
        log_id = self.__update_db(insert_log, self.__job_id, self.__log_states["running"], round(self.__start_time))
        self.__log_id = log_id

        # Load json config file
        with resources.open_resource(f"steps/{self.__step_name}.json") as fp:
            self.__config = json.loads(fp.read())

        # Load and merge global presets
        with resources.open_resource(f"steps/global_presets.json") as fp:
            global_presets = json.loads(fp.read())

        self.__config["presets"] = {**global_presets.get("presets", {}), **self.__config.get("presets", {})}

        if not self.__no_tmp_dir:
            os.mkdir(resources.get_temp_resource_path("", self.id))

        # Init Steps config with default config
        steps_config = self.__get_default_config(self.__config.get("run_config", {}))
        steps_config.update(self.steps_config)
        self.steps_config = steps_config

        # Init out_time
        self.__config["out_time"] = datetime.fromtimestamp(self.__start_time).strftime(DATE_FORMAT)

        logger.info(f"Initialization finished!")

    def __update_db(self, func: callable, *args, **kwargs):
        if self.__log_to_db:
            return func(*args, **kwargs)

    def __on_completion(self, values: dict, data: StepData):
        # Set state to ready
        self.__current_step = self.__steps_max

        # Set endTime and log
        self.__end_time = time.time()
        completion_time = round(self.__end_time - self.__start_time, 2)

        logger.info(f"{self.__log_name}  {self.id} finished in {completion_time}s")

        # Update DB logs
        self.__update_db(update_log_finish, self.__log_id, self.__log_states["finished"], completion_time)

        if self.__attach_mode:
            return

        # Check and delete video
        delete_video(self.steps_config, self.__config)

        cp_request = data.get_config("on_completion")

        # IF ON Completion is in config send request
        if cp_request is not None:
            try:
                logger.info("Send completion notice...")

                # Save video name and thumbnail name to config
                video_name = os.path.basename(values["sequence"])

                data.insert_data("_conf|video_path", values["sequence"], {})
                data.insert_data("_conf|video_name", video_name, {})
                data.insert_data("_conf|video_id", os.path.splitext(video_name)[0], {})

                if isinstance(values["thumbnail"], str):
                    thumbnail_name = os.path.basename(values["thumbnail"])

                    data.insert_data("_conf|thumbnail_path", values["thumbnail"], {})
                    data.insert_data("_conf|thumbnail_name", thumbnail_name, {})
                    data.insert_data("_conf|thumbnail_id", os.path.splitext(thumbnail_name)[0], {})

                # make request
                api_request(cp_request, data, "", "_comp", True)

                logger.info("Completion report sent out!")
            except Exception:
                logger.exception("Completion report could not be sent: ")

    def __cleanup(self):
        if self.__no_tmp_dir:
            return

            # delete directory
        logger.info("Cleaning up...")
        shutil.rmtree(resources.get_temp_resource_path("", self.id), ignore_errors=True)
        logger.info("Finished cleanup!")

    def __error_cleanup(self, e: Exception):
        # If thumbnail was created and the video wasn`t generated -> remove thumbnail
        if isinstance(self.__config.get("thumbnail", None), str) and self.__current_step != self.__steps_max:
            print(self.__config["thumbnail"])
            with contextlib.suppress(FileNotFoundError):
                os.remove(self.__config["thumbnail"])

        self.__current_step = -2

        if not self.__log_id is None:
            self.__update_db(update_log_error,
                             self.__log_id,
                             self.__log_states["error"],
                             f"{e.__class__.__name__}: {e}",
                             traceback.format_exc())

        logger.exception(f"An error occurred: ")
        logger.info(f"{self.__log_name}  {self.id} could not be finished.")

        self.__cleanup()

    def start(self):
        """Führt alle Schritte aus, die in der übergebenen Instanz der Klasse :class:`Steps` definiert sind.

        Initialisiert zuerst einen Pipeline-Ordner mit der Pipeline-ID. Dieser kann dann in der gesamten Pipeline zur
        Zwichenspeicherung von Dateien verwendet werden. Dieser wird nach Beendigung oder bei einem Fehlerfall wieder gelöscht.

        Führt alle Schritte aus der übergebenen Steps Instanz, die in der Funktion :func:`sequence` definiert sind,
        der Reihenfolge nach aus. Mit der Ausnahme von allen Steps mit der id < 0 und >= `step_max`.

        :return: Wenn ohne Fehler ausgeführt `True`, sonst `False`
        :rtype: bool
        """
        try:
            self.__setup()
            data = StepData(self.steps_config, self.id, self.__job_id, self.__config.get("presets", None))

            logger.info(f"{self.__log_name}  {self.id} started!")

            for self.__current_step in range(0, self.__steps_max):
                logger.info(f"Next step: {self.current_step_name()}")

                # Execute Step
                self.__steps[self.__current_step].get("call", lambda: None)(self.__config, data)

                logger.info(f"Step finished: {self.current_step_name()}!")

            self.__on_completion(self.__config, data)
            self.__cleanup()

            return True
        except (KeyboardInterrupt, SystemExit) as e:
            self.__error_cleanup(e)
            raise
        except Exception as e:
            self.__error_cleanup(e)

            if self.__attach_mode:
                raise

            return False
