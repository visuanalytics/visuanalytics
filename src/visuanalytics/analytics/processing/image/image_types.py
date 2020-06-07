from visuanalytics.analytics.processing.image.pillow import generate_image_pillow
from visuanalytics.analytics.processing.image.wordcloud import generate_image_wordcloud

IMAGE_TYPES = {
    "pillow": generate_image_pillow,
    "wordcloud": generate_image_wordcloud
}


def generate_image(pipeline_id, name, values):
    return IMAGE_TYPES[values["type"]](pipeline_id, name, values)
