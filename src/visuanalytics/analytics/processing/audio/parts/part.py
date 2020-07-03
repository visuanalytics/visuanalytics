from random import randint

from visuanalytics.analytics.util.step_errors import AudioError, raise_step_error
from visuanalytics.analytics.util.type_utils import get_type_func, register_type_func

AUDIO_PARTS_TYPES = {}


@raise_step_error(AudioError)
def audio_parts(values, data):
    # TODO raise TypeError
    return "".join([f"{get_type_func(value, AUDIO_PARTS_TYPES)(value, data)} " for value in values])


def register_audio_parts(func):
    return register_type_func(AUDIO_PARTS_TYPES, AudioError, func)


@register_audio_parts
def text(values, data):
    """Gibt den Text unter pattern aus.

    Gibt den Text unter pattern aus. Wenn dieser Ersetzungen erwartet, werden diese durchgeführt.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    return data.format(values["pattern"], values)


@register_audio_parts
def compare(values, data):
    """Vergleicht zwei Werte miteinander und führt je nachdem ob =, < oder > random_text mit angegebenen Werten durch.

    Vergleicht zwei Werte miteinander und führt random_text mit den jeweils unter on_equal, on_higher oder on_lower
    angegebenen Werten durch.

    Wenn condition-Value gleich check-Value, führe random_text für die Werte unter on_equal durch.
    Wenn condition-Value größer check-Value, führe random_text für die Werte unter on_higher durch.
    Wenn condition-Value kleiner check-Value, führe random_text für die Werte unter on_lower durch.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """

    value_left = data.get_data_num(values["value_left"], values)
    value_right = data.get_data_num(values["value_right"], values)

    if value_left == value_right:
        values["pattern"] = values.get("on_equal", [])
    elif value_left > value_right:
        values["pattern"] = values.get("on_higher", [])
    elif value_left < value_right:
        values["pattern"] = values.get("on_lower", [])

    random_text(values, data)


@register_audio_parts
def option(values, data):
    """Führt die `"random_text"` aus, je nachdem ob ein bestimmter Wert `"true"` oder `"false"` ist.

    Wenn der Wert, der in `"check"` steht `"true"` ist, wird `"random_text"` ausgeführt mit den pattern,
    die unter `"on_true"` stehen.
    Wenn der Wert, der in `"check"` steht `"false"` ist, wird `"random_text"` ausgeführt mit den pattern,
    die unter `"on_false"` stehen.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    check = data.get_data(values["check"], values)

    if bool(check):
        values["pattern"] = values.get("on_true", [])
    else:
        values["pattern"] = values.get("on_false", [])

    random_text(values, data)


@register_audio_parts
def random_text(values, data):
    """Sucht aus mehreren Strings (Array in pattern) einen aus.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    len_pattern = len(values["pattern"])
    rand = randint(0, len_pattern - 1)
    return data.format(values["pattern"][rand], values)
