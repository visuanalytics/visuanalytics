from visuanalytics.analytics.processing.image.pillow.overlay import add_text, add_text_array, add_image, add_image_array
from visuanalytics.analytics.util import resources
from PIL import Image
from PIL import ImageDraw

OVERLAY_TYPES = {
    "text": add_text,
    "text_array": add_text_array,
    "image": add_image,
    "image_array": add_image_array
}


def generate_image_pillow(pipeline_id, name, values):
    source_img = Image.open(resources.get_resource_path(values[name]["path"]))
    img1 = Image.new("RGBA", source_img.size)
    draw = ImageDraw.Draw(source_img)
    for overlay in values["overlay"]:
        OVERLAY_TYPES[overlay["type"]](overlay, source_img, draw, values["presets"])
    file = resources.new_temp_resource_path(pipeline_id, "png")
    Image.composite(img1, source_img, img1).save(file)
    return file
