"""
Modul, welches die grundlegenden Funktionen der verschiedenen Arten zur Bilderzeugung beeinhaltet.
"""

from PIL import Image
from PIL import ImageDraw

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.processing.image.matplotlib.diagram import generate_diagram, generate_diagram_custom
from visuanalytics.analytics.processing.image.pillow.overlay import OVERLAY_TYPES
from visuanalytics.analytics.processing.image.wordcloud import wordcloud as wc
from visuanalytics.analytics.util.step_errors import raise_step_error, ImageError, DiagramError
from visuanalytics.analytics.util.type_utils import get_type_func, register_type_func
from visuanalytics.util import resources


IMAGE_TYPES = {}
DIAGRAM_TYPES = {}
"""Ein Dictionary bestehend aus allen Image-Typ-Methoden."""


def register_image(func):
    """Registriert die übergebene Funktion und versieht sie mit einem `"try/except"`-Block.
    Fügt eine Typ-Funktion dem Dictionary IMAGE_TYPES hinzu.

    :param func: die zu registrierende Funktion
    :return: Funktion mit try/except-Block
    """
    return register_type_func(IMAGE_TYPES, ImageError, func)


def register_diagram(func):
    """Registriert die übergebene Funktion und versieht sie mit einem `"try/except"`-Block.
    Fügt eine Typ-Funktion dem Dictionary DIAGRAM_TYPES hinzu.

    :param func: die zu registrierende Funktion
    :return: Funktion mit try/except-Block
    """
    return register_type_func(DIAGRAM_TYPES, DiagramError, func)


@raise_step_error(ImageError)
def generate_all_images(values: dict, step_data: StepData):
    """
    Durchläuft jedes Bild in values (in der JSON), überprüft welcher Typ des Bildes vorliegt und ruft die
    passende Typ-Methode auf. Nach der Erstellung der Bilder wird der Bauplan des Bilder (in values) mit dem Bildpfad ersetzt.

    :param values: Werte aus der JSON-Datei
    :param step_data: Daten aus der API
    """
    for key, item in enumerate(values["images"]):
        image_func = get_type_func(values["images"][item], IMAGE_TYPES)

        values["images"][item] = image_func(values["images"][item], step_data, values["images"])


@raise_step_error(DiagramError)
def generate_all_diagrams(values: dict, step_data: StepData):
    """
    Durchläuft jedes Bild in values (in der JSON), überprüft welcher Typ des Bildes vorliegt und ruft die
    passende Typ-Methode auf. Nach der Erstellung der Bilder wird der Bauplan des Bilder (in values) mit dem Bildpfad ersetzt.

    :param values: Werte aus der JSON-Datei
    :param step_data: Daten aus der API
    """
    if not values.get("diagrams", None):
        # continue, if the step 'diagrams' does not exist (for old stepdata-files)
        return

    for key, item in enumerate(values["diagrams"]):
        diagram_func = get_type_func(values["diagrams"][item], DIAGRAM_TYPES)

        values["diagrams"][item] = diagram_func(values["diagrams"][item], step_data, values["diagrams"])


@register_image
def pillow(values: dict, step_data: StepData, prev_paths: dict):
    """
    Erstellt ein Bild mit Hilfe der Python-Bibliothek Pillow.
    Dazu wird ein neues Bild geöffnet oder ein bisher erstelltes Bild weiter bearbeitet.
    In der JSON können beliebige viele Overlays angegeben werden, welche diese Methode alle
    ausführt und auf das Bild setzt.

    :param values: Image-Bauplan des zu erstellenden Bildes
    :param step_data: Daten aus der API
    :param prev_paths: alle Image-Baupläne und somit auch alle Pfade zu den bisher erstellten Bildern
    :return: Pfad zum erstellten Bild
    :rtype: str
    """
    if values.get("path", None) is None:
        image_name = step_data.format(values["image_name"])
        source_img = Image.open(resources.get_resource_path(prev_paths[image_name]))
    else:
        path = step_data.format(values["path"])
        source_img = Image.open(resources.get_image_path(path))
    img1 = Image.new("RGBA", source_img.size)
    draw = ImageDraw.Draw(source_img)

    for overlay in values["overlay"]:
        over_func = get_type_func(overlay, OVERLAY_TYPES)
        over_func(overlay, step_data, source_img, prev_paths, draw)

    file = resources.new_temp_resource_path(step_data.data["_pipe_id"], "png")
    Image.composite(img1, source_img, img1).save(file)
    return file


@register_image
def wordcloud(values: dict, step_data: StepData, prev_paths):
    """
    Erstellt ein Wordcloud Bild mit Hilfe der Python-Bibliothek Wordcloud.

    :param values: Image-Bauplan des zu erstellenden Bildes
    :param step_data: Daten aus der API
    :param prev_paths: alle Image-Baupläne und somit auch alle Pfade zu den bisher erstellten Bildern
    :return: Pfad zum erstellten Bild
    :rtype: str
    """
    return wc.wordcloud(values, step_data, prev_paths)


@register_image
def diagram(values: dict, step_data: StepData, prev_paths):
    """
    Erstellt ein Wordcloud Bild mit Hilfe der Python-Bibliothek Wordcloud.

    :param values: Image-Bauplan des zu erstellenden Bildes
    :param step_data: Daten aus der API
    :param prev_paths: alle Image-Baupläne und somit auch alle Pfade zu den bisher erstellten Bildern
    :return: Pfad zum erstellten Bild
    :rtype: str
    """
    return generate_diagram(values, step_data, prev_paths)


@register_diagram
def diagram_custom(values: dict, step_data: StepData, prev_paths):
    """
    Erstellt ein Diagram mit Hilfe der Python-Bibliothek MatPlotLib.

    :param values: Image-Bauplan des zu erstellenden Diagramms
    :param step_data: Daten aus der API
    :param prev_paths: alle Image-Bauplane
    :return: Pfad zum erstellten Bild
    :rtype: str
    """
    return generate_diagram_custom(values, step_data)  # , prev_paths)
