"""
Funktionen zum Umwandelung der Daten aus der API in Teile eines Texts.

Globale Variablen:
- WEATHER_DESCRIPTIONS: Dictionary mit verschiedenen Beschreibungen des Wetters anhand eines Codes.
Funktion: random_weather_descriptions(code): Sucht eine Beschreibung für einen bestimmten Wetter-Code als String aus und
gibt diesen zurück.
- CITY_DESCRIPTIONS: Dictionary mit verschiedenen Beschreibungen einer Stadt.
Funktion: random_city_descriptions(city_name): Sucht eine Beschreibung für eine bestimmte Stadt als String aus und
gibt diesen zurück.
"""
from numpy import random

from visuanalytics.analytics.preprocessing.weather import transform


def air_data_to_text(rh, pres):
    """Wandelt die von der Weatherbit-API gegebenen Werte rh und pres in Text um.

    Diese Eingabeparameter sind Werte aus der Weatherbit-API.
    Die Ausgabeparameter dienen später der flüssigeren Wiedergabe des Textes als Audiodatei.

    :param rh: relative Luftfeuchtigkeit in % (Prozent)
    :param pres: Luftdruck in mbar (Millibar)
    :return: rh_text, pres_text

    Example:
        rh = 58
        pres = 1000.27
        r, p = air_data_to_text(rh, pres)
        print(r)
        print(p)
    """
    rh_text = str(rh) + " Prozent"
    pres_text = str(pres).replace(".", ",") + " Millibar"
    return rh_text, pres_text


def wind_data_to_text(wind_cdir_full, wind_dir, wind_spd):
    """Wandelt alle Winddaten so um, dass sie flüssig vorgelesen werden können.

    Diese Eingabeparameter sind Werte aus der Weatherbit-API.
    Im Dictionary directions_dictionary sind die englischen Wörter für die Himmelsrichtungen auf zwei verschiedene
    Weisen auf Deutsch übersetzt. Die Übersetzungen dienen später der flüssigeren Wiedergabe des Textes als Audiodatei.

    :param wind_cdir_full: Angabe der Windrichtung Beispiel: west-southwest
    :param wind_dir: Angabe der Windrichtung in Grad
    :param wind_spd: Angabe der Windgeschwindigkeit in m/s
    :return: wind_direction, wind_dir_degree, wind_spd_text

    Example:
        wind_cdir_full = "west-southwest"
        wind_dir = 252
        wind_spd = 0.827464
        wind_cdir_full, wind_dir, wind_spd = wind_data_to_text(wind_cdir_full, wind_dir, wind_spd)
        print(wind_cdir_full)
        print(wind_dir)
        print(wind_spd)
    """
    directions_dictionary = {
        "west": {"noun": "West", "adjective": "westlich"},
        "southwest": {"noun": "Südwest", "adjective": "südwestlich"},
        "northwest": {"noun": "Nordwest", "adjective": "nordwestlich"},
        "south": {"noun": "Süd", "adjective": "südlich"},
        "east": {"noun": "Ost", "adjective": "östlich"},
        "southeast": {"noun": "Südost", "adjective": "südöstlich"},
        "northeast": {"noun": "Nordost", "adjective": "nordöstlich"},
        "north": {"noun": "Nord", "adjective": "nördlich"}
    }

    wind_cdir = wind_cdir_full.split("-")
    wind_direction_1 = directions_dictionary[wind_cdir[0]]["noun"]
    wind_direction_2 = directions_dictionary[wind_cdir[1]]["noun"]
    wind_direction_text = wind_direction_1 + " " + wind_direction_2
    wind_dir_degree_text = str(wind_dir) + " Grad"
    wind_spd_text = str(round(wind_spd, 2)).replace(".", ",") + " Metern pro Sekunde"
    return wind_direction_text, wind_dir_degree_text, wind_spd_text


