import re
from datetime import datetime

from numpy import random

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.transform.calculate import CALCULATE_ACTIONS
from visuanalytics.analytics.transform.util.key_utils import get_new_keys, get_new_key
from visuanalytics.analytics.util.step_pattern import data_insert_pattern, data_get_pattern

TRANSFORM_TYPES = {}


def transform(values: dict, data: StepData):
    for transformation in values["transform"]:
        transformation["_loop_states"] = values.get("_loop_states", {})

        TRANSFORM_TYPES[transformation["type"]](transformation, data)


def register_transform(func):
    TRANSFORM_TYPES[func.__name__] = func
    return func


@register_transform
def transform_array(values: dict, data: StepData):
    for idx, entry in enumerate(data.get_data(values["array_key"], values)):
        data.save_loop(values, idx, entry)
        transform(values, data)


@register_transform
def transform_dict(values: dict, data: StepData):
    for entry in data.get_data(values["dict_key"], values).items():
        data.save_loop(values, entry[0], entry[1])
        transform(values, data)


@register_transform
def calculate(values: dict, data: StepData):
    action = data.format(values["action"], values)
    CALCULATE_ACTIONS[action](values, data)


@register_transform
def select(values: dict, data: StepData):
    root = values.get("_loop_states", {}).get("_loop", None)

    if root is None:
        # If root is data root
        old_root = dict(data.data)
        data.clear_data()
        root = data.data
    else:
        old_root = dict(root)
        root.clear()

    for key in values["relevant_keys"]:
        data_insert_pattern(key, root, data_get_pattern(key, old_root))


@register_transform
def select_range(values: dict, data: StepData):
    value_array = data.get_data(values["array_key"], values)
    range_start = data.format(values.get("range_start", 0), values)
    range_end = data.format(values["range_end"], values)

    data.insert_data(values["array_key"], value_array[range_start:range_end], values)


@register_transform
def append(values: dict, data: StepData):
    # TODO(Max) improve
    try:
        array = data.get_data(values["new_key"], values)
    except KeyError:
        data.insert_data(values["new_key"], [], values)
        array = data.get_data(values["new_key"], values)

    value = data.get_data(values["key"], values)

    array.append(value)


@register_transform
def add_symbol(values: dict, data: StepData):
    """Fügt ein Zeichen, Symbol, Wort oder einen Satz zu einem Wert hinzu.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, key)
        new_key = get_new_keys(values, idx)

        new_values = data.format(values['pattern'], values)
        data.insert_data(new_key, new_values, values)


@register_transform
def replace(values: dict, data: StepData):
    """Ersetzt ein Zeichen, Symbol, Wort oder einen Satz.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, key)

        value = str(data.get_data(key, values))
        new_key = get_new_keys(values, idx)

        new_value = value.replace(data.format(values["old_value"], values),
                                  data.format(values["new_value"], values),
                                  data.format(values.get("count", -1), values))
        data.insert_data(new_key, new_value, values)


@register_transform
def translate_key(values: dict, data: StepData):
    """Setzt den value zu einem key als neuen value für die JSON.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, key)

        value = str(data.get_data(key, values))
        new_key = get_new_keys(values, idx)

        new_value = data.format(values["dict"][value], values)
        data.insert_data(new_key, new_value, values)


@register_transform
def alias(values: dict, data: StepData):
    for key, new_key in zip(values["keys"], values["new_keys"]):
        value = data.get_data(key, values)
        new_key = data.format(new_key, values)

        # TODO(max) maybe just replace key not insert and delete
        data.insert_data(new_key, value, values)
        data.remove_data(key, values)


@register_transform
def regex(values: dict, data: StepData):
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, key)

        value = str(data.get_data(key, values))
        new_key = get_new_keys(values, idx)

        find = data.format(values["find"], values)
        replace_by = data.format(values["replace_by"], values)
        new_value = re.sub(find, replace_by, value)
        data.insert_data(new_key, new_value, values)


@register_transform
def date_format(values: dict, data: StepData):
    """Ändert das Format des Datums bzw. der Uhrzeit.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, key)

        value = data.get_data(key, values)
        given_format = data.format(values["given_format"], values)
        date = datetime.strptime(value, given_format).date()
        new_value = date.strftime(data.format(values["format"], values))
        new_key = get_new_keys(values, idx)
        data.insert_data(new_key, new_value, values)


