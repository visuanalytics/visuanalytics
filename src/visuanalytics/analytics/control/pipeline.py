import os
import time

from visuanalytics.analytics.control.procedures.steps import Steps
from visuanalytics.analytics.util import resources


class Pipeline(object):
    """Enthält alle informationen zu einer Pipeline, und führt alle Steps aus.

    Benötigt beim ersttellen eine id, und Eine instanz der Klasse :class:`Steps` bzw. einer Unterklasse von :class:`Steps`.
    Bei dem aufruf von Start werden alle Steps der reihe nach ausgeführt.
    """

    def __init__(self, pipeline_id: str, steps: Steps):
        self.__steps = steps
        self.__start_time = 0.0
        self.__end_time = 0.0
        self.__id = pipeline_id
        self.__current_step = -1

    @property
    def start_time(self):
        """float: startzeit der Pipeline. Wird erst bei dem Aufruf von :func:`start` inizalisiert."""
        return self.__start_time

    @property
    def end_time(self):
        """float: endzeit der Pipeline. Wird erst nach beendigung der Pipeline inizalisiert."""
        return self.__end_time

    @property
    def id(self):
        """str: id des Pipelines"""
        return self.__id

    def progress(self):
        """Fortschritt der Pipeline.

        :return: Nummer des Aktullen Schritts, Anzahl aller Schritte
        :rtype: int, int
        """
        return self.__current_step + 1, self.__steps.step_max + 1

    def current_step_name(self):
        """Gibt den Namen des Aktuellen Schritts zurück"""
        return self.__steps.sequence[self.__current_step]["name"]

    def __setup(self):
        print(f"Pipeline {self.id} Started")

        self.__start_time = time.time()
        os.mkdir(resources.get_resource_path(f"temp/{self.id}"))

    def __cleanup(self):
        os.rmdir(resources.get_resource_path(f"temp/{self.id}"))

        self.__end_time = time.time()
        print(f"Pipeline {self.id} Stoped")

    def start(self):
        """Führt alle Schritte die in der übergebenen Instanz der Klasse :class:`Steps` definiert sind aus.

        Initalisiertt zuerst einen Pipeline Ordner mit der Pipeline id, dieser kann dann im gesamten Pipeline zur
        zwichenspeicherung von dateien verwendet werden. Dieser wird nach Beendigung oder bei einem Fehler fall wieder gelöscht.

        Führt alle Schritte aus der übergebenen Steps instans, die in der Funktion :func:`sequence` difiniert sind,
        der reihnfolge nach aus. Mit der ausnahme von allen Steps mit der id < 0 und >= `step_max`.

        :return: Wenn ohne fehler ausgeführt `True`, sonst `False`
        :rtype: bool
        """
        self.__setup()
        try:
            for idx in range(0, self.__steps.step_max):
                self.__current_step = idx
                self.__steps.sequence[idx]["call"](self.id)

            # Set state to ready
            self.__current_step = self.__steps.step_max
            self.__cleanup()
            return True

        except Exception as er:
            # TODO(max)
            print("Error", er.__cause__)
            self.__current_step = -2
            self.__cleanup()
            return False
