import concurrent.futures


class Steps(object):
    """Beinhaltet eine Grundlegende Definition für alle Steps.

    Ist die GrundKlasse von der alle Step Klassen erben sollen.
    Sollte **nicht** selbst in einem Job verwendet werden.
    Eine unterklasse **muss** die Functionen :func:`apis`, :func:`preprocessing`, :func:`processing` und :func:`linking`
    überschreiben.

    Beinhaltet die Grundlegenden Funktionen um alle Steps der reihe nach ausführen zu Können.
    Die Klasse definiert eine sequence die, die reihnfolge der aufzurufenden Funktionen beinhaltet,
    mit einem Namen für den Step.
    """

    def __init__(self, config):
        self._config = config
        self.__sequence = [{"name": "Apis", "call": self.apis},
                           {"name": "Preprocessing", "call": self.preprocessing},
                           {"name": "Processing", "call": self.processing},
                           {"name": "Linking", "call": self.linking},
                           {"name": "Ready", "call": lambda _: None}]

    @property
    def sequence(self):
        """list: Sequence aller Schritte mit namen und auszuführender Funktion"""
        return self.__sequence

    @property
    def config(self):
        """dict: Einstellugnen für die Steps"""
        return self._config

    def get_step_name(self, idx: int):
        """Gibt den Namen eines Schrittes anhand seiner Id zurück
        :param idx: idx des Steps
        :type idx: int

        :return: Name des Steps
        :rtype: str
        """
        return self.__sequence[idx]["name"]

    def apis(self, job_id: str):
        """Function für den Step APIS, **Muss** überschrieben werden"""
        assert False, "Not Implemented"

    def prepocessing(self, job_id: str):
        assert False, "Not Implemented"

    def processing(self, job_id: str):
        """Function für den Step Processing, **Muss** überschrieben werden"""
        assert False, "Not Implemented"

    def linking(self, job_id: str):
        """Function für den Step Linking, **Muss** überschrieben werden"""
        assert False, "Not Implemented"
