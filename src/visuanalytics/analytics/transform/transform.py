import re
from datetime import datetime
from pydoc import locate
from random import randint

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.transform.calculate import CALCULATE_ACTIONS
from visuanalytics.analytics.transform.util.key_utils import get_new_keys, get_new_key
from visuanalytics.analytics.util.step_errors import TransformError, \
    raise_step_error, StepKeyError
from visuanalytics.analytics.util.step_pattern import data_insert_pattern, data_get_pattern
from visuanalytics.analytics.util.type_utils import get_type_func, register_type_func

TRANSFORM_TYPES = {}


@raise_step_error(TransformError)
def transform(values: dict, data: StepData):
    """Führt die unter `"type"` angegebene transform-Funktion als Schleife aus.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :return:
    """
    for transformation in values["transform"]:
        transformation["_loop_states"] = values.get("_loop_states", {})

        trans_func = get_type_func(transformation, TRANSFORM_TYPES)

        trans_func(transformation, data)


def register_transform(func):
    """Registriert die übergebene Funktion und versieht sie mit einem `"try except"`-Block.

    :param func: die zu registrierende Funktion
    :return: Funktion mit try catch Block
    """
    return register_type_func(TRANSFORM_TYPES, TransformError, func)


@register_transform
def transform_array(values: dict, data: StepData):
    """Führt alle angegebenen `"transform"`-Funktionen für alle Werte eines Arrays aus.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for _ in data.loop_array(data.get_data(values["array_key"], values), values):
        transform(values, data)


@register_transform
def transform_dict(values: dict, data: StepData):
    """Führt alle angegebenen `"transform"`-Funktionen für alle Werte eines Dictionaries aus.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for _ in data.loop_dict(data.get_data(values["dict_key"], values), values):
        transform(values, data)


@register_transform
def calculate(values: dict, data: StepData):
    """Berechnet die angegebene `"action"`.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    action_func = get_type_func(values, CALCULATE_ACTIONS, "action")

    action_func(values, data)


@register_transform
def select(values: dict, data: StepData):
    """Entfernt alle Keys, die nicht in `"relevant_keys"` stehen aus dem Dictionary.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
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
            if values.get("ignore_errors", False):
                raise


@register_transform
def delete(values: dict, data: StepData):
    """
    Löscht die angegebenen Keys aus den daten

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        data.remove_data(key, values)


@register_transform
def select_range(values: dict, data: StepData):
    """Entfernt alle Werte aus `"array_key"`, die nicht in `"range"` sind.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    value_array = data.get_data(values["array_key"], values)
    range_start = data.format(values.get("range_start", 0), values)
    range_end = data.format(values["range_end"], values)

    data.insert_data(values["array_key"], value_array[range_start:range_end], values)


@register_transform
def append(values: dict, data: StepData):
    """Speichert den Wert unter `"key"` in einem Array.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    # TODO(Max) improve
    try:
        array = data.get_data(values["new_key"], values)
    except StepKeyError:
        data.insert_data(values["new_key"], [], values)
        array = data.get_data(values["new_key"], values)

    value = data.get_data(values["key"], values)

    array.append(value)


@register_transform
def add_symbol(values: dict, data: StepData):
    """Fügt ein Zeichen, Symbol, Wort oder einen Satz zu einem Wert hinzu.

    Fügt ein Zeichen, Symbol, Wort oder einen Satz zu einem Wert hinzu. Dieses kann sowohl vor als auch hinter dem Wert
    stehen, der mit `"{_key}"` eingefügt wird. Außerdem kann man so einen Wert kopieren und einem neuen Key zuweisen, wenn
    man in unter `"pattern"` nur `"{_key}"` einsetzt.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        new_key = get_new_keys(values, idx)

        new_values = data.format(values['pattern'], values)
        data.insert_data(new_key, new_values, values)


