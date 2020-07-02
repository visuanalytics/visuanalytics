import re
from datetime import datetime
from random import randint

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.transform.calculate import CALCULATE_ACTIONS
from visuanalytics.analytics.transform.util.key_utils import get_new_keys, get_new_key
from visuanalytics.analytics.util.step_errors import TransformError, \
    raise_step_error
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
def transform_compare_arrays(values: dict, data: StepData):
    """Vergleicht zwei Werte verschiedener Arrays aus unterschiedlich tiefen Ebenen der Datenstruktur miteinander.

    Vergleicht zwei Werte verschiedener Arrays aus unterschiedlich tiefen Ebenen der Datenstruktur miteinander.
    Neue Values sind Integer-Werte.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """

    pattern = data.format(values["pattern"], values)
    for idx1, entry1 in data.loop_array(data.get_data(values["array_key_1"], values), values):
        compare = data.format(values["compare"], values)
        value_1 = entry1[compare]
        new_key = ""
        new_value = ""
        for idx2, entry2 in data.loop_array(data.get_data(values["array_key_2"], values), values):
            where = data.format(values["where"], values)
            value_2 = entry2[where][compare]
            if value_1 == value_2:
                new_value = int(entry2[where][pattern])
                new_key = values["new_key"]
        data.save_loop(idx1, entry1, values)
        data.insert_data(new_key, new_value, values)


@register_transform
def transform_values_diff(values: dict, data: StepData):
    """Vergleicht zwei Werte verschiedener Arrays aus gleich tiefen Ebenen der Datenstruktur miteinander.

    Vergleicht zwei Werte verschiedener Arrays aus gleich tiefen Ebenen der Datenstruktur miteinander.
    Neue Values sind Integer-Werte.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    pattern = data.format(values["pattern"], values)
    for idx1, entry1 in data.loop_array(data.get_data(values["array_key_2"], values), values):
        compare = data.format(values["compare"], values)
        value_1 = entry1[compare]
        new_key = ""
        new_value = ""
        for idx2, entry2 in data.loop_array(data.get_data(values["array_key_1"], values), values):
            value_2 = entry2[compare]
            if value_1 == value_2:
                new_value = int(entry2[pattern]) - int(entry1[pattern])
                new_key = values["new_key"]
        data.save_loop(idx1, entry1, values)
        data.insert_data(new_key, new_value, values)


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
    action = data.format(values["action"], values)
    CALCULATE_ACTIONS[action](values, data)


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
            if values.get("throw_errors", True):
                raise


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
    except KeyError:
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
            if values.get("throw_errors", True):
                raise


@register_transform
def regex(values: dict, data: StepData):
    # TODO ggf. entfernen, da es wie replace funktioniert
    """Führt `"re.sub"` für die angegebenen Felder aus.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = str(data.get_data(key, values))
        new_key = get_new_keys(values, idx)

        find = data.format(values["find"], values)
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
        new_value = date.strftime(data.format(values["format"], values))
        new_key = get_new_keys(values, idx)
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
        if values.get("zeropaded_off", False):
            new_value = date.strftime(data.format(values["format"], values)).lstrip("0").replace(" 0", " ")
            data.insert_data(new_key, new_value, values)
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
    date_format = data.format(values["format"], values)
    value = datetime.now()
    new_value = value.strftime(date_format)
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
def choose_random(values: dict, data: StepData):
    """Wählt aus einem gegebenen Dictionary mithilfe von gegebenen Wahlmöglichkeiten random einen Wert aus.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = str(data.get_data(key, values))
        length_dict_array = len(values["dict"][value])
        decision = randint(0, length_dict_array - 1)
        new_key = get_new_keys(values, idx)
        new_value = data.format(values["dict"][value][decision], values)
        data.insert_data(new_key, new_value, values)


@register_transform
def find_equal(values: dict, data: StepData):
    # TODO
    """innerhalb von loop

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
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
def result(values: dict, data: StepData):
    """Gibt das Ergebnis von drei möglichen Ergebnissen aus und weist diese einem Key zu.

    Gibt das Ergebnis von drei möglichen Ergebnissen aus und weist diese einem Key zu.
    Die drei möglichen Ergebnisse kommen durch den Vergleich von zwei Werten zustande. Diese Werte sind entweder
    gleich, größer oder kleiner als der jeweils andere Wert. Der zurückgegebene Wert ist ein Integer.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(key, values)
        compare_1 = data.format(values["compare_1"], values)
        compare_2 = data.format(values["compare_2"], values)
        new_key = get_new_keys(values, idx)
        if value[compare_1] == value[compare_2]:
            new_value = int(data.format(values["points"]["1"], values))
        elif value[compare_1] > value[compare_2]:
            new_value = int(data.format(values["points"]["2"], values))
        elif value[compare_1] < value[compare_2]:
            new_value = int(data.format(values["points"]["3"], values))
        else:
            new_value = 0
        data.insert_data(new_key, new_value, values)


@register_transform
def copy(values: dict, data: StepData):
    """Kopiert einen Wert zu einem neuen Key.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        new_key = get_new_keys(values, idx)
        new_value = int(data.get_data(key, values))
        data.insert_data(new_key, new_value, values)


