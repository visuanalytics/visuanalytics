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


def transform_compare_arrays(values: dict, data: StepData):
    pattern = data.format(values["pattern"], values)
    for idx1, entry1 in enumerate(data.get_data(values["array_key_1"], values)):
        data.save_loop(values, idx1, entry1)
        compare = data.format(values["compare"], values)
        value_1 = entry1[compare]
        new_key = ""
        new_value = ""
        for idx2, entry2 in enumerate(data.get_data(values["array_key_2"], values)):
            data.save_loop(values, idx2, entry2)
            where = data.format(values["where"], values)
            value_2 = entry2[where][compare]
            if value_1 == value_2:
                new_value = entry2[where][pattern]
                new_key = values["new_key"]
        data.save_loop(values, idx1, entry1)
        data.insert_data(new_key, new_value, values)


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
        try:
            data_insert_pattern(key, root, data_get_pattern(key, old_root))
        except:
            if values.get("throw_errors", True):
                raise     

                
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


def transform_translate_key(values: dict, data: StepData):
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
        try:
            _transform_alias(values, data, key, new_key)
        except:
            if values.get("throw_errors", True):
                raise


def _transform_alias(values: dict, data: StepData, key, new_key):
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

        find = data.format(values["find"], values)
        replace_by = data.format(values["replace_by"], values)
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
        if values.get("zeropaded_off", False):
            new_value = date.strftime(data.format(values["format"], values)).lstrip("0").replace(" 0", " ")
            data.insert_data(new_key, new_value, values)
        else:
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
    new_key = values["new_key"] if values.get("new_key", None) else key
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


def transform_find_equal(values: dict, data: StepData):
    # TODO
    """innerhalb von loop

    :param values:
    :param data:
    """
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, key)

        value = data.get_data(key, values)
        new_key = transform_get_new_keys(values, idx, key)
        search_through = data.format(values["search_through"], values)
        replace_by = data.format(values["replace_by"], values)
        if value == search_through:
            new_value = replace_by
        else:
            new_value = value
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
    data.insert_data(new_key, value, values)


def transform_get_new_keys(values: dict, idx, key):
    return values["new_keys"][idx] if values.get("new_keys", None) else key


def transform_result(values: dict, data: StepData):
    for idx, key in enumerate(values["keys"]):
        value = data.get_data(key, values)
        compare_1 = data.format(values["compare_1"], values)
        compare_2 = data.format(values["compare_2"], values)
        new_key = transform_get_new_keys(values, idx, key)
        if value[compare_1] == value[compare_2]:
            new_value = data.format(values["points"]["1"], values)
        elif value[compare_1] > value[compare_2]:
            new_value = data.format(values["points"]["2"], values)
        elif value[compare_1] < value[compare_2]:
            new_value = data.format(values["points"]["3"], values)
        else:
            new_value = ""
        data.insert_data(new_key, new_value, values)


def transform_copy(values: dict, data: StepData):
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, key)
        new_key = transform_get_new_keys(values, idx, key)
        new_value = str(data.get_data(key, values))
        data.insert_data(new_key, new_value, values)


def transform_compare_and_copy(values: dict, data: StepData):
    for idx1, key_1 in enumerate(values["array_keys_1"]):
        data.save_loop_key(values, key_1)
        value_1 = data.get_data(key_1, values)
        for idx2, key_2 in enumerate(values["array_keys_2"]):
            data.save_loop_key(values, key_2)
            value_2 = data.get_data(key_2, values)
            for idx, key in enumerate(values["keys"]):
                data.save_loop_key(values, key)
                value = data.get_data[key]
                if value_1 == value_2:
                    new_value = value
                    new_key = transform_get_new_keys(values, idx1, key_1)
                    data.insert_data(new_key, new_value, values)


TRANSFORM_TYPES = {
    "transform_array": transform_array,
    "transform_dict": transform_dict,
    "transform_compare_arrays": transform_compare_arrays,
    "select": transform_select,
    "select_range": transform_select_range,
    "append": transform_append,
    "add_symbol": transform_add_symbol,
    "replace": transform_replace,
    "translate_key": transform_translate_key,
    "alias": transform_alias,
    "regex": transform_regex,
    "date_format": transform_date_format,
    "timestamp": transform_timestamp,
    "date_weekday": transform_date_weekday,
    "date_now": transform_date_now,
    "find_equal": transform_find_equal,
    "loop": transform_loop,
    "wind_direction": transform_wind_direction,
    "choose_random": transform_choose_random,
    "add_data": transform_add_data,
    "result": transform_result,
    "copy": transform_copy,
    "compare_and_copy": transform_compare_and_copy,
    "calculate": calculate
}
