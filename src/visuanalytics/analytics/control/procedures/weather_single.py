from visuanalytics.analytics.preprocessing.weather import speech as pre_speech
from visuanalytics.analytics.apis import weather as api
from visuanalytics.analytics.control.procedures.steps import Steps
from visuanalytics.analytics.linking import weather as linking
from visuanalytics.analytics.preprocessing.weather import visualisation as pre_visualisation, transform
from visuanalytics.analytics.processing.weather import visualisation as pro_visualisation, speech, speech_single, \
    visualisation_single
from visuanalytics.analytics.util import date_time, audio


# TODO(max) handle config not


class SingleWeatherSteps(Steps):
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
        self.__json_data = api.get_example(single=True) if self.config.get("testing", False) else api.get_forecasts(
            True,
            self.config.get(
                "cityname"))

    def preprocessing(self, pipeline_id: str):
        """Verarbeitet die Daten aus der Wetter API.

        :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
        :type pipeline_id: str
        """
        # Preprocess api data
        data = transform.preprocess_weather_data(self.__json_data, True)

        # clear JSON data (evtl. remove)
        self.__json_data = None

        # Preprocess visualisation data
        self.__preprocessed_data["date"] = date_time.date_to_weekday(transform.get_first_day(data, self.config.get(
            "cityname")))
        self.__preprocessed_data["data"] = data

    def processing(self, pipeline_id: str):
        """Erstellt aus den APi Daten, Bilder und Texte.

        :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
        :type pipeline_id: str
        """
        data = self.__preprocessed_data

        # Generate images
        self.__processed_data["images"] = visualisation_single.get_all_images_single_city(pipeline_id, data["data"],
                                                                                          data["date"], self.config.get(
                "cityname"))

        # Generate Audio
        self.__processed_data["audios"] = speech_single.get_all_audios_single_city(pipeline_id, data["data"],
                                                                                   data["date"], self.config.get(
                "cityname"))
        self.__processed_data["audio_length"] = audio.get_audio_length(self.__processed_data["audios"])

        # clean preprocessed data
        self.__preprocessed_data = None

    def linking(self, pipeline_id: str):
        """Baut das Video zusammen.

        :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
        :type pipeline_id: str
        """
        linking.to_forecast(pipeline_id, self.__processed_data["images"], self.__processed_data["audios"],
                            self.__processed_data["audio_length"])
