class Steps(object):
    def __init__(self, config):
        self._config = config
        self.__sequence = [{"name": "Apis", "call": self.apis},
                           {"name": "Preprocessing", "call": self.prepocessing},
                           {"name": "Processing", "call": self.processing},
                           {"name": "Linking", "call": self.linking},
                           {"name": "Ready", "call": lambda _: None}]

    @property
    def sequence(self):
        return self.__sequence

    @property
    def config(self):
        return self._config

    def get_state_name(self, idx: int):
        return self.__sequence[idx]["name"]

    def apis(self, job_id: str):
        assert False, "Not Implemented"

    def prepocessing(self, job_id: str):
        assert False, "Not Implemented"

    def processing(self, job_id: str):
        assert False, "Not Implemented"

    def linking(self, job_id: str):
        assert False, "Not Implemented"
