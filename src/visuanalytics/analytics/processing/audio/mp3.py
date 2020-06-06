from gtts import gTTS

from visuanalytics.analytics.processing.audio.parts import part_types
from visuanalytics.analytics.util import resources


def generate_audio(name, values, config):
    text = part_types.audio_parts(values)
    tts = gTTS(text, config.lang)
    file_path = resources.new_temp_resource_path(name, config.format)
    tts.save(file_path)
    return file_path
