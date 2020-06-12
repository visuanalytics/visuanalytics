def audio_parts(values, data):
    return "".join([f"{AUDIO_PARTS_TYPES[value['type']](value, data)} " for value in values["parts"]])
    

def audio_parts_text(values, data):
    return data.format(values["pattern"], values)


AUDIO_PARTS_TYPES = {
    "text": audio_parts_text
}
