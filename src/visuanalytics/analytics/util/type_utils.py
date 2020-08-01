import functools
from typing import Type

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.util.step_errors import StepTypeError, raise_step_error, StepError
from visuanalytics.util.dict_utils import merge_dict


def register_type_func(types: dict, error: Type[StepError], func):
    """ Registriert die Übergebene Funktion,
    und versieht sie mit einem try except block

    :param types: Dict wo der type registriert werden soll.
    :param error: fehler der geworfen werden soll.
    :param func: Zu registrierende Funktion.
    :return: funktion mit try, catch block.
    """
    func = raise_step_error(error)(func)

    @functools.wraps(func)
    def type_func(values: dict, data: StepData, *args, **kwargs):
        # Replace presets
        if "preset" in values:
            merge_dict(values, data.get_preset(values["preset"]))

        return func(values, data, *args, **kwargs)

    types[func.__name__] = type_func
    return type_func


def register_type_func_no_data(types: dict, error: Type[StepError], func):
    func = raise_step_error(error)(func)

    types[func.__name__] = func
    return func


def get_type_func(values: dict, types: dict, key="type"):
    """
    Hilfsfunktion um die Typefunktion aus einem Dictonary zu bekommen.

    Ist der Type (eintrag in `types`) nicht vorhanden wirde ein `StepTypeError` geworfen.

    :param values: Werte aus der JSON-Datei.
    :param types: Dictionary mit `type: func`
    :param key: Key des Typen in values
    :return: gesuchte funktion
    :raises: StepTypeError
    """
    func = types.get(values.get(key, ""), None)

    if func is None:
        raise StepTypeError(values.get(key, None))

    return func
