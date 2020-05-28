"""
Dieses Modul dient dazu um aus gegebenen Daten von der Weather API Bilder zu generieren.
"""

from PIL import Image
from PIL import ImageDraw

from visuanalytics.analytics.processing.util.text_draw import draw_text
from visuanalytics.analytics.util import resources

LOCATIONS_WEEKDAYS = [(345, 52), (960, 52), (1585, 52)]
"""
list: Liste aus Tupeln: X und Y Koordinaten der Wochentagsanzeige.
"""


def get_all_images_germany(pipeline_id, icon_oneday, temp_oneday, icon_threeday, data_mm_temp_threeday, date):
    """
    generiert alle Bilder die für den Deutschland bericht benörigt werden

    :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
    :type pipeline_id: str
    :param icon_oneday: Das Ergebnis der Methode :func:`data_icon_oneday()`.
    :type: list
    :param temp_oneday: Das Ergebnis der Methode :func:`data_temp_oneday()`
    :type:list
    :param icon_threeday: Das Ergebnis der Methode :func:`data_icon_threeday()`.
    :type:list
    :param data_mm_temp_threeday: Das Ergebnis der Methode :func:`data_mm_temp_threeday()`.
    :type:list
    :param date: Wochentage für den Bericht
    :type:list
    :return: Eine Liste mit Bildern die erstelt wurden
    :rtype: list
    """
    return [_get_oneday_icons_image(pipeline_id, icon_oneday[0], date[0]),
            _get_oneday_temp_image(pipeline_id, temp_oneday[0], date[0]),
            _get_oneday_icons_image(pipeline_id, icon_oneday[1], date[1]),
            _get_oneday_temp_image(pipeline_id, temp_oneday[1], date[1]),
            _get_threeday_image(pipeline_id, icon_threeday, data_mm_temp_threeday, date[2:5], 0),
            _get_threeday_image(pipeline_id, icon_threeday, data_mm_temp_threeday, date[2:5], 1),
            _get_threeday_image(pipeline_id, icon_threeday, data_mm_temp_threeday, date[2:5], 2),
            _get_threeday_image(pipeline_id, icon_threeday, data_mm_temp_threeday, date[2:5], 3)]


def combine_images_audiolength(images, audiol):
    """
    Kombiniert das 3 Tages images, wo nichts markiert ist mit den anderen Bildern zur Vorbereitung von ffmpeg

    :param images: Liste mit allen images
    :type images: list
    :param audiol: Liste aller Audiolängen
    :type audiol: list
    :return: Neues Tupel bestehend aus den sortierten images und audiolängen
    :rtype: tuple
    """
    return ([images[0], images[1], images[2], images[3], images[7], images[4],
             images[5], images[6], images[7]],
            [audiol[0], audiol[1], audiol[2], audiol[3] - 1, 2, audiol[4] - 2, audiol[5] - 1, audiol[6] - 3, 5])


def _get_threeday_image(pipeline_id, data, data2, weekdates, which_date):
    """
    Methode zum generieren des Bildes für die Vorhersage für die nächsten 3-5 Tage.

    :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
    :type pipeline_id: str
    :param weekdates: Wochentage für die nächsten 2-4 Tage
    :type weekdates : list
    :param data: Das Ergebnis der Methode :func:`data_icon_threeday()`.
    :type data: list
    :param dat2: Das Ergebnis der Methode :func:`data_mm_temp_threeday()`.
    :type data2: list
    :param which_date: Welches 3 tages Bild ausgewählt werden soll
    :type which_date: int
    :return: Den Dateinamen des erstellten Bildes.
    :rtype: str
    """
    source_img = Image.open(resources.get_resource_path("weather/DE3Tage" + str(which_date) + ".png"))
    img1 = Image.new("RGBA", source_img.size, (0, 0, 0, 0))
    for item in data:
        for i in range(0, 3):
            icon = Image.open(
                resources.get_resource_path("weather/icons/" + item[i + 3] + ".png")).convert("RGBA")
            icon = icon.resize([200, 200], Image.LANCZOS)
            source_img.paste(icon, item[i], icon)

    draw = ImageDraw.Draw(source_img)

    for item in data2:
        draw_text(draw, item[0], item[1])

    for idx, item in enumerate(LOCATIONS_WEEKDAYS):
        draw_text(draw, item, weekdates[idx])

    file = resources.new_temp_resource_path(pipeline_id, "png")
    Image.composite(img1, source_img, img1).save(file)

    return file


def _get_oneday_icons_image(pipeline_id, data, weekdate):
    """
    Methode zum generieren des Bildes für die Vorhersage für heute/morgen (Iconbild).

    :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
    :type pipeline_id: str
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
        source_img.paste(icon, (item[0][0] - 90, item[0][1] - 35), icon)
    draw = ImageDraw.Draw(source_img)
    draw_text(draw, (305, 48), weekdate)

    file = resources.new_temp_resource_path(pipeline_id, "png")
    Image.composite(img1, source_img, img1).save(file)
    return file


def _get_oneday_temp_image(pipeline_id, data, weekdate):
    """
    Methode zum generieren des Bildes für die Vorhersage für heute/morgen (Temperaturbild).

    :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
    :type pipeline_id: str
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
    tile = Image.open(resources.get_resource_path("weather/kachel.png"))
    for item in data:
        source_img.paste(tile, (item[0][0] - 53, item[0][1]), tile)
        draw_text(draw, item[0], item[1], fontsize=50)

    draw_text(draw, (305, 48), weekdate)
    file = resources.new_temp_resource_path(pipeline_id, "png")
    Image.composite(img1, source_img, img1).save(file)

    return file
