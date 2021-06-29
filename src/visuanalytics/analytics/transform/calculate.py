"""
Modul für Berechnungen für den `transform`-Typ `calculate`.
"""
import collections
import numbers
import operator

import numpy as np

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.transform.util.key_utils import get_new_keys

CALCULATE_ACTIONS = {}
"""Ein Dictionary bestehend aus allen Calculate-Actions-Methoden."""


def register_calculate(func):
    """Registriert die übergebene Funktion und versieht sie mit einem `"try/except"`-Block.
    Fügt eine Action-Funktion dem Dictionary CALCULATE_ACTIONS hinzu.

    :param func: die zu registrierende Funktion
    :return: Funktion mit try/except-Block
    """
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
            new_value = round(mean_value, data.get_data(values["decimal"], values, numbers.Number))
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
def calculate_sum(values: dict, data: StepData):
    """Findet den Maximalwert von Werten, die in einem Array stehen.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(key, values)
        new_key = get_new_keys(values, idx)
        new_value = sum(value)
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
            new_value = round(value, data.get_data(values["decimal"], values, numbers.Number))
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


# Function that can be used in all calculate-Actions with 2 values
def _bi_calculate(values: dict, data: StepData, op):
    keys_right = values.get("keys_right", None)
    value_right = values.get("value_right", None)
    value_left = values.get("value_left", None)
    decimal = values.get("decimal", None)

    # TODO (max) May solve loop two key arrays better to support key, key1
    for idx, key in data.loop_key(values["keys"], values):
        key = data.get_data(key, values)
        new_key = get_new_keys(values, idx)

        if keys_right is not None:
            # If keys_right is present use that key
            right = data.get_data(keys_right[idx], values)
            res = op(key, right)
        elif value_right is not None:
            # If value_right is present use that value
            right = data.get_data(value_right, values, numbers.Number)
            res = op(key, right)
        else:
            # If value_left is present use that value
            left = data.get_data(value_left, values, numbers.Number)
            res = op(left, key)

        if decimal is not None:
            # If decimal is present round
            decimal = data.get_data(decimal, values, numbers.Number)
            res = round(res, decimal)
            if decimal == 0:
                res = int(res)

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
    _bi_calculate(values, data, operator.truediv)


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

@register_calculate
def calculate_modulo(values: dict, data: StepData):
    """Dividiert gegebene Werte durch Werte, die in divide_by stehen und gibt den Restwert zurück.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    _bi_calculate(values, data, operator.mod)
