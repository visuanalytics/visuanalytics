"""
Modul welches die grundlegenden Funktionen der verschieden Arten zur Bilderzeugung beeihaltet.
"""

from PIL import Image
from PIL import ImageDraw

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.processing.image.pillow.pillow import generate_image_pillow
from visuanalytics.analytics.processing.image.wordcloud.wordcloud import generate_image_wordcloud
from visuanalytics.analytics.util.step_errors import raise_step_error, ImageError
from visuanalytics.analytics.util.type_utils import get_type_func
from visuanalytics.analytics.processing.image.pillow.overlay import OVERLAY_TYPES

from visuanalytics.analytics.util import resources

IMAGE_TYPES = {}
"""Ein Dictionary bestehende aus allen Image Typ Methoden."""


def register_image(func):
    """
    Fügt eine Typ-Funktion dem Dictionary IMAGE_TYPES hinzu.

    :param func: Eine Funktion
    :return: Die übergebene Funktion
    """
    IMAGE_TYPES[func.__name__] = func
    return func


@raise_step_error(ImageError)
def generate_all_images(values: dict, step_data: StepData):
    """
    Durchläuft jedes Bild in values (also in der JSON), überprüft welcher Typ des Bildes vorliegt und ruft die
    passende Typ Methode auf, nach der Erstellung der Bilder wird der Bauplan des Bilder (in values) mit dem Bildpfad ersetzt.

    :param values: Werte aus der JSON-Datei
    :param step_data: Daten aus der API
    """
    for key, item in enumerate(values["images"]):
        values["images"][item] = IMAGE_TYPES[values["images"][item]["type"]](values["images"][item], values["images"],
                                                                             values["presets"], step_data)


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
    if values.get("already_created", False):
        source_img = Image.open(resources.get_resource_path(prev_paths[values["path"]]))
    else:
        source_img = Image.open(resources.get_resource_path(values["path"]))
    img1 = Image.new("RGBA", source_img.size)
    draw = ImageDraw.Draw(source_img)
    for overlay in values["overlay"]:
        OVERLAY_TYPES[overlay["type"]](overlay, source_img, draw, presets, step_data)
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
    assert False, "Not Implemented"
