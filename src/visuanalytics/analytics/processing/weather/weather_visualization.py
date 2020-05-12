"""Modul dient dazu um aus gegebenen Daten von der Weather API Bilder oder Videos zu generieren.
"""
# TODO (Jannik): Englische Namen für Variablen und Funktionsnamen verwenden, Funtionen an die neue Struktur anpassen,
# TODO (Jannik): Teil der Funktionen ins "linking"-package auslagern.

import os

from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
import uuid


def generate_drei_tages_vorhersage(data, data2):
    """Methode wird genutzt um das Bild für die 3 Tages Vorherschau zu generieren.
        Args:
            data(Liste): Preprocessed Data von der Api
        Returns:
            String : Den Dateinamen des erstellten Bildes
    """
    source_img = Image.open(
        os.path.join(os.path.dirname(__file__), "../../../resources/weather", "3-Tage-Vorhersage.png"))
    img1 = Image.new("RGBA", source_img.size, (0, 0, 0, 0))
    for item in data:
        for i in range(0, 3):
            icon = Image.open(os.path.join(os.path.dirname(__file__),
                                           "../../../resources/weather/icons/",
                                           item[i + 3] + ".png")).convert(
                "RGBA")
            icon = icon.resize([160, 160], Image.LANCZOS)
            source_img.paste(icon, item[i + 0], icon)

    draw = ImageDraw.Draw(source_img)

    for item in data2:
        draw.text(item[0], item[1],
                  font=ImageFont.truetype(
                      os.path.join(os.path.dirname(__file__), "../../../resources/weather", "FreeSansBold.ttf"), 60))

    dateiname = str(uuid.uuid4())
    Image.composite(img1, source_img, img1).save(
        os.path.join(os.path.dirname(__file__), "../../../resources/temp/weather", dateiname + ".png"))

    return dateiname


def generate_vorhersage_morgen_icons(data):
    """Methode wird genutzt um das Bild für die Vorhersage für morgen zu generieren(Iconbild).
            Args:
               data(Liste): Preprocessed Data von der Api
            Returns:
               String : Den Dateinamen des erstellten Bildes
        """
    source_img = Image.open(os.path.join(os.path.dirname(__file__), "../../../resources/weather", "Wetter-morgen.png"))
    img1 = Image.new("RGBA", source_img.size, (0, 0, 0, 0))
    for item in data:
        icon = Image.open(os.path.join(os.path.dirname(__file__), "../../../resources/weather/icons",
                                       item[1] + ".png")).convert(
            "RGBA")
        icon = icon.resize([150, 150], Image.LANCZOS)
        source_img.paste(icon, (item[0][0] - 40, item[0][1] - 35), icon)

    dateiname = str(uuid.uuid4())
    Image.composite(img1, source_img, img1).save(
        os.path.join(os.path.dirname(__file__), "../../../resources/temp/weather", dateiname + ".png"))
    return dateiname


def generate_vorhersage_morgen_temperatur(data):
    """methode wird genutzt um das Bild für die Vorhersage für morgen zu generieren(Temperaturbild).
            Args:
               data(Liste): Preprocessed Data von der Api
            Returns:
               String : Den Dateinamen des erstellten Bildes
        """

    source_img = Image.open(os.path.join(os.path.dirname(__file__), "../../../resources/weather", "Wetter-morgen.png"))
    img1 = Image.new("RGBA", source_img.size)
    draw = ImageDraw.Draw(source_img)
    for item in data:
        kachel = Image.open(os.path.join(os.path.dirname(__file__), "../../../resources/weather", "kachel.png"))
        source_img.paste(kachel, item[0], kachel)
        draw.text((item[0][0] + 10, item[0][1]), item[1],
                  font=ImageFont.truetype(
                      os.path.join(os.path.dirname(__file__), "../../../resources/weather", "FreeSansBold.ttf"), 53))

    dateiname = str(uuid.uuid4())
    Image.composite(img1, source_img, img1).save(
        os.path.join(os.path.dirname(__file__), "../../../resources/temp/weather", dateiname + ".png"))
    return dateiname
