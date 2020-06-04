"""
Dieses Modul dient dazu um aus gegebenen Daten von der Weather API Bilder für den Lokalen Wetterbericht zu generieren.
"""
from PIL import Image
from PIL import ImageDraw

from visuanalytics.analytics.preprocessing.weather.speech import WEATHER_DESCRIPTIONS
from visuanalytics.analytics.processing.util.text_draw import draw_text, draw_text_fix

from visuanalytics.analytics.util import resources

LOCATION_CITY_NAME = (962, 35)
"""
tupel: X und Y Koordinaten der Position des Ortsnamen.
"""
LOCATION_WEEKDAYS_2 = [(552, 213), (1360, 213)]
"""
list: Liste aus Tupeln: X und Y Koordinaten der Position der Wochentage (2 Tages Bild).
"""
LOCATION_WEEKDAYS_3 = [(347, 285), (953, 285), (1567, 285)]
"""
list: Liste aus Tupeln: X und Y Koordinaten der Position der Wochentage (3 Tages Bild).
"""
LOCATION_ICONS_2 = [(246, 280), (1065, 280)]
"""
list: Liste aus Tupeln: X und Y Koordinaten der Position der Wettericons (2 Tages Bild).
"""
LOCATION_ICONS_3 = [(50, 420), (690, 420), (1300, 420)]
"""
list: Liste aus Tupeln: X und Y Koordinaten der Position der Wettericons (3 Tages Bild).
"""
LOCATION_TEMP_MAX_2 = [(700, 370), (1530, 370)]
"""
list: Liste aus Tupeln: X und Y Koordinaten der Position der Max Temperatur (2 Tages Bild).
"""
LOCATION_TEMP_MAX_3 = [(462, 440), (1070, 440), (1673, 440)]
"""
list: Liste aus Tupeln: X und Y Koordinaten der Position der Max Temperatur (3 Tages Bild).
"""
LOCATION_TEMP_MIN_2 = [(794, 480), (1608, 480)]
"""
list: Liste aus Tupeln: X und Y Koordinaten der Position der Min Temperatur (2 Tages Bild).
"""
LOCATION_TEMP_MIN_3 = [(540, 550), (1150, 550), (1765, 550)]
"""
list: Liste aus Tupeln: X und Y Koordinaten der Position der Min Temperatur (3 Tages Bild).
"""
LOCATION_ICON_NAME_2 = [(520, 570), (1350, 570)]
"""
list: Liste aus Tupeln: X und Y Koordinaten der Position der Text-Kurz-Beschreibung des Icons (2 Tages Bild).
"""
LOCATION_FIRST_ENTRY_NAME_2 = [(270, 660), (1090, 660)]
"""
list: Liste aus Tupeln: X und Y Koordinaten der Position des ersten Eintrages für die Tabelle mit den Windangaben etc. 
(Name des Eintrags zb. Windstärke) (2 Tages Bild).
"""
LOCATION_FIRST_ENTRY_DATA_2 = [(675, 660), (1500, 660)]
"""
list: Liste aus Tupeln: X und Y Koordinaten der Position des ersten Eintrages für die Tabelle mit den Daten 
(Name des Eintrags zb. 5 m/s) (2 Tages Bild).
"""
LOCATION_FIRST_ENTRY_NAME_3 = [(120, 730), (730, 730), (1342, 730)]
"""
list: Liste aus Tupeln: X und Y Koordinaten der Position des ersten Eintrages für die Tabelle mit den Windangaben etc. 
(Name des Eintrags zb. Windstärke) (3 Tages Bild).
"""
LOCATION_FIRST_ENTRY_DATA_3 = [(443, 730), (1055, 730), (1660, 730)]
"""
list: Liste aus Tupeln: X und Y Koordinaten der Position des ersten Eintrages für die Tabelle mit den Daten 
(Name des Eintrags zb. 5 m/s) (3 Tages Bild).
"""


def get_all_images_single_city(pipeline_id, data, date, city_name, keys1=None, keys2=None):
    """
       generiert alle Bilder die für den Lokalen Wetterbericht benötigt werden

        :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
        :type pipeline_id: str
        :param data: Die Überarbeitet JSON Data von der Wather API
        :type data: dict
        :param date: Wochentage für den Bericht
        :type date: list
        :param city_name: Name der Stadt für den der Wetterbericht erstellt werden soll
        :type city_name: str
        :param keys1: Keywörter die angezeigt werden sollen (2 Tages Bild)
        :type keys1: list
        :param keys2: Keywörter die angezeigt werden sollen (3 Tages Bild)
        :type keys2: list
        :return: Eine Liste mit Bildern die erstelt wurden
        :rtype: list
       """
    if keys1 is None:
        keys1 = [("Regen", "pop", " %"), ("Luftfeuchtigkeit", "rh", " %"), ("gefühlt", "app_max_temp", "\u00B0"),
                 ("Windstärke", "wind_spd", " m/s")]
    if keys2 is None:
        keys2 = ("Regen", "pop", "%")
    return [_generate_first_second_day_image(pipeline_id, data[city_name][0:2], date[0:2], city_name, 0, keys1),
            _generate_first_second_day_image(pipeline_id, data[city_name][0:2], date[0:2], city_name, 1, keys1),
            _generate_three_days_image(pipeline_id, data[city_name][2:5], date[2:5], city_name, 0, keys2),
            _generate_three_days_image(pipeline_id, data[city_name][2:5], date[2:5], city_name, 1, keys2),
            _generate_three_days_image(pipeline_id, data[city_name][2:5], date[2:5], city_name, 2, keys2),
            _generate_first_second_day_image(pipeline_id, data[city_name][0:2], date[0:2], city_name, 2, keys1),
            _generate_three_days_image(pipeline_id, data[city_name][2:5], date[2:5], city_name, 3, keys2)]


