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
    "font_path": "fonts/Dosis-Regular.ttf",
    "prefer_horizontal": 0.90,
    "scale": 1,
    "min_font_size": 4,
    "font_step": 1,
    "mode": "RGB",
    "relative_scaling": 0.5,
    "color_func": False,
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


def wordcloud(values: dict, step_data: StepData, prev_paths):
    """Erstellt ein Wordcloud Bild.

    Der Standard-Farbverlauf bei color_func true ist Grau/Schwarz.
    Die Standard-Farbe ist generell die Colormap viridis.

    :param values: Image Bauplan des zu erstellenden Bildes
    :param step_data: Daten aus der API
    :param prev_paths: Alle Image Baupläne und somit auch alle Pfade zu den bisher erstellen Bildern
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

    path = resources.get_resource_path(wordcloud_parameter["font_path"])
    wordcloud_parameter["font_path"] = path

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
            x0 = wordcloud_parameter["width"]
            y0 = wordcloud_parameter["height"]
            x, y = np.ogrid[:x0, :y0]

            mask = (x - (x0 / 2)) ** 2 + (y - (y0 / 2)) ** 2 > 500 ** 2

            mask = 255 * mask.astype(int)
            wordcloud_parameter["mask"] = mask

    if values.get("use_global_stopwords", None) is not None:
        try:
            file = resources.get_resource_path("stopwords/stopwords.txt")
            with open(file, "r", encoding='utf-8') as f:
                list_stopwords = f.read().splitlines()
        except IOError:
            list_stopwords = []

        dont_use = step_data.get_data(values.get("stopwords", []), {}, list)
        for each in list_stopwords:
            if each not in dont_use:
                dont_use.append(each)
        wordcloud_parameter["stopwords"] = set(dont_use)
    else:
        dont_use = step_data.get_data(values.get("stopwords", []), {}, list)
        wordcloud_parameter["stopwords"] = set(dont_use)

    if values.get("text", None) is not None:
        wordcloud_image = WordCloud(**wordcloud_parameter).generate(step_data.format(values["text"], {}))
    elif values.get("dict", None) is not None:
        wordcloud_image = WordCloud(**wordcloud_parameter).generate_from_frequencies(
            step_data.get_data(values["dict"], {}, dict))

    image = wordcloud_image.to_image()
    file = resources.new_temp_resource_path(step_data.data["_pipe_id"], "png")
    image.save(file)
    return file
