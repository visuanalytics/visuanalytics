import collections
import operator

import numpy as np

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.transform.util.key_utils import get_new_keys

CALCULATE_ACTIONS = {}


def register_calculate(func):
    CALCULATE_ACTIONS[func.__name__.replace("calculate_", "")] = func
    return func


@register_calculate
def calculate_mean(values: dict, data: StepData):
    """Berechnet den Mittelwert von Werten, die in einem Array stehen.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :return:
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(key, values)
        new_key = get_new_keys(values, idx)
        mean_value = float(np.mean(value))
        if values.get("decimal", None):
            new_value = round(mean_value, data.format(values["decimal"], values))
        else:
            new_value = round(mean_value)
        data.insert_data(new_key, new_value, values)


@register_calculate
def calculate_max(values: dict, data: StepData):
    """Findet den Maximalwert von Werten, die in einem Array stehen.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(key, values)
        new_key = get_new_keys(values, idx)
        new_value = max(value)
        data.insert_data(new_key, new_value, values)

        if values.get("save_idx_to", None):
            data.insert_data(values["save_idx_to"][idx], value.index(new_value), values)


@register_calculate
def calculate_min(values: dict, data: StepData):
    """Findet den Minimalwert von Werten, die in einem Array stehen.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(key, values)
        new_key = get_new_keys(values, idx)
        new_value = min(value)
        data.insert_data(new_key, new_value, values)

        if values.get("save_idx_to", None):
            data.insert_data(values["save_idx_to"][idx], value.index(new_value), values)


@register_calculate
def calculate_round(values: dict, data: StepData):
    """Rundet gegebene Werte auf eine gewünschte Nachkommastelle.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(key, values)
        new_key = get_new_keys(values, idx)

        if values.get("decimal", None):
            new_value = round(value, data.format(values["decimal"], values))
        else:
            new_value = round(value)
        data.insert_data(new_key, new_value, values)


@register_calculate
def calculate_mode(values: dict, data: StepData):
    """Bestimmt den am häufigsten in einem Array vorkommenden Wert.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(key, values)
        new_key = get_new_keys(values, idx)
        new_value = collections.Counter(value).most_common()[0][0]
        data.insert_data(new_key, new_value, values)


# Function that can be used in all Calculate Operations with 2 values
def _bi_calculate(values: dict, data: StepData, op):
    keys_right = values.get("keys_right", None)
    value_right = values.get("value_right", None)
    value_left = values.get("value_left", None)
    decimal = values.get("decimal", None)

    # TODO (max) May solve loop two key arrays better to support key, key1
    for idx, key in data.loop_key(values["keys"], values):
        key = int(data.get_data(key, values))
        new_key = get_new_keys(values, idx)

        if keys_right is not None:
            # If keys_right is present use that key
            right = int(data.get_data(keys_right[idx], values))
            res = op(key, right)
        elif value_right is not None:
            # If value_right is present use that value
            right = int(data.format(value_right, values))
            res = op(key, right)
        else:
            # If value_left is present use taht value
            left = int(data.format(value_left, values))
            res = op(left, key)

        if decimal is not None:
            # If decimal is present round
            decimal = data.format(decimal, values)
            res = round(res, decimal)

        data.insert_data(new_key, res, values)


@register_calculate
def calculate_multiply(values: dict, data: StepData):
    """Multipliziert gegebene Werte mit Werten, die in multiply_by stehen und rundet auf die gewünschte Nachkommastelle,
    die unter decimal angegeben wird.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    _bi_calculate(values, data, operator.mul)


@register_calculate
def calculate_divide(values: dict, data: StepData):
    """Dividiert gegebene Werte durch Werte, die in divide_by stehen und rundet auf die gewünschte Nachkommastelle,
    die unter decimal angegeben wird.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    _bi_calculate(values, data, operator.div)


@register_calculate
def calculate_subtract(values: dict, data: StepData):
    """Die jeweiligen Werte, die in subtract stehen, werden von den Werten, die in key stehen, subtrahiert.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    _bi_calculate(values, data, operator.sub)


@register_calculate
def calculate_add(values: dict, data: StepData):
    """Die jeweiligen Werte, die in add stehen, werden zu den Werten, die in key stehen, hinzuaddiert.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    _bi_calculate(values, data, operator.add)
