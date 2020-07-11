"""
Modul welches die grundlegenden Funktionen der verschieden Arten zur Bilderzeugung beeihaltet.
"""

import matplotlib.pyplot as plt
import numpy as np
from PIL import Image
from PIL import ImageDraw
from wordcloud import WordCloud, STOPWORDS

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.processing.image.pillow.overlay import OVERLAY_TYPES
from visuanalytics.analytics.util import resources
from visuanalytics.analytics.util.step_errors import raise_step_error, ImageError
from visuanalytics.analytics.util.type_utils import get_type_func, register_type_func

IMAGE_TYPES = {}
"""Ein Dictionary bestehende aus allen Image Typ Methoden."""


def register_image(func):
    """
    Fügt eine Typ-Funktion dem Dictionary IMAGE_TYPES hinzu.

    :param func: Eine Funktion
    :return: Die übergebene Funktion
    """
    return register_type_func(IMAGE_TYPES, ImageError, func)


@raise_step_error(ImageError)
def generate_all_images(values: dict, step_data: StepData):
    """
    Durchläuft jedes Bild in values (also in der JSON), überprüft welcher Typ des Bildes vorliegt und ruft die
    passende Typ Methode auf, nach der Erstellung der Bilder wird der Bauplan des Bilder (in values) mit dem Bildpfad ersetzt.

    :param values: Werte aus der JSON-Datei
    :param step_data: Daten aus der API
    """
    for key, item in enumerate(values["images"]):
        image_func = get_type_func(values["images"][item], IMAGE_TYPES)

        values["images"][item] = image_func(values["images"][item], values["images"], values["presets"], step_data)


@register_image
def pillow(values: dict, prev_paths: dict, presets: dict, step_data: StepData):
    """
    Erstellt ein Bild mit Hilfe von Pillow.
    Dazu wird ein neues Bild geöffnet oder ein bisher erstelltest Bild weiter bearbeitet.
    In der JSON können beliebige viele Overlays angegeben werden, welche diese Methode alle
    ausführt und schlussendlich auf das Bild packt.

    :param values: Image Bauplan des zu erstellenden Bildes
    :param prev_paths: Alle Image Baupläne und somit auch alle Pfade zu den bisher erstellen Bildern
    :param presets: Preset Part aus der JSON
    :param step_data: Daten aus der API
    :return: Den Pfad zum erstellten Bild
    :rtype: str
    """
    if values.get("path", None) is None:
        source_img = Image.open(resources.get_resource_path(prev_paths[values["image_name"]]))
    else:
        source_img = Image.open(resources.get_image_path(values["path"]))
    img1 = Image.new("RGBA", source_img.size)
    draw = ImageDraw.Draw(source_img)

    for overlay in values["overlay"]:
        over_func = get_type_func(overlay, OVERLAY_TYPES)
        over_func(overlay, source_img, draw, presets, step_data)

    file = resources.new_temp_resource_path(step_data.data["_pipe_id"], "png")
    Image.composite(img1, source_img, img1).save(file)
    return file


@register_image
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
        "width": 400,
        "height": 200,
        "collocations": True,
        "max_font_size": None,
        "max_words": 200,
        "contour_width": 0,
        "contour_color": "black",
        "interpolation": "bilinear",
        "bbox_inches": "tight",
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

    return file
