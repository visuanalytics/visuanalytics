AUDIO_PARTS_TYPES = {}


def audio_parts(values, data):
    return "".join([f"{AUDIO_PARTS_TYPES[value['type']](value, data)} " for value in values])


def register_audio_parts(func):
    AUDIO_PARTS_TYPES[func.__name__] = func
    return func


@register_audio_parts
def text(values, data):
    return data.format(values["pattern"], values)
