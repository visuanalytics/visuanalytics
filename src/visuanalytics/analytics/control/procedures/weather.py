from visuanalytics.analytics.apis import weather as api
from visuanalytics.analytics.control.procedures.steps import Steps
from visuanalytics.analytics.preprocessing import weather as pre
from visuanalytics.analytics.processing.weather import visualisation as wv

# TODO(Max) not ready yet

# TODO(Max) vtl remove
TESTING_MODE = 1


class WeatherSteps(Steps):
    def __init__(self, config):
        super().__init__(config)
        self.__json_data = []
        self.__processed_data = {}

    def apis(self, pipeline_id: str):
        if TESTING_MODE:
            self.__json_data = api.get_example()
        else:
            self.__json_data = api.get_forecasts()

    def preprocessing(self, pipeline_id: str):
        data = pre.preprocess_weather_data(self.__json_data)
        # clear JSON data (vtl. remove)
        self.__json_data = None

        self.__processed_data = {"ico_three": pre.get_ico_three(data),
                                 "temp_mm_three": pre.get_temp_mm_three(data),
                                 "ico_tomorow": pre.get_ico_tomorow(data),
                                 "temp_tomorow": pre.get_temp_tomorow(data)}

    def processing(self, pipeline_id: str):
        wv.get_three_pic(self.__processed_data["ico_three"], self.__processed_data["temp_mm_three"])
        wv.get_tomo_icons(self.__processed_data["ico_tomorow"])
        wv.get_tomo_temperatur(self.__processed_data["temp_tomorow"])

    def linking(self, pipeline_id: str):
        pass
