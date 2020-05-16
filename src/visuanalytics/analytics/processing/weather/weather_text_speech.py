# Autor: Tanja
#
# TODO: NOCH NICHT VOLLSTÄNDIG! NUR DEMO-VERSION
# TODO: Vielleicht das Modul in "speech" umbenennen
# Zur Vervollständigung werden weitere Module und das Dictionary mit den Daten der API und verarbeiteten Daten benötigt.
"""
Generierung einer Audiodatei des Wetterberichts mit vorverarbeiteten Daten aus der Weatherbit-API.
In DATA sind aktuell nur Beispielwerte abgespeichert.
"""

import datetime
import time
from visuanalytics.analytics.util import resources
from visuanalytics.analytics.preprocessing.weather import get_data
from gtts import gTTS


def first_weatherforecast_text_to_speech(data_for_text):
    """Generiert eine Textvorlage für einen Wetterbericht: Heute und 3-Tage-Vorhersage als Audio-Datei.

    Es wird jeweils ein Text für die Wettervorhersage für heute und die drei darauffolgenden Tage erstellt.
    Die Sätze werden aus Satzteilen zusammengesetzt, die von den Modulen cities_descriptions,
    weather_descriptions, air_data_to_text, wind_data_to_text, date_to_weekday und time_to_text
    generiert werden.

    :param days: Liste mit 4 aufeinanderfolgenden Wochentagen
            -> weitere Infos von der API: Wird noch eingefügt
    :return: text_full

    Example:
    data_for_text = {"today": {"weekday": "Donnerstag","max_temp": " 17 Grad ", "city_name_max": " in Gießen ", "code_max": " kommt es zu einem Mix aus Sonne und Wolken ",
                                                   "min_temp": " 12 Grad ", "city_name_min": " in Kiel ", "code_min": " ist mit Gewittern zu rechnen ",
                                                    "avg_temp": " 15 Grad "},
                "tomorrow": {"weekday": "Freitag","max_temp": " 17 Grad ", "city_name_max": " in Gießen ", "code_max": " kommt es zu einem Mix aus Sonne und Wolken ",
                                                   "min_temp": " 12 Grad ", "city_name_min": " in Kiel ", "code_min": " ist mit Gewittern zu rechnen ",
                                                    "avg_temp": " 15 Grad "},
                "next_1": {"weekday": "Samstag","max_temp": " 17 Grad ", "city_name_max": " in Hamburg ", "code_max": " ist mit Gewittern zu rechnen ",
                                                "min_temp": " 12 Grad ", "city_name_min": " in Bremen ", "code_min": " ist mit Schneefall zu rechnen ",
                                                "avg_temp": " 15 Grad "},
                "next_2": {"weekday": "Sonntag","max_temp": " 17 Grad ", "city_name_max": " in Saarbrücken ", "code_max": " ist mit Gewittern zu rechnen ",
                                                "min_temp": " 12 Grad ", "city_name_min": " in Kiel ", "code_min": " ist mit Gewittern zu rechnen ",
                                                "avg_temp": " 15 Grad "},
                "next_3": {"weekday": "Montag","max_temp": " 17 Grad ", "city_name_max": " in Berlin ", "code_max": " ist mit Gewittern zu rechnen ",
                                                "min_temp": " 12 Grad ", "city_name_min": " in Garmisch-Partenkirchen ", "code_min": " ist mit Gewittern zu rechnen ",
                                                "avg_temp": " 15 Grad "},
                "data_giessen_today": {"city_name": " in Gießen ", "temp": " 14 Grad ", "wind_cdir_full": " West Südwest ",
                                       "wind_spd": " 0,83 Metern pro Sekunde ", "sunset_ts": " 20 Uhr 55 ", "sunrise_ts": " 5 Uhr 55 ", "code": " kommt es zu klarem Himmel "}}
    text = first_weatherforecast_text_to_speech(data_for_text)
    print(text)

    data_for_text = {"weekday": {}, "today_icons": {}, "today_temperature": {}, "tomorrow_icons" {}, "tomorrow_temperature": {}, "three_days": {}}
    """
    data = get_data.add_data_together(data_for_text)
    # Erstellen der Texte für die Audiodateien mithilfe der Daten aus data_for_text
    # TODO data_for_text generieren
    today_weather = (
        f"Am heutigen {data['today']['weekday']} {data['today']['code_max']} {data['today']['city_name_max']}. "
        f"{data['today']['city_name_min']} {data['today']['code_min']}. ")
    today_temp = (
        f"Die Temperaturen liegen zwischen {data['today']['temp_min']} {data['today']['city_name_min']} "
        f"und {data['today']['temp_max']} {data['today']['city_name_max']}. "
        f"Die Durchschnittstemperatur liegt heute bei {data['today']['temp_avg']}. ")
    tomorrow_weather = (
        f"Am heutigen {data['tomorrow']['weekday']} {data['tomorrow']['code_min']} {data['tomorrow']['city_name_min']}. "
        f"{data['tomorrow']['city_name_max']} {data['tomorrow']['code_max']}. ")
    tomorrow_temp = (
        f"Die Temperaturen liegen zwischen {data['tomorrow']['temp_min']} {data['tomorrow']['city_name_min']} "
        f"und {data['tomorrow']['temp_max']} {data['tomorrow']['city_name_max']}. "
        f"Die Durchschnittstemperatur liegt heute bei {data['tomorrow']['temp_avg']}. ")
    next_1 = (
        f"Am {data['next_1']['weekday']} {data['next_1']['code_min']}.  "
        f"Die Temperaturen liegen zwischen {data['next_1']['temp_min']} und {data['next_1']['temp_max']}. "
        f"Die Durchschnittstemperatur liegt bei {data['next_1']['temp_avg']}. ")
    next_2 = (
        f"Am {data['next_2']['weekday']} {data['next_2']['common_code']}.  "
        f"Die Temperaturen liegen zwischen {data['next_2']['temp_min']} und {data['next_2']['temp_max']}. "
        f"Die Durchschnittstemperatur liegt bei {data['next_2']['temp_avg']}. ")
    next_3 = (
        f"Am {data['next_3']['weekday']} {data['next_3']['common_code']}.  "
        f"Die Temperaturen liegen zwischen {data['next_3']['temp_min']} und {data['next_3']['temp_max']}. "
        f"Die Durchschnittstemperatur liegt bei {data['next_3']['temp_avg']}. ")
    three_days = f"{next_1} {next_2} {next_3}"

    # Create timestamp for the filenames
    ts = time.time()
    timestamp = datetime.datetime.fromtimestamp(ts).strftime('%d%m%Y_%H%M%S')

    # create the .mp3 filenames
    file_name_today_weather_mp3 = resources.get_resource_path("temp/weather/" + "today_weather_" + timestamp + ".mp3")
    file_name_today_temp_mp3 = resources.get_resource_path("temp/weather/" + "today_temp_" + timestamp + ".mp3")
    file_name_tomorrow_weather_mp3 = resources.get_resource_path("temp/weather/" + "tomorrow_weather_" + timestamp + ".mp3")
    file_name_tomorrow_temp_mp3 = resources.get_resource_path("temp/weather/" + "tomorow_temp_" + timestamp + ".mp3")
    file_name_three_days_mp3 = resources.get_resource_path("temp/weather/" + "three_days_" + timestamp + ".mp3")

    # Quelle: https://stackoverflow.com/questions/13890935/does-pythons-time-time-return-the-local-or-utc-timestamp

    # die generierten .mp3 Dateien werden in resources/temp/weather zwischengespeichert

    tts_1 = gTTS(today_weather, lang='de')
    tts_1.save(file_name_today_weather_mp3)

    tts_2 = gTTS(today_temp, lang='de')
    tts_2.save(file_name_today_temp_mp3)

    tts_3 = gTTS(tomorrow_weather, lang='de')
    tts_3.save(file_name_tomorrow_weather_mp3)

    tts_4 = gTTS(tomorrow_temp, lang='de')
    tts_4.save(file_name_tomorrow_temp_mp3)

    tts_5 = gTTS(three_days, lang='de')
    tts_5.save(file_name_three_days_mp3)

    return

