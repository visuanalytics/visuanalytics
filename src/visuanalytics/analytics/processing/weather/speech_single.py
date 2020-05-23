"""
Hier werden die Audiodateien für eine 5 Tage-Wettervorhersage für eine bestimmte Stadt generiert.

Die Methode get_all_audios_single_city(pipeline_id, data, date, cityname) wenden die Methoden
_generate_first_day_audio(pipeline_id, data_for_text, date, cityname)
_generate_second_day_audio(pipeline_id, data_for_text, date, cityname)
_generate_three_days_audio(pipeline_id, data_for_text, date, cityname)
an, um für jeden Tag eine Audiodatei zu erhalten. Der Rückgabewert der eben genannten Methoden
ist immer eine Audiodatei.
"""
from visuanalytics.analytics.preprocessing.weather import speech
from visuanalytics.analytics.processing.util import filepath_mp3 as fp

def get_all_audios_single_city(pipeline_id, data, date, cityname):
    """
    Generierung der Audiodateien für eine 5-Tage-Wettervorhersage für eine bestimmte Stadt.


    :param pipeline_id: Ordnername der Audiodatei
    :param data: Dictinary mit relevanten Wetterdaten, die in preprocessing.weather.speech.merge_data
    erstellt wurden
    :param date: String mit Wochentag
    :param cityname: String
    :return: Gibt für jede generierte Audiodatei einen Pfad an, wo diese zu finden ist.
    """
    return [_generate_first_day_audio(pipeline_id, data[cityname][0], date[0], cityname),
            _generate_second_day_audio(pipeline_id, data[cityname][1], date[1], cityname),
            _generate_three_days_audio(pipeline_id, data[cityname][2], date[2], cityname),
            _generate_three_days_audio(pipeline_id, data[cityname][3], date[3], cityname),
            _generate_three_days_audio(pipeline_id, data[cityname][4], date[4], cityname)]

def _generate_first_day_audio(pipeline_id, data, date, cityname):
    text = (
        f"In {cityname} {data['code']}. Die Höchstwerte erreichen am heutigen {date} {data['max_temp']}. "
        f"Die Tiefstwerte liegen bei {data['min_temp']}. "
        f"Die gefühlten Temperaturen liegen zwischen {data['app_min_temp']} und {data['app_max_temp']}. "
        f"Die Regenwahrscheinlichkeit liegt bei {data['pop']} und die relative Luftfeuchtigkeit liegt bei {data['rh']}. "
        f"Der Wind kommt heute aus Richtung {data['wind_cdir_full']} und erreicht Geschwindigkeiten von {data['wind_spd']}. "
        f"Die Sonne geht heute um {data['sunset_ts']} unter und geht morgen um {data['sunrise_ts']} wieder auf. "
    )
    file_path = fp.get_filepath_mp3(pipeline_id, text)
    return file_path


def _generate_second_day_audio(pipeline_id, data, date, cityname):
    text = (
        f"In {cityname} {data['code']}. Die Höchstwerte erreichen am morgigen {date} {data['max_temp']}. "
        f"Die Tiefstwerte liegen bei {data['min_temp']}. "
        f"Die gefühlten Temperaturen liegen zwischen {data['app_min_temp']} und {data['app_max_temp']}. "
        f"Die Regenwahrscheinlichkeit liegt bei {data['pop']} und die relative Luftfeuchtigkeit liegt bei {data['rh']}. "
        f"Der Wind kommt aus Richtung {data['wind_cdir_full']} und erreicht Geschwindigkeiten von {data['wind_spd']}. "
    )
    file_path = fp.get_filepath_mp3(pipeline_id, text)
    return file_path


def _generate_three_days_audio(pipeline_id, data, date, cityname):
    text = (
        f"Am {date} {data['code']} bei Temperaturen von {data['min_temp']} bis {data['max_temp']}. "
        f"Die gefühlten Temperaturen liegen in {cityname} zwischen {data['app_min_temp']} und {data['app_max_temp']}. "
        f"Die Regenwahrscheinlichkeit liegt bei {data['pop']} und die relative Luftfeuchtigkeit liegt bei {data['rh']}. "
        f"Der Wind kommt aus Richtung {data['wind_cdir_full']} und erreicht Geschwindigkeiten von {data['wind_spd']}. "
    )
    file_path = fp.get_filepath_mp3(pipeline_id, text)
    return file_path