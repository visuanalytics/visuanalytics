"""
Modul mit Funktionen zur Berechnung und Umwandlung von Daten.
"""
import numbers
import re
from collections import Counter
from datetime import datetime
from pydoc import locate
from random import randint

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.transform.calculate import CALCULATE_ACTIONS
from visuanalytics.analytics.transform.util.key_utils import get_new_keys, get_new_key
from visuanalytics.analytics.util.step_errors import TransformError, \
    raise_step_error, StepKeyError
from visuanalytics.analytics.util.step_pattern import data_insert_pattern, data_get_pattern
from visuanalytics.analytics.util.step_utils import execute_type_option, execute_type_compare
from visuanalytics.analytics.util.type_utils import get_type_func, register_type_func
from visuanalytics.util import resources

TRANSFORM_TYPES = {}
"""Ein Dictionary bestehend aus allen Transform-Typ-Methoden.  """


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
    Fügt eine Typ-Funktion dem Dictionary TRANSFORM_TYPES hinzu.

    :param func: die zu registrierende Funktion
    :return: Funktion mit try/catch-Block
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
            if values.get("ignore_errors", False) is False:
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
    range_start = data.get_data(values.get("range_start", 0), values, int)
    range_end = data.get_data(values["range_end"], values, int)

    data.insert_data(values["array_key"], value_array[range_start:range_end], values)


@register_transform
def append(values: dict, data: StepData):
    """Speichert den Wert unter `"key"` in einem Array.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(key, values)
        new_key = values["new_keys"][idx]
        new_key_format = data.format(values.get("append_type", "list"))

        try:
            result = data.get_data(new_key, values)
        except StepKeyError:
            if new_key_format == "string":
                data.insert_data(new_key, "", values)
            else:
                data.insert_data(new_key, [], values)

            result = data.get_data(new_key, values)

        if new_key_format == "string":
            result = result + data.format(values.get("delimiter", " ")) + value
            data.insert_data(new_key, result, values)
        else:
            result.append(value)


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
                                  data.get_data(values.get("count", -1), values, int))
        data.insert_data(new_key, new_value, values)


@register_transform
def translate(values: dict, data: StepData):
    """Setzt den Wert eines Keys zu einem neuen Key als Wert für die JSON.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = str(data.get_data(key, values))
        new_key = get_new_keys(values, idx)
        translation = data.get_data(values["dict"], values, dict)

        new_value = data.format(translation[value], values)
        data.insert_data(new_key, new_value, values)


@register_transform
def alias(values: dict, data: StepData):
    """Erstzt einen Key durch einen neuen Key.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for key, new_key in zip(values["keys"], values["new_keys"]):
        value = data.get_data(key, values)
        new_key = data.format(new_key, values)

        data.insert_data(new_key, value, values)

        if not data.get_data(values.get("keep_old", False), {}, bool):
            data.remove_data(key, values)


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
        zeropaded_off = data.get_data(values.get("zeropaded_off", False), values, bool)
        if zeropaded_off:
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
        zeropaded_off = data.get_data(values.get("zeropaded_off", False), values, bool)
        if zeropaded_off:
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
    zeropaded_off = data.get_data(values.get("zeropaded_off", False), values, bool)
    if zeropaded_off:
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
    loop_values = data.deep_format(values.get("values", None), values=values)

    # if values is none use range
    if loop_values is None:
        start = data.get_data(values.get("range_start", 0), values, int)
        stop = data.get_data(values["range_stop"], values, int)
        loop_values = range(start, stop)

    for _ in data.loop_array(loop_values, values):
        transform(values, data)


@register_transform
def add_data(values: dict, data: StepData):
    """Fügt Daten zu einem neuen Key hinzu.

    Fügt die unter `"data"` angegebenen Daten zu einem neuen Key hinzu.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for new_key in values["new_keys"]:
        value = data.deep_format(values["data"], values=values)
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
    values["transform"] = execute_type_option(values, data)

    transform(values, data)


@register_transform
def compare(values: dict, data: StepData):
    """Vergleicht zwei Werte miteinander und führt je nachdem ob =, !=, < oder > die "transform"-Typen aus.

    Wenn `value_left` gleich `value_right`, führe "transform"-Typen aus on_equal durch.
    Wenn `value_left` ungleich `value_right`, führe "transform"-Typen aus on_not_equal durch.
    Wenn `value_left` größer `value_right`, führe "transform"-Typen aus on_higher durch.
    Wenn `value_left` kleiner `value_right`, führe "transform"-Typen aus on_lower durch.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :return:
    """
    values["transform"] = execute_type_compare(values, data)

    transform(values, data)


