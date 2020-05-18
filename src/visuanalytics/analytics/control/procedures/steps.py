class Steps(object):
    """Beinhaltet eine Grundlegende Definition für alle Steps.

    Ist die GrundKlasse von der alle Step Klassen erben sollen.
    Sollte **nicht** selbst in einer :class:´Pipeline` verwendet werden.
    Eine unterklasse **muss** die Functionen :func:`apis`, :func:`preprocessing`, :func:`processing` und :func:`linking`
    überschreiben. Falls die reihnfolge auch überschrieben werden soll,
    solten die hinweise in der Dokumentation für die variablen `step_max` und `sequence` beachtet werden.
    """

    def __init__(self, config):
        self._config = config
        # Step_max muss mit der höchsten zahl in sequence übereinstimmen
        self.__step_max = 4
        self.__sequence = {-2: {"name": "Error"},
                           -1: {"name": "Not Started"},
                           0: {"name": "Apis", "call": self.apis},
                           1: {"name": "Preprocessing", "call": self.preprocessing},
                           2: {"name": "Processing", "call": self.processing},
                           3: {"name": "Linking", "call": self.linking},
                           4: {"name": "Ready"}}

    @property
    def step_max(self):
        """int: höchste step id.

        Falls sequence überschrieben wird **muss** diese variable auch überschrieben werden,
        dieser wert **sollte** immer gleich dem höchsten wert in sequence sein.
        """
        return self.__step_max

    @property
    def sequence(self):
        """list: Enthält alle Schritte mit den dazugehörigen functionen (fals vorhanden).

        Die Schritte -2, -1, und 4 haben keine funktionen da dies Fehler oder start und Endpunkt definieren.
        Falls die variable `sequence` überschrieben wird **muss** diese -2 und -1 enthalten,
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
