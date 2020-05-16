"""
Dieses Modul dient dazu um aus gegebenen Daten von der Weather API Bilder zu generieren.
"""

from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
from visuanalytics.analytics.util import resources
import uuid

LOCATIONS_WEEKDAYS = [(220, 97), (840, 97), (1462, 97)]
"""
list: Liste aus Tupeln: X und Y Koordinaten der Wochentagsanzeige.
"""


def get_threeday_image(data, data2, weekdates):
    """
    Methode zum generieren des Bildes für die Vorhersage für die nächsten 3-5 Tage.

    :param weekdates: Wochentage für die nächsten 2-4 Tage
    :type weekdates : list
    :param data: Das Ergebnis der Methode :func:`data_icon_threeday()`.
    :type data: list
    :param dat2: Das Ergebnis der Methode :func:`data_mm_temp_threeday()`.
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
        _draw_text(draw, ((item[0][0] + _get_shifting_temp(item[1])), (item[0][1]) + 2), item[1])

    for idx, item in enumerate(LOCATIONS_WEEKDAYS):
        shifting = _get_shifting_weekday(weekdates[idx])
        _draw_text(draw, (item[0] + 4 + shifting, item[1] + 4), weekdates[idx], fontcolour="black")
        _draw_text(draw, (item[0] + shifting, item[1]), weekdates[idx])

    file = str(uuid.uuid4())
    Image.composite(img1, source_img, img1).save(
        resources.get_resource_path("temp/weather/" + file + ".png"))

    return file


def get_oneday_icons_image(data, weekdate):
    """
    Methode zum generieren des Bildes für die Vorhersage für heute/morgen (Iconbild).

    :param weekdate: Wochentag des Datums für morgen
    :type weekdate : str
    :param data: Das Ergebnis der Methode :func:`data_icon_oneday()`.
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
    draw = ImageDraw.Draw(source_img)
    _draw_weekdays(draw, weekdate)
    file = str(uuid.uuid4())
    Image.composite(img1, source_img, img1).save(
        resources.get_resource_path("temp/weather/" + file + ".png"))
    return file


def get_oneday_temp_image(data, weekdate):
    """
    Methode zum generieren des Bildes für die Vorhersage für heute/morgen (Temperaturbild).

    :param weekdate: Wochentag des Datums für morgen
    :type weekdate : str
    :param data: Das Ergebnis der Methode :func:`data_temp_oneday()`
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
        _draw_text(draw, (item[0][0] + 14 + _get_shifting_temp(item[1]), item[0][1] + 1), item[1], fontsize=50)

    _draw_weekdays(draw, weekdate)
    file = str(uuid.uuid4())
    Image.composite(img1, source_img, img1).save(
        resources.get_resource_path("temp/weather/" + file + ".png"))

    return file


def _draw_weekdays(draw, weekdate):
    _draw_text(draw, (304, 114), weekdate, fontcolour="black")
    _draw_text(draw, (300, 110), weekdate)


def _draw_text(draw, position, content, fontsize=60, fontcolour="white", path="weather/FreeSansBold.ttf"):
    draw.text(position, content,
              font=ImageFont.truetype(resources.get_resource_path(path), fontsize),
              fill=fontcolour)


def _get_shifting_temp(item):
    # verschiebt die Temperatur wenn einstellig, - einstellig, und - zweistellig
    return 17 if len(item) == 2 else 7 if item[0] == '-' and len(item) == 3 else -6 if item[0] == '-' and len(
        item) == 4 else 0


def _get_shifting_weekday(item):
    # verschiebt den Wochentagname wenn  6,8,10 stellig
    return 15 if len(item) == 6 else -8 if len(item) == 8 else -45 if len(item) == 10 else 0
