import os
import shutil
import time

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
        """str: id des Pipelines"""
        return self.__id

    def progress(self):
        """Fortschritt der Pipeline.

        :return: Nummer des Aktullen Schritts, Anzahl aller Schritte
        :rtype: int, int
        """
        return self.__current_step + 1, self.__steps.step_max + 1

    def current_step_name(self):
        """Gibt den Namen des aktuellen Schritts zurück"""
        return self.__steps.sequence[self.__current_step]["name"]

    def __setup(self):
        print(f"Pipeline {self.id} Started")

        self.__start_time = time.time()
        os.mkdir(resources.get_temp_resource_path("", self.id))

    def __cleanup(self):
        # delete Directory
        shutil.rmtree(resources.get_temp_resource_path("", self.id), ignore_errors=True)

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
            print("Error", er)
            self.__current_step = -2
            self.__cleanup()
            return False
