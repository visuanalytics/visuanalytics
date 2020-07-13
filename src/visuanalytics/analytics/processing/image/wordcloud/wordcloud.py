import random

import matplotlib.pyplot as plt
import numpy as np
from PIL import Image
from wordcloud import WordCloud, STOPWORDS

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.util import resources
from visuanalytics.analytics.util.step_errors import ImageError
from visuanalytics.analytics.util.type_utils import register_type_func

WORDCLOUD_TYPES = {}
"""Ein Dictionary bestehende aus allen Wordcloud Typ Methoden  """


def register_wordcloud(func):
    """
    Fügt eine Typ-Funktion dem Dictionary WORDCLOUD_TYPES hinzu.

    :param func: Eine Funktion
    :return: Die übergebene Funktion
    """
    return register_type_func(WORDCLOUD_TYPES, ImageError, func)


@register_wordcloud
def color_func(word, font_size, position, orientation, random_state=None, **kwargs):
    """
    Erstellt das Farbspektrum, in welcher die Wörter der wordcloud dargestellt werden
    """
    return "hsl(245, 46%%, %d%%)" % random.randint(5, 35)


@register_wordcloud
def wordcloud(image: dict, prev_paths, presets: dict, step_data: StepData):
    """
    Erstellt ein Wordcloud Bild  --- TODO.

    :param values: Image Bauplan des zu erstellenden Bildes
    :param prev_paths: Alle Image Baupläne und somit auch alle Pfade zu den bisher erstellen Bildern
    :param presets: Preset Part aus der JSON
    :param step_data: Daten aus der API
    :return: Den Pfad zum erstellten Bild
    :rtype: str
    """

    WORDCLOUD_DEFAULT_PARAMETER = {
        "background_color": "white",
        "transparency": False,
        "width": 400,
        "height": 200,
        "collocations": True,
        "max_font_size": None,
        "max_words": 200,
        "contour_width": 0,
        "contour_color": "white",
        "interpolation": "bilinear",
        "bbox_inches": "tight",
        "font_path": None,
        "prefer_horizontal": 0.90,
        "scale": 1,
        "min_font_size": 4,
        "font_step": 1,
        "mode": "RGB",
        "relative_scaling": 0.5,
        "color_func": color_func,
        "regexp": None,
        "colormap": "viridis",
        "normalize_plurals": True,
        "stopwords": None
    }
    wordcloud_parameter = WORDCLOUD_DEFAULT_PARAMETER

    for each in WORDCLOUD_DEFAULT_PARAMETER:
        if each in image["parameter"]:
            wordcloud_parameter[each] = step_data.format(image["parameter"][each])

    if image["parameter"]["mask"] is not None:
        x0 = step_data.format(image["parameter"]["mask"]["x"])
        y0 = step_data.format(image["parameter"]["mask"]["y"])
        x, y = np.ogrid[:x0, :y0]

        mask = None
        figure = image["parameter"]["mask"]["figure"]
        if figure == "circle":
            mask = (x - (x0 / 2)) ** 2 + (y - (y0 / 2)) ** 2 > 400 ** 2
        elif figure == "square":
            mask = x * y
        elif figure == "own_mask":
            path = resources.get_image_path(image["parameter"]["mask"]["own_mask_path"])
            mask = np.array(Image.open(path))

        wordcloud_parameter["mask"] = 255 * mask.astype(int)
    else:
        mask = None
        wordcloud_parameter["mask"] = mask

    stopwords = set(STOPWORDS)

    dont_use = step_data.format(image["stopwords"])
    stopwords.add(dont_use)
    list_dont_use = dont_use.split()
    STOPWORDS.update(list_dont_use)

    wordcloud_image = WordCloud(background_color=wordcloud_parameter["background_color"],
                                width=wordcloud_parameter["width"],
                                height=wordcloud_parameter["height"],
                                collocations=wordcloud_parameter["collocations"],
                                max_font_size=wordcloud_parameter["max_font_size"],
                                max_words=wordcloud_parameter["max_words"],
                                contour_width=wordcloud_parameter["contour_width"],
                                contour_color=wordcloud_parameter["contour_color"],
                                font_path=wordcloud_parameter["font_path"],
                                prefer_horizontal=wordcloud_parameter["prefer_horizontal"],
                                scale=wordcloud_parameter["scale"],
                                min_font_size=wordcloud_parameter["min_font_size"],
                                font_step=wordcloud_parameter["font_step"],
                                mode=wordcloud_parameter["mode"],
                                relative_scaling=wordcloud_parameter["relative_scaling"],
                                color_func=wordcloud_parameter["color_func"],
                                regexp=wordcloud_parameter["regexp"],
                                colormap=wordcloud_parameter["colormap"],
                                normalize_plurals=wordcloud_parameter["normalize_plurals"],
                                mask=wordcloud_parameter["mask"]).generate(step_data.get_data(image["text"], image))

    plt.axis("off")
    # plt.imshow(wordcloud_image, interpolation=step_data.format(image["parameter"]["interpolation"]))
    image = wordcloud_image.to_image()
    file = resources.new_temp_resource_path(step_data.data["_pipe_id"], "png")
    image.save(file)

    if wordcloud_parameter["transparency"]:
        img = Image.open(file)
        img = img.convert("RGBA")
        pixels = img.getdata()

        newPixels = []
        for item in pixels:
            if item[0] == 255 and item[1] == 255 and item[2] == 255:
                newPixels.append((255, 255, 255, 0))
            else:
                newPixels.append(item)

        img.putdata(newPixels)
        img.save(file)

    return file