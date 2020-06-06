"""
Funktionen zum Umwandeln der Daten aus der API in Teile eines Wetterberichts.

In diesem Modul findet man verschiedene Methoden, die Werte aus der API umwandeln können. Diese werden dann so
verarbeitet, dass sie am Ende ein String sind mit ggf. Information darüber, welche Einheit der Wert hat. (Beispiel:
ist rh=48. Ausgabe: "48 Prozent".)

Des Weiteren beinhaltet dieses Modul zwei global definierte Variablen, die in Methoden in diesem Modul verwendet werden:
- WEATHER_DESCRIPTIONS: Dictionary mit verschiedenen Beschreibungen des Wetters anhand eines Codes.
:func:`random_weather_descriptions`: Sucht eine Beschreibung für einen bestimmten Wetter-Code als String aus und
gibt diesen zurück.
- CITY_DESCRIPTIONS: Dictionary mit key:value <Stadtname>: "in <Stadtname>".
:func:`city_name_to_text`: Sucht eine Beschreibung für eine bestimmte Stadt als String aus und
gibt diesen zurück.

Die Methoden get_data_today_tomorrow_three, merge_data und merge_data_single bereiten die Daten vor, welche
anschließend als Rückgabeparameter ein Dictionary zurückgeben. Die Dictionaries aus merge_data und merge_data_single
erstellen die Dictionaries, die in processing/weather/speech/get_all_audios_germany und
processing/weather/speech_single/get_all_audios_single_city benötigt werden, um Audiodateien für Wetterberichte
(deutschlandweit und bezogen auf eine bestimmte Stadt) zu erstellen.
"""
from numpy import random

from visuanalytics.analytics.preprocessing.weather import transform
from visuanalytics.analytics.util import date_time


def pres_data_to_text(pres):
    """Wandelt die von der Weatherbit-API gegebenen Werte pres in Text um.

    Der Ausgabeparameter dient später der flüssigeren Wiedergabe des Textes als Audiodatei.

    :param pres: Luftdruck in mbar (Millibar) (Wert aus der Weatherbit-API bzw. Dictionary aus
        preprocessing/weather/transform/preprocess_weather_data)
    :type pres: float
    :return: String mit z.B. "0,83 Millibar"
    :rtype: str

    Example:
        pres = 0.83
        p = air_data_to_text(pres)
        print(pres)
    """
    pres_replace = str(pres).replace(".", ",")
    pres_text = f"{pres_replace} Millibar"
    return pres_text


def percent_to_text(value):
    """Wandelt Zahlenwerte, die in Prozent angegeben sind, in Text um.

    Der Ausgabeparameter dient später der flüssigeren Wiedergabe des Textes als Audiodatei.

    :param value: ein Wert in % (Prozent) z.B. Niederschlagswahrscheinlichkeit oder relative Luftfeuchtigkeit
        (Wert aus der Weatherbit-API bzw. Dictionary aus preprocessing/weather/transform/preprocess_weather_data)
    :type value: int
    :return: String mit z.B. "58 Prozent"
    :rtype: str

    Example:
        value = 58
        value_p = percent_to_text(value)
        print(value_p)
    """
    to_text = f"{str(value)} Prozent"
    return to_text


