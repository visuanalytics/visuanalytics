"""
Dieses Modul dient dazu um aus gegebenen Daten von der Weather API Bilder zu generieren.
"""

from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
from visuanalytics.analytics.util import resources
from visuanalytics.analytics.processing.util import date_time
import uuid

LOCATIONS_WEEKDAYS = [(205, 103), (828, 103), (1435, 103)]
"""
list: Liste aus Tupeln: X und Y Koordinaten der Wochentagsanzeige.
"""


def get_three_pic(data, data2, date):
    """
    Methode zum generieren des Bildes für die Vorhersage für die nächsten 2-4 Tage.

    :param datum: Datum des Tages zuvor
    :type datum : str
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
            icon = icon.resize([200, 200], Image.LANCZOS)
            source_img.paste(icon, item[i + 0], icon)

    draw = ImageDraw.Draw(source_img)
    for item in data2:
        draw.text((item[0][0] + _get_shifting(item[1]), item[0][1]), item[1],
                  font=ImageFont.truetype(resources.get_resource_path("weather/FreeSansBold.ttf"), 60), )

    weekdates = date_time.date_to_weekday(date)
    for idx, item in enumerate(LOCATIONS_WEEKDAYS):
        draw.text((item[0] + 4, item[1] + 4), str(weekdates[idx + 1]),
                  font=ImageFont.truetype(resources.get_resource_path("weather/weather/FreeSansBold.ttf"), 60),
                  fill="black")
        draw.text((item[0], item[1]), str(weekdates[idx + 1]),
                  font=ImageFont.truetype(resources.get_resource_path("weather/weather/FreeSansBold.ttf"), 60))
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
        icon = icon.resize([160, 160], Image.LANCZOS)
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
        tile = Image.open(resources.get_resource_path("weather/kachel.png"))
        source_img.paste(tile, item[0], tile)
        draw.text((item[0][0] + 14 + _get_shifting(item[1]), item[0][1] + 1), item[1],
                  font=ImageFont.truetype(resources.get_resource_path("weather/FreeSansBold.ttf"), 50))

    file = str(uuid.uuid4())
    Image.composite(img1, source_img, img1).save(
        resources.get_resource_path("temp/weather/" + file + ".png"))
    return file


def _get_shifting(item):
    # verschiebt die Temperatur wenn einstellig, - einstellig, und - zweistellig
    return 17 if len(item) == 2 else 7 if item[0] == '-' and len(item) == 3 else -6 if item[0] == '-' and len(
        item) == 4 else 0
