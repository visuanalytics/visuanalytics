"""
Modul welches die Pillow Image Funktionen zum erstellen und bearbeiten von Bildern beinhaltet.
"""

import matplotlib.pyplot as plt
import numpy as np
from PIL import Image
from wordcloud import WordCloud, STOPWORDS

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.processing.image.pillow.draw import DRAW_TYPES
from visuanalytics.analytics.util import resources
from visuanalytics.analytics.util.step_errors import ImageError
from visuanalytics.analytics.util.step_utils import execute_type_option, execute_type_compare
from visuanalytics.analytics.util.type_utils import register_type_func, get_type_func

OVERLAY_TYPES = {}
"""Ein Dictionary bestehende aus allen Overlay Typ Methoden  """


def register_overlay(func):
    """
    Fügt eine Typ-Funktion dem Dictionary OVERLAY_TYPES hinzu.

    :param func: Eine Funktion
    :return: Die übergebene Funktion
    """
    return register_type_func(OVERLAY_TYPES, ImageError, func)


@register_overlay
def text(overlay: dict, source_img, draw, presets: dict, step_data: StepData):
    """
    Methode um Text auf ein gegebenes Bild zu schreiben mit dem Bauplan der in overlay vorgegeben ist.

    :param overlay: Bauplan des zu schreibenden Overlays
    :param source_img: Bild auf welches geschrieben werden soll
    :param draw: Draw Objekt
    :param presets: Preset Part aus der JSON
    :param step_data: Daten aus der API
    """
    content = step_data.format(overlay["pattern"])
    draw_func = get_type_func(overlay, DRAW_TYPES, "anchor_point")
    draw_func(draw,
              (step_data.format(overlay["pos_x"]), step_data.format(overlay["pos_y"])),
              content,
              step_data.format(presets[overlay["preset"]]["font_size"]),
              step_data.format(presets[overlay["preset"]]["color"]),
              step_data.format(presets[overlay["preset"]]["font"]))


@register_overlay
def text_array(overlay: dict, source_img, draw, presets: dict, step_data: StepData):
    """
    Methode um ein Text-Array auf ein gegebenes Bild zu schreiben mit dem Bauplan der in overlay vorgegeben ist.
    Im Bauplan sind mehrere Texte vorgegeben die auf das Bild geschrieben werden sollen, diese werden ausgepackt
    und umformatiert sodass alle einzelnen overlays nacheinander an die Funktion text übergeben werden.

    :param overlay: Bauplan des zu schreibenden Overlays
    :param source_img: Bild auf welches geschrieben werden soll
    :param draw: Draw Objekt
    :param presets: Preset Part aus der JSON
    :param step_data: Daten aus der API
    """
    for idx, i in enumerate(overlay["pos_x"]):
        if isinstance(overlay["preset"], list):
            preset = overlay["preset"][idx]
        else:
            preset = overlay["preset"]
        if isinstance(overlay["pattern"], list):
            pattern = overlay["pattern"][idx]
        else:
            pattern = overlay["pattern"]
        new_overlay = {
            "anchor_point": overlay["anchor_point"],
            "pos_x": overlay["pos_x"][idx],
            "pos_y": overlay["pos_y"][idx],
            "pattern": pattern,
            "preset": preset}
        text(new_overlay, source_img, draw, presets, step_data)


@register_overlay
def option(values: dict, source_img, draw, presets: dict, step_data: StepData):
    """
    Methode welche 2 verschiedene Baupläne bekommt was auf ein Bild geschrieben werden soll, dazu
    wird ein boolean Wert in der Step_data ausgewertet und je nachdem ob dieser Wert
    true oder false ist wird entweder Bauplan A oder Bauplan B ausgeführt.

    :param values: Baupläne des zu schreibenden Overlays
    :param source_img: Bild auf welches geschrieben werden soll
    :param draw: Draw Objekt
    :param presets: Preset Part aus der JSON
    :param step_data: Daten aus der API
    """
    chosen_text = execute_type_option(values, step_data)

    for overlay in chosen_text:
        over_func = get_type_func(overlay, OVERLAY_TYPES)
        over_func(overlay, source_img, draw, presets, step_data)


@register_overlay
def compare(values: dict, source_img, draw, presets: dict, step_data: StepData):
    """
    Methode welche 2 verschiedene Baupläne bekommt was auf ein Bild geschrieben werden soll, dazu
    wird ein boolean Wert in der Step_data ausgewertet und je nachdem ob dieser Wert
    true oder false ist wird entweder Bauplan A oder Bauplan B ausgeführt.

    :param values: Baupläne des zu schreibenden Overlays
    :param source_img: Bild auf welches geschrieben werden soll
    :param draw: Draw Objekt
    :param presets: Preset Part aus der JSON
    :param step_data: Daten aus der API
    """
    chosen_text = execute_type_compare(values, step_data)

    for overlay in chosen_text:
        over_func = get_type_func(overlay, OVERLAY_TYPES)
        over_func(overlay, source_img, draw, presets, step_data)