WEATHER_DESCRIPTIONS = {
    "200": {0: "kommt es zu Gewittern mit leichtem Regen",
            1: "ist mit Gewitter und leichtem Regen zu rechnen"},
    "201": {0: "kommt es zu Gewittern mit Regen",
            1: "ist mit Gewitter und Regen zu rechnen"},
    "202": {0: "kommt es zu Gewittern mit starkem Regen",
            1: "ist mit Gewitter und starkem Regen zu rechnen"},
    "230": {0: "kommt es zu Gewittern mit leichtem Nieselregen",
            1: "ist mit Gewitter und leichtem Nieselregen zu rechnen"},
    "231": {0: "kommt es zu Gewittern mit Nieselregen",
            1: "ist mit Gewitter und Nieselregen zu rechnen"},
    "232": {0: "kommt es zu Gewittern mit starkem Nieselregen",
            1: "ist mit Gewitter und starkem Nieselregen zu rechnen"},
    "233": {0: "kommt es zu Gewittern mit Hagel",
            1: "ist mit Gewitter und Hagel zu rechnen"},
    "300": {0: "kommt es zu leichtem Nieselregen",
            1: "ist mit leichtem Nieselregen zu rechnen"},
    "301": {0: "kommt es zu Nieselregen",
            1: "ist mit Nieselregen zu rechnen"},
    "302": {0: "kommt es zu starkem Nieselregen",
            1: "ist mit starkem Nieselregen zu rechnen"},
    "500": {0: "kommt es zu leichtem Regen",
            1: "ist es leicht regnerisch"},
    "501": {0: "kommt es zu mäßigem Regen",
            1: "ist es regnerisch"},
    "502": {0: "kommt es zu starkem Regen",
            1: "ist es stark regnerisch"},
    "511": {0: "kommt es zu Eisregen",
            1: "ist mit Eisregen zu rechnen"},
    "520": {0: "kommt es zu leichtem Regenschauer",
            1: "ist mit leichten Regenschauern zu rechnen"},
    "521": {0: "kommt es zu Regenschauer",
            1: "ist mit Regenschauern zu rechnen"},
    "522": {0: "kommt es zu starkem Regenschauer",
            1: "ist mit starken Regenschauern zu rechnen"},
    "600": {0: "kommt es zu leichtem Schneefall",
            1: "ist mit leichtem Schneefall zu rechnen"},
    "601": {0: "kommt es zu Schnee",
            1: "ist mit Schnee zu rechnen"},
    "602": {0: "kommt es zu starkem Schneefall",
            1: "ist mit starkem Schneefall zu rechnen"},
    "610": {0: "kommt es zu einem Mix aus Schnee und Regen",
            1: "ist mit einem Mix aus Schnee und Regen zu rechnen"},
    "611": {0: "kommt es zu Schneeregen",
            1: "ist mit Schneeregen zu rechnen"},
    "612": {0: "kommt es zu starkem Schneeregen",
            1: "ist mit starkem Schneeregen zu rechnen"},
    "621": {0: "kommt es zu Schneeschauer",
            1: "ist mit Schneeschauern zu rechnen"},
    "622": {0: "kommt es zu starkem Schneeschauer",
            1: "ist mit starken Schneeschauern zu rechnen"},
    "623": {0: "kommt es zu Windböen",
            1: "ist mit Windböen zu rechnen"},
    "700": {0: "kommt es zu Nebel",
            1: "ist mit Nebel zu rechnen"},
    "711": {0: "kommt es zu Nebel",
            1: "ist mit Nebel zu rechnen"},
    "721": {0: "kommt es zu Dunst",
            1: "ist mit Nebel zu rechnen"},
    "731": {0: "kommt es zu Staub in der Luft",
            1: "ist mit Staub in der Luft zu rechnen"},
    "741": {0: "kommt es zu Nebel",
            1: "ist mit Nebel zu rechnen"},
    "751": {0: "kommt es zu Eisnebel",
            1: "ist mit Eisnebel zu rechnen"},
    "800": {0: "ist der Himmel klar",
            1: "wird es heiter mit klarem Himmel"},
    "801": {0: "sind nur wenige Wolken am Himmel",
            1: "ist es leicht bewölkt"},
    "802": {0: "sind vereinzelte Wolken am Himmel",
            1: "ist es vereinzelt bewölkt"},
    "803": {0: "ist die Bewölkung durchbrochen",
            1: "sind durchbrochene Wolken am Himmel"},
    "804": {0: "kommt es zu bedecktem Himmel",
            1: "ist es bewölkt"},
    "900": {0: "kommt es zu unbekanntem Niederschlag",
            1: "ist mit unbekanntem Niederschlag zu rechnen"}
}


