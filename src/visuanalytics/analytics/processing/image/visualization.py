from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.processing.image.pillow.pillow import generate_image_pillow
from visuanalytics.analytics.processing.image.wordcloud.wordcloud import generate_image_wordcloud
from visuanalytics.analytics.util.step_errors import raise_step_error

IMAGE_TYPES = {
    "pillow": generate_image_pillow,
    "wordcloud": generate_image_wordcloud
}


# TODO (max) may change functions (in pillow, wordcloud and _generate_image)
#  to can be used with raise_step_error (values, data)


@raise_step_error(ImportError)
def generate_all_images(values: dict, step_data: StepData):
    for key, item in enumerate(values["images"]):
        path = _generate_image(values["images"][item], values["images"], values["presets"], step_data)
        values["images"][item] = path


def _generate_image(image: dict, prev_paths, presets: dict, step_data: StepData):
    return IMAGE_TYPES[image["type"]](image, prev_paths, presets, step_data)
