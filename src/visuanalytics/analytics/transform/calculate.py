import numpy as np

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.util import statistical


def calculate_mean(values: dict, data: StepData):
    """Berechnet den Mittelwert von Werten, die in einem Array stehen.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :return:
    """
    value = data.get_data(values["key"], values)
    new_key = calculate_get_new_keys(values, -1, values["key"])
    new_value = np.mean(value)
    data.insert_data(new_key, new_value, values)


def calculate_max(values: dict, data: StepData):
    """Sucht den Maximalwert von Werten, die in einem Array stehen.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    value = data.get_data(values["key"], values)
    new_key = calculate_get_new_keys(values, -1, values["key"])
    new_value = max(value)
    data.insert_data(new_key, new_value, values)


def calculate_min(values: dict, data: StepData):
    """Sucht den Minimalwert von Werten, die in einem Array stehen.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    value = data.get_data(values["key"], values)
    new_key = calculate_get_new_keys(values, -1, values["key"])
    new_value = min(value)
    data.insert_data(new_key, new_value, values)


def calculate_round(values: dict, data: StepData):
    """Rundet gegebene Werte auf eine bestimmte Nachkommastelle ab.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, key)

        value = data.get_data(key, values)
        new_key = calculate_get_new_keys(values, idx, key)

        if values.get("count", None):
            new_value = round(value, data.format(values["count"], values))
        else:
            new_value = round(value)
        data.insert_data(new_key, new_value, values)


def calculate_mode(values: dict, data: StepData):
    """Bestimmt den am häufigsten in einem Array vorkommenden Value.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    value = data.get_data(values["key"], values)
    new_key = calculate_get_new_keys(values, -1, values["key"])
    new_value = statistical.mode(value)
    data.insert_data(new_key, new_value, values)


def calculate_ms_to_kmh(values: dict, data: StepData):
    value = data.get_data(values["key"], values)
    new_key = calculate_get_new_keys(values, -1, values["key"])
    new_value = value * 3.6
    data.insert_data(new_key, new_value, values)


def calculate_get_new_keys(values: dict, idx, key):
    """Prüft nach, ob values["new_keys"] bzw. values["new_key"] vorhanden ist.

    Prüft nach, ob values["new_keys"] bzw. values["new_key"] vorhanden ist. Wenn nicht, wird values["keys"] bzw.
    values["key"] ausgewählt.

    :param values: Werte aus der JSON-Datei
    :param idx: Index des Arrays, welches gerade betrachtet wird. Wenn nur ein Wert, dann muss idx < 0 sein.
    :param key: value["key"]
    :return: Inhalt von values["new_keys"] bzw. Inhalt von values["new_key"]
    """
    if idx < 0:
        return values["new_key"] if values.get("new_key", None) else key

    return values["new_keys"][idx] if values.get("new_keys", None) else key


CALCULATE_ACTIONS = {
    "mean": calculate_mean,
    "max": calculate_max,
    "min": calculate_min,
    "round": calculate_round,
    "mode": calculate_mode
}
