import collections

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


@register_calculate
def calculate_multiply_keys(values: dict, data: StepData):
    """Multipliziert gegebene Werte mit Werten, die in multiply_by stehen und rundet auf die gewünschte Nachkommastelle,
    die unter decimal angegeben wird.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    multiply_by = int(data.format(values["multiply_by"], values))
    for idx, key in data.loop_key(values["keys"], values):
        value = int(data.get_data(key, values))
        new_key = get_new_keys(values, idx)
        multiply_by = data.format(values["multiply_by"], values)
        new_value = (value * multiply_by)
        if values.get("decimal") is not None:
            decimal = data.format(values["decimal"], values)
            new_value = round(new_value, decimal)
        data.insert_data(new_key, new_value, values)


@register_calculate
def calculate_divide_keys(values: dict, data: StepData):
    """Dividiert gegebene Werte durch Werte, die in divide_by stehen und rundet auf die gewünschte Nachkommastelle,
    die unter decimal angegeben wird.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(key, values)
        new_key = get_new_keys(values, idx)
        divide_by = data.format(values["divide_by"], values)
        new_value = (value / divide_by)

        if values.get("decimal") is not None:
            decimal = data.format(values["decimal"], values)
            new_value = round(new_value, decimal)
        data.insert_data(new_key, new_value, values)


@register_calculate
def calculate_divide(values: dict, data: StepData):
    """Dividiert die angegebenen Werte durch den Wert, der in divide_by steht. Anschließend wird das
    jeweilige Ergebnis auf die gewünschte Nachkommastelle gerundet, die unter decimal angegeben wird.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    divide_by = int(data.format(values["divide_by"], values))
    for idx, key in data.loop_key(values["keys"], values):
        value = int(data.get_data(key, values))
        new_key = get_new_keys(values, idx)
        new_value = value / divide_by
        if values.get("decimal") is not None:
            decimal = data.format(values["decimal"], values)
            new_value = round(new_value, decimal)
        data.insert_data(new_key, new_value, values)


@register_calculate
def calculate_subtract_keys(values: dict, data: StepData):
    """Die jeweiligen Werte, die in subtract stehen, werden von den Werten, die in key stehen, subtrahiert.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = int(data.get_data(key, values))
        subtract = int(data.get_data(values["subtract"][idx], values))
        new_key = get_new_keys(values, idx)
        new_value = value - subtract
        data.insert_data(new_key, new_value, values)


@register_calculate
def calculate_subtract(values: dict, data: StepData):
    """Der Wert, der in subtract steht, wird jeweils von den Werten, die in key stehen, subtrahiert.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    subtract = int(data.format(values["subtract"], values))
    for idx, key in data.loop_key(values["keys"], values):
        value = int(data.get_data(key, values))
        new_key = get_new_keys(values, idx)
        new_value = value - subtract
        data.insert_data(new_key, new_value, values)


@register_calculate
def calculate_add_keys(values: dict, data: StepData):
    """Die jeweiligen Werte, die in add stehen, werden zu den Werten, die in key stehen, hinzuaddiert.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = int(data.get_data(key, values))
        add = int(data.get_data(values["add"][idx], values))
        new_key = get_new_keys(values, idx)
        new_value = value + add
        data.insert_data(new_key, new_value, values)


@register_calculate
def calculate_add(values: dict, data: StepData):
    """Der Wert, der in add steht, wird jeweils zu den Werten, die in key stehen, hinzuaddiert.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    add = int(data.format(values["add"], values))
    for idx, key in data.loop_key(values["keys"], values):
        value = int(data.get_data(key, values))
        new_key = get_new_keys(values, idx)
        new_value = value + add
        data.insert_data(new_key, new_value, values)