@register_transform
def compare(values: dict, data: StepData):
    value_left: str = data.get_data(values["value_left"], values)
    value_right: str = data.get_data(values["value_right"], values)

    if values.get("on_different", []):
        if value_left.__eq__(value_right):
            values["transform"] = values.get("on_equal", [])
        else:
            values["transform"] = values.get("on_different", [])
    else:
        if value_left == value_right:
            values["transform"] = values.get("on_equal", [])
        elif value_left > value_right:
            values["transform"] = values.get("on_higher", [])
        elif value_left < value_right:
            values["transform"] = values.get("on_lower", [])

    transform(values, data)


@register_transform
def option(values: dict, data: StepData):
    """Führt die aufgeführten `"transform"`-Funktionen aus, je nachdem ob zwei bestimmte Werte =, < oder > sind.

    Wenn `"condition"`-Wert gleich `"check"`-Wert, dann werden die `"transform"`-Funktionen ausgeführt,
    die unter `"on_equal"` stehen.
    Wenn `"condition"`-Wert größer `"check"`-Wert, dann werden die `"transform"`-Funktionen ausgeführt,
    die unter `"on_higher"` stehen.
    Wenn `"condition"`-Wert kleiner `"check"`-Wert, dann werden die `"transform"`-Funktionen ausgeführt,
    die unter `"on_lower"` stehen.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    check = data.get_data(values["check"], values)
    condition = values.get("condition", None)
    if condition is not None:
        if condition == check:
            values["transform"] = values.get("on_equal", [])
        elif condition > check:
            values["transform"] = values.get("on_higher", [])
        elif condition < check:
            values["transform"] = values.get("on_lower", [])
    else:
        if check:
            values["transform"] = values.get("on_true", [])
        else:
            values["transform"] = values.get("on_false", [])

    transform(values, data)


@register_transform
def compare_and_random_text(values: dict, data: StepData):
    """Wählt random einen Text aus bestimmtem `"pattern"`-Arrays aus, je nachdem ob zwei bestimmte Werte =, < oder > sind.

    Wenn `"compare_1"`-Wert gleich `"compare_2"`-Wert, dann wird ein Text aus dem ersten Array aus `"pattern"` random ausgewählt.
    Wenn `"compare_1"`-Wert größer `"compare_2"`-Wert, dann wird ein Text aus dem zweiten Array aus `"pattern"` random ausgewählt.
    Wenn `"compare_1"`-Wert kleiner `"compare_2"`-Wert, dann wird ein Text aus dem dritten Array aus `"pattern"` random ausgewählt.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(key, values)
        where = data.format(values["where"], values)
        compare_1 = data.format(values["compare_1"], values)
        compare_2 = data.format(values["compare_2"], values)
        new_key = get_new_keys(values, idx)
        value_1 = value[where][compare_1]
        value_2 = value[where][compare_2]
        if value_1 == value_2:
            len_pattern = len(values["pattern"][0])
            rand = randint(0, len_pattern - 1)
            new_value = data.format(values["pattern"][0][rand], values)
        elif value_1 > value_2:
            len_pattern = len(values["pattern"][1])
            rand = randint(0, len_pattern - 1)
            new_value = data.format(values["pattern"][1][rand], values)
        elif value_1 < value_2:
            len_pattern = len(values["pattern"][2])
            rand = randint(0, len_pattern - 1)
            new_value = data.format(values["pattern"][2][rand], values)
        else:
            new_value = 0
        data.insert_data(new_key, new_value, values)


@register_transform
def random_text(values: dict, data: StepData):
    """Wählt random einen Text aus einem `"pattern"`-Array aus.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        len_pattern = len(values["pattern"])
        rand = randint(0, len_pattern - 1)
        new_key = get_new_keys(values, idx)
        new_value = data.format(values["pattern"][rand], values)
        data.insert_data(new_key, new_value, values)