def wind_cdir_full_data_to_text(wind_cdir_full):
    """Wandelt die Windrichtung so um, dass sie flüssig vorgelesen werden kann.

    Dieser Eingabeparameter ist ein Wert aus der Weatherbit-API bzw. aus dem Dictionary, welches in
    preprocessing/weather/transform/preprocess_weather_data erstellt wurde.
    Im Dictionary directions_dictionary sind die englischen Wörter für die Himmelsrichtungen auf zwei verschiedene
    Weisen auf Deutsch übersetzt. Die Übersetzungen dienen später der flüssigeren Wiedergabe des Textes als Audiodatei.

    :param wind_cdir_full: Angabe der Windrichtung Beispiel: west-southwest (Wert aus der Weatherbit-API bzw. Dictionary
        aus preprocessing/weather/transform/preprocess_weather_data)
    :type wind_cdir_full: str
    :return: Windrichtung -> String mit z.B. "West Südwest"
    :rtype: str

    Example:
        wind_cdir_full = "west-southwest"
        wind_cdir_full = wind_data_to_text(wind_cdir_full)
        print(wind_cdir_full)
    """
    directions_dictionary = {
        "west": {0: "West", 1: "westlich", 2: "Westen"},
        "southwest": {0: "Südwest", 1: "südwestlich", 2: "Südwesten"},
        "northwest": {0: "Nordwest", 1: "nordwestlich", 2: "Nordwesten"},
        "south": {0: "Süd", 1: "südlich", 2: "Süden"},
        "east": {0: "Ost", 1: "östlich", 2: "Osten"},
        "southeast": {0: "Südost", 1: "südöstlich", 2: "Südosten"},
        "northeast": {0: "Nordost", 1: "nordöstlich", 2: "Nordosten"},
        "north": {0: "Nord", 1: "nördlich", 2: "Norden"}
    }
    if wind_cdir_full.find("-") != -1:
        wind_cdir = wind_cdir_full.split("-")
        wind_1 = wind_cdir[0]
        wind_2 = wind_cdir[1]
        wind_direction_1 = directions_dictionary[wind_1][0]
        wind_direction_2 = directions_dictionary[wind_2][0]
        wind_direction_text = f"{wind_direction_1} {wind_direction_2}"
    else:
        wind_direction_text = f"{directions_dictionary[wind_cdir_full][2]}"
    return wind_direction_text


def wind_spd_data_to_text(wind_spd):
    """Wandelt die Windgeschwindigkeit so um, dass sie flüssig vorgelesen werden können.

    Dieser Eingabeparameter ist ein Wert aus der Weatherbit-API bzw. aus dem Dictionary, welches in
    preprocessing/weather/transform/preprocess_weather_data erstellt wurde.
    Die Umwandlung in einen Satzteil in einem String dient später der flüssigeren Wiedergabe des Textes als Audiodatei.

    :param wind_spd: Angabe der Windgeschwindigkeit in m/s (Wert aus der Weatherbit-API bzw. Dictionary aus
        preprocessing/weather/transform/preprocess_weather_data)
    :type wind_spd: float
    :return: Windrichtung -> String mit z.B. "0,83 Metern pro Sekunde"
    :rtype: str

    Example:
        wind_spd = 0.827464
        wind_spd = wind_data_to_text(wind_spd)
        print(wind_spd)
    """
    wind_spd_text = str(round(wind_spd, 2)).replace(".", ",") + " Metern pro Sekunde"
    return wind_spd_text


