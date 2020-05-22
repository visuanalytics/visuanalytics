import os
import shutil
import time
import logging

from visuanalytics.analytics.control.procedures.steps import Steps
from visuanalytics.analytics.util import resources


class Pipeline(object):
    """Enthält alle informationen zu einer Pipeline, und führt alle Steps aus.

    Benötigt beim Ersttellen eine id, und eine Instanz der Klasse :class:`Steps` bzw. einer Unterklasse von :class:`Steps`.
    Bei dem Aufruf von Start werden alle Steps der Reihe nach ausgeführt.
    """

    def __init__(self, pipeline_id: str, steps: Steps):
        self.__steps = steps
        self.__start_time = 0.0
        self.__end_time = 0.0
        self.__id = pipeline_id
        self.__current_step = -1

        # set logging level to INFO when testing, otherwise only WARNING and ERROR messages are actually logged
        if (self.__steps.config["testing"]):
            logging.basicConfig(level=logging.INFO)

    @property
    def start_time(self):
        """float: Startzeit der Pipeline. Wird erst bei dem Aufruf von :func:`start` inizalisiert."""
        return self.__start_time

    @property
    def end_time(self):
        """float: Endzeit der Pipeline. Wird erst nach Beendigung der Pipeline inizalisiert."""
        return self.__end_time

    @property
    def id(self):
        """str: id der Pipeline."""
        return self.__id

    def progress(self):
        """Fortschritt der Pipeline.

        :return: Anzahl der schon ausgeführten schritte, Anzahl aller Schritte
        :rtype: int, int
        """
        return self.__current_step + 1, self.__steps.step_max + 1

    def current_step_name(self):
        """Gibt den Namen des aktuellen Schritts zurück.

        :return: Name des Aktuellen Schrittes.
        :rtype: str
        """
        return self.__steps.sequence[self.__current_step]["name"]

    def current_log_message(self):
        """Gibt die Log-Message des aktuellen Schritts zurück.

        :return: Log-Message des Aktuellen Schrittes.
        :rtype: str
        """
        return self.__steps.sequence[self.__current_step]["log_msg"]

    def __setup(self):
        self.__start_time = time.time()
        os.mkdir(resources.get_temp_resource_path("", self.id))

    def __cleanup(self):
        # delete Directory
        shutil.rmtree(resources.get_temp_resource_path("", self.id), ignore_errors=True)

        self.__end_time = time.time()
        if (self.__current_step != self.__steps.step_max):
            logging.info(f"Pipeline {self.id} could not be finished.")
        else:
            completion_time = round(self.__end_time - self.__start_time, 2)
            logging.info(f"{self.current_log_message()} Pipeline {self.id} in {completion_time}s")

    def start(self):
        """Führt alle Schritte die in der übergebenen Instanz der Klasse :class:`Steps` definiert sind aus.

        Initalisiertt zuerst einen Pipeline Ordner mit der Pipeline id, dieser kann dann im gesamten Pipeline zur
        zwichenspeicherung von dateien verwendet werden. Dieser wird nach Beendigung oder bei einem Fehler fall wieder gelöscht.

        Führt alle Schritte aus der übergebenen Steps instans, die in der Funktion :func:`sequence` difiniert sind,
        der reihnfolge nach aus. Mit der ausnahme von allen Steps mit der id < 0 und >= `step_max`.

        :return: Wenn ohne fehler ausgeführt `True`, sonst `False`
        :rtype: bool
        """
        logging.info(self.current_log_message())
        self.__setup()
        logging.info(f"Started Pipeline {self.id}")
        try:
            for idx in range(0, self.__steps.step_max):
                self.__current_step = idx
                logging.info(self.current_log_message())
                self.__steps.sequence[idx]["call"](self.id)

            # Set state to ready
            self.__current_step = self.__steps.step_max
            self.__cleanup()
            return True

        except Exception as er:
            # TODO(max)
            self.__current_step = -2
            logging.error(f"{self.current_log_message()}: {er}")
            self.__cleanup()
            return False
