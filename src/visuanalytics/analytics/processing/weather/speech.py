# Autor: Tanja
#
# TODO: NOCH NICHT VOLLSTÄNDIG! NUR DEMO-VERSION
# TODO: Vielleicht das Modul in "speech" umbenennen
# Zur Vervollständigung werden weitere Module und das Dictionary mit den Daten der API und verarbeiteten Daten benötigt.
"""
Generierung einer Audiodatei des Wetterberichts mit vorverarbeiteten Daten aus der Weatherbit-API.
In DATA sind aktuell nur Beispielwerte abgespeichert.
"""

from gtts import gTTS

from visuanalytics.analytics.util import resources


def get_all_audios_germany(pipeline_id, data):
    """Generiert eine Textvorlage für einen Wetterbericht: Heute, morgen und 3-Tage-Vorhersage als Audio-Datei.

    Es wird jeweils ein Text für die Wettervorhersage für heute, morgen und die drei darauffolgenden Tage erstellt.
    Die Sätze werden aus Satzteilen zusammengesetzt, die u.a. von den Modulen cities_descriptions,
    weather_descriptions, date_to_weekday generiert werden.

    :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
    :type pipeline_id: str
    :param data: Dictionary mit relevanten Wetterdaten aus der API, wird in preprocessing.weather.speech.merge_data erstellt
    :return: [file_name_today_weather_mp3, file_name_today_temp_mp3, file_name_tomorrow_weather_mp3,
            file_name_tomorrow_temp_mp3, file_name_three_days_mp3]

    Example:
    data_for_text = {'today': {'weekday': 'Samstag', 'common_code': 804,
                'city_name_max': 'in der Hafenstadt Kiel', 'max_temp': '19', 'code_max': 'ist es leicht bewölkt',
                'city_name_min': 'in Gießen an der Lahn', 'min_temp': '0', 'code_min': 'ist es vereinzelt bewölkt'},
            'tomorrow': {'weekday': 'Sonntag', 'common_code': 803,
                'city_name_max': 'an der Ostsee', 'max_temp': '20', 'code_max': 'ist es leicht bewölkt',
                'city_name_min': 'in Gießen', 'min_temp': '4', 'code_min': 'sind vereinzelte Wolken am Himmel'},
            'next_1': {'weekday': 'Montag', 'common_code': 801,
                'city_name_max': 'im Westen Deutschlands', 'max_temp': '23', 'code_max': 'ist die Bewölkung durchbrochen',
                'city_name_min': 'in Gießen an der Lahn', 'min_temp': '4', 'code_min': 'sind nur wenige Wolken am Himmel'},
            'next_2': {'weekday': 'Dienstag', 'common_code': 803,
                'city_name_max': 'in Düsseldorf', 'max_temp': '23', 'code_max': 'sind vereinzelte Wolken am Himmel',
                'city_name_min': 'in Hannover', 'min_temp': '7', 'code_min': 'sind durchbrochene Wolken am Himmel'},
            'next_3': {'weekday': 'Mittwoch', 'common_code': 802,
                'city_name_max': 'im Westen Deutschlands', 'max_temp': '25', 'code_max': 'wird es heiter mit klarem Himmel',
                'city_name_min': 'in Hannover', 'min_temp': '7', 'code_min': 'ist es vereinzelt bewölkt'}}
    text = first_weatherforecast_text_to_speech(data_for_text)
    print(text)
    """
    text = []

    # Erstellen der Texte für die Audiodateien mithilfe der Daten aus data

    # today_weather
    text.append(
        f"Am heutigen {data['today']['weekday']} {data['today']['code_max']} {data['today']['city_name_max']}. "
        f"{data['today']['city_name_min']} {data['today']['code_min']}. ")

    # today_temp
    text.append(
        f"Die Temperaturen liegen zwischen {data['today']['min_temp']} Grad {data['today']['city_name_min']} "
        f"und {data['today']['max_temp']} Grad {data['today']['city_name_max']}. ")

    # tomorrow_weather
    text.append(
        f"Am morgigen {data['tomorrow']['weekday']} {data['tomorrow']['code_min']} {data['tomorrow']['city_name_min']}. "
        f"{data['tomorrow']['city_name_max']} {data['tomorrow']['code_max']}. ")

    # tomorrow_temp
    text.append(
        f"Die Temperaturen liegen zwischen {data['tomorrow']['min_temp']} Grad {data['tomorrow']['city_name_min']} "
        f"und {data['tomorrow']['max_temp']} Grad {data['tomorrow']['city_name_max']}. ")

    next_1 = (f"Am {data['next_1']['weekday']} {data['next_1']['common_code']}.  "
              f"Die Temperaturen liegen zwischen {data['next_1']['min_temp']} Grad {data['next_1']['city_name_min']} und {data['next_1']['max_temp']} Grad "
              f"{data['next_1']['city_name_max']}. ")

    next_2 = (f"Am {data['next_2']['weekday']} {data['next_2']['common_code']}.  "
              f"Die Temperaturen liegen zwischen {data['next_2']['min_temp']} Grad {data['next_2']['city_name_min']} und {data['next_2']['max_temp']} Grad "
              f"{data['next_2']['city_name_max']}.  ")

    next_3 = (f"Am {data['next_3']['weekday']} {data['next_3']['common_code']}.  "
              f"Die Temperaturen liegen zwischen {data['next_3']['min_temp']} Grad {data['next_3']['city_name_min']} und {data['next_3']['max_temp']} Grad "
              f"{data['next_3']['city_name_max']}. ")

    # three_days
    text.append(f"{next_1} {next_2} {next_3}")

    out = []
    for idx, x in enumerate(text):
        tts = gTTS(x, lang='de')
        out.append(resources.new_temp_resource_path(pipeline_id, "mp3"))
        tts.save(out[idx])

    return out
