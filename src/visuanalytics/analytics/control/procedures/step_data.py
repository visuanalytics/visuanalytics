from visuanalytics.analytics.util import config_manager
from visuanalytics.analytics.util.step_pattern import StepPatternFormatter, data_insert_pattern, data_get_pattern


class StepData(object):
    def __init__(self, run_config):
        super().__init__()
        self.__data = {"_conf": run_config}
        self.__formatter = StepPatternFormatter()

    @staticmethod
    def get_api_key(api_key_name):
        return config_manager.get_private()["api_keys"][api_key_name]

    @staticmethod
    def save_loop(values: dict, idx, current):
        values["_loop_states"] = {"_idx": idx, "_loop": current}

    def save_loop_key(self, values: dict, idx, key):
        values["_loop_states"] = {"_idx": idx, "_key": self.get_data(key, values)}

    @property
    def data(self):
        return self.__data

    def init_data(self, data: dict):
        self.__data.update(data)

    def get_data(self, key_string: str, values: dict):
        data = {**self.__data, **values.get("_loop_states", {})}
        key_string = self.__formatter.format(key_string, data)

        return data_get_pattern(key_string, data)

    def format_api(self, value_string: str, api_key_name: str):
        return self.__formatter.format(value_string, {**self.__data, "_api_key": self.get_api_key(api_key_name)})

    def format(self, value_string: str, values: dict):
        data = {**self.__data, **values.get("_loop_states", {})}
        return self.__formatter.format(value_string, data)

    def insert_data(self, key_string: str, value, values: dict):
        self.__data = {**self.__data, **values.get("_loop_states", {})}
        key_string = self.__formatter.format(key_string, self.__data)

        data_insert_pattern(key_string, self.__data, value)

        # Remove temporary Used data
        # TODO(Max) vtl. solve better
        self.__data.pop("_loop", None)
        print(self.__data.pop("_key", None))
        self.__data.pop("_idx", None)
