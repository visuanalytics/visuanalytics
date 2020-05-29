"""
Generierung von Audiodateien für einen deutschlandweiten Wetterbericht mit vorbereiteten Daten aus der Weatherbit-API.
Die Daten wurden in preprocessing/weather/transform und preprocessing/weather/speech vorbereitet.
"""

from gtts import gTTS

from visuanalytics.analytics.util import resources


def get_all_audios_germany(pipeline_id, data):
    """Generiert eine Textvorlage und Audiodateien für einen Wetterbericht (heute, morgen und 3-Tage-Vorhersage).

    Es wird jeweils ein Text für die Wettervorhersage für heute, morgen und die drei darauffolgenden Tage erstellt.
    Die Sätze werden aus Satzteilen zusammengesetzt, die u.a. von den Modulen cities_descriptions,
    weather_descriptions, date_to_weekday generiert werden.

    :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
    :type pipeline_id: str
    :param data: Dictionary mit relevanten Wetterdaten aus der API (erstellt in der Methode merge_data in
        preprocessing/weather/speech.py)
    :type data: dict
    :return: Array mit 7 Ordnerpfaden zu Audiodateien.
    :rtype: str[]


    Example:
    data = {'today': {'weekday': 'Samstag', 'common_code': 804,
                'city_highest_max': 'in der Hafenstadt Kiel', 'temp_highest_max': '19', 'code_highest_max': 'ist es leicht bewölkt',
                'city_lowest_max': 'in Gießen an der Lahn', 'temp_lowest_max': '0', 'code_lowest_max': 'ist es vereinzelt bewölkt'},
            'tomorrow': {'weekday': 'Sonntag', 'common_code': 803,
                'city_highest_max': 'an der Ostsee', 'temp_highest_max': '20', 'code_highest_max': 'ist es leicht bewölkt',
                'city_lowest_max': 'in Gießen', 'temp_lowest_max': '4', 'code_lowest_max': 'sind vereinzelte Wolken am Himmel'},
            'next_1': {'weekday': 'Montag', 'common_code': 801,
                'city_highest_max': 'im Westen Deutschlands', 'temp_highest_max': '23', 'code_highest_max': 'ist die Bewölkung durchbrochen',
                'city_lowest_max': 'in Gießen an der Lahn', 'temp_lowest_max': '4', 'code_lowest_max': 'sind nur wenige Wolken am Himmel'},
            'next_2': {'weekday': 'Dienstag', 'common_code': 803,
                'city_highest_max': 'in Düsseldorf', 'temp_highest_max': '23', 'code_highest_max': 'sind vereinzelte Wolken am Himmel',
                'city_lowest_max': 'in Hannover', 'temp_lowest_max': '7', 'code_lowest_max': 'sind durchbrochene Wolken am Himmel'},
            'next_3': {'weekday': 'Mittwoch', 'common_code': 802,
                'city_highest_max': 'im Westen Deutschlands', 'temp_highest_max': '25', 'code_highest_max': 'wird es heiter mit klarem Himmel',
                'city_lowest_max': 'in Hannover', 'temp_lowest_max': '7', 'code_lowest_max': 'ist es vereinzelt bewölkt'}}
    """
    text = []

    # Erstellen der Texte für die Audiodateien mithilfe der Daten aus data

    # today_weather
    text.append(
        f"Am heutigen {data['today']['weekday']} {data['today']['code_highest_max']} {data['today']['city_highest_max']}. "
        f"{data['today']['city_lowest_max']} {data['today']['code_lowest_max']}. ")

    # today_temp
    text.append(
        f"Die Temperaturen liegen zwischen {data['today']['temp_lowest_max']} Grad {data['today']['city_lowest_max']} "
        f"und {data['today']['temp_highest_max']} Grad {data['today']['city_highest_max']}. ")

    # tomorrow_weather
    text.append(
        f"Am morgigen {data['tomorrow']['weekday']} {data['tomorrow']['code_lowest_max']} {data['tomorrow']['city_lowest_max']}. "
        f"{data['tomorrow']['city_highest_max']} {data['tomorrow']['code_highest_max']}. ")

    # tomorrow_temp
    text.append(
        f"Die Temperaturen liegen zwischen {data['tomorrow']['temp_lowest_max']} Grad {data['tomorrow']['city_lowest_max']} "
        f"und {data['tomorrow']['temp_highest_max']} Grad {data['tomorrow']['city_highest_max']}. ")

    # next_1 (1. Tag der 3-Wetter-Übersicht)
    text.append(
        f"Am {data['next_1']['weekday']} {data['next_1']['common_code']}.  "
        f"Die Temperaturen liegen zwischen {data['next_1']['min_temp']} Grad {data['next_1']['city_min_temp']} und {data['next_1']['temp_highest_max']} Grad "
        f"{data['next_1']['city_highest_max']}. ")

    # next_2 (2. Tag der 3-Wetter-Übersicht)
    text.append(
        f"Am {data['next_2']['weekday']} {data['next_2']['common_code']}.  "
        f"Die Temperaturen liegen zwischen {data['next_2']['min_temp']} Grad {data['next_2']['city_min_temp']} und {data['next_2']['temp_highest_max']} Grad "
        f"{data['next_2']['city_highest_max']}.  ")

    # next_3 (3. Tag der 3-Wetter-Übersicht)
    text.append(
        f"Am {data['next_3']['weekday']} {data['next_3']['common_code']}.  "
        f"Die Temperaturen liegen zwischen {data['next_3']['min_temp']} Grad {data['next_3']['city_min_temp']} und {data['next_3']['temp_highest_max']} Grad "
        f"{data['next_3']['city_highest_max']}. ")

    out = []
    for idx, x in enumerate(text):
        tts = gTTS(x, lang='de')
        out.append(resources.new_temp_resource_path(pipeline_id, "mp3"))
        tts.save(out[idx])

    return out
