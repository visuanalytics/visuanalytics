import json

from gtts import gTTS
from visuanalytics.analytics.control.procedures.step_data import StepData

from visuanalytics.analytics.processing.audio.parts import part
from visuanalytics.analytics.util import resources


def generate_audio(values: dict, data: StepData, config):
    text = part.audio_parts(values["parts"], data)
    tts = gTTS(text, config["lang"])
    file_path = resources.new_temp_resource_path(values, config["format"])
    tts.save(file_path)
    # replace_with_audio_path(value, file_path)
    return file_path


def replace_with_audio_path(value, file_path):
    for key, v in value.items():
        value.update(key=file_path)
    pass


with open("step-example_weather_single_test.json") as fp:
    d = json.loads(fp)

x = generate_audio(d["name"], d["audio"]["audios"]["a1"], d["audio"]["config"])
print(x)
