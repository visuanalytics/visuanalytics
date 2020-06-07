from visuanalytics.analytics.processing.image.pillow import generate_image_pillow
from visuanalytics.analytics.processing.image.wordcloud import generate_image_wordcloud

IMAGE_TYPES = {
    "pillow": generate_image_pillow,
    "wordcloud": generate_image_wordcloud
}


def generate_image(name, values):
    IMAGE_TYPES[name](name, values)
