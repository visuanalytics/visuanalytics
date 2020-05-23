class Steps(object):
    """Beinhaltet eine Grundlegende Definition für alle Steps.

    Ist die GrundKlasse von der alle Step Klassen erben sollen.
    Sollte **nicht** selbst in einer :class:´Pipeline` verwendet werden.
    Eine unterklasse **muss** die Functionen :func:`apis`, :func:`preprocessing`, :func:`processing` und :func:`linking`
    überschreiben. Falls die Reihnfolge auch überschrieben werden soll,
    solten die Hinweise in der Dokumentation für die Variablen `step_max` und `sequence` beachtet werden.
    """

    def __init__(self, config):
        self._config = config
        # Step_max muss mit der höchsten zahl in sequence übereinstimmen
        self.__step_max = 4
        self.__sequence = {-2: {"name": "Error", "log_msg": "An error occured:"},
                           -1: {"name": "Not Started", "log_msg": "Initializing pipeline..."},
                           0: {"name": "Apis", "call": self.apis, "log_msg": "Retrieving data from APIs..."},
                           1: {"name": "Preprocessing", "call": self.preprocessing,
                               "log_msg": "Preprocessing API-data..."},
                           2: {"name": "Processing", "call": self.processing,
                               "log_msg": "Processing preprocessed data..."},
                           3: {"name": "Linking", "call": self.linking, "log_msg": "Linking into final result..."},
                           4: {"name": "Ready", "log_msg": "Successfully finished"}}

    @property
    def step_max(self):
        """int: höchste step id.

        Falls Sequence überschrieben wird **muss** diese Variable auch überschrieben werden,
        dieser wert **sollte** immer gleich dem höchsten wert in der Sequence sein.
        """
        return self.__step_max

    @property
    def sequence(self):
        """list: Enthält alle Schritte mit den dazugehörigen functionen (fals vorhanden).

        Die Schritte -2, -1, und 4 haben keine Funktionen da diese Fehler, Start oder Endpunkt definieren.
        Falls die Variable `sequence` überschrieben wird **muss** diese -2 und -1 enthalten,
        desweiteren sollte der letzte Schritt `Ready` sein da dessen function nie aufgerufen wird.
        """
        return self.__sequence

    @property
    def config(self):
        """dict: Einstellungen für die Steps."""
        return self._config

    def apis(self, pipeline_id: str):
        """Function für den Step `APIS`, **Muss** überschrieben werden."""
        assert False, "Not Implemented"

    def preprocessing(self, pipeline_id: str):
        """Function für den Step `Preprocessing`, **Muss** überschrieben werden."""
        assert False, "Not Implemented"

    def processing(self, pipeline_id: str):
        """Function für den Step `Processing`, **Muss** überschrieben werden."""
        assert False, "Not Implemented"

    def linking(self, pipeline_id: str):
        """Function für den Step `Linking`, **Muss** überschrieben werden."""
        assert False, "Not Implemented"