WEATHER_DESCRIPTIONS = {
    "200": {0: "kommt es zu Gewittern mit leichtem Regen",
            1: "ist mit Gewitter und leichtem Regen zu rechnen",
            2: "Gewitter"},
    "201": {0: "kommt es zu Gewittern mit Regen",
            1: "ist mit Gewitter und Regen zu rechnen",
            2: "Gewitter"},
    "202": {0: "kommt es zu Gewittern mit starkem Regen",
            1: "ist mit Gewitter und starkem Regen zu rechnen",
            2: "Gewitter"},
    "230": {0: "kommt es zu Gewittern mit leichtem Nieselregen",
            1: "ist mit Gewitter und leichtem Nieselregen zu rechnen",
            2: "Gewitter"},
    "231": {0: "kommt es zu Gewittern mit Nieselregen",
            1: "ist mit Gewitter und Nieselregen zu rechnen",
            2: "Gewitter"},
    "232": {0: "kommt es zu Gewittern mit starkem Nieselregen",
            1: "ist mit Gewitter und starkem Nieselregen zu rechnen",
            2: "Gewitter"},
    "233": {0: "kommt es zu Gewittern mit Hagel",
            1: "ist mit Gewitter und Hagel zu rechnen",
            2: "Gewitter"},
    "300": {0: "kommt es zu leichtem Nieselregen",
            1: "ist mit leichtem Nieselregen zu rechnen",
            2: "regnerisch"},
    "301": {0: "kommt es zu Nieselregen",
            1: "ist mit Nieselregen zu rechnen",
            2: "Nieselregen"},
    "302": {0: "kommt es zu starkem Nieselregen",
            1: "ist mit starkem Nieselregen zu rechnen",
            2: "regnerisch"},
    "500": {0: "kommt es zu leichtem Regen",
            1: "ist es leicht regnerisch",
            2: "Regen"},
    "501": {0: "kommt es zu mäßigem Regen",
            1: "ist es regnerisch",
            2: "Regen"},
    "502": {0: "kommt es zu starkem Regen",
            1: "ist es stark regnerisch",
            2: "Regen"},
    "511": {0: "kommt es zu Eisregen",
            1: "ist mit Eisregen zu rechnen",
            2: "Eisregen"},
    "520": {0: "kommt es zu leichtem Regenschauer",
            1: "ist mit leichten Regenschauern zu rechnen",
            2: "Regenschauer"},
    "521": {0: "kommt es zu Regenschauer",
            1: "ist mit Regenschauern zu rechnen",
            2: "Regenschauer"},
    "522": {0: "kommt es zu starkem Regenschauer",
            1: "ist mit starken Regenschauern zu rechnen",
            2: "Regenschauer"},
    "600": {0: "kommt es zu leichtem Schneefall",
            1: "ist mit leichtem Schneefall zu rechnen",
            2: "Schnee"},
    "601": {0: "kommt es zu Schnee",
            1: "ist mit Schnee zu rechnen",
            2: "Schnee"},
    "602": {0: "kommt es zu starkem Schneefall",
            1: "ist mit starkem Schneefall zu rechnen",
            2: "Schnee"},
    "610": {0: "kommt es zu einem Mix aus Schnee und Regen",
            1: "ist mit einem Mix aus Schnee und Regen zu rechnen",
            2: "Schnee"},
    "611": {0: "kommt es zu Schneeregen",
            1: "ist mit Schneeregen zu rechnen",
            2: "Schneeregen"},
    "612": {0: "kommt es zu starkem Schneeregen",
            1: "ist mit starkem Schneeregen zu rechnen",
            2: "Schneeregen"},
    "621": {0: "kommt es zu Schneeschauer",
            1: "ist mit Schneeschauern zu rechnen",
            2: "Schneeschauer"},
    "622": {0: "kommt es zu starkem Schneeschauer",
            1: "ist mit starken Schneeschauern zu rechnen",
            2: "Schneeschauer"},
    "623": {0: "kommt es zu Windböen",
            1: "ist mit Windböen zu rechnen",
            2: "windig"},
    "700": {0: "kommt es zu Nebel",
            1: "ist mit Nebel zu rechnen",
            2: "nebelig"},
    "711": {0: "kommt es zu Nebel",
            1: "ist mit Nebel zu rechnen",
            2: "nebelig"},
    "721": {0: "kommt es zu Dunst",
            1: "ist mit Nebel zu rechnen",
            2: "nebelig"},
    "731": {0: "kommt es zu Staub in der Luft",
            1: "ist mit Staub in der Luft zu rechnen",
            2: "staubig"},
    "741": {0: "kommt es zu Nebel",
            1: "ist mit Nebel zu rechnen",
            2: "nebelig"},
    "751": {0: "kommt es zu Eisnebel",
            1: "ist mit Eisnebel zu rechnen",
            2: "Eisnebel"},
    "800": {0: "ist der Himmel klar",
            1: "wird es heiter mit klarem Himmel",
            2: "heiter"},
    "801": {0: "sind nur wenige Wolken am Himmel",
            1: "ist es leicht bewölkt",
            2: "leicht bewölkt"},
    "802": {0: "sind vereinzelte Wolken am Himmel",
            1: "ist es vereinzelt bewölkt",
            2: "leicht bewölkt"},
    "803": {0: "ist es bewölkt, vereinzelt kommt die Sonne durch",
            1: "ist es bewölkt, vereinzelt kommt die Sonne durch",
            2: "leicht bewölkt"},
    "804": {0: "kommt es zu bedecktem Himmel",
            1: "ist es bewölkt",
            2: "bewölkt"},
    "900": {0: "kommt es zu unbekanntem Niederschlag",
            1: "ist mit unbekanntem Niederschlag zu rechnen",
            2: "unbekannt"}
}