@register_transform
def random_value(values: dict, data: StepData):
    """Wählt random einen Wert aus einem Array oder einem Dictionary (zu einem bestimmten Key) aus.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    if "array" in values:
        for key in values["new_keys"]:
            array = data.get_data(values["array"], values, list)
            length = len(array)

            rand = randint(0, length - 1)
            new_value = data.format(array[rand], values)
            data.insert_data(key, new_value, values)
    elif "dict" in values:
        for idx, key in data.loop_key(values["keys"], values):
            new_key = get_new_keys(values, idx)
            new_values = data.get_data(values.get("dict", None), values, dict)
            value = str(data.get_data(key, values))
            length = len(new_values[value])

            rand = randint(0, length - 1)
            new_value = data.format(new_values[value][rand], values)
            data.insert_data(new_key, new_value, values)


@register_transform
def convert(values: dict, data: StepData):
    """Konvertiert ein Datentyp in einen anderen Datentyp.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :return:
    """
    new_type = locate(values["to"])
    for idx, key in data.loop_key(values["keys"], values):
        new_key = get_new_keys(values, idx)
        value = new_type(data.get_data(key, values))

        data.insert_data(new_key, value, values)


@register_transform
def sort(values: dict, data: StepData):
    """Sortiert Wörter nach dem Alphabet oder Zahlen aufsteigend.

    Ist reverse auf True gesetzt, werden die Wörter zu Z nach A sortiert, bzw. Zahlen absteigend.
    Achtung: Sortierung von A nach Z
    ["Argentina", "Canada", "Cyprus", "Germany", "Norway", "Schweden", "USA", "United Kingdom", "Z"]
    "USA" ist vor "United Kingdom", weil bei "USA" der zweite Buchstabe auch groß geschrieben ist.
    Würde dort "Usa" statt "USA" stehen, wäre "United Kingdom" vor "USA".

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :return:
    """
    for idx, key in data.loop_key(values["keys"], values):
        new_key = get_new_keys(values, idx)
        value = data.get_data(key, values)
        reverse = data.get_data(values.get("reverse", False), values, bool)

        new_value = sorted(value, reverse=reverse)

        data.insert_data(new_key, new_value, values)


@register_transform
def most_common(values: dict, data: StepData):
    """Sortiert die Wörter nach der Häufigkeit, optional mit Häufigkeit.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :return:
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(key, values)
        new_key = get_new_keys(values, idx)

        most_c_list = Counter(value).most_common()

        if data.get_data(values.get("include_count", False), values, bool):
            new_value = most_c_list
        else:
            new_value = [elm[0] for elm in most_c_list]

        data.insert_data(new_key, new_value, values)


@register_transform
def sub_lists(values: dict, data: StepData):
    """Extrahiert aus einem Array (Liste) kleinere Arrays (Listen).

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :return:
    """
    value = data.get_data(values["array_key"], values)

    for sub_list in values["sub_lists"]:
        start = data.get_data(sub_list.get("range_start", 0), values, numbers.Number)
        end = data.get_data(sub_list.get("range_end", -1), values, numbers.Number)
        new_key = get_new_key(sub_list)

        new_value = value[start:end]

        data.insert_data(new_key, new_value, values)


@register_transform
def to_dict(values: dict, data: StepData):
    """Wandelt eine Liste aus Tupeln oder Arrays in ein Dictionary um.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :return:
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(key, values)
        new_key = get_new_keys(values, idx)
        new_value = dict(value)

        data.insert_data(new_key, new_value, values)


@register_transform
def join(values: dict, data: StepData):
    """Fügt Elemente einer Liste zu einem String zusammen mit jeweils einem Delimiter dazwischen.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :return:
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(key, values)
        new_key = get_new_keys(values, idx)
        delimiter = data.format(values.get("delimiter", ""), values)

        new_value = delimiter.join(value)

        data.insert_data(new_key, new_value, values)


