from visuanalytics.analytics.apis import weather as api
from visuanalytics.analytics.control.procedures.steps import Steps
from visuanalytics.analytics.linking import linker as linking
from visuanalytics.analytics.preprocessing.weather import transform, speech
from visuanalytics.analytics.processing.weather import speech_single, visualisation_single
from visuanalytics.analytics.util import date_time, audio
import logging

# TODO(max) handle config not

logger = logging.getLogger(__name__)


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

        if self.config.get("testing", False):
            logger.info("Using stored example data for testing...")
            self.__json_data = api.get_example(single=True)
        else:
            city_name = self.config.get("city_name")
            logger.info(f"Retrieving forecast data for {city_name} from weatherbit-API...")
            self.__json_data = api.get_forecasts(True, city_name)

    def preprocessing(self, pipeline_id: str):
        """Verarbeitet die Daten aus der Wetter API.

        :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
        :type pipeline_id: str
        """
        # Preprocess api data
        logger.info("Transforming local forecast data...")
        data = transform.preprocess_weather_data(self.__json_data, True)

        # clear JSON data (evtl. remove)
        self.__json_data = None

        # Preprocess visualisation data
        logger.info("Preprocessing for visualisation...")
        self.__preprocessed_data["date"] = date_time.date_to_weekday(
            transform.get_first_day_single(data, self.config.get(
                "city_name")))

        # Preprocess speech data
        self.__preprocessed_data["speech_data"] = speech.merge_data_single(data, self.config["city_name"])

        self.__preprocessed_data["data"] = data

    def processing(self, pipeline_id: str):
        """Erstellt aus den APi Daten, Bilder und Texte.

        :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
        :type pipeline_id: str
        """
        data = self.__preprocessed_data

        # Generate images
        city_name = self.config.get("city_name")
        logger.info(f"Generating {city_name}-forecast images... ")
        self.__processed_data["images"] = visualisation_single.get_all_images_single_city(pipeline_id, data["data"],
                                                                                          data["date"], city_name)

        # Generate Audio
        logger.info("Generating {city_name}-forecast audios...")
        self.__processed_data["audios"] = speech_single.get_all_audios_single_city(pipeline_id, data["speech_data"],
                                                                                   data["date"], city_name)

        # Get audio length
        logger.info("Determining audio length...")
        self.__processed_data["audio_length"] = audio.get_audio_length(self.__processed_data["audios"])

        temp_data = visualisation_single.combine_images_audiolength(self.__processed_data["images"],
                                                                    self.__processed_data["audio_length"])
        self.__processed_data["images"] = temp_data[0]
        self.__processed_data["audio_length"] = temp_data[1]

        # clean preprocessed data
        self.__preprocessed_data = None

    def linking(self, pipeline_id: str):
        """Baut das Video zusammen.

        :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
        :type pipeline_id: str
        """
        city_name = self.config.get("city_name")
        logger.info("Generating {city_name}-forecast video...")
        linking.to_forecast(pipeline_id, self.__processed_data["images"], self.__processed_data["audios"],
                            self.__processed_data["audio_length"])