@register_transform
def timestamp(values: dict, data: StepData):
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, key)
        value = data.get_data(key, values)
        date = datetime.fromtimestamp(value)
        new_key = get_new_keys(values, idx)
        if values.get("zeropaded_off", False):
            new_value = date.strftime(data.format(values["format"], values)).lstrip("0").replace(" 0", " ")
            data.insert_data(new_key, new_value, values)
        else:
            new_value = date.strftime(data.format(values["format"], values))
            data.insert_data(new_key, new_value, values)


@register_transform
def date_weekday(values: dict, data: StepData):
    """Wandelt das Datum in den Wochentag in.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    day_weekday = {
        0: "Montag",
        1: "Dienstag",
        2: "Mittwoch",
        3: "Donnerstag",
        4: "Freitag",
        5: "Samstag",
        6: "Sonntag"
    }
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, key)

        value = data.get_data(values["keys"][idx], values)
        given_format = data.format(values["given_format"], values)
        date = datetime.strptime(value, given_format).date()
        new_key = get_new_keys(values, idx)

        new_value = day_weekday[date.weekday()]
        data.insert_data(new_key, new_value, values)


@register_transform
def date_now(values: dict, data: StepData):
    """Generiert das heutige Datum und gibt es im gewünschten Format aus.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    new_key = values["new_key"]
    date_format = data.format(values["format"], values)
    value = datetime.now()
    new_value = value.strftime(date_format)
    data.insert_data(new_key, new_value, values)


@register_transform
def wind_direction(values: dict, data: StepData):
    """Wandelt einen String von Windrichtungen um.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    value = data.get_data(values["key"], values)
    new_key = get_new_key(values)
    if value.find(data.format(values["delimiter"], values)) != -1:
        wind = value.split("-")
        wind_1 = wind[0]
        wind_2 = wind[1]
        wind_dir_1 = data.format(values["dict"][wind_1]["0"], values)
        wind_dir_2 = data.format(values["dict"][wind_2]["0"], values)
        new_value = f"{wind_dir_1}-{wind_dir_2}"
    else:
        new_value = data.format(values["dict"][value]["1"], values)
    data.insert_data(new_key, new_value, values)


@register_transform
def choose_random(values: dict, data: StepData):
    """Wählt aus einem gegebenen Dictionary mithilfe von gegebenen Wahlmöglichkeiten random einen Value aus.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, key)

        value = str(data.get_data(key, values))
        choice_list = []
        for x in range(len(values["choice"])):
            choice_list.append(data.format(values["choice"][x], values))
        decision = str(random.choice(choice_list))
        new_key = get_new_keys(values, idx)
        new_value = data.format(values["dict"][value][decision], values)
        data.insert_data(new_key, new_value, values)


@register_transform
def find_equal(values: dict, data: StepData):
    # TODO
    """innerhalb von loop

    :param values:
    :param data:
    """
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, key)

        value = data.get_data(key, values)
        new_key = get_new_keys(values, idx)
        search_through = data.format(values["search_through"], values)
        replace_by = data.format(values["replace_by"], values)
        if value == search_through:
            new_value = replace_by
        else:
            new_value = value
        data.insert_data(new_key, new_value, values)


@register_transform
def loop(values: dict, data: StepData):
    loop_values = values.get("values", None)

    # is Values is none use range
    if loop_values is None:
        start = data.format(values.get("range_start", 0), values)
        stop = data.format(values["range_stop"], values)
        loop_values = range(start, stop)

    for idx, value in enumerate(loop_values):
        data.save_loop(values, idx, value)
        transform(values, data)


@register_transform
def add_data(values: dict, data: StepData):
    new_key = data.format(values["new_key"], values)
    value = data.format(values["pattern"], values)
    data.insert_data(new_key, value, values)
