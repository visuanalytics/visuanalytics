import gtts.tokenizer.symbols
from gtts import gTTS

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.processing.audio.parts import part
from visuanalytics.analytics.util import resources
from visuanalytics.analytics.util.step_errors import raise_step_error, AudioError
from visuanalytics.analytics.util.type_utils import get_type_func, register_type_func

GENERATE_AUDIO_TYPES = {}


@raise_step_error(AudioError)
def generate_audios(values: dict, data: StepData):
    audios = values["audio"]["audios"]
    config = values["audio"]["config"]
    config["type"] = "default"  # TODO (max) defualt or get custom config

    for key in audios:
        audios[key] = generate_audio(audios[key], data, config)


@raise_step_error(AudioError)
def generate_audio(values: dict, data: StepData, config: dict):
    values["text"] = part.audio_parts(values["parts"], data)

    return get_type_func(config, GENERATE_AUDIO_TYPES)(values, data, config)


def register_generate_audio(func):
    return register_type_func(GENERATE_AUDIO_TYPES, AudioError, func)


@register_generate_audio
def default(values: dict, data: StepData, config: dict):
    sub_pairs = config.get("sub_pairs", None)

    if sub_pairs:
        for key in sub_pairs:
            value = data.get_data(key, values)
            gtts.tokenizer.symbols.SUB_PAIRS.append((key, value))

    tts = gTTS(values["text"], lang=config["lang"])

    file_path = resources.new_temp_resource_path(data.data["_pipe_id"], config["format"])
    tts.save(file_path)

    return file_path


@register_generate_audio
def custom(values: dict, data: StepData, config: dict):
    assert False, "Not implemented"
