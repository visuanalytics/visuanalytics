"""
Modul, welches die verschiedenen Typen beeinhaltet, um Text auf ein Bild zu setzen.
"""
from PIL import ImageFont
import textwrap

from visuanalytics.analytics.util.step_errors import ImageError
from visuanalytics.analytics.util.type_utils import register_type_func_no_data
from visuanalytics.util import resources

DRAW_TYPES = {}
"""Ein Dictionary bestehend aus allen Draw-Typ-Methoden.  """


def register_draw(func):
    """Registriert die übergebene Funktion und versieht sie mit einem `"try/except"`-Block.
    Fügt eine Typ-Funktion dem Dictionary DRAW_TYPES hinzu.

    :param func: die zu registrierende Funktion
    :return: Funktion mit try/except-Block
    """
    return register_type_func_no_data(DRAW_TYPES, ImageError, func)


@register_draw
def center(draw, position, content, font_size, font_colour, font_path, width=None):
    """
    Methode, um Text an einem fixem Punkt in ein Bild zu schreiben

    :param draw: Draw-Object, auf welches geschrieben werden soll
    :type draw: PIL.ImageDraw.Draw()
    :param position: Position, an welche geschrieben werden soll
    :type position: tuple
    :param content: Text, der geschrieben werden soll
    :type content: str
    :param font_size: Größe des Texts, Standard Größe = 70
    :type font_size: int
    :param font_colour: Farbe, in welcher geschrieben werden soll (Textfarbe als string oder Hexadezimalwert)
    :type font_colour: str
    :param font_path: Pfad zur Schriftart, in welcher geschrieben werden soll
    :type font_path: str

    """
    ttype = ImageFont.truetype(resources.get_resource_path(font_path), font_size)
    w, h = ttype.getsize(content)
    if width:
        y_text = h
        lines = textwrap.wrap(content, width=calc_num_character(ttype, content[0], width))
        for line in lines:
            draw.text(((position[0] - (w / 2)), y_text + position[1]), line,
                          font=ImageFont.truetype(resources.get_resource_path(font_path), font_size),
                          fill=font_colour)
            y_text += h
    else:
        draw.text(((position[0] - (w / 2)), position[1]), content,
                  font=ImageFont.truetype(resources.get_resource_path(font_path), font_size),
                  fill=font_colour)


@register_draw
def left(draw, position, content, font_size, font_colour, font_path, width=None):
    """
    Methode, um Text mittig auf ein Bild zu schreiben.
    Ort, an dem angefangen wird zu schreiben ,ist variabel und wird berechnet
    anhand der Größe des zu schreibenden Textes.

    :param draw: Draw-Object, auf welches geschrieben werden soll
    :type draw: PIL.ImageDraw.Draw()
    :param position: Position, an welche geschrieben werden soll
    :type position: tuple
    :param content: Text, der geschrieben werden soll
    :type content: str
    :param font_size: Größe des Texts, Standard Größe = 70
    :type font_size: int
    :param font_colour: Farbe, in welcher geschrieben werden soll (Textfarbe als string oder Hexadezimalwert)
    :type font_colour: str
    :param font_path: Pfad zur Schriftart, in welcher geschrieben werden soll
    :type font_path: str
    """
    #draw.text(position, content,
    #          font=ImageFont.truetype(resources.get_resource_path(font_path), font_size),
    #          fill=font_colour)
    ttype = ImageFont.truetype(resources.get_resource_path(font_path), font_size)
    w, h = ttype.getsize(content)
    if width:
        y_text = h
        lines = textwrap.wrap(content, width=calc_num_character(ttype, content[0], width))
        for line in lines:
            draw.text(((position[0] - (w / 2)), y_text + position[1]), line,
                          font=ImageFont.truetype(resources.get_resource_path(font_path), font_size),
                          fill=font_colour)
            y_text += h
    else:
        draw.text(((position[0] - (w / 2)), position[1]), content,
                  font=ImageFont.truetype(resources.get_resource_path(font_path), font_size),
                  fill=font_colour)

def calc_num_character(ttype, text, width):
    w = ttype.getsize(text)[0]
    return width // w