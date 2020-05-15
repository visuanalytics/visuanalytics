# Autor: Tanja
#
# TODO: NOCH NICHT VOLLSTÄNDIG! NUR DEMO-VERSION
# TODO: Vielleicht das Modul in "speech" umbenennen
# Zur Vervollständigung werden weitere Module und das Dictionary mit den Daten der API und verarbeiteten Daten benötigt.
"""
Generierung einer Audiodatei des Wetterberichts mit vorverarbeiteten Daten aus der Weatherbit-API.
In DATA sind aktuell nur Beispielwerte abgespeichert.
"""

import os
import os.path
import datetime
import time
#from analytics.processing.util.date_time import date_to_weekday
#from dateandtime.time_to_text import time_change_format
#from wind_data import wind_data_to_text
#from cities_descriptions import random_city_descriptions
#from weather_descriptions import random_weather_descriptions
from visuanalytics.analytics.util import resources
from gtts import gTTS


def first_weatherforecast_text_to_speech(data):
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
                "next_1": {"weekday": "Freitag","max_temp": " 17 Grad ", "city_name_max": " in Hamburg ", "code_max": " ist mit Gewittern zu rechnen ",
                                                "min_temp": " 12 Grad ", "city_name_min": " in Bremen ", "code_min": " ist mit Schneefall zu rechnen ",
                                                "avg_temp": " 15 Grad "},
                "next_2": {"weekday": "Samstag","max_temp": " 17 Grad ", "city_name_max": " in Saarbrücken ", "code_max": " ist mit Gewittern zu rechnen ",
                                                "min_temp": " 12 Grad ", "city_name_min": " in Kiel ", "code_min": " ist mit Gewittern zu rechnen ",
                                                "avg_temp": " 15 Grad "},
                "next_3": {"weekday": "Sonntag","max_temp": " 17 Grad ", "city_name_max": " in Berlin ", "code_max": " ist mit Gewittern zu rechnen ",
                                                "min_temp": " 12 Grad ", "city_name_min": " in Garmisch-Partenkirchen ", "code_min": " ist mit Gewittern zu rechnen ",
                                                "avg_temp": " 15 Grad "},
                "data_giessen_today": {"city_name": " in Gießen ", "temp": " 14 Grad ", "wind_cdir_full": " West Südwest ",
                                       "wind_spd": " 0,83 Metern pro Sekunde ", "sunset_ts": " 20 Uhr 55 ", "sunrise_ts": " 5 Uhr 55 ", "code": " kommt es zu klarem Himmel "}}
    text = first_weatherforecast_text_to_speech(data_for_text)
    print(text)
    """
    today = (
        f"Am heutigen {data['today']['weekday']} {data['today']['code_max']} {data['today']['city_name_max']} "
        f"und {data['today']['city_name_min']} {data['today']['code_min']}. "
        f"Die Temperaturen liegen zwischen {data['today']['min_temp']} {data['today']['city_name_min']} "
        f"und {data['today']['max_temp']} {data['today']['city_name_max']}. "
        f"{data['data_giessen_today']['city_name']} {data['data_giessen_today']['code']}. "
        f"Der Wind kommt aus Richtung {data['data_giessen_today']['wind_cdir_full']} "
        f"mit einer Geschwindigkeit von {data['data_giessen_today']['wind_spd']}. "
        f"Die Durchschnittstemperatur liegt heute bei {data['data_giessen_today']['temp']}. Die Sonne geht gegen "
        f"{data['data_giessen_today']['sunset_ts']} unter und geht am {data['next_1']['weekday']} um {data['data_giessen_today']['sunrise_ts']} "
        f"wieder auf. ")
    next_1 = (
        f"Am {data['next_1']['weekday']} {data['next_1']['code_max']} {data['next_1']['city_name_max']} "
        f"und {data['next_1']['city_name_min']} {data['next_1']['code_min']}. "
        f"Die Temperaturen liegen zwischen {data['next_1']['min_temp']} {data['next_1']['city_name_min']} "
        f"und {data['next_1']['max_temp']} {data['next_1']['city_name_max']}. ")
    next_2 = (
        f"Am {data['next_2']['weekday']} werden {data['next_2']['city_name_max']} Temperaturen von {data['next_2']['max_temp']} "
        f"erreicht. {data['next_2']['city_name_max']} {data['next_2']['code_max']}. "
        f"{data['next_2']['city_name_min']} {data['next_2']['code_min']}. Die Temperaturen erreichen dort bis zu "
        f"{data['next_2']['min_temp']}. ")
    next_3 = (
        f"Am {data['next_3']['weekday']} {data['next_3']['code_max']} {data['next_3']['city_name_max']} "
        f"und {data['next_3']['city_name_min']} {data['next_3']['code_min']}. "
        f"Die Temperaturen liegen zwischen {data['next_3']['min_temp']} {data['next_3']['city_name_min']} "
        f"und {data['next_3']['max_temp']} {data['next_3']['city_name_max']}. ")
    text_full = f"{today} {next_1} {next_2} {next_3}"

    # Quelle: https://stackoverflow.com/questions/13890935/does-pythons-time-time-return-the-local-or-utc-timestamp
    # Quelle: https://www.geeksforgeeks.org/reading-writing-text-files-python/

    # Die Zeilen, in denen eine Datei generiert wird, sind auskommentiert. Es muss erst geklärt werden wie genau diese zwischengespeichert werden sollen.

    ts = time.time()
    timestamp = datetime.datetime.fromtimestamp(ts).strftime('%d%m%Y_%H%M%S')
    file_name_mp3 = "full_weatherforecast_" + timestamp + ".mp3"

    # TODO Path-Module einfügen bzw. zur Hilfe nehmen, um die .mp3-Dateien temporär zu speichern

    tts = gTTS(text_full, lang='de')
    tts.save(resources.get_resource_path("temp/weather/" + file_name_mp3))
    return text_full
