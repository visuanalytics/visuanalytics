from numpy import random

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
    return data.format(values["pattern"], values)


@register_audio_parts
def option_for(values, data):
    """Führt Funktionen aus.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """

    value = data.get_data(values["check"], values)
    condition = data.get_data(values["condition"], values)

    if condition == value:
        values["transform"] = values.get("on_equal", [])
    elif condition > value:
        values["transform"] = values.get("on_higher", [])
    elif condition < value:
        values["transform"] = values.get("on_lower", [])

    return random_text(values, data)


@register_audio_parts
def random_text(values, data):
    """Sucht aus mehreren Texten einen aus.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    len_pattern = len(values["pattern"])
    choice = []
    for i in range(len_pattern):
        choice.append(i)
    rand = random.choice(choice)
    return data.format(values["pattern"][rand], values)
