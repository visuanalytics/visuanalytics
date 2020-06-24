from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.processing.image.pillow.overlay import OVERLAY_TYPES

from PIL import Image
from PIL import ImageDraw

from visuanalytics.analytics.util import resources

IMAGE_TYPES = {}


def register_image(func):
    IMAGE_TYPES[func.__name__] = func
    return func


def generate_all_images(values: dict, step_data: StepData):
    for key, item in enumerate(values["images"]):
        values["images"][item] = IMAGE_TYPES[values["images"][item]["type"]](values["images"][item], values["images"],
                                                                             values["presets"], step_data)


@register_image
def pillow(values: dict, prev_paths: dict, presets: dict, step_data: StepData):
    if values.get("already_created", False):
        source_img = Image.open(resources.get_resource_path(prev_paths[values["path"]]))
    else:
        source_img = Image.open(resources.get_resource_path(values["path"]))
    img1 = Image.new("RGBA", source_img.size)
    draw = ImageDraw.Draw(source_img)
    for overlay in values["overlay"]:
        OVERLAY_TYPES[overlay["type"]](overlay, source_img, draw, presets, step_data)
    file = resources.new_temp_resource_path(step_data.data["_pipe_id"], "png")
    Image.composite(img1, source_img, img1).save(file)
    return file


@register_image
def wordcloud(image: dict, prev_paths, presets: dict, step_data: StepData):
    assert False, "Not Implemented"
