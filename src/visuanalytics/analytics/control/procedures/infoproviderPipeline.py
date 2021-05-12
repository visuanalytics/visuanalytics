from visuanalytics.analytics.control.procedures.pipeline import Pipeline
from visuanalytics.analytics.apis.api import api_request, api
from visuanalytics.analytics.transform.transform import transform
from visuanalytics.analytics.storing.storing import storing


class InfoproviderPipeline(Pipeline):
    """
    Enthält alle Informationen zu einer Infoprovider_Pipeline und führt die Steps Api, Transform und Storing aus.

    Benötigt beim Erstellen eine id und eine Instanz der Klasse :class:`Steps` bzw. einer Unterklasse von :class:`Steps`.
    Bei dem Aufruf von Start werden alle Steps der Reihe nach ausgeführt.
    """
    __steps = {-2: {"name": "Error"},
               -1: {"name": "Not Started"},
               0: {"name": "Apis", "call": api},
               1: {"name": "Transform", "call": transform},
               2: {"name": "Storing", "call": storing}}
    __steps_max = 2

    def __setup(self):
        logger.info(f"Initializing {self.__log_name} {self.id}...")

        self.__start_time = time.time()

        # Insert job into Table
        log_id = self.__update_db(insert_log, self.__job_id, self.__log_states["running"], round(self.__start_time))
        self.__log_id = log_id

        # Load json config file
        with resources.open_resource(f"infoproviders/{self.__step_name}.json") as fp:
            self.__config = json.loads(fp.read())

        # Load and merge global presets
        with resources.open_resource(f"infoproviders/global_presets.json") as fp:
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
