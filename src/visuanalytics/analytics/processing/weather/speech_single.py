from visuanalytics.analytics.preprocessing.weather import speech
from visuanalytics.analytics.preprocessing.util import get_filepath_mp3 as fp
from visuanalytics.analytics.util import resources
from gtts import gTTS

def get_all_audios_single_city(pipeline_id, data, date, cityname):
    return [_generate_first_day_audio(pipeline_id, data[cityname][0], date[0], cityname),
            _generate_second_day_audio(pipeline_id, data[cityname][1], date[1], cityname),
            _generate_three_days_audio(pipeline_id, data[cityname][2], date[2], cityname),
            _generate_three_days_audio(pipeline_id, data[cityname][3], date[3], cityname),
            _generate_three_days_audio(pipeline_id, data[cityname][4], date[4], cityname)]

def _generate_first_day_audio(pipeline_id, data_for_text, date, cityname):
    """

    :param pipeline_id:
    :param data_for_text:
    :param date:
    :param cityname:
    :return:
    """
    """
    Example: 
    data = {"max_temp": f"{str(data['max_temp'])} Grad",
            "min_temp": f"{str(data['min_temp'])} Grad",
            "app_max_temp": f"{str(data['app_max_temp'])} Grad",
            "app_min_temp": f"{str(data['app_min_temp'])} Grad",
            "wind_cdir_full": wind_cdir_full_data_to_text(data['wind_cdir_full']),
            "wind_spd": wind_spd_data_to_text(data['wind_spd']),
            "code": random_weather_descriptions(data['code']),
            "sunset_ts": time_text_sunset,
            "sunrise_ts": time_text_sunrise,
            "rh": rh_data_to_text(data['rh']),
            "pop": pop_data_to_text(data['pop'])}
    """
    data = speech.merge_data_single(data_for_text)
    text = (
        f"{cityname}  {data['code']} Die Höchstwerte erreichen am heutigen {date} {data['max_temp']}. "
        f"Die Tiefstwerte liegen bei {data['min_temp']}. "
        f"Die gefühlten Temperaturen liegen zwischen {data['app_min_temp']} und {data['app_max_temp']}. "
        f"Die Regenwahrscheinlichkeit liegt bei {data['pop']} und die relative Luftfeuchtigkeit liegt bei {data['rh']}. "
        f"Der Wind kommt heute aus Richtung {data['wind_cdir_full']} und erreicht Geschwindigkeiten von {data['wind_spd']}. "
        f"Die Sonne geht heute um {data['sunset_ts']} unter und geht morgen um {data['sunrise_ts']} wieder auf. "
    )
    file_path = fp.get_filepath_mp3(pipeline_id, text)
    return file_path


def _generate_second_day_audio(pipeline_id, data_for_text, date, cityname):
    data = speech.merge_data_single(data_for_text)
    text = (
        f"{cityname}  {data['code']} Die Höchstwerte erreichen am morgigen {date} {data['max_temp']}. "
        f"Die Tiefstwerte liegen bei {data['min_temp']}. "
        f"Die gefühlten Temperaturen liegen zwischen {data['app_min_temp']} und {data['app_max_temp']}. "
        f"Die Regenwahrscheinlichkeit liegt bei {data['pop']} und die relative Luftfeuchtigkeit liegt bei {data['rh']}. "
        f"Der Wind kommt aus Richtung {data['wind_cdir_full']} und erreicht Geschwindigkeiten von {data['wind_spd']}. "
    )
    file_path = fp.get_filepath_mp3(pipeline_id, text)
    return file_path


def _generate_three_days_audio(pipeline_id, data_for_text, date, cityname):
    data = speech.merge_data_single(data_for_text)
    text = (
        f"Am {date} {data['code']} bei Temperaturen von {data['min_temp']} bis {data['max_temp']}. "
        f"Die gefühlten Temperaturen liegen {cityname} zwischen {data['app_min_temp']} und {data['app_max_temp']}. "
        f"Die Regenwahrscheinlichkeit liegt bei {data['pop']} und die relative Luftfeuchtigkeit liegt bei {data['rh']}. "
        f"Der Wind kommt aus Richtung {data['wind_cdir_full']} und erreicht Geschwindigkeiten von {data['wind_spd']}. "
    )
    file_path = fp.get_filepath_mp3(pipeline_id, text)
    return file_path