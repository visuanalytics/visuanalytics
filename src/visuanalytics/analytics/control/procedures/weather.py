from visuanalytics.analytics.preprocessing.weather import speech as pre_speech
from visuanalytics.analytics.apis import weather as api
from visuanalytics.analytics.control.procedures.steps import Steps
from visuanalytics.analytics.linking import weather as linking
from visuanalytics.analytics.preprocessing.weather import visualisation as pre_visualisation, transform
from visuanalytics.analytics.processing.weather import visualisation as pro_visualisation, speech
from visuanalytics.analytics.util import date_time, audio


# TODO(max) handle config not


class WeatherSteps(Steps):
    """Schritte für das Erstellen eines Wetterberichtes"""

    def __init__(self, config):
        super().__init__(config)
        self.__json_data = []
        self.__preprocessed_data = {}
        self.__processed_data = {}

    def apis(self, pipeline_id: str):
        """Holt die APi Daten von der Wetter Api.

        :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
        :type pipeline_id: str
        """
        # if testing get example
        self.__json_data = api.get_example() if self.config.get("testing", False) else api.get_forecasts()

    def preprocessing(self, pipeline_id: str):
        """Verarbeitet die Daten aus der Wetter API.

        :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
        :type pipeline_id: str
        """
        # Preprocess api data
        data = transform.preprocess_weather_data(self.__json_data)

        # clear JSON data (vtl. remove)
        self.__json_data = None

        # Preprocess visualisation data
        self.__preprocessed_data["date"] = date_time.date_to_weekday(transform.get_first_day(data))
        self.__preprocessed_data["icon_oneday_0"] = pre_visualisation.data_icon_oneday(data, 0)
        self.__preprocessed_data["temp_oneday_0"] = pre_visualisation.data_temp_oneday(data, 0)
        self.__preprocessed_data["icon_oneday_1"] = pre_visualisation.data_icon_oneday(data, 1)
        self.__preprocessed_data["temp_oneday_1"] = pre_visualisation.data_temp_oneday(data, 1)
        self.__preprocessed_data["icon_threeday"] = pre_visualisation.data_icon_threeday(data)
        self.__preprocessed_data["data_mm_temp_threeday"] = pre_visualisation.data_mm_temp_threeday(data)

        # Preprocess speech data
        self.__preprocessed_data["merge_data"] = pre_speech.merge_data(data)

    def processing(self, pipeline_id: str):
        """Erstellt aus den APi Daten, Bilder und Texte.

        :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
        :type pipeline_id: str
        """
        data = self.__preprocessed_data

        # Generate images
        self.__processed_data["images"] = [
            pro_visualisation.get_oneday_icons_image(pipeline_id, data["icon_oneday_0"], data["date"][0]),
            pro_visualisation.get_oneday_temp_image(pipeline_id, data["temp_oneday_0"], data["date"][0]),
            pro_visualisation.get_oneday_icons_image(pipeline_id, data["icon_oneday_1"], data["date"][1]),
            pro_visualisation.get_oneday_temp_image(pipeline_id, data["temp_oneday_1"], data["date"][1]),
            pro_visualisation.get_threeday_image(pipeline_id, data["icon_threeday"], data["data_mm_temp_threeday"],
                                                 data["date"][2:5])]

        # Generate Audio
        self.__processed_data["audios"] = speech.first_weatherforecast_text_to_speech(pipeline_id, data["merge_data"])
        self.__processed_data["audio_length"] = audio.get_audio_length(self.__processed_data["audios"])

        # clean preprocessed data
        self.__preprocessed_data = None

    def linking(self, pipeline_id: str):
        """Baut das Video zusammen.

        :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
        :type pipeline_id: str
        """
        linking.to_forecast_germany(pipeline_id, self.__processed_data["images"], self.__processed_data["audios"],
                                    self.__processed_data["audio_length"])
