import os
import time

from visuanalytics.analytics.control.steps.steps import Steps
from visuanalytics.analytics.util import resources


class Job(object):
    def __init__(self, job_id: str, steps: Steps):
        self.__steps = steps
        self.__start_time = 0
        self.__id = job_id
        self.__current_state = None

    @property
    def start_time(self):
        return self.__start_time

    @property
    def id(self):
        return self.__id

    def progress(self):
        return self.__current_state + 1, len(self.__steps.sequence)

    def current_state_name(self):
        return "not started" if self.__current_state is None else \
            "Error" if self.__current_state < 0 else self.__steps.get_state_name(self.__current_state)

    def __setup(self):
        print(f"Job {self.id} Started")

        self.__start_time = time.time()
        os.mkdir(resources.get_resource_path(f"temp/{self.id}"))

    def __cleanup(self):
        os.rmdir(resources.get_resource_path(f"temp/{self.id}"))

        print(f"Job {self.id} Stoped")

    def start(self):
        self.__setup()
        try:
            for idx, step in enumerate(self.__steps.sequence):
                self.__current_state = idx
                step["call"](self.id)

            self.__cleanup()
            return True

        except StepError as er:
            print("Error")
            self.__current_state = -1
            self.__cleanup()
            return False


# TODO(Max) verschieben

class StepError(ValueError):
    pass
