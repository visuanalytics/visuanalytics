import functools


class StepError(Exception):

    def __init__(self, values):
        self.type = values.get("type", None)
        self.values = values

    def __str__(self):
        if isinstance(self.__cause__, (StepKeyError, StepTypeError)):
            # Invalid Key
            return f"On Type '{self.type}', {self.__cause__}"
        elif isinstance(self.__cause__, KeyError):
            # Field for type is missing
            return f"On Type '{self.type}', Entry {self.__cause__} is missing."

        # Other errors
        return f"On Type '{self.type}', \"{type(self.__cause__).__name__}: {self.__cause__}\" was raised"


class StepTypeError(Exception):
    def __init__(self, type):
        if type is None:
            super().__init__(f"Entry 'type' is missing")
        else:
            super().__init__(f"Type '{type}' does not Exists")


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


class APIKeyError(Exception):
    def __init__(self, api_key_name):
        super().__init__(f"Api key '{api_key_name}' not Found.")


class StepKeyError(Exception):
    def __init__(self, func_name, key):
        super().__init__(f"{func_name}: Invalid Data Key: {key}")


def raise_step_error(error):
    """
    Gitbt einen Decorator zurück der die Orginal Funktion
    mit einem `try`, `expect` block umschießt. Die in `error` übergebene Exception
    wird dann Anstadt der Erwarteten Exception geworfen.

    :param error: Neue Fehler Klasse
    :return: Decorator
    """

    def raise_error(func):
        @functools.wraps(func)
        def new_func(values, *args, **kwargs):
            try:
                return func(values, *args, **kwargs)
            # Not raise TransformError Twice
            except error:
                raise
            except BaseException as e:
                raise error(values) from e

        return new_func

    return raise_error
