"""
Modul welches die Pillow Image Funktionen zum erstellen und bearbeiten von Bildern beinhaltet.
"""

from PIL import Image

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.processing.image.pillow.draw import DRAW_TYPES
from visuanalytics.analytics.util.step_errors import ImageError
from visuanalytics.analytics.util.step_utils import execute_type_option, execute_type_compare
from visuanalytics.analytics.util.type_utils import register_type_func, get_type_func
from visuanalytics.util import resources

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
def text(overlay: dict, step_data: StepData, source_img, prev_paths, draw):
    """
    Methode um Text auf ein gegebenes Bild zu schreiben mit dem Bauplan der in overlay vorgegeben ist.

    :param overlay: Bauplan des zu schreibenden Overlays
    :param step_data: Daten aus der API
    :param source_img: Bild auf welches geschrieben werden soll
    :param prev_paths: Alle Image Baupläne und somit auch alle Pfade zu den bisher erstellen Bildern
    :param draw: Draw Objekt
    """
    content = step_data.format(overlay["pattern"])
    draw_func = get_type_func(overlay, DRAW_TYPES, "anchor_point")

    draw_func(draw,
              (step_data.format(overlay["pos_x"]), step_data.format(overlay["pos_y"])),
              content,
              step_data.format(overlay["font_size"]),
              step_data.format(overlay["color"]),
              step_data.format(overlay["font"]))


@register_overlay
def text_array(overlay: dict, step_data: StepData, source_img, prev_paths, draw):
    """
    Methode um ein Text-Array auf ein gegebenes Bild zu schreiben mit dem Bauplan der in overlay vorgegeben ist.
    Im Bauplan sind mehrere Texte vorgegeben die auf das Bild geschrieben werden sollen, diese werden ausgepackt
    und umformatiert sodass alle einzelnen overlays nacheinander an die Funktion text übergeben werden.

    :param overlay: Bauplan des zu schreibenden Overlays
    :param step_data: Daten aus der API
    :param source_img: Bild auf welches geschrieben werden soll
    :param prev_paths: Alle Image Baupläne und somit auch alle Pfade zu den bisher erstellen Bildern
    :param draw: Draw Objekt
    """
    # TODO (Max) preset arrays are not working jet
    for idx, i in enumerate(overlay["pos_x"]):
        new_overlay = {}
        items = ["font_size", "color", "font"]

        for item in items:
            _add_to_dict(new_overlay, overlay, item, idx)

        _add_to_dict(new_overlay, overlay, "pattern", idx)
        _add_to_dict(new_overlay, overlay, "anchor_point", idx)
        new_overlay.update({"pos_x": overlay["pos_x"][idx]})
        new_overlay.update({"pos_y": overlay["pos_y"][idx]})
        text(new_overlay, step_data, source_img, prev_paths, draw)


def _add_to_dict(new_overlay: dict, overlay: dict, key: str, idx: int):
    if isinstance(overlay[key], list):
        new_overlay.update({key: overlay[key][idx]})
    else:
        new_overlay.update({key: overlay[key]})


@register_overlay
def option(values: dict, step_data: StepData, source_img, prev_paths, draw):
    """
    Methode welche 2 verschiedene Baupläne bekommt was auf ein Bild geschrieben werden soll, dazu
    wird ein boolean Wert in der Step_data ausgewertet und je nachdem ob dieser Wert
    true oder false ist wird entweder Bauplan A oder Bauplan B ausgeführt.

    :param values: Baupläne des zu schreibenden Overlays
    :param step_data: Daten aus der API
    :param source_img: Bild auf welches geschrieben werden soll
    :param prev_paths: Alle Image Baupläne und somit auch alle Pfade zu den bisher erstellen Bildern
    :param draw: Draw Objekt
    """
    chosen_text = execute_type_option(values, step_data)

    for overlay in chosen_text:
        over_func = get_type_func(overlay, OVERLAY_TYPES)
        over_func(overlay, step_data, source_img, prev_paths, draw)


@register_overlay
def compare(values: dict, step_data: StepData, source_img, prev_paths, draw):
    """
    Methode welche 2 verschiedene Baupläne bekommt was auf ein Bild geschrieben werden soll, dazu
    wird ein boolean Wert in der Step_data ausgewertet und je nachdem ob dieser Wert
    true oder false ist wird entweder Bauplan A oder Bauplan B ausgeführt.

    :param values: Baupläne des zu schreibenden Overlays
    :param step_data: Daten aus der API
    :param source_img: Bild auf welches geschrieben werden soll
    :param prev_paths: Alle Image Baupläne und somit auch alle Pfade zu den bisher erstellen Bildern
    :param draw: Draw Objekt
    """
    chosen_text = execute_type_compare(values, step_data)

    for overlay in chosen_text:
        over_func = get_type_func(overlay, OVERLAY_TYPES)
        over_func(overlay, step_data, source_img, prev_paths, draw)


