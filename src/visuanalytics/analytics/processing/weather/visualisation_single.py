from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont

from visuanalytics.analytics.util import resources

LOCATION_CITY_NAME = (720, 80)
LOCATION_WEEKDAYS_2 = [(420, 235), (1200, 235)]
LOCATION_WEEKDAYS_3 = [(200, 320), (843, 320), (1416, 320)]
LOCATION_ICONS_2 = [(336, 380), (1145, 380)]
LOCATION_ICONS_3 = [(150, 450), (780, 450), (1380, 450)]
LOCATION_TEMP_MAX_2 = [(640, 420), (1450, 420)]
LOCATION_TEMP_MAX_3 = [(380, 474), (989, 474), (1613, 474)]
LOCATION_TEMP_MIN_2 = [(774, 530), (1578, 530)]
LOCATION_TEMP_MIN_3 = [(483, 600), (1080, 600), (1700, 600)]
LOCATION_ICON_NAME_2 = [(345, 600), (1180, 600)]
LOCATION_FIRST_ENTRY_NAME_2 = [(270, 670), (1090, 670)]
LOCATION_FIRST_ENTRY_DATA_2 = [(675, 670), (1500, 670)]
LOCATION_FIRST_ENTRY_NAME_3 = [(120, 740), (734, 740), (1334, 740)]
LOCATION_FIRST_ENTRY_DATA_3 = [(423, 740), (1055, 740), (1700, 740)]


def get_all_images_single_city(pipeline_id, data, date, city_name, keys1=None, keys2=None):
    if keys1 is None:
        keys1 = [("Regen", "pop"), ("Luftfeutigkeit", "rh"), ("gefühlt", "app_max_temp"), ("Windstärke", "wind_spd")]
    if keys2 is None:
        keys2 = ("Regen", "pop")
    return [_generate_first_second_day_image(pipeline_id, data[city_name][0:2], date[0:2], city_name, 0, keys1),
            _generate_first_second_day_image(pipeline_id, data[city_name][0:2], date[0:2], city_name, 1, keys1),
            _generate_three_days_image(pipeline_id, data[city_name][2:5], date[2:5], city_name, 0, keys2),
            _generate_three_days_image(pipeline_id, data[city_name][2:5], date[2:5], city_name, 1, keys2),
            _generate_three_days_image(pipeline_id, data[city_name][2:5], date[2:5], city_name, 2, keys2)]


"""
[{'rh': 57, 'sunset_ts': 1590088706, 'sunrise_ts': 1590032139, 'app_min_temp': 4.1, 'wind_spd': 1.32611, 'pop': 0, 
'wind_cdir_full': 'southeast', 'valid_date': '2020-05-21', 'app_max_temp': 23.9, 'max_temp': 24.4, 'min_temp': 7.2, 
'icon': 'c02d', 'code': 801},]
"""


def _generate_first_second_day_image(pipeline_id, data, date, city_name, which_date, keys):
    source_img = Image.open(resources.get_resource_path("weather/Ort_2day" + str(which_date) + ".png"))
    img1 = Image.new("RGBA", source_img.size)

    for idx, coord in enumerate(LOCATION_ICONS_2):
        icon = Image.open(
            resources.get_resource_path("weather/icons/" + data[idx]["icon"] + ".png")).convert("RGBA")
        icon = icon.resize([400, 400], Image.LANCZOS)
        source_img.paste(icon, coord, icon)

    draw = ImageDraw.Draw(source_img)

    _draw_text(draw, LOCATION_CITY_NAME, city_name)

    for idx, d in enumerate(date):
        _draw_text(draw, LOCATION_WEEKDAYS_2[idx], d)
        _draw_text(draw, LOCATION_ICON_NAME_2[idx], str(data[idx]["code"]))
        _draw_text(draw, LOCATION_TEMP_MAX_2[idx], str(data[idx]["max_temp"]))
        _draw_text(draw, LOCATION_TEMP_MIN_2[idx], str(data[idx]["min_temp"]))
        for i in range(0, 4):
            _draw_text(draw, (LOCATION_FIRST_ENTRY_NAME_2[idx][0], LOCATION_FIRST_ENTRY_NAME_2[idx][1] + (i * 50)),
                       keys[i][0])
            _draw_text(draw, (LOCATION_FIRST_ENTRY_DATA_2[idx][0], LOCATION_FIRST_ENTRY_DATA_2[idx][1] + (i * 60)),
                       str(data[idx][keys[i][1]]))

    file = resources.new_temp_resource_path(pipeline_id, "png")
    Image.composite(img1, source_img, img1).save(file)
    return file


def _generate_three_days_image(pipeline_id, data, date, city_name, which_date, keys):
    source_img = Image.open(resources.get_resource_path("weather/Ort_3day" + str(which_date) + ".png"))
    img1 = Image.new("RGBA", source_img.size)

    for idx, coord in enumerate(LOCATION_ICONS_3):
        icon = Image.open(
            resources.get_resource_path("weather/icons/" + data[idx]["icon"] + ".png")).convert("RGBA")
        icon = icon.resize([300, 300], Image.LANCZOS)
        source_img.paste(icon, coord, icon)

    draw = ImageDraw.Draw(source_img)

    _draw_text(draw, LOCATION_CITY_NAME, city_name)

    for idx, d in enumerate(date):
        _draw_text(draw, LOCATION_WEEKDAYS_3[idx], d)
        _draw_text(draw, LOCATION_TEMP_MAX_3[idx], str(data[idx]["max_temp"]))
        _draw_text(draw, LOCATION_TEMP_MIN_3[idx], str(data[idx]["min_temp"]))
        _draw_text(draw, LOCATION_FIRST_ENTRY_NAME_3[idx], keys[0])
        _draw_text(draw, LOCATION_FIRST_ENTRY_DATA_3[idx], str(data[idx][keys[1]]))

    file = resources.new_temp_resource_path(pipeline_id, "png")
    Image.composite(img1, source_img, img1).save(file)
    return file


def _draw_text(draw, position, content, fontsize=60, fontcolour="white", path="weather/Dosis.ttf"):
    draw.text(position, content,
              font=ImageFont.truetype(resources.get_resource_path(path), fontsize),
              fill=fontcolour)
