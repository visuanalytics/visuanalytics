import functools
from typing import Type

from requests import Response


class StepError(Exception):
    """
    Fehlerklasse für eine Fehler der in einem der Schritte auftritt.

    Verwendet self.__cause__ um an Informationen eines Vorherigen Fehlers zu Kommen.
    Sollte deshalb nur mit eines raises StepError(values) from Excepiton verwendet werden.
    """

    def __init__(self, values):
        # Make sure that values is a dictonary
        if not isinstance(values, dict):
            values = {}

        self.type = values.get("type", None)
        self.desc = values.get("description", None)
        self.values = values

    def __type_msg(self, msg: str):
        return f"{msg}'{self.type}', " if self.type is not None else ""

    def __str__(self):
        # Build Post messages
        pos_msg = f"On '{self.desc}' {self.__type_msg('with Type ')}" if self.desc is not None else self.__type_msg(
            'On Type ')

        if isinstance(self.__cause__,
                      (StepKeyError, StepTypeError, PresetError, APIKeyError, APiRequestError, TestDataError,
                       FFmpegError)):
            # Invalid Key
            return f"{pos_msg}{self.__cause__}"
        elif isinstance(self.__cause__, KeyError):
            # Field for type is missing
            return f"{pos_msg}Entry {self.__cause__} is missing."

        # Other errors
        return f"{pos_msg}{type(self.__cause__).__name__}: {self.__cause__}"


class APIError(StepError):
    pass


class TransformError(StepError):
    pass


class StoringError(StepError):
    pass


class ImageError(StepError):
    pass


class ThumbnailError(StepError):
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
    Fehlerklasse für einen nicht-gefundenen API key-Namen.
    """

    def __init__(self, api_key_name):
        super().__init__(f"Api key '{api_key_name}' not Found.")


class APiRequestError(Exception):
    """
    Fehlerklasse für einen Fehlgeschlagenen Http/s request
    """

    def __init__(self, response: Response):
        super().__init__(
            f"Error during the api request to '{response.request.url}':\nResponse-Code: {response.status_code}\nResponse-Body: {response.content}")


class TestDataError(IOError):
    """
    FehlerKlasse für das laden von TestDaten
    """

    def __init__(self, file_name: str):
        super().__init__(f"Test-data from 'exampledata/{file_name}.json' could not be loaded")


class InvalidContentTypeError(Exception):
    def __init__(self, url, content_type: str, expected_type="'application/json'"):
        if url is None:
            super().__init__(f"Generate Audio: Invalid Content Type '{content_type}' only {expected_type} is Suported")
        else:
            super().__init__(
                f"Error on respone from '{url}': Invalid Content Type '{content_type}' only {expected_type} is Suported")


class PresetError(Exception):
    def __init__(self, key):
        super().__init__(f"Preset '{key}' not Found")


class FFmpegError(Exception):
    def __init__(self, exitCode, output):
        if not output:
            super().__init__(f"Video generation with FFmpeg failed with exit code {exitCode}.")
        else:
            super().__init__(f"Video generation with FFmpeg failed with exit code {exitCode}: {output}")


def raise_step_error(error: Type[StepError]):
    """
    Gibt einen Decorator zurück der die Orginal Funktion
    mit einem `try`, `expect` Block umschließt. Die in `error` übergebene Exception
    wird dann anstatt der erwarteten Exception geworfen.

    :param error: Neue Fehlerklasse
    :return: Decorator
    """

    def raise_error(func):
        @functools.wraps(func)
        def new_func(values, *args, **kwargs):
            try:
                return func(values, *args, **kwargs)
            # Not raise the Same Error Twice
            except error:
                raise
            except BaseException as e:
                raise error(values) from e

        return new_func

    return raise_error