@register_overlay
def image(overlay: dict, step_data: StepData, source_img, prev_paths, draw):
    """
    Methode um ein Bild in das source_img einzufügen mit dem Bauplan der in overlay vorgegeben ist.

    :param overlay: Bauplan des zu schreibenden Overlays
    :param step_data: Daten aus der API
    :param source_img: Bild auf welches das Bild eingefügt werden soll
    :param prev_paths: Alle Image Baupläne und somit auch alle Pfade zu den bisher erstellen Bildern
    :param draw: Draw Objekt
    """
    if overlay.get("path", None) is None:
        path = resources.get_resource_path(prev_paths[overlay["image_name"]])
    else:
        path = resources.get_image_path(step_data.format(overlay["path"]))
    icon = Image.open(path).convert("RGBA")
    if overlay.get("color_transparency", None) is not None:
        _color_to_transparent(icon, overlay["color_transparency"])
    if step_data.format(overlay.get("color", "RGBA")) != "RGBA":
        icon = icon.convert(step_data.format(overlay["color"]))
    if overlay.get("size_x", None) is not None and overlay.get("size_y", None) is not None:
        icon = icon.resize([step_data.format(overlay["size_x"]),
                            step_data.format(overlay["size_y"])], Image.LANCZOS)
    if overlay.get("pos_x", None) is not None and overlay.get("pos_y", None) is not None:
        pos_x = step_data.format(overlay["pos_x"])
        pos_y = step_data.format(overlay["pos_y"])
    else:
        width_b, height_b = source_img.size
        width_i, height_i = icon.size
        pos_x = int(round((width_b - width_i) / 2))
        pos_y = int(round((height_b - height_i) / 2))
    if overlay.get("transparency", False):
        source_img.alpha_composite(icon, (pos_x,
                                          pos_y))
    else:
        source_img.paste(icon, (pos_x,
                                pos_y), icon)


@register_overlay
def image_array(overlay: dict, step_data: StepData, source_img, prev_paths, draw):
    """
    Methode um ein Bild-Array in das source_img einzufügen mit dem Bauplan der in overlay vorgegeben ist.
    Im Bauplan sind mehrere Bilder vorgegeben die auf das Bild gesetzt werden sollen, diese werden ausgepackt
    und umformatiert sodass alle einzelnen Bilder nacheinander an die Funktion image übergeben werden


    :param overlay: Bauplan des zu schreibenden Overlays
    :param step_data: Daten aus der API
    :param source_img: Bild auf welches das Bild eingefügt werden soll
    :param prev_paths: Alle Image Baupläne und somit auch alle Pfade zu den bisher erstellen Bildern
    :param draw: Draw Objekt
    """
    for idx, i in enumerate(overlay["pos_x"]):
        if isinstance(overlay["color"], list):
            color = overlay["color"][idx]
        else:
            color = overlay["color"]
        if isinstance(overlay.get("path", " "), list):
            path = overlay["path"][idx]
        else:
            path = overlay.get("path", None)
        if isinstance(overlay.get("image_name", " "), list):
            image_name = overlay["image_name"][idx]
        else:
            image_name = overlay.get("image_name", None)
        new_overlay = {
            "size_x": overlay.get("size_x", None),
            "size_y": overlay.get("size_y", None),
            "pos_x": overlay["pos_x"][idx],
            "pos_y": overlay["pos_y"][idx],
            "transparency": overlay.get("transparency", False),
            "path": path,
            "image_name": image_name,
            "white_transparency": overlay.get("white_transparency", False),
            "color": color}
        image(new_overlay, step_data, source_img, prev_paths, draw)


def _color_to_transparent(img, color):
    pixels = img.getdata()
    new_pixels = []
    for item in pixels:
        if item[0] == int("0x" + color[0:2], 16) and item[1] == int("0x" + color[2:4], 16) and item[2] == int(
                "0x" + color[4:6], 16):
            new_pixels.append((int("0x" + color[0:2], 16), int("0x" + color[2:4], 16), int(
                "0x" + color[4:6], 16), 0))
        else:
            new_pixels.append(item)
    img.putdata(new_pixels)
