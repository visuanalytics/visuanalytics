from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.processing.image.pillow.pillow import generate_image_pillow
from visuanalytics.analytics.processing.image.wordcloud.wordcloud import generate_image_wordcloud
from visuanalytics.analytics.util.step_errors import raise_step_error, ImageError
from visuanalytics.analytics.util.type_utils import get_type_func

IMAGE_TYPES = {
    "pillow": generate_image_pillow,
    "wordcloud": generate_image_wordcloud
}


@raise_step_error(ImageError)
def generate_all_images(values: dict, step_data: StepData):
    for key, item in enumerate(values["images"]):
        path = _generate_image(values["images"][item], values["images"], values["presets"], step_data)
        values["images"][item] = path


@raise_step_error(ImageError)
def _generate_image(image: dict, prev_paths, presets: dict, step_data: StepData):
    image_func = get_type_func(image, IMAGE_TYPES)

    return image_func(image, prev_paths, presets, step_data)
