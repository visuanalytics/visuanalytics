import functools
from typing import Type

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.util.step_errors import StepTypeError, raise_step_error, StepError
from visuanalytics.util.dict_utils import merge_dict


def register_type_func(types: dict, error: Type[StepError], func):
    """ Registriert die übergebene Funktion
    und versieht sie mit einem try-except-Block.

    :param types: Dictionary, in dem der Typ registriert werden soll.
    :param error: Fehler, der geworfen werden soll.
    :param func: Zu registrierende Funktion.
    :return: Funktion mit try-catch-Block.
    """
    func = raise_step_error(error)(func)

    @functools.wraps(func)
    def type_func(values: dict, data: StepData, *args, **kwargs):
        # replace presets
        if "preset" in values:
            # TODO (Max) may give values a higher prio
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
    Hilfsfunktion, um die Typfunktion aus einem Dictonary zu bekommen.

    Ist der Typ (Eintrag in `types`) nicht vorhanden, wird ein `StepTypeError` geworfen.

    :param values: Werte aus der JSON-Datei.
    :param types: Dictionary mit `type: func`
    :param key: Key des Typen in values
    :return: gesuchte Funktion
    :raises: StepTypeError
    """
    func = types.get(values.get(key, ""), None)

    if func is None:
        raise StepTypeError(values.get(key, None))

    return func
