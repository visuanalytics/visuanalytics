from gtts import gTTS
from visuanalytics.analytics.control.procedures.step_data import StepData

from visuanalytics.analytics.processing.audio.parts import part
from visuanalytics.analytics.util import resources


def generate_audios(values: dict, data: StepData):
    audios = values["audio"]["audios"]
    config = values["audio"]["config"]

    for key in audios:
        audios[key] = generate_audio(audios[key], data, config)


def generate_audio(values: dict, data: StepData, config: dict):
    text = part.audio_parts(values["parts"], data)
    tts = gTTS(text, lang=config["lang"])

    file_path = resources.new_temp_resource_path(data.data["_pipeline_id"], config["format"])
    tts.save(file_path)

    return file_path
