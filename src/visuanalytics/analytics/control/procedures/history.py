from visuanalytics.analytics.apis import history as api
from visuanalytics.analytics.control.procedures.steps import Steps
from visuanalytics.analytics.linking import linker as linking
from visuanalytics.analytics.preprocessing.history import transform, speech, visualisation
from visuanalytics.analytics.processing.history import visualisation as pro_visualisation
from visuanalytics.analytics.processing.history import speech as pro_speech
from visuanalytics.analytics.util import audio
import logging

# TODO(max) handle config not

logger = logging.getLogger(__name__)


class HistorySteps(Steps):
    """Schritte für das Erstellen der Zeit Wordcloud"""

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
            self.__json_data = api.get_example()
        else:
            logger.info(f"Retrieving forecast data from Zeit-API...")
            self.__json_data = api.get_forecasts()

    def preprocessing(self, pipeline_id: str):
        """Verarbeitet die Daten aus der Zeit API.

        :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
        :type pipeline_id: str
        """
        # Preprocess api data
        logger.info("Transforming local forecast data...")
        data = transform.preprocess_history_data(self.__json_data)

        # clear JSON data (evtl. remove)
        self.__json_data = None

        # Preprocess data
        logger.info("Preprocessing for visualisation and speech...")

        self.__preprocessed_data["date"] = transform.get_date(data[0])

        # Preprocess speech data
        self.__preprocessed_data["speech_data"] = speech.merge_data(data, self.__preprocessed_data["date"])

        # Preprocess visualisation data
        self.__preprocessed_data["visualisation_data"] = visualisation.merge_data(data,
                                                                                  self.__preprocessed_data["date"])

    def processing(self, pipeline_id: str):
        """Erstellt aus den APi Daten, Bilder und Texte.

        :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
        :type pipeline_id: str
        """
        data = self.__preprocessed_data

        # Generate images
        logger.info(f"Generating forecast images... ")
        self.__processed_data["images"] = pro_visualisation.get_all_images(pipeline_id, data["visualisation_data"],
                                                                           data["date"])

        # Generate Audio
        logger.info("Generating forecast audios...")
        self.__processed_data["audios"] = pro_speech.get_all_audios(pipeline_id, data["speech_data"],
                                                                    data["date"])

        # Get audio length
        logger.info("Determining audio length...")
        self.__processed_data["audio_length"] = audio.get_audio_length(
            self.__processed_data["audios"])

        # clean preprocessed data
        self.__preprocessed_data = None

    def linking(self, pipeline_id: str):
        """Baut das Video zusammen.

        :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
        :type pipeline_id: str
        """
        logger.info("Generating forecast video...")
        linking.to_forecast(pipeline_id, self.__processed_data["images"], self.__processed_data["audios"],
                            self.__processed_data["audio_length"], self.config.get("h264_nvenc", False))
