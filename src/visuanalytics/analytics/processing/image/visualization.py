from visuanalytics.analytics.processing.image.pillow.pillow import generate_image_pillow
from visuanalytics.analytics.processing.image.wordcloud.wordcloud import generate_image_wordcloud

IMAGE_TYPES = {
    "pillow": generate_image_pillow,
    "wordcloud": generate_image_wordcloud
}


def generate_all_images(pipeline_id, images, step_data):
    for key, item in enumerate(images):
        if item != "presets":
            _generate_image(pipeline_id, images[item], images["presets"], step_data)


def _generate_image(pipeline_id, image, presets, step_data):
    return IMAGE_TYPES[image["type"]](pipeline_id, image, presets, step_data)
