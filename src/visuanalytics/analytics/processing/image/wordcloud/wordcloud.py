import random

import numpy as np
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
    "stopwords": None,
    "repeat": False,
    "mask": None
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

    if step_data.get_data(parameter["colormap"], {}):
        wordcloud_parameter["colormap"] = step_data.get_data(parameter["colormap"], {})

    if parameter["figure"] is not None:
        figure = step_data.get_data(parameter["figure"], {})
        if figure == "circle":
            x0 = step_data.get_data(parameter["width"], {})
            y0 = step_data.get_data(parameter["height"], {})
            x, y = np.ogrid[:x0, :y0]

            mask = (x - (x0 / 2)) ** 2 + (y - (y0 / 2)) ** 2 > 500 ** 2

            mask = 255 * mask.astype(int)
            wordcloud_parameter["mask"] = mask
            wordcloud_parameter["width"] = x0
            wordcloud_parameter["height"] = y0

        elif figure == "square":
            wordcloud_parameter["width"] = step_data.get_data(parameter["width"], {})
            wordcloud_parameter["height"] = step_data.get_data(parameter["height"], {})

    stopwords = set(STOPWORDS)
    dont_use = step_data.get_data(image["stopwords"], {})
    stopwords.add(dont_use)
    list_dont_use = dont_use.split()
    STOPWORDS.update(list_dont_use)

    wordcloud_image = WordCloud(**wordcloud_parameter).generate(step_data.get_data(image["text"], {}))

    image = wordcloud_image.to_image()
    file = resources.new_temp_resource_path(step_data.data["_pipe_id"], "png")
    image.save(file)
    return file