@register_overlay
def image(overlay: dict, source_img, draw, presets: dict, step_data: StepData):
    """
    Methode um ein Bild in das source_img einzufügen mit dem Bauplan der in overlay vorgegeben ist.

    :param overlay: Bauplan des zu schreibenden Overlays
    :param source_img: Bild auf welches das Bild eingefügt werden soll
    :param draw: Draw Objekt
    :param presets: Preset Part aus der JSON
    :param step_data: Daten aus der API
    """
    path = step_data.format(overlay["path"])
    icon = Image.open(
        resources.get_image_path(path)).convert("RGBA")
    if step_data.format(overlay.get("color", "RGBA")) != "RGBA":
        icon = icon.convert(step_data.format(overlay["color"]))
    if overlay.get("size_x", None) is not None and overlay.get("size_y", None) is not None:
        icon = icon.resize([step_data.format(overlay["size_x"]),
                            step_data.format(overlay["size_y"])], Image.LANCZOS)
    if overlay.get("transparency", False):
        source_img.alpha_composite(icon, (step_data.format(overlay["pos_x"]),
                                          step_data.format(overlay["pos_y"])))
    else:
        source_img.paste(icon, (step_data.format(overlay["pos_x"]),
                                step_data.format(overlay["pos_y"])), icon)


@register_overlay
def image_array(overlay: dict, source_img, draw, presets: dict, step_data: StepData):
    """
    Methode um ein Bild-Array in das source_img einzufügen mit dem Bauplan der in overlay vorgegeben ist.
    Im Bauplan sind mehrere Bilder vorgegeben die auf das Bild gesetzt werden sollen, diese werden ausgepackt
    und umformatiert sodass alle einzelnen Bilder nacheinander an die Funktion image übergeben werden


    :param overlay: Bauplan des zu schreibenden Overlays
    :param source_img: Bild auf welches das Bild eingefügt werden soll
    :param draw: Draw Objekt
    :param presets: Preset Part aus der JSON
    :param step_data: Daten aus der API
    """
    for idx, i in enumerate(overlay["pos_x"]):
        if isinstance(overlay["color"], list):
            color = overlay["color"][idx]
        else:
            color = overlay["color"]
        if isinstance(overlay["path"], list):
            path = overlay["path"][idx]
        else:
            path = overlay["path"]
        new_overlay = {
            "size_x": overlay.get("size_x", None),
            "size_y": overlay.get("size_y", None),
            "pos_x": overlay["pos_x"][idx],
            "pos_y": overlay["pos_y"][idx],
            "transparency": overlay.get("transparency", False),
            "path": path,
            "color": color}
        image(new_overlay, source_img, draw, presets, step_data)


@register_overlay
def wordcloud(overlay: dict, source_img, draw, presets: dict, step_data: StepData):
    """
    Erstellt ein Wordcloud Bild.

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
        if each in overlay["parameter"]:
            wordcloud_parameter[each] = step_data.format(overlay["parameter"][each])

    if overlay["parameter"]["mask"] is not None:
        x0 = step_data.format(overlay["parameter"]["mask"]["x"])
        y0 = step_data.format(overlay["parameter"]["mask"]["y"])
        x, y = np.ogrid[:x0, :y0]

        mask = None
        figure = overlay["parameter"]["mask"]["figure"]
        if figure == "circle":
            mask = (x - (x0 / 2)) ** 2 + (y - (y0 / 2)) ** 2 > 400 ** 2
        elif figure == "square":
            mask = x * y
        elif figure == "own_mask":
            path = resources.get_image_path(overlay["parameter"]["mask"]["own_mask_path"])
            mask = np.array(Image.open(path))

        wordcloud_parameter["mask"] = 255 * mask.astype(int)
    else:
        mask = None
        wordcloud_parameter["mask"] = mask

    stopwords = set(STOPWORDS)

    dont_use = step_data.format(overlay["stopwords"])
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
                                mask=wordcloud_parameter["mask"]).generate(step_data.get_data(overlay["text"], overlay))
    # TODO Tanja: background transparent
    # wordcloud_image.recolor(color_func=WORDCLOUD_TYPES.color_func)
    plt.axis("off")
    # plt.imshow(wordcloud_image, interpolation=step_data.format(overlay["parameter"]["interpolation"]))
    image = wordcloud_image.to_image()
    file = resources.new_temp_resource_path(step_data.data["_pipe_id"], "png")
    image.save(file)

    return file
