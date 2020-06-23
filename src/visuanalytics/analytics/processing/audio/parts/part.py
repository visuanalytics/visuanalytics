from visuanalytics.analytics.util.step_errors import AudioError, raise_step_error

AUDIO_PARTS_TYPES = {}


@raise_step_error(AudioError)
def audio_parts(values, data):
    # TODO raise TypeError
    return "".join([f"{AUDIO_PARTS_TYPES[value['type']](value, data)} " for value in values])


def register_audio_parts(func):
    func = raise_step_error(AudioError)(func)

    AUDIO_PARTS_TYPES[func.__name__] = func
    return func


@register_audio_parts
def text(values, data):
    return data.format(values["pattern"], values)
