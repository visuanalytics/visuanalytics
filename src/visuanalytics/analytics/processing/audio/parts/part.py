"""
Modul, welches die grundlegenden Funktionen der verschiedenen Arten zur Textgenerierung für die Text-to-Speech-Umwandlung beeinhaltet.
"""
from random import randint

from visuanalytics.analytics.util.step_errors import AudioError, raise_step_error
from visuanalytics.analytics.util.step_utils import execute_type_option, execute_type_compare
from visuanalytics.analytics.util.type_utils import get_type_func, register_type_func

AUDIO_PARTS_TYPES = {}
"""Ein Dictionary bestehend aus allen Audio-Parts-Typ-Methoden.  """


@raise_step_error(AudioError)
def audio_parts(values, data):
    return_string = ""
    for value in values:
        return_value = get_type_func(value, AUDIO_PARTS_TYPES)(value, data)
        if not return_value[1]:
            return "", False
        return_string = return_string + return_value[0]
    return return_string, True


def register_audio_parts(func):
    """Registriert die übergebene Funktion und versieht sie mit einem `"try/except"`-Block.
    Fügt eine Typ-Funktion dem Dictionary AUDIO_PARTS_TYPES hinzu.

    :param func: die zu registrierende Funktion
    :return: Funktion mit try/except-Block
    """
    return register_type_func(AUDIO_PARTS_TYPES, AudioError, func)


@register_audio_parts
def file(values, data):
    """
    Gibt an, dass eine bereits vorhandene Audio Teil der Audio ist

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    return "", False


@register_audio_parts
def text(values, data):
    """Gibt den Text unter pattern aus.

    Gibt den Text unter pattern aus. Wenn dieser Ersetzungen erwartet, werden diese durchgeführt.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    return data.format(values["pattern"], values), True


@register_audio_parts
def compare(values, data):
    """Vergleicht zwei Werte miteinander und führt je nachdem, ob =, !=, < oder >, die danach aufgeführten `"audio_parts"`-Funktionen aus.

    Wenn `value_left` gleich `value_right`, führe "transform"-Typen aus on_equal durch.
    Wenn `value_left` ungleich `value_right`, führe "transform"-Typen aus on_not_equal durch.
    Wenn `value_left` größer `value_right`, führe "transform"-Typen aus on_higher durch.
    Wenn `value_left` kleiner `value_right`, führe "transform"-Typen aus on_lower durch.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """

    return audio_parts(execute_type_compare(values, data), data)


@register_audio_parts
def option(values, data):
    """Führt die aufgeführten `"audio_parts"`-Funktionen aus, je nachdem ob ein bestimmter Wert `"true"` oder `"false"` ist.

     Wenn der Wert, der in `"check"` steht `"true"` ist, werden die `"audio_parts"`-Funktionen ausgeführt,
     die unter `"on_true"` stehen.
     Wenn der Wert, der in `"check"` steht `"false"` ist, werden die `"audio_parts"`-Funktionen ausgeführt,
     die unter `"on_false"` stehen.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    return audio_parts(execute_type_option(values, data), data)


@register_audio_parts
def random_text(values, data):
    """Sucht aus mehreren Strings (Array in pattern) zufällig einen aus.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    len_pattern = len(values["pattern"])
    if len_pattern == 1:
        return data.format(values["pattern"][0], values), True
    else:
        rand = randint(0, len_pattern - 1)
        return data.format(values["pattern"][rand], values), True

@register_audio_parts
def silent(values, data):
    """
    Gibt an, dass eine lautlose Audio Teil der Audio ist

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    return "", False
