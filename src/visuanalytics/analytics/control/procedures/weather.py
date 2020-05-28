from visuanalytics.analytics.preprocessing.weather import speech as pre_speech
from visuanalytics.analytics.apis import weather as api
from visuanalytics.analytics.control.procedures.steps import Steps
from visuanalytics.analytics.linking import linker as linking
from visuanalytics.analytics.preprocessing.weather import visualisation as pre_visualisation, transform
from visuanalytics.analytics.processing.weather import visualisation as pro_visualisation, speech
from visuanalytics.analytics.util import date_time, audio
import logging

# TODO(max) handle config not

logger = logging.getLogger(__name__)


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
        if self.config.get("testing", False):
            logger.info("Using stored weather data for tesing...")
            self.__json_data = api.get_example()
        else:
            logger.info("Retrieving weather forecast data from weatherbit-api...")
            api.get_forecasts()

        # self.__json_data = api.get_example() if self.config.get("testing", False) else

    def preprocessing(self, pipeline_id: str):
        """Verarbeitet die Daten aus der Wetter API.

        :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
        :type pipeline_id: str
        """
        # Preprocess api data
        logger.info("Transforming nationwide weather forecast data...")
        data = transform.preprocess_weather_data(self.__json_data)

        # clear JSON data (vtl. remove)
        self.__json_data = None

        # Preprocess visualisation data
        logger.info("Preprocessing for visualisation...")
        self.__preprocessed_data["date"] = date_time.date_to_weekday(transform.get_first_day(data))
        self.__preprocessed_data["icon_oneday"] = [pre_visualisation.data_icon_oneday(data, 0),
                                                   pre_visualisation.data_icon_oneday(data, 1)]
        self.__preprocessed_data["temp_oneday"] = [pre_visualisation.data_temp_oneday(data, 0),
                                                   pre_visualisation.data_temp_oneday(data, 1)]
        self.__preprocessed_data["icon_threeday"] = pre_visualisation.data_icon_threeday(data)
        self.__preprocessed_data["data_mm_temp_threeday"] = pre_visualisation.data_mm_temp_threeday(data)

        # Preprocess speech data
        logger.info("Preprocessing for speech...")
        self.__preprocessed_data["merge_data"] = pre_speech.merge_data(data)

    def processing(self, pipeline_id: str):
        """Erstellt aus den APi Daten, Bilder und Texte.

        :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
        :type pipeline_id: str
        """
        data = self.__preprocessed_data

        # Generate images
        logger.info("Generating Germany-forecast images...")
        self.__processed_data["images"] = pro_visualisation.get_all_images_germany(pipeline_id, data["icon_oneday"],
                                                                                   data["temp_oneday"],
                                                                                   data["icon_threeday"],
                                                                                   data["data_mm_temp_threeday"],
                                                                                   data["date"])

        # Generate Audio
        logger.info("Generating Germany-forecast audio...")
        self.__processed_data["audios"] = speech.get_all_audios_germany(pipeline_id, data["merge_data"])
        logger.info("Determining audio length...")

        self.__processed_data["audio_length"] = audio.get_audio_length(self.__processed_data["audios"],
                                                                       self.config.get("h264_nvenc", False))
        
        temp_data = pro_visualisation.combine_images_audiolength(self.__processed_data["images"],
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
        logger.info("Generating Germany-forecast video...")
        linking.to_forecast(pipeline_id, self.__processed_data["images"], self.__processed_data["audios"],
                            self.__processed_data["audio_length"], self.config.get("h264_nvenc", False))
