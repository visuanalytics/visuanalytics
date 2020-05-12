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
from dateandtime.dateandtime import date_to_weekday
from dateandtime.time_to_text import time_change_format
from wind_data import wind_data_to_text
from cities_descriptions import random_city_descriptions
from weather_descriptions import random_weather_descriptions
from gtts import gTTS

# globale Variable: DATA mit Beispielwerten
DATA = {
    "code_1": 501,
    "code_2": 800,
    "code_3": 201,
    "code_4": 601,
    "code_5": 202,
    "city_name_1": "muenchen",
    "city_name_2": "berlin",
    "city_name_3": "frankfurt",
    "city_name_4": "hamburg",
    "city_name_5": "schwerin",
    "wind_cdir_full": "west-southwest",
    "wind_dir": 252,
    "wind_spd": 0.827464,
    "max_temp_1": 18,
    "max_temp_2": 17,
    "max_temp_3": 16,
    "max_temp_4": 19,
    "min_temp_1": 10,
    "min_temp_2": 9,
    "min_temp_3": 8,
    "min_temp_4": 11,
    "temp": 14,
    "sunrise_ts": 1588833718,
    "sunset_ts": 1588823718}


def first_weatherforecast_text_to_speech(days):
    """Generiert eine Textvorlage für einen Wetterbericht: Heute und 3-Tage-Vorhersage als Audio-Datei.

    Es wird jeweils ein Text für die Wettervorhersage für heute und die drei darauffolgenden Tage erstellt.
    Die Sätze werden aus Satzteilen zusammengesetzt, die von den Modulen cities_descriptions,
    weather_descriptions, air_data_to_text, wind_data_to_text, date_to_weekday und time_to_text
    generiert werden.

    :param days: Liste mit 4 aufeinanderfolgenden Wochentagen
            -> weitere Infos von der API: Wird noch eingefügt
    :return: text_full

    Example:
        days = date_to_weekday("2020-05-11")
        text = first_weatherforecast_text_to_speech(days)
        print(text)
    """
    today = (
        f"Am heutigen {days[0]} {random_weather_descriptions(DATA['code_1'])} {random_city_descriptions(DATA['city_name_1'])} "
        f"und {random_city_descriptions(DATA['city_name_2'])} {random_weather_descriptions(DATA['code_2'])}. "
        f"Die Temperaturen liegen zwischen {str(DATA['min_temp_3'])} Grad {random_city_descriptions(DATA['city_name_3'])} "
        f"und {str(DATA['max_temp_4'])} Grad {random_city_descriptions(DATA['city_name_4'])}. "
        f"{random_city_descriptions(DATA['city_name_5'])} {random_weather_descriptions(DATA['code_5'])}. "
        f"Der Wind kommt aus Richtung {wind_data_to_text(DATA['wind_cdir_full'], DATA['wind_dir'], DATA['wind_spd'])[0]} "
        f"mit einer Geschwindigkeit von {wind_data_to_text(DATA['wind_cdir_full'], DATA['wind_dir'], DATA['wind_spd'])[2]}. "
        f"Die Durchschnittstemperatur liegt heute bei {str(DATA['temp'])} Grad. Die Sonne geht gegen "
        f"{time_change_format(DATA['sunset_ts'])[2]} unter und geht am {days[1]} um {time_change_format(DATA['sunrise_ts'])[2]} "
        f"wieder auf. ")
    next_1 = (
        f"Am {days[1]} {random_weather_descriptions(DATA['code_1'])} {random_city_descriptions(DATA['city_name_1'])} "
        f"und {random_city_descriptions(DATA['city_name_2'])} {random_weather_descriptions(DATA['code_2'])}. "
        f"Die Temperaturen liegen zwischen {str(DATA['min_temp_3'])} Grad {random_city_descriptions(DATA['city_name_3'])} "
        f"und {str(DATA['max_temp_4'])} Grad {random_city_descriptions(DATA['city_name_4'])}. ")
    next_2 = (
        f"Am {days[2]} werden {random_city_descriptions(DATA['city_name_1'])} Temperaturen von {str(DATA['max_temp_1'])} "
        f"Grad erreicht. {random_city_descriptions(DATA['city_name_1'])} {random_weather_descriptions(DATA['code_1'])}. "
        f"{random_city_descriptions(DATA['city_name_2'])} {random_weather_descriptions(DATA['code_2'])}. Die Temperaturen erreichen dort bis zu "
        f"{str(DATA['max_temp_2'])} Grad. ")
    next_3 = (
        f"Am {days[3]} {random_weather_descriptions(DATA['code_1'])} {random_city_descriptions(DATA['city_name_1'])} "
        f"und {random_city_descriptions(DATA['city_name_2'])} {random_weather_descriptions(DATA['code_2'])}. "
        f"Die Temperaturen liegen zwischen {str(DATA['min_temp_3'])} Grad {random_city_descriptions(DATA['city_name_3'])} "
        f"und {str(DATA['max_temp_4'])} Grad {random_city_descriptions(DATA['city_name_4'])}. ")
    text_full = f"{today} {next_1} {next_2} {next_3}"

    # Quelle: https://stackoverflow.com/questions/13890935/does-pythons-time-time-return-the-local-or-utc-timestamp
    # Quelle: https://www.geeksforgeeks.org/reading-writing-text-files-python/

    # Die Zeilen, in denen eine Datei generiert wird, sind auskommentiert. Es muss erst geklärt werden wie genau diese zwischengespeichert werden sollen.

    ts = time.time()
    timestamp = datetime.datetime.fromtimestamp(ts).strftime('%d%m%Y_%H%M%S')
    file_name_mp3 = "full_weatherforecast_" + timestamp + ".mp3"

    # TODO Path-Module einfügen bzw. zur Hilfe nehmen, um die .mp3-Dateien temporär zu speichern

    # tts = gTTS(text_full, lang='de')
    # tts.save(file_name_mp3)
    return text_full
