class Steps(object):
    def __init__(self, config):
        self._config = config
        self.__sequence = [{"name": "Apis", "call": self.apis},
                           {"name": "Preprocessing", "call": self.prepocessing},
                           {"name": "Processing", "call": self.processing},
                           {"name": "Linking", "call": self.linking},
                           {"name": "Ready", "call": lambda: None}]

    @property
    def sequence(self):
        return self.__sequence

    @property
    def config(self):
        return self._config

    def get_state_name(self, idx: int):
        return self.__sequence[idx]["name"]

    def apis(self):
        assert False, "Not Implemented"

    def prepocessing(self):
        assert False, "Not Implemented"

    def processing(self):
        assert False, "Not Implemented"

    def linking(self):
        assert False, "Not Implemented"