@register_transform
def replace(values: dict, data: StepData):
    """Ersetzt ein Zeichen, Symbol, Wort, einen Satz oder eine ganzen Text in einem String.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = str(data.get_data(key, values))
        new_key = get_new_keys(values, idx)

        new_value = value.replace(data.format(values["old_value"], values),
                                  data.format(values["new_value"], values),
                                  data.format(values.get("count", -1), values))
        data.insert_data(new_key, new_value, values)


@register_transform
def translate_key(values: dict, data: StepData):
    """Setzt den Wert eines Keys zu einem neuen Key als Wert für die JSON.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = str(data.get_data(key, values))
        new_key = get_new_keys(values, idx)

        new_value = data.format(values["dict"][value], values)
        data.insert_data(new_key, new_value, values)


@register_transform
def alias(values: dict, data: StepData):
    """Erstzt einen Key durch einen neuen Key.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for key, new_key in zip(values["keys"], values["new_keys"]):
        try:
            value = data.get_data(key, values)
            new_key = data.format(new_key, values)

            # TODO(max) maybe just replace key not insert and delete
            data.insert_data(new_key, value, values)
            data.remove_data(key, values)
        except:
            if values.get("ignore_errors", False):
                raise


@register_transform
def regex(values: dict, data: StepData):
    """Führt `"re.sub"` für die angegebenen Felder aus.
    regex (suche nach dieser Expression, replace_by (ersetze Expression durch), value (String in dem ersetzt werden soll)

    Geht nur für regex ohne backslash \

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(key, values)
        new_key = get_new_keys(values, idx)

        regex = data.format(values["regex"], values)
        find = fr"{regex}"
        replace_by = data.format(values["replace_by"], values)
        new_value = re.sub(find, replace_by, value)
        data.insert_data(new_key, new_value, values)


@register_transform
def date_format(values: dict, data: StepData):
    """Ändert das Format des Datums und der Uhrzeit.

    Ändert das Format des Datums und der Uhrzeit, welches unter `"given_format"` angegeben wird, in ein gewünschtes
    anderes Format, welches unter `"format"` angegeben wird.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(key, values)
        given_format = data.format(values["given_format"], values)
        date = datetime.strptime(value, given_format).date()
        new_key = get_new_keys(values, idx)
        zeropaded_off = values.get("zeropaded_off", None)
        if (zeropaded_off is not None) and (zeropaded_off == True):
            new_value = date.strftime(data.format(values["format"], values)).lstrip("0").replace(" 0", " ")
        else:
            new_value = date.strftime(data.format(values["format"], values))
        data.insert_data(new_key, new_value, values)


@register_transform
def timestamp(values: dict, data: StepData):
    """Wandelt einen UNIX-Zeitstempel in ein anderes Format um.

    Wandelt einen UNIX-Zeitstempel in ein anderes Format um, welches unter `"format"` angegeben wird. Ist zeropaded_off
    true, so wird aus z.B. 05 eine 5.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(key, values)
        date = datetime.fromtimestamp(value)
        new_key = get_new_keys(values, idx)
        zeropaded_off = values.get("zeropaded_off", None)
        if (zeropaded_off is not None) and (zeropaded_off == True):
            new_value = date.strftime(data.format(values["format"], values)).lstrip("0").replace(" 0", " ")
        else:
            new_value = date.strftime(data.format(values["format"], values))
        data.insert_data(new_key, new_value, values)


@register_transform
def date_weekday(values: dict, data: StepData):
    """Wandelt das angegebene Datum in den jeweiligen Wochentag um.

    Wandelt das angegebene Datum, im unter `"given_format"` angegebenen Format, in den jeweiligen Wochentag um.

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
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(values["keys"][idx], values)
        given_format = data.format(values["given_format"], values)
        date = datetime.strptime(value, given_format).date()
        new_key = get_new_keys(values, idx)

        new_value = day_weekday[date.weekday()]
        data.insert_data(new_key, new_value, values)


@register_transform
def date_now(values: dict, data: StepData):
    """Generiert das heutige Datum und gibt es im gewünschten Format aus.

    Generiert das heutige Datum und gibt es im unter `"format"` angegebenen Format aus.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    new_key = values["new_key"]
    value = datetime.now()
    zeropaded_off = values.get("zeropaded_off", None)
    if (zeropaded_off is not None) and (zeropaded_off == True):
        new_value = value.strftime(data.format(values["format"], values)).lstrip("0").replace(" 0", " ")
    else:
        new_value = value.strftime(data.format(values["format"], values))
    data.insert_data(new_key, new_value, values)


@register_transform
def wind_direction(values: dict, data: StepData):
    """Wandelt einen String von Windrichtungen um.

    Funktion nur mit den wind_cdir_full-Werten aus der Weatherbit-API ausführbar.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    value = data.get_data(values["key"], values)
    new_key = get_new_key(values)
    delimiter = data.format(values["delimiter"], values)
    if value.find(delimiter) != -1:
        wind = value.split(delimiter)
        wind_1 = wind[0]
        wind_2 = wind[1]
        wind_dir_1 = data.format(values["dict"][wind_1]["0"], values)
        wind_dir_2 = data.format(values["dict"][wind_2]["0"], values)
        new_value = f"{wind_dir_1}-{wind_dir_2}"
    else:
        new_value = data.format(values["dict"][value]["1"], values)
    data.insert_data(new_key, new_value, values)


@register_transform
def loop(values: dict, data: StepData):
    """Durchläuft das angegebene Array und führt für jedes Element die angegebenen `"transform"`-Funktionen aus.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    loop_values = values.get("values", None)

    # is Values is none use range
    if loop_values is None:
        start = data.format(values.get("range_start", 0), values)
        stop = data.format(values["range_stop"], values)
        loop_values = range(start, stop)

    for _ in data.loop_array(loop_values, values):
        transform(values, data)


@register_transform
def add_data(values: dict, data: StepData):
    """Fügt Daten zu einem neuen Key hinzu.

    Fügt die unter `"pattern"` angegebenen Daten zu einem neuen Key hinzu.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for new_key in values["new_keys"]:
        value = data.format(values["pattern"], values)
        data.insert_data(new_key, value, values)


@register_transform
def copy(values: dict, data: StepData):
    """Kopiert einen Wert zu einem neuen Key.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        new_key = get_new_keys(values, idx)
        new_value = data.get_data(key, values)
        data.insert_data(new_key, new_value, values)


@register_transform
def option(values: dict, data: StepData):
    """Führt die aufgeführten `"transform"`-Funktionen aus, je nachdem ob ein bestimmter Wert `"true"` oder `"false"` ist.

    Wenn der Wert, der in `"check"` steht `"true"` ist, werden die `"transform"`-Funktionen ausgeführt,
    die unter `"on_true"` stehen.
    Wenn der Wert, der in `"check"` steht `"false"` ist, werden die `"transform"`-Funktionen ausgeführt,
    die unter `"on_false"` stehen.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    check = data.get_data(values["check"], values)

    if bool(check):
        values["transform"] = values.get("on_true", [])
    else:
        values["transform"] = values.get("on_false", [])

    transform(values, data)


@register_transform
def compare(values: dict, data: StepData):
    value_left = data.get_data_num(values["value_left"], values)
    value_right = data.get_data_num(values["value_right"], values)

    if value_left == value_right:
        values["transform"] = values.get("on_equal", [])
    elif value_left > value_right:
        values["transform"] = values.get("on_higher", [])
    elif value_left < value_right:
        values["transform"] = values.get("on_lower", [])

    transform(values, data)


@register_transform
def random_value(values: dict, data: StepData):
    """Wählt random einen Wert aus einem Array oder einem Dictionary (zu einem bestimmten Key) aus.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    array = values.get("array", None)
    dict = values.get("dict", None)
    for idx, key in data.loop_key(values["keys"], values):
        new_key = get_new_keys(values, idx)
        new_value = ""
        if array is not None:
            length = len(values["array"])
            rand = randint(0, length - 1)
            new_value = data.format(values["array"][rand], values)
        elif dict is not None:
            value = str(data.get_data(key, values))
            length = len(values["dict"][value])
            rand = randint(0, length - 1)
            new_value = data.format(values["dict"][value][rand], values)
        data.insert_data(new_key, new_value, values)


@register_transform
def convert(values: dict, data: StepData):
    new_type = locate(values["to"])
    for idx, key in data.loop_key(values["keys"], values):
        new_key = get_new_keys(values, idx)
        value = new_type(data.get_data(key, values))

        data.insert_data(new_key, value, values)
