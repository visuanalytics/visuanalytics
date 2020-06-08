import numpy as np

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.util import statistical


def calculate_mean(values: dict, data: StepData):
    value = data.get_data(values["key"], values)
    new_key = calculate_get_new_keys(values, -1, values["key"])
    new_value = np.mean(value)
    data.insert_data(new_key, new_value, values)


def calculate_max(values: dict, data: StepData):
    value = data.get_data(values["key"], values)
    new_key = calculate_get_new_keys(values, -1, values["key"])
    new_value = max(value)
    data.insert_data(new_key, new_value, values)


def calculate_min(values: dict, data: StepData):
    value = data.get_data(values["key"], values)
    new_key = calculate_get_new_keys(values, -1, values["key"])
    new_value = min(value)
    data.insert_data(new_key, new_value, values)


def calculate_round(values: dict, data: StepData):
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, idx, key)

        value = data.get_data(key, values)
        new_key = calculate_get_new_keys(values, idx, key)

        if values.get("count", None):
            new_value = round(value, data.get_data(values["count"], values))
        else:
            new_value = round(value)
        data.insert_data(new_key, new_value, values)


def calculate_mode(values: dict, data: StepData):
    value = data.get_data(values["key"], values)
    new_key = calculate_get_new_keys(values, -1, values["key"])
    new_value = statistical.mode(value)
    data.insert_data(new_key, new_value, values)


def calculate_get_new_keys(values: dict, idx, key):
    if idx < 0:
        return values["new_keys"] if values.get("new_keys", None) else key

    return values["new_keys"][idx] if values.get("new_keys", None) else key


CALCULATE_ACTIONS = {
    "mean": calculate_mean,
    "max": calculate_max,
    "min": calculate_min,
    "round": calculate_round,
    "mode": calculate_mode
}
