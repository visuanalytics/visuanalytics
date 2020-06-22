class StepError(Exception):

    def __init__(self, values, message="test"):
        self.message = message
        self.type = values.get("type", None)

        self.values = values
        # super().__init__(message)

    def __str__(self):
        if isinstance(self.__cause__, StepKeyError):
            # Invalid Key
            return f"On Type '{self.type}', {self.__cause__}"
        elif isinstance(self.__cause__, StepTypeError):
            # Invalid Type
            return f"Type '{self.__cause__}' does not Exists"
        elif isinstance(self.__cause__, KeyError):
            # Field for type is missing
            return f"On Type '{self.type}', Entry {self.__cause__} is missing."

        # Other errors
        return f"On Type '{self.type}', \"{type(self.__cause__).__name__}: {self.__cause__}\" was raised"


class APIError(StepError):
    pass


class TransformError(StepError):
    pass


class ImageError(StepError):
    pass


class AudioError(StepError):
    pass


class SeqenceError(StepError):
    pass


class StepTypeError(Exception):
    pass


class StepKeyError(Exception):
    def __init__(self, func_name, key):
        super().__init__(f"{func_name}: Invalid Data Key: {key}")
