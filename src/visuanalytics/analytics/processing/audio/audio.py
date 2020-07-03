import base64
import logging
import mimetypes

import gtts.tokenizer.symbols
from gtts import gTTS

from visuanalytics.analytics.apis.api import api_request
from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.processing.audio.parts import part
from visuanalytics.analytics.util import resources
from visuanalytics.analytics.util.config_manager import get_config
from visuanalytics.analytics.util.step_errors import raise_step_error, AudioError, InvalidContentTypeError
from visuanalytics.analytics.util.step_pattern import data_get_pattern
from visuanalytics.analytics.util.type_utils import get_type_func, register_type_func

logger = logging.getLogger(__name__)

GENERATE_AUDIO_TYPES = {}


def get_audio_config(values: dict, data: StepData):
    config = get_config()["audio"]
    custom_config = values["audio"].get("config", {})

    # If Config in Step Json is pressent use That config
    config.update(custom_config)

    return config


@raise_step_error(AudioError)
def generate_audios(values: dict, data: StepData):
    config: dict = get_audio_config(values, data)

    audio_func = get_type_func(config, GENERATE_AUDIO_TYPES)
    audio_func(values["audio"]["audios"], data, config)


def register_generate_audio(func):
    return register_type_func(GENERATE_AUDIO_TYPES, AudioError, func)


@register_generate_audio
def default(values: dict, data: StepData, config: dict):
    for key in values:
        text = part.audio_parts(values[key]["parts"], data)

        sub_pairs = data.format_json(config.get("sub_pairs", None), None, values)

        if sub_pairs:
            for key in sub_pairs:
                value = data.get_data(key, values)
                gtts.tokenizer.symbols.SUB_PAIRS.append((key, value))

        tts = gTTS(text, lang=data.format(config["lang"]))

        file_path = resources.new_temp_resource_path(data.data["_pipe_id"], data.format(config["format"]))
        tts.save(file_path)

        values[key] = file_path


@register_generate_audio
def custom(values: dict, data: StepData, config: dict):
    logger.info("Generate Audio with Custom Audio Config")

    _prepare_custom(config.get("prepare", None), data, config)

    for key in values:
        text = part.audio_parts(values[key]["parts"], data)

        data.data["_audio"]["text"] = text
        # TODO set Testing to false
        generate = config["generate"]
        generate["include_headers"] = True
        response = api_request(generate, data, "audio")

        values[key] = _save_audio(response, data, config)


def _prepare_custom(values: dict, data: StepData, config: dict):
    data.data["_audio"] = {}

    if values is not None:
        # TODO(Max) Solve better
        data.data["_audio"]["pre"] = api_request(values, data, "audio")


def _save_audio(response, data: StepData, config: dict):
    content_type = response["headers"]["content-type"]
    post_generate = config.get("post_generate", {})
    audio = response["content"]

    # If Content Type is json Try to decode json String with base64
    if content_type.startswith("application/json"):
        # Get Audio String
        audio = data_get_pattern(data.format(post_generate["audio_key"]), audio)
        # decode Audio Key with base64
        audio = base64.b64decode(audio)
        audio_path = resources.new_temp_resource_path(data.data["_pipe_id"],
                                                      data.format(post_generate["file_extension"]))
    else:
        # Check if Content type is an audio Type
        if not content_type.startswith("audio"):
            raise InvalidContentTypeError(None, content_type, "'audio/*'")

        # Get File Extention from Mime Type:
        extension = mimetypes.guess_all_extensions(content_type)
        audio_path = resources.new_temp_resource_path(data.data["_pipe_id"], extension[0].replace(".", ""))

    with open(audio_path, "wb") as fp:
        fp.write(audio)

    return audio_path
