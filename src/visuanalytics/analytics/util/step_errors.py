import functools

from requests import Response


class StepError(Exception):
    """
    Fehlerklasse für eine Fehler der in einem der Schritte auftritt.

    Verwendet self.__cause__ um an Informationen eines Vorherigen Fehlers zu Kommen.
    Sollte deshalb nur mit eines raises StepError(values) from Excepiton verwendet werden.
    """

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
    """
    Fehlerklasse für einen Typen Fehler
    der innerhalb eines Schrittes auftritt.
    """

    def __init__(self, type):
        if type is None:
            super().__init__(f"Entry 'type' is missing")
        else:
            super().__init__(f"Type '{type}' does not Exists")


class StepKeyError(Exception):
    """
    Fehlerklasse für eine Fehlerhaften Data key.
    """

    def __init__(self, func_name, keys):
        self.func_name = func_name
        self.keys = keys

    def __str__(self):
        if isinstance(self.__cause__, KeyError):
            return f"{self.func_name}: Invalid Data Key {self.__cause__} in '{self.keys}'"

        return f"{self.func_name}: Could not Access data '{self.keys}': {self.__cause__}"


class APIKeyError(Exception):
    """
    Fehlerklasse für einen Nicht
    gefundenen API key Name.
    """

    def __init__(self, api_key_name):
        super().__init__(f"Api key '{api_key_name}' not Found.")


class APiRequestError(Exception):
    def __init__(self, response: Response):
        super().__init__(
            f"Response-Code: {response.status_code}, Response-Headers: {response.headers}, Response-Body: {response.content}")


def raise_step_error(error):
    """
    Gibt einen Decorator zurück der die Orginal Funktion
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