def random_weather_descriptions(code):
    """Nimmt den Code vom Wetter-Icon aus der Weatherbit-API und generiert einen Satzteil als String.

    Innerhalb des Moduls wird der Code vom Wetter-Icon in einen String umgewandelt und im Dictionary
    weather_descriptions nachgeschaut, welcher Satzteil dazugehört. Es sind mehrere Satzteile pro
    Code möglich, daher wird mit der random-Funktion einer der möglichen Satzteile ausgesucht und als
    String ausgegeben. Dieser Satzteil wird ein Teil des späteren Wetterberichts (.txt-Datei), welcher
    dann in eine Audio-Datei umgewandelt wird.

    :param code: Wetter-Icon aus der Weatherbit-API, z.B. 501 als Integer.
    :return text_weather: String. Wird am Ende als Beschreibung zum Wetter als Satzteil in den Wetterbericht eingebaut.

    Example:
        code = 601
        text = random_weather_descriptions(code)
        print("In Berlin " + text + ".")
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
    """Gibt eine Beschreibung der Stadt aus.

    Um die Texte des Wetterberichts automatisch zu generieren und sie trotzdem nicht immer gleich aussehen, wird
    hier das Dictionary CITY_DESCRIPTIONS verwendet mit verschiedenen Beschreibungen zu einer Stadt. Dies kann ganz normal der Name
    der Stadt sein oder zum Beispiel die Lage der Stadt in Deutschland. Mithilfe der Random-Funktion wird eine
    dieser Beschreibungen ausgewählt und später im Text des Wetterberichts eingefügt.

    :param city_name: Die von der Weatherbit-API ausgegebene Stadt.
    :return text_city: Gibt eine Stadt oder eine Eigenschaft (wie z.B. Himmelsrichtung) der eingegebenen Stadt als
    Text aus.

    Example:
        city_name = "schwerin"
        x = random_city_descriptions(city_name)
        print(x + " scheint am Donnerstag die Sonne.")
    """
    text_city = str(CITY_NAMES[city_name])
    return text_city


def get_data_today_tomorrow_three(data):
    data_min_max = {}
    for i in range(5):
        city_name_maximum, maximum_temp, code_maximum = transform.get_city_with_max_temp(data, i)
        city_name_minimum, minimum_temp, code_minimum = transform.get_city_with_min_temp(data, i)
        avg_temperatur = transform.get_cities_max_temp(data, i)
        city_name_max = transform.speech.city_name_to_text(city_name_maximum)
        city_name_min = transform.speech.city_name_to_text(city_name_minimum)
        avg_temperatur[0] = transform.speech.city_name_to_text(avg_temperatur[0])
        avg_temperatur[3] = transform.speech.city_name_to_text(avg_temperatur[3])
        code_max = transform.speech.random_weather_descriptions(code_maximum)
        code_min = transform.speech.random_weather_descriptions(code_minimum)
        avg_temperatur[2] = transform.speech.random_weather_descriptions(avg_temperatur[2])
        avg_temperatur[5] = transform.speech.random_weather_descriptions(avg_temperatur[5])
        max_temp = str(maximum_temp)
        min_temp = str(minimum_temp)
        data_min_max.update({i: {"city_name_max": city_name_max, "max_temp": max_temp,
                                 "code_max": code_max, "city_name_min": city_name_min,
                                 "min_temp": min_temp, "code_min": code_min,
                                 "city_name_max_avg": avg_temperatur[0], "max_avg_temp": avg_temperatur[1],
                                 "code_max_avg": avg_temperatur[2], "city_name_min_avg": avg_temperatur[3],
                                 "min_avg_temp": avg_temperatur[4], "code_min_avg": avg_temperatur[5]}})
    return data_min_max


def merge_data(data):
    data_for_text = {}
    weekdays_for_dict = transform.get_weekday(data)
    average_temp, common_code = transform.get_common_code_per_day(data)
    data_min_max = get_data_today_tomorrow_three(data)
    data_for_text.update({"today": {"weekday": weekdays_for_dict["today"],
                                    "average_temp": average_temp[0],
                                    "common_code": common_code[0],
                                    "city_name_max": data_min_max[0]["city_name_max"],
                                    "max_temp": data_min_max[0]["max_temp"],
                                    "code_max": data_min_max[0]["code_max"],
                                    "city_name_min": data_min_max[0]["city_name_min"],
                                    "min_temp": data_min_max[0]["min_temp"],
                                    "code_min": data_min_max[0]["code_min"],
                                    "city_name_max_avg": data_min_max[0]["city_name_max_avg"],
                                    "max_avg_temp": data_min_max[0]["max_avg_temp"],
                                    "code_max_avg": data_min_max[0]["code_max_avg"],
                                    "city_name_min_avg": data_min_max[0]["city_name_min_avg"],
                                    "min_avg_temp": data_min_max[0]["min_avg_temp"],
                                    "code_min_avg": data_min_max[0]["code_min_avg"]}})
    data_for_text.update({"tomorrow": {"weekday": weekdays_for_dict["tomorrow"],
                                       "average_temp": average_temp[1],
                                       "common_code": common_code[1],
                                       "city_name_max": data_min_max[1]["city_name_max"],
                                       "max_temp": data_min_max[1]["max_temp"],
                                       "code_max": data_min_max[1]["code_max"],
                                       "city_name_min": data_min_max[1]["city_name_min"],
                                       "min_temp": data_min_max[1]["min_temp"],
                                       "code_min": data_min_max[1]["code_min"],
                                       "city_name_max_avg": data_min_max[1]["city_name_max_avg"],
                                       "max_avg_temp": data_min_max[1]["max_avg_temp"],
                                       "code_max_avg": data_min_max[1]["code_max_avg"],
                                       "city_name_min_avg": data_min_max[1]["city_name_min_avg"],
                                       "min_avg_temp": data_min_max[1]["min_avg_temp"],
                                       "code_min_avg": data_min_max[1]["code_min_avg"]}})
    data_for_text.update({"next_1": {"weekday": weekdays_for_dict["next_1"],
                                     "average_temp": average_temp[2],
                                     "common_code": common_code[2],
                                     "city_name_max": data_min_max[2]["city_name_max"],
                                     "max_temp": data_min_max[2]["max_temp"],
                                     "code_max": data_min_max[2]["code_max"],
                                     "city_name_min": data_min_max[2]["city_name_min"],
                                     "min_temp": data_min_max[2]["min_temp"],
                                     "code_min": data_min_max[2]["code_min"],
                                     "city_name_max_avg": data_min_max[2]["city_name_max_avg"],
                                     "max_avg_temp": data_min_max[2]["max_avg_temp"],
                                     "code_max_avg": data_min_max[2]["code_max_avg"],
                                     "city_name_min_avg": data_min_max[2]["city_name_min_avg"],
                                     "min_avg_temp": data_min_max[2]["min_avg_temp"],
                                     "code_min_avg": data_min_max[2]["code_min_avg"]}})
    data_for_text.update({"next_2": {"weekday": weekdays_for_dict["next_2"],
                                     "average_temp": average_temp[3],
                                     "common_code": common_code[3],
                                     "city_name_max": data_min_max[3]["city_name_max"],
                                     "max_temp": data_min_max[3]["max_temp"],
                                     "code_max": data_min_max[3]["code_max"],
                                     "city_name_min": data_min_max[3]["city_name_min"],
                                     "min_temp": data_min_max[3]["min_temp"],
                                     "code_min": data_min_max[3]["code_min"],
                                     "city_name_max_avg": data_min_max[3]["city_name_max_avg"],
                                     "max_avg_temp": data_min_max[3]["max_avg_temp"],
                                     "code_max_avg": data_min_max[3]["code_max_avg"],
                                     "city_name_min_avg": data_min_max[3]["city_name_min_avg"],
                                     "min_avg_temp": data_min_max[3]["min_avg_temp"],
                                     "code_min_avg": data_min_max[3]["code_min_avg"]}})
    data_for_text.update({"next_3": {"weekday": weekdays_for_dict["next_3"],
                                     "average_temp": average_temp[4],
                                     "common_code": common_code[4],
                                     "city_name_max": data_min_max[4]["city_name_max"],
                                     "max_temp": data_min_max[4]["max_temp"],
                                     "code_max": data_min_max[4]["code_max"],
                                     "city_name_min": data_min_max[4]["city_name_min"],
                                     "min_temp": data_min_max[4]["min_temp"],
                                     "code_min": data_min_max[4]["code_min"],
                                     "city_name_max_avg": data_min_max[4]["city_name_max_avg"],
                                     "max_avg_temp": data_min_max[4]["max_avg_temp"],
                                     "code_max_avg": data_min_max[4]["code_max_avg"],
                                     "city_name_min_avg": data_min_max[4]["city_name_min_avg"],
                                     "min_avg_temp": data_min_max[4]["min_avg_temp"],
                                     "code_min_avg": data_min_max[4]["code_min_avg"]}})
    return data_for_text
