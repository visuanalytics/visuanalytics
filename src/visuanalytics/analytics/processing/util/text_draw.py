"""
Module zum Text schreiben in ein Bild
"""

from PIL import ImageFont

from visuanalytics.analytics.util import resources


def draw_text(draw, position, content, font_size=70, font_colour="white", font_path="weather/Dosis-Bold.ttf"):
    """
    Methode zum Text in ein Bild schreiben an einem Fixem Punkt

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


def draw_text_fix(draw, position, content, font_size=70, font_colour="white", font_path="weather/Dosis-Bold.ttf"):
    """
        Methode zum Text in ein Bild schreiben, Ort an dem geschrieben wird ist variable an der Größe des
        zu schreibenden Textes

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
