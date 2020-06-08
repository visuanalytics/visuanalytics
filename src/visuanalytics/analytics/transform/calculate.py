import numpy as np

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.util import statistical


def calculate_mean(values: dict, data: StepData):
    key = values["key"]
    new_key = calculate_get_new_keys(values, -1, key)
    new_value = np.mean(key)
    data.insert_data(new_key, new_value, values)


def calculate_max(values: dict, data: StepData):
    key = values["key"]
    new_key = calculate_get_new_keys(values, -1, key)
    new_value = max(key)
    data.insert_data(new_key, new_value, values)


def calculate_min(values: dict, data: StepData):
    key = values["key"]
    new_key = calculate_get_new_keys(values, -1, key)
    new_value = min(key)
    data.insert_data(new_key, new_value, values)


def calculate_round(values: dict, data: StepData):
    for idx, key in enumerate(values["keys"]):
        data.save_loop(values, idx, key)
        new_key = calculate_get_new_keys(values, idx, key)
        new_value = round(key, data.get_data(values.get("count", -1)))
        data.insert_data(new_key, new_value, values)


def calculate_mode(values: dict, data: StepData):
    key = values["key"]
    new_key = calculate_get_new_keys(values, -1, key)
    new_value = statistical.mode(key)
    data.insert_data(new_key, new_value, values)


def calculate_get_new_keys(values: dict, idx, key):
    if (idx == -1):
        x = values["new_keys"] if values.get("new_keys", None) else key
    else:
        x = values["new_keys"][idx] if values.get("new_keys", None) else key
    return x


CALCULATE_ACTIONS = {
    "mean": calculate_mean,
    "max": calculate_max,
    "min": calculate_min,
    "round": calculate_round,
    "mode": calculate_mode
}
