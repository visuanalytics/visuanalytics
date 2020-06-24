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
