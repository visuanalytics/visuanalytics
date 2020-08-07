import json
import logging
import os
import shutil
import time
import traceback
from datetime import datetime

from visuanalytics.analytics.apis.api import api_request, api
from visuanalytics.analytics.control.procedures.step_data import StepData
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
               0: {"name": "Apis", "call": api},
               1: {"name": "Transform", "call": transform},
               2: {"name": "Storing", "call": storing},
               3: {"name": "Images", "call": generate_all_images},
               4: {"name": "Thumbnail", "call": thumbnail},
               5: {"name": "Audios", "call": generate_audios},
               6: {"name": "Sequence", "call": link},
               7: {"name": "Ready"}}
    __steps_max = 7
    __log_states = {"running": 0, "finished": 1, "error": -1}

    def __init__(self, job_id: int, pipeline_id: str, step_name: str, steps_config=None, log_to_db=False):
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

    @property
    def start_time(self):
        """float: Startzeit der Pipeline. Wird erst bei dem Aufruf von :func:`start` initialisiert."""
        return self.__start_time

    @property
    def end_time(self):
        """float: Endzeit der Pipeline. Wird erst nach Beendigung der Pipeline initialisiert."""
        return self.__end_time

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

    def __setup(self):
        logger.info(f"Initializing Pipeline {self.id}...")

        self.__start_time = time.time()

        # Insert job into Table
        log_id = self.__update_db(insert_log, self.__job_id, self.__log_states["running"], round(self.__start_time))
        self.__log_id = log_id

        # Load json config file
        with resources.open_resource(f"steps/{self.__step_name}.json") as fp:
            self.__config = json.loads(fp.read())

        # Init out_time
        self.__config["out_time"] = datetime.fromtimestamp(self.__start_time).strftime(DATE_FORMAT)

        os.mkdir(resources.get_temp_resource_path("", self.id))

        logger.info(f"Inizalization finished!")

    def __update_db(self, func: callable, *args, **kwargs):
        if self.__log_to_db:
            return func(*args, **kwargs)

    def __on_completion(self, values: dict, data: StepData):
        delete_video(self.steps_config, self.__config)

        # Set state to ready
        self.__current_step = self.__steps_max

        # Set endTime and log
        self.__end_time = time.time()
        completion_time = round(self.__end_time - self.__start_time, 2)
        logger.info(f"Pipeline {self.id} finished in {completion_time}s")

        # Update DB logs
        self.__update_db(update_log_finish, self.__log_id, self.__log_states["finished"], completion_time)

        cp_request = data.get_config("on_completion")

        # IF ON Completion is in config send Request
        if cp_request is not None:
            try:
                logger.info("Send completion notice...")

                # Save Video Name and Thumbnail name to Config
                video_name = os.path.basename(values["sequence"])

                data.insert_data("_conf|video_path", values["sequence"], {})
                data.insert_data("_conf|video_name", video_name, {})
                data.insert_data("_conf|video_id", os.path.splitext(video_name)[0], {})

                if isinstance(values["thumbnail"], str):
                    thumbnail_name = os.path.basename(values["thumbnail"])

                    data.insert_data("_conf|thumbnail_path", values["thumbnail"], {})
                    data.insert_data("_conf|thumbnail_name", thumbnail_name, {})
                    data.insert_data("_conf|thumbnail_id", os.path.splitext(thumbnail_name)[0], {})

                # Make request
                api_request(cp_request, data, "", "_comp", True)

                logger.info("Completion report sent out!")
            except Exception:
                logger.exception("Completion report could not be sent: ")

    def __cleanup(self):
        # delete Directory
        logger.info("Cleaning up...")
        shutil.rmtree(resources.get_temp_resource_path("", self.id), ignore_errors=True)
        logger.info("Finished cleanup!")

    def start(self):
        """Führt alle Schritte, die in der übergebenen Instanz der Klasse :class:`Steps` definiert sind, aus.

        Initialisiert zuerst einen Pipeline-Ordner mit der Pipeline id. Dieser kann dann in der gesamten Pipeline zur
        Zwichenspeicherung von Dateien verwendet werden. Dieser wird nach Beendigung oder bei einem Fehlerfall wieder gelöscht.

        Führt alle Schritte aus der übergebenen Steps Instanz, die in der Funktion :func:`sequence` definiert sind,
        der Reihenfolge nach aus. Mit der Ausnahme von allen Steps mit der id < 0 und >= `step_max`.

        :return: Wenn ohne Fehler ausgeführt `True`, sonst `False`
        :rtype: bool
        """
        try:
            self.__setup()
            data = StepData(self.steps_config, self.id, self.__config.get("presets", None))

            logger.info(f"Pipeline {self.id} started!")

            for self.__current_step in range(0, self.__steps_max):
                logger.info(f"Next step: {self.current_step_name()}")

                # Execute Step
                self.__steps[self.__current_step].get("call", lambda: None)(self.__config, data)

                logger.info(f"Step finished: {self.current_step_name()}!")

            self.__on_completion(self.__config, data)
            self.__cleanup()
            return True
        except (KeyboardInterrupt, SystemExit):
            # TODO (max) db updaten und current_step setzen
            self.__cleanup()
            raise
        except Exception as e:
            self.__current_step = -2

            if not self.__log_id is None:
                self.__update_db(update_log_error,
                                 self.__log_id,
                                 self.__log_states["error"],
                                 f"{e.__class__.__name__}: {e}",
                                 traceback.format_exc())

            logger.exception(f"An error occurred: ")
            logger.info(f"Pipeline {self.id} could not be finished.")
            self.__cleanup()
            return False