def combine_images_audiolength(images, audiol):
    """
       Kombiniert das 3 Tages images und das 2 Tages Image, auf dem nichts markiert ist mit den anderen Bildern zur vorbereitung von ffmpeg

       :param images: Liste mit allen images
       :type images: list
       :param audiol: Liste aller Audiolängen
       :type audiol: list
       :return: Neues Tupel bestehend aus den sortierten images und audiolängen
       :rtype: tuple
       """
    return ([images[5], images[0], images[1], images[5], images[6], images[2], images[3], images[4],
             images[6]], [3, audiol[0] - 3, audiol[1] - 4, 4, 3, audiol[2] - 3, audiol[3], audiol[4] - 5, 5])


def _generate_first_second_day_image(pipeline_id, data, date, city_name, which_date, keys):
    colour = "#949994"
    source_img = Image.open(resources.get_resource_path("weather/Ort_2day" + str(which_date) + ".png"))
    img1 = Image.new("RGBA", source_img.size)

    for idx, coord in enumerate(LOCATION_ICONS_2):
        icon = Image.open(
            resources.get_resource_path("weather/icons/" + data[idx]["icon"] + ".png")).convert("RGBA")
        if not (idx == which_date or which_date == 2):
            icon = icon.convert('L')
        icon = icon.resize([350, 350], Image.LANCZOS)
        source_img.paste(icon, coord, icon)

    draw = ImageDraw.Draw(source_img)

    draw_text(draw, LOCATION_CITY_NAME, city_name, font_size=120)

    for idx, d in enumerate(date):
        if idx == which_date or which_date == 2:
            colour = "white"
        draw_text(draw, LOCATION_WEEKDAYS_2[idx], d, font_colour=colour)
        draw_text(draw, LOCATION_ICON_NAME_2[idx], WEATHER_DESCRIPTIONS[str(data[idx]["code"])][2],
                  font_path="weather/Dosis-Medium.ttf", font_colour=colour)
        draw_text(draw, LOCATION_TEMP_MAX_2[idx], str(round(data[idx]["max_temp"])) + "\u00B0", font_size=110,
                  font_colour=colour)
        draw_text(draw, LOCATION_TEMP_MIN_2[idx], str(round(data[idx]["min_temp"])) + "\u00B0", font_size=80,
                  font_colour=colour)
        for i in range(0, 4):
            draw_text_fix(draw, (LOCATION_FIRST_ENTRY_NAME_2[idx][0], LOCATION_FIRST_ENTRY_NAME_2[idx][1] + (i * 70)),
                          keys[i][0], font_path="weather/Dosis-Regular.ttf", font_size=45, font_colour=colour)
            draw_text_fix(draw, (LOCATION_FIRST_ENTRY_DATA_2[idx][0], LOCATION_FIRST_ENTRY_DATA_2[idx][1] + (i * 70)),
                          str(round(data[idx][keys[i][1]], 2)) + keys[i][2], font_path="weather/Dosis-Regular.ttf",
                          font_size=45, font_colour=colour)
        colour = "#949994"

    file = resources.new_temp_resource_path(pipeline_id, "png")
    Image.composite(img1, source_img, img1).save(file)
    return file


def _generate_three_days_image(pipeline_id, data, date, city_name, which_date, keys):
    colour = "#949994"
    source_img = Image.open(resources.get_resource_path("weather/Ort_3day" + str(which_date) + ".png"))
    img1 = Image.new("RGBA", source_img.size)

    for idx, coord in enumerate(LOCATION_ICONS_3):
        icon = Image.open(
            resources.get_resource_path("weather/icons/" + data[idx]["icon"] + ".png")).convert("RGBA")
        if not (idx == which_date or which_date == 3):
            icon = icon.convert('L')
        icon = icon.resize([280, 280], Image.LANCZOS)
        source_img.paste(icon, coord, icon)

    draw = ImageDraw.Draw(source_img)

    draw_text(draw, LOCATION_CITY_NAME, city_name, font_size=120)

    for idx, d in enumerate(date):
        if idx == which_date or which_date == 3:
            colour = "white"
        draw_text(draw, LOCATION_WEEKDAYS_3[idx], d, font_colour=colour)
        draw_text(draw, LOCATION_TEMP_MAX_3[idx], str(round(data[idx]["max_temp"])) + "\u00B0", font_size=110,
                  font_colour=colour)
        draw_text(draw, LOCATION_TEMP_MIN_3[idx], str(round(data[idx]["min_temp"])) + "\u00B0", font_size=80,
                  font_colour=colour)
        draw_text_fix(draw, LOCATION_FIRST_ENTRY_NAME_3[idx], keys[0], font_path="weather/Dosis-Regular.ttf",
                      font_size=45,
                      font_colour=colour)
        draw_text_fix(draw, LOCATION_FIRST_ENTRY_DATA_3[idx], str(data[idx][keys[1]]) + keys[2],
                      font_path="weather/Dosis-Regular.ttf",
                      font_size=45, font_colour=colour)
        colour = "#949994"

    file = resources.new_temp_resource_path(pipeline_id, "png")
    Image.composite(img1, source_img, img1).save(file)
    return file
