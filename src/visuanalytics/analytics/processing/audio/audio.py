import gtts.tokenizer.symbols
from gtts import gTTS

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.processing.audio.parts import part
from visuanalytics.analytics.util import resources
from visuanalytics.analytics.util.step_errors import raise_step_error, AudioError


@raise_step_error(AudioError)
def generate_audios(values: dict, data: StepData):
    audios = values["audio"]["audios"]
    config = values["audio"]["config"]

    for key in audios:
        audios[key] = generate_audio(audios[key], data, config)


@raise_step_error(AudioError)
def generate_audio(values: dict, data: StepData, config: dict):
    text = part.audio_parts(values["parts"], data)
    subpairs = config.get("subpairs", None)

    if subpairs:
        for key in subpairs:
            value = data.get_data(key, values)
            gtts.tokenizer.symbols.SUB_PAIRS.append((key, value))

    tts = gTTS(text, lang=config["lang"])

    file_path = resources.new_temp_resource_path(data.data["_pipe_id"], config["format"])
    tts.save(file_path)

    return file_path