def random_weather_descriptions(code):
    """Nimmt den Code vom Wetter-Icon aus der Weatherbit-API und generiert einen Satzteil als String.

    Innerhalb des Moduls wird der Code vom Wetter-Icon in einen String umgewandelt und im Dictionary
    weather_descriptions nachgeschaut, welcher Satzteil dazugehört. Es sind mehrere Satzteile pro
    Code möglich, daher wird mit der random-Funktion einer der möglichen Satzteile ausgesucht und als
    String ausgegeben. Dieser Satzteil wird ein Teil des späteren Wetterberichts (.txt-Datei), welcher
    dann in eine Audio-Datei umgewandelt wird.

    :param code: Wetter-Icon aus der Weatherbit-API, z.B. 501 als Integer. (Wert aus der Weatherbit-API bzw. Dictionary
        aus preprocessing/weather/transform/preprocess_weather_data)
    :type code: int
    :return text_weather: String. Wird am Ende als Beschreibung zum Wetter als Satzteil in den Wetterbericht eingebaut.
    :rtype: str

    Example:
        code = 601
        text = random_weather_descriptions(code)
        print(f"In Berlin {text}. ")
    """

    icon_code = str(code)
    x = random.choice([0, 1])
    text_weather = str(WEATHER_DESCRIPTIONS[icon_code][x])
    return text_weather


CITY_NAMES = {
    "Berlin": "in Berlin",
    "Bremen": "in Bremen",
    "Dresden": "in Dresden",
    "Düsseldorf": "in Düsseldorf",
    "Frankfurt": "in Frankfurt am Main",
    "Gießen": "in Gießen",
    "Hamburg": "in Hamburg",
    "Hannover": "in Hannover",
    "Kiel": "in Kiel",
    "Konstanz": "in Konstanz am Bodensee",
    "München": "in München",
    "Nürnberg": "in Nürnberg",
    "Saarbrücken": "in Saarbrücken",
    "Schwerin": "in Schwerin",
    "Stuttgart": "in Stuttgart",
    "Leipzig": "in Lepzig",
    "Magdeburg": "in Magdeburg",
    "Mainz": "in Mainz",
    "Regensburg": "in Regensburg"
}


def city_name_to_text(city_name):
    """Gibt eine Stadt aus.

    Um die Texte des Wetterberichts automatisch zu generieren und sie trotzdem nicht immer gleich aussehen, wird
    hier das Dictionary CITY_DESCRIPTIONS verwendet mit verschiedenen Beschreibungen zu einer Stadt. Dies kann ganz
    normal der Name der Stadt sein oder zum Beispiel die Lage der Stadt in Deutschland. Mithilfe der Random-Funktion
    wird eine dieser Beschreibungen ausgewählt und später im Text des Wetterberichts eingefügt.

    :param city_name: Die von der Weatherbit-API ausgegebene Stadt. (Wert aus der Weatherbit-API bzw. Dictionary aus
        preprocessing/weather/transform/preprocess_weather_data)
    :type city_name: str
    :return text_city: Gibt eine Stadt aus und setzt ein "in " davor.
    :rtype: str

    Example:
        city_name = "Schwerin"
        x = random_city_descriptions(city_name)
        print(f"{x} scheint am Donnerstag die Sonne.")
    """
    text_city = str(CITY_NAMES[city_name])
    return text_city


def get_data_today_tomorrow_three(data):
    """Erstellt ein Dictionary mithilfe der Methoden aus preprocessing/weather/transform und preprocessing/weather/speech.

    In dieser Methode werden 5 Dictionaries (für jeden Tag der Wettervorhersage eins) erstellt, welche Teil eines
    Dictionaries werden, welches in merge_data erstellt wird.

    :param data: Dictionary aus preprocessing/weather/transform/preprocess_weather_data
    :type data: dict
    :return: Dictionary mit relevanten Wetterdaten für eine 5-Tage-Deutschland-Wettervorhersage.
    :rtype: dict
    """
    data_lowest_and_highest_max_and_min = {}
    for i in range(5):
        cities_max_temp = transform.get_cities_max_temp(data, i)
        city_highest_max = city_name_to_text(cities_max_temp[0])
        city_lowest_max = city_name_to_text(cities_max_temp[3])
        code_highest_max = random_weather_descriptions(cities_max_temp[2])
        code_lowest_max = random_weather_descriptions(cities_max_temp[5])
        temp_highest_max = str(cities_max_temp[1])
        temp_lowest_max = str(cities_max_temp[4])
        temp_min = transform.get_city_with_min_temp(data, i)
        data_lowest_and_highest_max_and_min.update(
            {i: {"city_highest_max": city_highest_max, "temp_highest_max": temp_highest_max,
                 "code_highest_max": code_highest_max, "city_lowest_max": city_lowest_max,
                 "temp_lowest_max": temp_lowest_max, "code_lowest_max": code_lowest_max,
                 "city_min_temp": city_name_to_text(temp_min[0]), "min_temp": temp_min[1],
                 "code_min_temp": temp_min[2]}})
    return data_lowest_and_highest_max_and_min


