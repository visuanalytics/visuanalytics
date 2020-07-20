import numbers
import random

import numpy as np
from wordcloud import WordCloud

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


def get_color_func(h, s, l_start, l_end):
    def color_func(word, font_size, position, orientation, random_state=None, **kwargs):
        """
        Erstellt das Farbspektrum, in welcher die Wörter der wordcloud dargestellt werden
        """
        return "hsl(%d, %d%%, %d%%)" % (h, s, random.randint(l_start, l_end))

    return color_func


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

    for param in parameter:
        if param in wordcloud_parameter:
            if isinstance(wordcloud_parameter[param], bool):
                value = step_data.get_data_bool(parameter[param], {})
            elif isinstance(wordcloud_parameter[param], numbers.Number):
                value = step_data.get_data_num(parameter[param], {})
            else:
                value = step_data.format(parameter[param])

            wordcloud_parameter[param] = value
    # TODO
    if step_data.get_data_bool(parameter.get("color_func", False), {}):
        if step_data.get_data_num(image["color_func"][0], {}) is not None:
            h = step_data.get_data_num(image["color_func_h"][0], {})
        else:
            h = 245
        if step_data.get_data_num(image["color_func_s"][1], {}) is not None:
            s = step_data.get_data_num(image["color_func_s"][1], {})
        else:
            s = 46
        if step_data.get_data_num(image["color_func_l_start"][2], {}) is not None:
            l_start = step_data.get_data_num(image["color_func_l_start"][2], {})
        else:
            l_start = 5
        if step_data.get_data_num(image["color_func_l_end"][3], {}) is not None:
            l_end = step_data.get_data_num(image["color_func_l_end"][3], {})
        else:
            l_end = 35

        wordcloud_parameter["color_func"] = get_color_func(h, s, l_start, l_end)

    if parameter.get("colormap", ""):
        wordcloud_parameter["colormap"] = step_data.format(parameter["colormap"])

    if parameter.get("figure", None) is not None:
        figure = step_data.format(parameter["figure"], {})
        if figure == "circle":
            x0 = step_data.get_data_num(parameter["width"], {})
            y0 = step_data.get_data_num(parameter["height"], {})
            x, y = np.ogrid[:x0, :y0]

            mask = (x - (x0 / 2)) ** 2 + (y - (y0 / 2)) ** 2 > 500 ** 2

            mask = 255 * mask.astype(int)
            wordcloud_parameter["mask"] = mask
            wordcloud_parameter["width"] = x0
            wordcloud_parameter["height"] = y0

        elif figure == "square":
            wordcloud_parameter["width"] = step_data.get_data(parameter["width"], {})
            wordcloud_parameter["height"] = step_data.get_data(parameter["height"], {})

    if image.get("stopwords", None) is not None:
        # TODO (max) May change to array (not string) or change delimiter to ','
        dont_use = step_data.format(image["stopwords"], {})
        wordcloud_parameter["stopwords"] = set(dont_use.split())

    wordcloud_image = WordCloud(**wordcloud_parameter).generate(step_data.format(image["text"], {}))

    image = wordcloud_image.to_image()
    file = resources.new_temp_resource_path(step_data.data["_pipe_id"], "png")
    image.save(file)
    return file
