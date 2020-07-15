import random

import matplotlib.pyplot as plt
import numpy as np
from PIL import Image
from wordcloud import WordCloud, STOPWORDS

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.util import resources

WORDCLOUD_DEFAULT_PARAMETER = {
    "background_color": "white",
    "width": 400,
    "height": 200,
    "collocations": True,
    "max_font_size": None,
    "max_words": 200,
    "contour_width": 0,
    "contour_color": "white",
    "font_path": None,
    "prefer_horizontal": 0.90,
    "scale": 1,
    "min_font_size": 4,
    "font_step": 1,
    "mode": "RGB",
    "relative_scaling": 0.5,
    "color_func": None,
    "regexp": None,
    "colormap": "viridis",
    "normalize_plurals": True,
    "stopwords": None
}


def color_func(word, font_size, position, orientation, random_state=None, **kwargs):
    """
    Erstellt das Farbspektrum, in welcher die Wörter der wordcloud dargestellt werden
    """
    return "hsl(245, 46%%, %d%%)" % random.randint(5, 35)


def wordcloud(image: dict, prev_paths, presets: dict, step_data: StepData):
    """Erstellt ein Wordcloud Bild.

    :param values: Image Bauplan des zu erstellenden Bildes
    :param prev_paths: Alle Image Baupläne und somit auch alle Pfade zu den bisher erstellen Bildern
    :param presets: Preset Part aus der JSON
    :param step_data: Daten aus der API
    :return: Den Pfad zum erstellten Bild
    :rtype: str
    """
    wordcloud_parameter = WORDCLOUD_DEFAULT_PARAMETER
    parameter = image.get("parameter", {})

    for each in wordcloud_parameter:
        if each in parameter:
            wordcloud_parameter[each] = step_data.format(parameter[each])

    if step_data.get_data_bool(parameter.get("color_func", False), {}):
        wordcloud_parameter["color_func"] = color_func

    if parameter["mask"] is not None and parameter["mask"]["figure"] is not None:
        x0 = step_data.format(parameter["mask"]["x"])
        y0 = step_data.format(parameter["mask"]["y"])
        x, y = np.ogrid[:x0, :y0]

        figure = step_data.get_data(parameter["mask"]["figure"], {})
        if figure == "circle":
            mask = (x - (x0 / 2)) ** 2 + (y - (y0 / 2)) ** 2 > 400 ** 2
        elif figure == "square":
            mask = x * y
        else:
            # TODO testen
            path = resources.get_image_path(parameter["mask"]["path"])
            mask = np.array(Image.open(path))

        wordcloud_parameter["mask"] = 255 * mask.astype(int)
    else:
        wordcloud_parameter["mask"] = None

    stopwords = set(STOPWORDS)

    dont_use = step_data.get_data(image["stopwords"], {})
    stopwords.add(dont_use)
    list_dont_use = dont_use.split()
    STOPWORDS.update(list_dont_use)

    wordcloud_image = WordCloud(**wordcloud_parameter).generate(step_data.get_data(image["text"], {}))

    plt.axis("off")
    image = wordcloud_image.to_image()
    file = resources.new_temp_resource_path(step_data.data["_pipe_id"], "png")
    image.save(file)
    return file
