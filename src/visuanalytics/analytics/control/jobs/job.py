import time

from visuanalytics.analytics.control.steps.steps import Steps


class Job(object):
    def __init__(self, id: str, steps: Steps):
        self.__steps = steps
        self.__start_time = ""
        self.__id = id
        self.__current_state = -1

    @property
    def start_time(self):
        return self.__start_time

    @property
    def id(self):
        return self.__id

    def progress(self):
        return self.__current_state + 1, len(self.__steps.sequence)

    def current_state_name(self):
        return "not started" if self.__current_state < 0 else self.__steps.get_state_name(self.__current_state)

    def __setup(self):
        self.__start_time = time.time()
        # TODO(Max)
        pass

    def __cleanup(self):
        # TODO(Max)
        pass

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
            self.__cleanup()
            return False


# TODO(Max) verschieben

class StepError(ValueError):
    pass
