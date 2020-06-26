"""
Modul welches die verschieden Typen beeihaltet um Text auf ein Bild zu setzten
"""
from PIL import ImageFont

from visuanalytics.analytics.util import resources
from visuanalytics.analytics.util.step_errors import ImageError
from visuanalytics.analytics.util.type_utils import register_type_func

DRAW_TYPES = {}
"""Ein Dictionary bestehende aus allen Draw Typ Methoden  """


def register_draw(func):
    """
    Fügt eine Typ-Funktion dem Dictionary DRAW_TYPES hinzu

    :param func: Eine Funktion
    :return: Die übergebene Funktion
    """
    return register_type_func(DRAW_TYPES, ImageError, func)


@register_draw
def center(draw, position, content, font_size, font_colour, font_path):
    """
    Methode um Text an einem fixem Punkt in ein Bild zu schreiben

    :param draw: Draw Object auf welches geschrieben werden soll
    :type draw: PIL.ImageDraw.Draw()
    :param position: Position an welche geschrieben werden soll
    :type position: tuple
    :param content: Text der geschrieben werden soll
    :type content: str
    :param font_size: Größe des Texts, Standard Größe = 70
    :type font_size: int
    :param font_colour: Farbe in welcher geschrieben werden soll (Kann textfarbe als string aber auch Hexwert sein)
    :type font_colour: str
    :param font_path: Pfad zur Schriftart in welches geschrieben werden soll
    :type font_path: str


    """
    ttype = ImageFont.truetype(resources.get_resource_path(font_path), font_size)
    w, h = ttype.getsize(content)
    draw.text(((position[0] - (w / 2)), position[1]), content,
              font=ImageFont.truetype(resources.get_resource_path(font_path), font_size),
              fill=font_colour)


@register_draw
def left(draw, position, content, font_size, font_colour, font_path):
    """
    Methode um Text in ein Bild mittig zu schreiben.
    Ort an dem angefangen wird zu schreiben ist variable und wird berechnet
    an der Größe des zu schreibenden Textes.

    :param draw: Draw Object auf welches geschrieben werden soll
    :type draw: PIL.ImageDraw.Draw()
    :param position: Position an welche geschrieben werden soll
    :type position: tuple
    :param content: Text der geschrieben werden soll
    :type content: str
    :param font_size: Größe des Texts, Standard Größe = 70
    :type font_size: int
    :param font_colour: Farbe in welcher geschrieben werden soll (Kann textfarbe als string aber auch Hexwert sein)
    :type font_colour: str
    :param font_path: Pfad zur Schriftart in welches geschrieben werden soll
    :type font_path: str
    """
    draw.text(position, content,
              font=ImageFont.truetype(resources.get_resource_path(font_path), font_size),
              fill=font_colour)
