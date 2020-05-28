from PIL import Image
from PIL import ImageDraw

from visuanalytics.analytics.preprocessing.weather.speech import WEATHER_DESCRIPTIONS
from visuanalytics.analytics.processing.util.text_draw import draw_text, draw_text_fix

from visuanalytics.analytics.util import resources

LOCATION_CITY_NAME = (962, 35)
LOCATION_WEEKDAYS_2 = [(552, 213), (1360, 213)]
LOCATION_WEEKDAYS_3 = [(347, 285), (953, 285), (1567, 285)]
LOCATION_ICONS_2 = [(246, 280), (1065, 280)]
LOCATION_ICONS_3 = [(50, 420), (690, 420), (1300, 420)]
LOCATION_TEMP_MAX_2 = [(700, 370), (1530, 370)]
LOCATION_TEMP_MAX_3 = [(462, 440), (1070, 440), (1673, 440)]
LOCATION_TEMP_MIN_2 = [(794, 480), (1608, 480)]
LOCATION_TEMP_MIN_3 = [(540, 550), (1150, 550), (1765, 550)]
LOCATION_ICON_NAME_2 = [(520, 570), (1350, 570)]
LOCATION_FIRST_ENTRY_NAME_2 = [(270, 660), (1090, 660)]
LOCATION_FIRST_ENTRY_DATA_2 = [(675, 660), (1500, 660)]
LOCATION_FIRST_ENTRY_NAME_3 = [(120, 730), (730, 730), (1342, 730)]
LOCATION_FIRST_ENTRY_DATA_3 = [(443, 730), (1055, 730), (1660, 730)]


# 949994


def get_all_images_single_city(pipeline_id, data, date, city_name, keys1=None, keys2=None):
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

    draw_text(draw, LOCATION_CITY_NAME, city_name, fontsize=120)

    for idx, d in enumerate(date):
        if idx == which_date or which_date == 2:
            colour = "white"
        draw_text(draw, LOCATION_WEEKDAYS_2[idx], d, fontcolour=colour)
        draw_text(draw, LOCATION_ICON_NAME_2[idx], WEATHER_DESCRIPTIONS[str(data[idx]["code"])][2],
                  path="weather/Dosis-Medium.ttf", fontcolour=colour)
        draw_text(draw, LOCATION_TEMP_MAX_2[idx], str(round(data[idx]["max_temp"])) + "\u00B0", fontsize=110,
                  fontcolour=colour)
        draw_text(draw, LOCATION_TEMP_MIN_2[idx], str(round(data[idx]["min_temp"])) + "\u00B0", fontsize=80,
                  fontcolour=colour)
        for i in range(0, 4):
            draw_text_fix(draw, (LOCATION_FIRST_ENTRY_NAME_2[idx][0], LOCATION_FIRST_ENTRY_NAME_2[idx][1] + (i * 70)),
                          keys[i][0], path="weather/Dosis-Regular.ttf", fontsize=45, fontcolour=colour)
            draw_text_fix(draw, (LOCATION_FIRST_ENTRY_DATA_2[idx][0], LOCATION_FIRST_ENTRY_DATA_2[idx][1] + (i * 70)),
                          str(round(data[idx][keys[i][1]], 2)) + keys[i][2], path="weather/Dosis-Regular.ttf",
                          fontsize=45, fontcolour=colour)
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

    draw_text(draw, LOCATION_CITY_NAME, city_name, fontsize=120)

    for idx, d in enumerate(date):
        if idx == which_date or which_date == 3:
            colour = "white"
        draw_text(draw, LOCATION_WEEKDAYS_3[idx], d, fontcolour=colour)
        draw_text(draw, LOCATION_TEMP_MAX_3[idx], str(round(data[idx]["max_temp"])) + "\u00B0", fontsize=110,
                  fontcolour=colour)
        draw_text(draw, LOCATION_TEMP_MIN_3[idx], str(round(data[idx]["min_temp"])) + "\u00B0", fontsize=80,
                  fontcolour=colour)
        draw_text_fix(draw, LOCATION_FIRST_ENTRY_NAME_3[idx], keys[0], path="weather/Dosis-Regular.ttf", fontsize=45,
                      fontcolour=colour)
        draw_text_fix(draw, LOCATION_FIRST_ENTRY_DATA_3[idx], str(data[idx][keys[1]]) + keys[2],
                      path="weather/Dosis-Regular.ttf",
                      fontsize=45, fontcolour=colour)
        colour = "#949994"

    file = resources.new_temp_resource_path(pipeline_id, "png")
    Image.composite(img1, source_img, img1).save(file)
    return file
