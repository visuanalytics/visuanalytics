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


def first_weatherforecast_text_to_speech(pipeline_id, data):
    """Generiert eine Textvorlage für einen Wetterbericht: Heute und 3-Tage-Vorhersage als Audio-Datei.

    Es wird jeweils ein Text für die Wettervorhersage für heute und die drei darauffolgenden Tage erstellt.
    Die Sätze werden aus Satzteilen zusammengesetzt, die von den Modulen cities_descriptions,
    weather_descriptions, air_data_to_text, wind_data_to_text, date_to_weekday und time_to_text
    generiert werden.

    :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
    :type pipeline_id: str
    :param days: Liste mit 4 aufeinanderfolgenden Wochentagen
            -> weitere Infos von der API: Wird noch eingefügt
    :return: [file_name_today_weather_mp3, file_name_today_temp_mp3, file_name_tomorrow_weather_mp3,
            file_name_tomorrow_temp_mp3, file_name_three_days_mp3]

    Example:
    data_for_text = {'today': {'weekday': 'Samstag', 'average_temp': 11, 'common_code': 804,
                'city_name_max': 'in der Hafenstadt Kiel', 'max_temp': '19', 'code_max': 'ist es leicht bewölkt',
                'city_name_min': 'in Gießen an der Lahn', 'min_temp': '0', 'code_min': 'ist es vereinzelt bewölkt',
                'city_name_max_avg': 'Kiel', 'max_avg_temp': 13.6, 'code_max_avg': 801,
                'city_name_min_avg': 'Garmisch-Partenkirchen', 'min_avg_temp': 7.6, 'code_min_avg': 804},
            'tomorrow': {'weekday': 'Sonntag', 'average_temp': 12, 'common_code': 803,
                'city_name_max': 'an der Ostsee', 'max_temp': '20', 'code_max': 'ist es leicht bewölkt',
                'city_name_min': 'in Gießen', 'min_temp': '4', 'code_min': 'sind vereinzelte Wolken am Himmel',
                'city_name_max_avg': 'Nürnberg', 'max_avg_temp': 14, 'code_max_avg': 802,
                'city_name_min_avg': 'Garmisch-Partenkirchen', 'min_avg_temp': 10.2, 'code_min_avg': 803},
            'next_1': {'weekday': 'Montag', 'average_temp': 14, 'common_code': 801,
                'city_name_max': 'im Westen Deutschlands', 'max_temp': '23', 'code_max': 'ist die Bewölkung durchbrochen',
                'city_name_min': 'in Gießen an der Lahn', 'min_temp': '4', 'code_min': 'sind nur wenige Wolken am Himmel',
                'city_name_max_avg': 'Kiel', 'max_avg_temp': 15.9, 'code_max_avg': 801,
                'city_name_min_avg': 'Hamburg', 'min_avg_temp': 12.5, 'code_min_avg': 804},
            'next_2': {'weekday': 'Dienstag', 'average_temp': 15, 'common_code': 803,
                'city_name_max': 'in Düsseldorf', 'max_temp': '23', 'code_max': 'sind vereinzelte Wolken am Himmel',
                'city_name_min': 'in Hannover', 'min_temp': '7', 'code_min': 'sind durchbrochene Wolken am Himmel',
                'city_name_max_avg': 'Frankfurt', 'max_avg_temp': 18.3, 'code_max_avg': 801,
                'city_name_min_avg': 'Garmisch-Partenkirchen', 'min_avg_temp': 10.3, 'code_min_avg': 502},
            'next_3': {'weekday': 'Mittwoch', 'average_temp': 15, 'common_code': 802,
                'city_name_max': 'im Westen Deutschlands', 'max_temp': '25', 'code_max': 'wird es heiter mit klarem Himmel',
                'city_name_min': 'in Hannover', 'min_temp': '7', 'code_min': 'ist es vereinzelt bewölkt',
                'city_name_max_avg': 'Düsseldorf', 'max_avg_temp': 19, 'code_max_avg': 800,
                'city_name_min_avg': 'Garmisch-Partenkirchen', 'min_avg_temp': 10.2, 'code_min_avg': 501}}
    text = first_weatherforecast_text_to_speech(data_for_text)
    print(text)
    """
    text = []

    # Erstellen der Texte für die Audiodateien mithilfe der Daten aus data

    # today_weather
    text.append(
        f"Am heutigen {data['today']['weekday']} {data['today']['code_max_avg']} {data['today']['city_name_max_avg']}. "
        f"{data['today']['city_name_min_avg']} {data['today']['code_min_avg']}. ")

    # today_temp
    text.append(
        f"Die Temperaturen liegen zwischen {data['today']['min_avg_temp']} Grad {data['today']['city_name_min_avg']} "
        f"und {data['today']['max_avg_temp']} Grad {data['today']['city_name_max']}. "
        f"Die Durchschnittstemperatur liegt heute bei {data['today']['average_temp']} Grad. ")

    # tomorrow_weather
    text.append(
        f"Am morgigen {data['tomorrow']['weekday']} {data['tomorrow']['code_min_avg']} {data['tomorrow']['city_name_min_avg']}. "
        f"{data['tomorrow']['city_name_max_avg']} {data['tomorrow']['code_max_avg']}. ")

    # tomorrow_temp
    text.append(
        f"Die Temperaturen liegen zwischen {data['tomorrow']['min_avg_temp']} Grad {data['tomorrow']['city_name_min_avg']} "
        f"und {data['tomorrow']['max_avg_temp']} Grad {data['tomorrow']['city_name_max_avg']}. "
        f"Die Durchschnittstemperatur liegt morgen bei {data['tomorrow']['average_temp']} Grad. ")

    next_1 = (f"Am {data['next_1']['weekday']} {data['next_1']['common_code']}.  "
              f"Die Temperaturen liegen zwischen {data['next_1']['min_temp']} Grad {data['next_1']['city_name_min']} und {data['next_1']['max_temp']} Grad. "
              f"{data['next_1']['city_name_max']}. Die Durchschnittstemperatur liegt am {data['next_1']['weekday']} bei {data['next_1']['average_temp']} Grad. ")

    next_2 = (f"Am {data['next_2']['weekday']} {data['next_2']['common_code']}.  "
              f"Die Temperaturen liegen zwischen {data['next_2']['min_temp']} Grad {data['next_2']['city_name_min']} und {data['next_2']['max_temp']} Grad. "
              f"{data['next_2']['city_name_max']}. Die Durchschnittstemperatur liegt am {data['next_2']['weekday']} bei {data['next_2']['average_temp']} Grad. ")

    next_3 = (f"Am {data['next_3']['weekday']} {data['next_3']['common_code']}.  "
              f"Die Temperaturen liegen zwischen {data['next_3']['min_temp']} Grad {data['next_3']['city_name_min']} und {data['next_3']['max_temp']} Grad. "
              f"{data['next_3']['city_name_max']}. Die Durchschnittstemperatur liegt am {data['next_3']['weekday']} bei {data['next_3']['average_temp']} Grad. ")

    # three_days
    text.append(f"{next_1} {next_2} {next_3}")

    out = []
    for idx, x in enumerate(text):
        tts = gTTS(x, lang='de')
        out.append(resources.new_temp_resource_path(pipeline_id, "mp3"))
        tts.save(out[idx])

    return out