@register_transform
def length(values: dict, data: StepData):
    """Gibt die Länge von Arrays (Listen), Strings, Tupeln und Dictionaries aus.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :return:
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(key, values)
        new_key = get_new_keys(values, idx)

        data.insert_data(new_key, len(value), values)


@register_transform
def remove_from_list(values: dict, data: StepData):
    """Bekommt Stopwords und wandelt die jeweiligen Wörter so um, dass Groß- und Kleinschreibung unwichtig ist.

    Bekommt eine Stopword-Liste aus der Textdatei resources/stopwords/stopwords.txt und ggf. die bei der Job-Erstellung
    eingegebenen wurden und wandelt die jeweiligen Wörter so um, dass Groß- und Kleinschreibung unwichtig ist.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :return:
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(key, values)
        new_key = get_new_keys(values, idx)
        to_remove = data.get_data(values.get("to_remove", []), values, list)

        if data.get_data(values.get("use_stopwords", False), values, bool):
            try:
                file = resources.get_resource_path("stopwords/stopwords.txt")
                with open(file, "r", encoding='utf-8') as f:
                    list_stopwords = f.read().splitlines()

                to_remove = to_remove + list_stopwords
            except IOError:
                pass

        if data.get_data(values.get("ignore_case", False), values, bool):
            to_remove = [r.lower() for r in to_remove]
            new_value = [v for v in value if v.lower() not in to_remove]
        else:
            new_value = [v for v in value if v not in to_remove]

        data.insert_data(new_key, new_value, values)


@register_transform
def lower_case(values: dict, data: StepData):
    """Jedes Wort in der Liste wird komplett in Kleinbuchstaben geschrieben.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :return:
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(key, values)
        new_key = get_new_keys(values, idx)

        new_value = [each.lower() for each in value]
        data.insert_data(new_key, new_value, values)


@register_transform
def upper_case(values: dict, data: StepData):
    """Jedes Wort in der Liste wird komplett in Großbuchstaben geschrieben.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :return:
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(key, values)
        new_key = get_new_keys(values, idx)

        new_value = [each.upper() for each in value]
        data.insert_data(new_key, new_value, values)


@register_transform
def capitalize(values: dict, data: StepData):
    """Der erste Buchstabe jedes Worts in der Liste wird groß geschrieben.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :return:
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(key, values)
        new_key = get_new_keys(values, idx)

        new_value = [each.capitalize() for each in value]
        data.insert_data(new_key, new_value, values)


@register_transform
def normalize_words(values: dict, data: StepData):
    """Wörter, die öfter vorkommen und unterschiedliche cases besitzen, werden normalisiert.

    Eine Liste wird durchlaufen und jedes Wort welches bei zweiten Vorkommen anders geschrieben wurde als das erste
    vorgekommene wird dann so ersetzt, dass es so geschrieben wird wie das zuerst vorgekommene. Z.B. Bundesliga und
    bundesliga. Aus bundesliga wird Bundesliga.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :return:
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(key, values)
        new_key = get_new_keys(values, idx)
        already_there = []
        new_value = []
        for each in value:
            if each.upper() in already_there:
                new_value.append(each.upper())
            elif each.lower() in already_there:
                new_value.append(each.lower())
            elif each.capitalize() in already_there:
                new_value.append(each.capitalize())
            else:
                already_there.append(each)
                new_value.append(each)

        data.insert_data(new_key, new_value, values)


@register_transform
def split_string(values: dict, data: StepData):
    """Teilt einen String am angegebenen Trennzeichen.

    Das Trennzeichen können auch mehrere Zeichen sein. Soll die Groß- und Kleinschreibung des Trennzeichens (delimiter) ignoriert werden, setzte `ignore_case` auf `true`.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :return:
    """
    for idx, key in data.loop_key(values["keys"], values):
        value = data.get_data(key, values)
        delimiter = data.format(values.get("delimiter", " "), values)
        new_key = get_new_keys(values, idx)

        if data.get_data(values.get("ignore_case", False), values, bool):
            new_value = re.split(delimiter, value, flags=re.IGNORECASE)
        else:
            new_value = re.split(delimiter, value)
        data.insert_data(new_key, new_value, values)


@register_transform
def check_key(values: dict, data: StepData):
    """Überprüft, ob ein Key vorhanden ist und setzt den dazugehörigen `key` bzw. den `new_keys` auf `true`.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :return:
    """
    for idx, key in enumerate(values["keys"]):
        try:
            data.get_data(key, values)
            value = True
        except StepKeyError:
            if "init_with" in values:
                init = data.deep_format(values["init_with"], values=values)
                data.insert_data(key, init, values)

            value = False
        if "new_keys" in values:
            data.insert_data(values["new_keys"][idx], value, values)
