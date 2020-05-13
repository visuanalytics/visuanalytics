"""
Dieses Modul dient dazu um aus gegebenen Daten von der Weather API Bilder zu generieren.
"""

from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
from visuanalytics.analytics.util import resources
import uuid


def get_three_pic(data, data2):
    """
    Methode zum generieren des Bildes für die Vorhersage für die nächsten 2-4 Tage.

    :param data: Das Ergebnis der Methode :func:`get_ico_three()`.
    :type data: list
    :param dat2: Das Ergebnis der Methode :func:`get_temp_mm_three()`.
    :type data2: list

    :return: Den Dateinamen des erstellten Bildes.
    :rtype: str

    """
    source_img = Image.open(resources.get_resource_path("weather/3-Tage-Vorhersage.png"))
    img1 = Image.new("RGBA", source_img.size, (0, 0, 0, 0))
    for item in data:
        for i in range(0, 3):
            icon = Image.open(
                resources.get_resource_path("weather/icons/" + item[i + 3] + ".png")).convert("RGBA")
            icon = icon.resize([160, 160], Image.LANCZOS)
            source_img.paste(icon, item[i + 0], icon)

    draw = ImageDraw.Draw(source_img)

    for item in data2:
        draw.text(item[0], item[1],
                  font=ImageFont.truetype(resources.get_resource_path("weather/FreeSansBold.ttf"), 60))

    file = str(uuid.uuid4())
    Image.composite(img1, source_img, img1).save(
        resources.get_resource_path("temp/weather/" + file + ".png"))

    return file


def get_tomo_icons(data):
    """
    Methode zum generieren des Bildes für die Vorhersage für morgen (Iconbild).

    :param data: Das Ergebnis der Methode :func:`get_ico_tomorow()`.
    :type data: list

    :return: Den Dateinamen des erstellten Bildes.
    :rtype: str

    """
    source_img = Image.open(resources.get_resource_path("weather/Wetter-morgen.png"))
    img1 = Image.new("RGBA", source_img.size, (0, 0, 0, 0))
    for item in data:
        icon = Image.open(resources.get_resource_path("weather/icons/" + item[1] + ".png")).convert(
            "RGBA")
        icon = icon.resize([150, 150], Image.LANCZOS)
        source_img.paste(icon, (item[0][0] - 40, item[0][1] - 35), icon)

    file = str(uuid.uuid4())
    Image.composite(img1, source_img, img1).save(
        resources.get_resource_path("temp/weather/" + file + ".png"))
    return file


def get_tomo_temperatur(data):
    """
    Methode zum generieren des Bildes für die Vorhersage für morgen (Temperaturbild).

    :param data: Das Ergebnis der Methode :func:`get_temp_tomorow()`
    :type data: list

    :return: Den Dateinamen des erstellten Bildes.
    :rtype: str

    """
    source_img = Image.open(resources.get_resource_path("weather/Wetter-morgen.png"))
    img1 = Image.new("RGBA", source_img.size)
    draw = ImageDraw.Draw(source_img)
    for item in data:
        x = 0
        if len(item[1]) == 2:
            x = 17
        if str(item[1])[0] == '-' and len(item[1]) == 3:
            x = 7
        tile = Image.open(resources.get_resource_path("weather/kachel.png"))
        source_img.paste(tile, item[0], tile)
        draw.text((item[0][0] + 10 + x, item[0][1] - 3), item[1],
                  font=ImageFont.truetype(resources.get_resource_path("weather/FreeSansBold.ttf"), 55))

    file = str(uuid.uuid4())
    Image.composite(img1, source_img, img1).save(
        resources.get_resource_path("temp/weather/" + file + ".png"))
    return file
