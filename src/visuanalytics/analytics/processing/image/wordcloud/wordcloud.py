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

DEFAULT_COLOR_FUNC_VALUES = [0, 0, 0, 40]


def get_color_func(h, s, l_start, l_end):
    """
    Erstellt das Farbspektrum, in welcher die Wörter der wordcloud dargestellt werden

    Die Werte werden jeweils als Integer angegeben.

    :param h: (hue) Farbton in Grad auf einem Farbenrad. Mögliche Werte: 0 bis 360
        0 ist Rot, 120 ist Grün und 240 ist Blau.
    :param s: (saturation) Sättigung in Prozent. 0% entspricht einem Grauton, 100% ist die volle Farbe.
    :param l_start: (lightness range start) Start des Helligkeitsbereichs in Prozent: 0% ist Schwarz, 100% ist Weiß.
    :param l_end: (lightness range end) Ende des Helligkeitsbereichs in Prozent: 0% ist Schwarz, 100% ist Weiß.
    :return: Funktion, die den Farbverlauf innerhalb der Wordcloud erstellt
    :rtype: callable
    """

    def color_func(word, font_size, position, orientation, random_state=None, **kwargs):
        return "hsl(%d, %d%%, %d%%)" % (h, s, random.randint(l_start, l_end))

    return color_func


def wordcloud(values: dict, prev_paths, presets: dict, step_data: StepData):
    """Erstellt ein Wordcloud Bild.

    Der Standard-Farbverlauf bei color_func true ist Grau/Schwarz.
    Die Standard-Farbe ist generell die Colormap viridis.

    :param values: Image Bauplan des zu erstellenden Bildes
    :param prev_paths: Alle Image Baupläne und somit auch alle Pfade zu den bisher erstellen Bildern
    :param presets: Preset Part aus der JSON
    :param step_data: Daten aus der API
    :return: Den Pfad zum erstellten Bild
    :rtype: str
    """
    wordcloud_parameter = dict(WORDCLOUD_DEFAULT_PARAMETER)
    parameter = values.get("parameter", {})

    for param in parameter:
        if param in wordcloud_parameter:
            if isinstance(wordcloud_parameter[param], bool):
                value = step_data.get_data(parameter[param], {}, bool)
            elif isinstance(wordcloud_parameter[param], numbers.Number):
                value = step_data.get_data(parameter[param], {}, numbers.Number)
            else:
                value = step_data.format(parameter[param])

            wordcloud_parameter[param] = value

    if bool(wordcloud_parameter.get("color_func", False)):
        cfw = list(DEFAULT_COLOR_FUNC_VALUES)

        if "color_func_words" in values:
            cfw_list = step_data.format(values["color_func_words"]).split(" ")

            for idx, c in enumerate(cfw_list):
                cfw[idx] = int(c)

        wordcloud_parameter["color_func"] = get_color_func(*cfw)
    else:
        wordcloud_parameter["color_func"] = None

    if parameter.get("colormap", ""):
        wordcloud_parameter["colormap"] = step_data.format(parameter["colormap"])

    if parameter.get("figure", None) is not None:
        figure = step_data.format(parameter["figure"], {})
        if figure == "circle":
            x0 = step_data.get_data(parameter["width"], {}, numbers.Number)
            y0 = step_data.get_data(parameter["height"], {}, numbers.Number)
            x, y = np.ogrid[:x0, :y0]

            mask = (x - (x0 / 2)) ** 2 + (y - (y0 / 2)) ** 2 > 500 ** 2

            mask = 255 * mask.astype(int)
            wordcloud_parameter["mask"] = mask
            wordcloud_parameter["width"] = x0
            wordcloud_parameter["height"] = y0

        elif figure == "square":
            wordcloud_parameter["width"] = step_data.get_data(parameter["width"], {})
            wordcloud_parameter["height"] = step_data.get_data(parameter["height"], {})

    if values.get("stopwords", None) is not None:
        # TODO (max) May change to array (not string) or change delimiter to ','
        dont_use = step_data.format(values["stopwords"], {})
        wordcloud_parameter["stopwords"] = set(dont_use.split())

    if values.get("text", None) is not None:
        wordcloud_image = WordCloud(**wordcloud_parameter).generate(step_data.format(values["text"], {}))
    elif values.get("dict", None) is not None:
        wordcloud_image = WordCloud(**wordcloud_parameter).generate_from_frequencies(
            step_data.get_data(values["dict"], {}, dict))

    image = wordcloud_image.to_image()
    file = resources.new_temp_resource_path(step_data.data["_pipe_id"], "png")
    image.save(file)
    return file