def merge_data(data, weekdays_for_dict):
    """ Zusammenführen der deutschlandweiten Wetterdaten für 5 Tage zu einem Dictionary mit Satzteilen.

    Dieses Dictionary wird mithilfe der Dictionaries aus get_data_today_tomorrow_three() und weiteren Methonden erstellt.

    :param data: Dictionary mit ausgewählten Daten aus der Weatherbit-API (erstellt in der Methode
        preprocess_weather_data in preprocessing/weather/transform.py)
    :type data: dict
    :param weekdays_for_dict: Liste bestehend aus den nächsten 5 Wochentagen (Montag, Dienstag ... etc)
    :type weekdays_for_dict: list
    :return: Dictionary aus relevanten Daten für einen deutschlandweiten Wetterbericht
    :rtype: dict
    """
    data_for_text = {}
    common_code = transform.get_common_code_per_day(data)
    data_lowest_and_highest_max_and_min = get_data_today_tomorrow_three(data)
    data_for_text.update({"today": {"weekday": weekdays_for_dict[0],
                                    "common_code": common_code[0],
                                    "city_highest_max": data_lowest_and_highest_max_and_min[0]["city_highest_max"],
                                    "temp_highest_max": data_lowest_and_highest_max_and_min[0]["temp_highest_max"],
                                    "code_highest_max": data_lowest_and_highest_max_and_min[0]["code_highest_max"],
                                    "city_lowest_max": data_lowest_and_highest_max_and_min[0]["city_lowest_max"],
                                    "temp_lowest_max": data_lowest_and_highest_max_and_min[0]["temp_lowest_max"],
                                    "code_lowest_max": data_lowest_and_highest_max_and_min[0]["code_lowest_max"],
                                    "city_min_temp": data_lowest_and_highest_max_and_min[0]["city_min_temp"],
                                    "min_temp": data_lowest_and_highest_max_and_min[0]["min_temp"],
                                    "code_min_temp": data_lowest_and_highest_max_and_min[0]["code_min_temp"]}})
    data_for_text.update({"tomorrow": {"weekday": weekdays_for_dict[1],
                                       "common_code": common_code[1],
                                       "city_highest_max": data_lowest_and_highest_max_and_min[1]["city_highest_max"],
                                       "temp_highest_max": data_lowest_and_highest_max_and_min[1]["temp_highest_max"],
                                       "code_highest_max": data_lowest_and_highest_max_and_min[1]["code_highest_max"],
                                       "city_lowest_max": data_lowest_and_highest_max_and_min[1]["city_lowest_max"],
                                       "temp_lowest_max": data_lowest_and_highest_max_and_min[1]["temp_lowest_max"],
                                       "code_lowest_max": data_lowest_and_highest_max_and_min[1]["code_lowest_max"],
                                       "city_min_temp": data_lowest_and_highest_max_and_min[1]["city_min_temp"],
                                       "min_temp": data_lowest_and_highest_max_and_min[1]["min_temp"],
                                       "code_min_temp": data_lowest_and_highest_max_and_min[1]["code_min_temp"]}})
    data_for_text.update({"next_1": {"weekday": weekdays_for_dict[2],
                                     "common_code": common_code[2],
                                     "city_highest_max": data_lowest_and_highest_max_and_min[2]["city_highest_max"],
                                     "temp_highest_max": data_lowest_and_highest_max_and_min[2]["temp_highest_max"],
                                     "code_highest_max": data_lowest_and_highest_max_and_min[2]["code_highest_max"],
                                     "city_lowest_max": data_lowest_and_highest_max_and_min[2]["city_lowest_max"],
                                     "temp_lowest_max": data_lowest_and_highest_max_and_min[2]["temp_lowest_max"],
                                     "code_lowest_max": data_lowest_and_highest_max_and_min[2]["code_lowest_max"],
                                     "city_min_temp": data_lowest_and_highest_max_and_min[2]["city_min_temp"],
                                     "min_temp": data_lowest_and_highest_max_and_min[2]["min_temp"],
                                     "code_min_temp": data_lowest_and_highest_max_and_min[2]["code_min_temp"]}})
    data_for_text.update({"next_2": {"weekday": weekdays_for_dict[3],
                                     "common_code": common_code[3],
                                     "city_highest_max": data_lowest_and_highest_max_and_min[3]["city_highest_max"],
                                     "temp_highest_max": data_lowest_and_highest_max_and_min[3]["temp_highest_max"],
                                     "code_highest_max": data_lowest_and_highest_max_and_min[3]["code_highest_max"],
                                     "city_lowest_max": data_lowest_and_highest_max_and_min[3]["city_lowest_max"],
                                     "temp_lowest_max": data_lowest_and_highest_max_and_min[3]["temp_lowest_max"],
                                     "code_lowest_max": data_lowest_and_highest_max_and_min[3]["code_lowest_max"],
                                     "city_min_temp": data_lowest_and_highest_max_and_min[3]["city_min_temp"],
                                     "min_temp": data_lowest_and_highest_max_and_min[3]["min_temp"],
                                     "code_min_temp": data_lowest_and_highest_max_and_min[3]["code_min_temp"]}})
    data_for_text.update({"next_3": {"weekday": weekdays_for_dict[4],
                                     "common_code": common_code[4],
                                     "city_highest_max": data_lowest_and_highest_max_and_min[4]["city_highest_max"],
                                     "temp_highest_max": data_lowest_and_highest_max_and_min[4]["temp_highest_max"],
                                     "code_highest_max": data_lowest_and_highest_max_and_min[4]["code_highest_max"],
                                     "city_lowest_max": data_lowest_and_highest_max_and_min[4]["city_lowest_max"],
                                     "temp_lowest_max": data_lowest_and_highest_max_and_min[4]["temp_lowest_max"],
                                     "code_lowest_max": data_lowest_and_highest_max_and_min[4]["code_lowest_max"],
                                     "city_min_temp": data_lowest_and_highest_max_and_min[4]["city_min_temp"],
                                     "min_temp": data_lowest_and_highest_max_and_min[4]["min_temp"],
                                     "code_min_temp": data_lowest_and_highest_max_and_min[4]["code_min_temp"]}})
    return data_for_text


