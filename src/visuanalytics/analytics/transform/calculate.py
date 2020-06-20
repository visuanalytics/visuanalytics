import numpy as np
import collections

from visuanalytics.analytics.control.procedures.step_data import StepData


def calculate(values: dict, data: StepData):
    action = data.format(values["action"], values)
    CALCULATE_ACTIONS[action](values, data)


def calculate_mean(values: dict, data: StepData):
    """Berechnet den Mittelwert von Werten, die in einem Array stehen.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :return:
    """
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, key)
        value = data.get_data(key, values)
        new_key = calculate_get_new_keys(values, idx, key)
        mean_value = float(np.mean(value))
        if values.get("decimal", None):
            new_value = round(mean_value, data.format(values["decimal"], values))
        else:
            new_value = round(mean_value)
        data.insert_data(new_key, new_value, values)


def calculate_max(values: dict, data: StepData):
    """Sucht den Maximalwert von Werten, die in einem Array stehen.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, key)
        value = data.get_data(key, values)
        new_key = calculate_get_new_keys(values, idx, key)
        new_value = max(value)
        data.insert_data(new_key, new_value, values)

        if values.get("save_idx_to", None):
            data.insert_data(values["save_idx_to"][idx], value.index(new_value), values)


def calculate_min(values: dict, data: StepData):
    """Sucht den Minimalwert von Werten, die in einem Array stehen.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, key)
        value = data.get_data(key, values)
        new_key = calculate_get_new_keys(values, idx, key)
        new_value = min(value)
        data.insert_data(new_key, new_value, values)

        if values.get("save_idx_to", None):
            data.insert_data(values["save_idx_to"][idx], value.index(new_value), values)


def calculate_round(values: dict, data: StepData):
    """Rundet gegebene Werte auf eine gewünschte Nachkommastelle ab.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, key)

        value = data.get_data(key, values)
        new_key = calculate_get_new_keys(values, idx, key)

        if values.get("decimal", None):
            new_value = round(value, data.format(values["decimal"], values))
        else:
            new_value = round(value)
        data.insert_data(new_key, new_value, values)


def calculate_mode(values: dict, data: StepData):
    """Bestimmt den am häufigsten in einem Array vorkommenden Value.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, key)
        value = data.get_data(key, values)
        new_key = calculate_get_new_keys(values, idx, key)
        new_value = collections.Counter(value).most_common()[0][0]
        data.insert_data(new_key, new_value, values)


def calculate_ms_to_kmh(values: dict, data: StepData):
    """Wandelt den angegebenen Wert von m/s in km/h um und rundet auf die 2. Nachkommastelle.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, key)
        value = data.get_data(key, values)
        new_key = calculate_get_new_keys(values, idx, key)
        kmh = (value * 3.6)
        if values.get("decimal", None):
            new_value = round(kmh, data.format(values["decimal"], values))
        else:
            new_value = round(kmh)
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
    "mode": calculate_mode,
    "ms_to_kmh": calculate_ms_to_kmh

}
