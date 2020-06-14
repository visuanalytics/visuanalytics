import re
from datetime import datetime

from numpy import random

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.transform.calculate import calculate
from visuanalytics.analytics.util.step_pattern import data_insert_pattern, data_get_pattern


def transform(values: dict, data: StepData):
    for transformation in values["transform"]:
        transformation["_loop_states"] = values.get("_loop_states", {})

        TRANSFORM_TYPES[transformation["type"]](transformation, data)


def transform_array(values: dict, data: StepData):
    for idx, entry in enumerate(data.get_data(values["array_key"], values)):
        data.save_loop(values, idx, entry)
        transform(values, data)


def transform_dict(values: dict, data: StepData):
    for entry in data.get_data(values["dict_key"], values).items():
        data.save_loop(values, entry[0], entry[1])
        transform(values, data)


def transform_select(values: dict, data: StepData):
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


def transform_select_range(values: dict, data: StepData):
    value_array = data.get_data(values["array_key"], values)
    range_start = data.format(values.get("range_start", 0), values)
    range_end = data.format(values["range_end"], values)

    data.insert_data(values["array_key"], value_array[range_start:range_end], values)


def transform_append(values: dict, data: StepData):
    # TODO(Max) improve
    try:
        array = data.get_data(values["new_key"], values)
    except KeyError:
        data.insert_data(values["new_key"], [], values)
        array = data.get_data(values["new_key"], values)

    value = data.get_data(values["key"], values)

    array.append(value)


def transform_add_symbol(values: dict, data: StepData):
    """Fügt ein Zeichen, Symbol, Wort oder einen Satz zu einem Wert hinzu.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, key)
        new_key = transform_get_new_keys(values, idx, key)

        new_values = data.format(values['pattern'], values)
        data.insert_data(new_key, new_values, values)


def transform_replace(values: dict, data: StepData):
    """Ersetzt ein Zeichen, Symbol, Wort oder einen Satz.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, key)

        value = str(data.get_data(key, values))
        new_key = transform_get_new_keys(values, idx, key)

        new_value = value.replace(data.format(values["old_value"], values),
                                  data.format(values["new_value"], values),
                                  data.format(values.get("count", -1), values))
        data.insert_data(new_key, new_value, values)


def transform_replace_kv(values: dict, data: StepData):
    """Setzt den value zu einem key als neuen value für die JSON.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, key)

        value = str(data.get_data(key, values))
        new_key = transform_get_new_keys(values, idx, key)

        new_value = data.format(values["dict"][value], values)
        data.insert_data(new_key, new_value, values)


def transform_alias(values: dict, data: StepData):
    for key, new_key in zip(values["keys"], values["new_keys"]):
        value = data.get_data(key, values)
        new_key = data.format(new_key, values)

        # TODO(max) maybe just replace key not insert and delete
        data.insert_data(new_key, value, values)
        data.remove_data(key, values)


def transform_regex(values: dict, data: StepData):
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, key)

        value = str(data.get_data(key, values))
        new_key = transform_get_new_keys(values, idx, key)

        find = data.format(values["find"][value], values)
        replace_by = data.format(values["replace_by"][value], values)
        new_value = re.sub(find, replace_by, value)
        data.insert_data(new_key, new_value, values)


def transform_date_format(values: dict, data: StepData):
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
        new_key = transform_get_new_keys(values, idx, key)
        data.insert_data(new_key, new_value, values)


def transform_timestamp(values: dict, data: StepData):
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, key)
        value = data.get_data(key, values)
        date = datetime.fromtimestamp(value)
        new_key = transform_get_new_keys(values, idx, key)
        new_value = date.strftime(data.format(values["format"], values))
        data.insert_data(new_key, new_value, values)


def transform_date_weekday(values: dict, data: StepData):
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
        new_key = transform_get_new_keys(values, idx, key)

        new_value = day_weekday[date.weekday()]
        data.insert_data(new_key, new_value, values)


def transform_date_now(values: dict, data: StepData):
    """Generiert das heutige Datum und gibt es im gewünschten Format aus.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    new_key = values["new_key"]
    date_format = data.format(values["format"], values)
    value = datetime.now()
    new_value = value.strftime(date_format)
    data.insert_data(new_key, new_value, values)


def transform_wind_direction(values: dict, data: StepData):
    """Wandelt einen String von Windrichtungen um.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    key = values["key"]
    value = data.get_data(values["key"], values)
    new_key = transform_get_new_keys(values, -1, key)
    if value.find(data.format(values["delimiter"], values)) != -1:
        wind = value.split("-")
        wind_1 = wind[0]
        wind_2 = wind[1]
        wind_dir_1 = data.format(values["dict"][wind_1]["0"], values)
        wind_dir_2 = data.format(values["dict"][wind_2]["0"], values)
        new_value = f"{wind_dir_1} {wind_dir_2}"
    else:
        new_value = data.format(values["dict"][value]["1"], values)
    data.insert_data(new_key, new_value, values)


def transform_choose_random(values: dict, data: StepData):
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
        new_key = transform_get_new_keys(values, -1, key)
        new_value = data.format(values["dict"][value][decision], values)
        data.insert_data(new_key, new_value, values)


def transform_loop(values: dict, data: StepData):
    loop_values = values.get("values", None)

    # is Values is none use range
    if loop_values is None:
        start = data.format(values.get("range_start", 0), values)
        stop = data.format(values["range_stop"], values)
        loop_values = range(start, stop)

    for idx, value in enumerate(loop_values):
        data.save_loop(values, idx, value)
        transform(values, data)


def transform_add_data(values: dict, data: StepData):
    new_key = data.format(values["new_key"], values)
    value = data.format(values["pattern"], values)
    data.insert_data(new_key, values, values)


def transform_get_new_keys(values: dict, idx, key):
    return values["new_keys"][idx] if values.get("new_keys", None) else key


TRANSFORM_TYPES = {
    "transform_array": transform_array,
    "transform_dict": transform_dict,
    "select": transform_select,
    "select_range": transform_select_range,
    "append": transform_append,
    "add_symbol": transform_add_symbol,
    "replace": transform_replace,
    "replace_kv": transform_replace_kv,
    "alias": transform_alias,
    "regex": transform_regex,
    "date_format": transform_date_format,
    "timestamp": transform_timestamp,
    "date_weekday": transform_date_weekday,
    "date_now": transform_date_now,
    "loop": transform_loop,
    "wind_direction": transform_wind_direction,
    "choose_random": transform_choose_random,
    "add_data": transform_add_data,
    "calculate": calculate
}