def merge_data_single(data, city_name):
    """ Zusammenführen der einzelnen Wetterdaten einer Stadt (5 Tage) zu einem Dictionary mit Satzteilen.

    Diese Methode erstellt ein Dictionary mit allen Wetterdaten der kommenden 5 Tage für eine bestimmte Stadt. Die
    Wetterdaten, die aus der Weatherbit-API kommen, werden in Satzteile umgewandelt. So dass am Ende die Lückentexte in
    processing/weather/speech_single.py gefüllt werden können.

    :param data: Dictionary mit ausgewählten Daten aus der Weatherbit-API (erstellt in der Methode
        preprocess_weather_data in preprocessing/weather/transform.py)
    :type data: dict
    :return: Dictionary aus relevanten Daten für den Wetterbericht einer bestimmten Stadt
    :rtype: dict
    """

    data_list = []
    for day in range(0, 5):
        date_sunset, time_sunset, time_text_sunset = date_time.time_change_format(data[city_name][day]['sunset_ts'])
        date_sunrise, time_sunrise, time_text_sunrise = date_time.time_change_format(data[city_name][day]['sunrise_ts'])
        data_for_text = {"max_temp": f"{str(round(data[city_name][day]['max_temp']))} Grad",
                         "min_temp": f"{str(round(data[city_name][day]['min_temp']))} Grad",
                         "app_max_temp": f"{str(round(data[city_name][day]['app_max_temp']))} Grad",
                         "app_min_temp": f"{str(round(data[city_name][day]['app_min_temp']))} Grad",
                         "wind_cdir_full": wind_cdir_full_data_to_text(data[city_name][day]['wind_cdir_full']),
                         "wind_spd": wind_spd_data_to_text(data[city_name][day]['wind_spd']),
                         "code": random_weather_descriptions(data[city_name][day]['code']),
                         "sunset_ts": time_text_sunset,
                         "sunrise_ts": time_text_sunrise,
                         "rh": percent_to_text(data[city_name][day]['rh']),
                         "pop": percent_to_text(data[city_name][day]['pop'])}
        data_list.append(data_for_text)
    return data_list
