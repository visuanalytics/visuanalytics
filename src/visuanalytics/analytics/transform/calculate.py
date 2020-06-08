import numpy as np

from visuanalytics.analytics.control.procedures.step_data import StepData


def calculate_mean(values: dict, data: StepData):
    entry = data.get_data((values["key"], values))
    new_entry = calculate_get_new_keys(values, data, -1, entry)
    new_values = np.mean(entry)
    data.insert_data(new_entry, new_values)


def calculate_max(values: dict, data: StepData):
    entry = data.get_data((values["key"], values))
    new_entry = calculate_get_new_keys(values, data, -1, entry)
    new_values = max(entry)
    data.insert_data(new_entry, new_values)


def calculate_min(values: dict, data: StepData):
    entry = data.get_data((values["key"], values))
    new_entry = calculate_get_new_keys(values, data, -1, entry)
    new_values = min(entry)
    data.insert_data(new_entry, new_values)


def calculate_round(values: dict, data: StepData):
    for idx, entry in enumerate(data.get_data(values["keys"], values)):
        data.save_loop(values, idx, entry)
        new_entry = calculate_get_new_keys(values, data, idx, entry)
        new_values = round(entry, data.get_data(values["count"]))
        data.insert_data(new_entry, new_values)


def calculate_get_new_keys(values: dict, data: StepData, idx, entry):
    if (idx == -1):
        x = data.get_data(values["new_key"], values) if data.get_data(values.get("new_key"), values) else entry
    else:
        x = data.get_data(values["new_keys"][idx], values) if data.get_data(values.get("new_keys"), values) else entry
    return x


CALCULATE_ACTIONS = {
    "mean": calculate_mean,
    "max": calculate_max,
    "min": calculate_min,
    "round": calculate_round
}
