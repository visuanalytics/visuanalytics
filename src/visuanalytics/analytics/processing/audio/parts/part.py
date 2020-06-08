def audio_parts(parts, data):
    text = ""
    "".join([f"{data.format(text, parts)} " for parts.patterns in parts])
    return text
