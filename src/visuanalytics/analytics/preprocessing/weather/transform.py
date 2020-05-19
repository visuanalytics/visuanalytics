import statistics

from numpy import random

from visuanalytics.analytics.preprocessing.weather import speech, visualisation
from visuanalytics.analytics.util import date_time, dictionary, statistical

NUM_DAYS = 5
"""
int: Anzahl der Tage, für die die Wettervorhersage von der API bezogen wird.
"""

RELEVANT_DATA = ["datetime", "temp", "low_temp", "min_temp", "high_temp", "max_temp", "app_min_temp", "app_max_temp",
                 "wind_cdir", "wind_dir", "icon", "code", "sunrise_ts", "sunset_ts"]
"""
list: Liste von JSON-Attributen, welche interessant für uns sind und aus den Daten rausgefiltert werden sollen.
"""


def preprocess_weather_data(api_data):
    """
    Wandelt eine Liste von Weatherbit-Forecast-API-Responses in ein Dictionary um, das die für uns relevanten Daten enthält.

    Um die weitere Verarbeitung zu vereinfachen, werden die Wettervorhersage-Daten in dieser Funktionen in eine leichter
    handzuhabende Struktur gebracht. Dazu werden irrelevante Parameter weggelassen und die allgemeine Struktur angepasst.

    :param api_data: Eine Liste von dictionaries, die jeweils eine JSON-Response mit den Wettervorhersage-Daten enthält.
    :type api_data: dict

    :returns:
        Ein Dictionary folgender Struktur:
        {
          "cities" : {
              "muenchen" : [
                {
                  "temp": 10,
                  "temp_high": 15,
                  "temp_low" : 2,
                  "temp_max" : 17,
                  "temp_min" : 0,
                  "app_min_temp": -2.3,
                  "app_max_temp": 18.3,
                  "wind_dir": 252,
                  "icon" : "c02d"
                  "code" : "802",
                  "date_time" :
                  "wind_cdir": "WSW",
                  "wind_dir": 252,
                  "sunrise_ts": 1588823718,
                  "sunset_ts": 1588877925
                },
                ...
              ],
              ...
          },
          "summaries" : [
            {
              "temp_min" : -2,
              "temp_max" : 24,
              "temp_avg" : 11,
              "common_icon" : c02d,
              "common_code" : 802
            },
            ...
          ]
        }
        "cities" enthält zu jeder Stadt vier "Unter-Dictionaries", welche wiederum die Wetterdaten für je einen Tag
        enthalten (insgesamt vier Tage).
        "summaries" enthält für jeden der vier Tage ein Unter-Dictionary, welche die zusammenfassenden Daten für je einen
        Tag enthalten.
    :rtype: dict

    :raises:
        KeyError: Wenn ein Schlüssel nicht im Dictionary enthalten ist. Dies sollte unter normalen Umständen nur
        vorkommen, wenn die Weatherbit-API geändert wird.
    """
    cities = dictionary.combine([_preprocess_single(d) for d in api_data])
    summaries = _summaries(cities)
    return {"cities": cities, "summaries": summaries}


def _preprocess_single(data):
    city = data["city_name"]
    days = data["data"][:NUM_DAYS]
    selected_data = [dictionary.select_pairs(RELEVANT_DATA, dictionary.flatten(d)) for d in days]
    return {city: selected_data}


def _summaries(data):
    days = range(NUM_DAYS)
    avg_temp = [statistics.mean(_get_for_day(i, "max_temp", data)) for i in days]
    min_temp = [min(_get_for_day(i, "min_temp", data)) for i in days]
    max_temp = [max(_get_for_day(i, "max_temp", data)) for i in days]
    icons = [statistical.mode(_get_for_day(i, "icon", data)) for i in days]
    codes = [statistical.mode(_get_for_day(i, "code", data)) for i in days]
    return [{"temp_avg": avg_temp[i],
             "temp_min": min_temp[i],
             "temp_max": max_temp[i],
             "common_icon": icons[i],
             "common_code": codes[i]} for i in days]


def _get_for_day(day, attribute, data):
    days = [data[c][day] for c in data]
    return [d[attribute] for d in days]


def get_weekday(data):
    date = data['cities']['Kiel'][0]['datetime']
    weekdays = date_time.date_to_weekday(date)
    weekdays_for_dict = {"today": weekdays[0], "tomorrow": weekdays[1], "next_1": weekdays[2], "next_2": weekdays[3],
                         "next_3": weekdays[4]}
    return weekdays_for_dict


def get_data_today_tomorrow_three(data):
    data_min_max = {}
    for i in range(5):
        city_name_maximum, maximum_temp, code_maximum = get_city_with_max_temp(data, i)
        city_name_minimum, minimum_temp, code_minimum = get_city_with_min_temp(data, i)
        avg_temperatur = get_city_with_max_min_avg_temp(data, i)
        city_name_max = speech.city_name_to_text(city_name_maximum)
        city_name_min = speech.city_name_to_text(city_name_minimum)
        avg_temperatur[0] = speech.city_name_to_text(avg_temperatur[0])
        avg_temperatur[3] = speech.city_name_to_text(avg_temperatur[3])
        code_max = speech.random_weather_descriptions(code_maximum)
        code_min = speech.random_weather_descriptions(code_minimum)
        avg_temperatur[2] = speech.random_weather_descriptions(avg_temperatur[2])
        avg_temperatur[5] = speech.random_weather_descriptions(avg_temperatur[5])
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
    weekdays_for_dict = get_weekday(data)
    average_temp, common_code = get_average_per_day(data)
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


def get_first_day(data):
    return data['cities']['Kiel'][0]['datetime']


def get_weather_icon(data, location, date_in_future):
    return data['cities'][location][date_in_future]['icon']


def get_weather_temp(data, location, date_in_future):
    temp = round(data['cities'][location][date_in_future]['max_temp'])
    return f"{temp}\u00B0"


def get_max_temp(data, date_in_future):
    max_temp = round(data['summaries'][date_in_future]['temp_max'])
    return f"{max_temp}\u00B0"


def get_min_temp(data, date_in_future):
    min_temp = round(data['summaries'][date_in_future]['temp_min'])
    return f"{min_temp}\u00B0"


def get_city_with_max_temp(data, date_in_future):
    """
    Methode, um aus Dictionary zu einem bestimmten Tag eine Stadt mit der höchsten Temperatur herauszufinden

    :param data: Dictionary, dass in der Methode preprocess_weather_data erstellt wird
    :param date_in_future: Tag in der Zukunft; 0: heute, 1: morgen, 2, übermorgen, 3: überübermorgen, 4: überüberübermorgen
    :return: eine Stadt, die an diesem Tag die Höchsttemperatur hat (wenn mehrere Städte gefunden werden, wird eine zurfällig ausgesucht), die Höchsttemperatur und das zugehörige Icon

    Example:
    city_with_max_temp = get_city_with_max_temp(data, 0)
    print(city_with_max_temp) -> "muenchen", 23, 801
    """

    max_temp = round(data['summaries'][date_in_future]['temp_max'])
    cities_with_max_temp = []
    for city in data['cities']:
        if round(data['cities'][city][date_in_future]['max_temp']) == max_temp:
            cities_with_max_temp.append(city)
    return_city = random.choice(cities_with_max_temp)
    return return_city, max_temp, data['cities'][return_city][date_in_future]['code']


def get_city_with_min_temp(data, date_in_future):
    """
    Methode, um aus Dictionary zu einem bestimmten Tag eine Stadt mit der niedriegsten Temperatur herauszufinden

    :param data: Dictionary, dass in der Methode preprocess_weather_data erstellt wird
    :param date_in_future: Tag in der Zukunft; 0: heute, 1: morgen, 2, übermorgen, 3: überübermorgen, 4: überüberübermorgen
    :return: eine Stadt, die an diesem Tag die Niedrigsttemperatur hat (wenn mehrere Städte gefunden werden, wird eine zurfällig ausgesucht), die Niedrigsttemperatur und das zugrhörige Icon

    Example:
    city_with_max_temp = get_city_with_min_temp(data, 0)
    print(city_with_min_temp) -> "berlin", 19, c02d
    """

    min_temp = round(data['summaries'][date_in_future]['temp_min'])
    cities_with_min_temp = []
    for city in data['cities']:
        if round(data['cities'][city][date_in_future]['min_temp']) == min_temp:
            cities_with_min_temp.append(city)

    return_city = random.choice(cities_with_min_temp)
    return return_city, min_temp, data['cities'][return_city][date_in_future]['code']


def get_city_with_max_min_avg_temp(data, date_in_future):
    """
    Methode, um aus Dictionary zu einem bestimmten Tag eine Stadt mit der höchsten Durchschnittstemperatur herauszufinden

    :param data: Dictionary, dass in der Methode preprocess_weather_data erstellt wird
    :param date_in_future: Tag in der Zukunft; 0: heute, 1: morgen, 2, übermorgen, 3: überübermorgen, 4: überüberübermorgen
    :return: eine Stadt, die an diesem Tag die höchste Durchschnittstemperatur hat (wenn mehrere Städte gefunden werden,
            wird eine zurfällig ausgesucht), die höchste Durchschnittstemperatur und das zugehörige Icon.
            Und eine Stadt, die an diesem Tag die niedrigste Durchschnittstemperatur hat (wenn mehrere Städte gefunden werden,
            wird eine zurfällig ausgesucht), die niedrigste Durchschnittstemperatur und das zugehörige Icon.

    Example:
    [city_name_max_avg, max_avg_temp, code_max_avg, city_name_min_avg, min_avg_temp, code_min_avg] = get_city_with_max_min_avg_temp(data, 0)
    print(city_with_max_temp) -> "muenchen", 23, 801
    """

    cities_with_avg_temp = []
    cities_with_max_avg_temp = []
    cities_with_min_avg_temp = []
    for city in data['cities']:
        cities_with_avg_temp.append(round(data['cities'][city][date_in_future]['max_temp']))
    maxtemp_temp = max(cities_with_avg_temp)
    mintemp_temp = min(cities_with_avg_temp)
    for city in data['cities']:
        if round(data['cities'][city][date_in_future]['max_temp']) == maxtemp_temp:
            cities_with_max_avg_temp.append(city)
        if round(data['cities'][city][date_in_future]['max_temp']) == mintemp_temp:
            cities_with_min_avg_temp.append(city)
    return_city_max = random.choice(cities_with_max_avg_temp)
    return_city_min = random.choice(cities_with_min_avg_temp)

    return [return_city_max, round(data['cities'][return_city_max][date_in_future]['max_temp']),
            data['cities'][return_city_max][date_in_future]['code'],
            return_city_min, round(data['cities'][return_city_min][date_in_future]['max_temp']),
            data['cities'][return_city_min][date_in_future]['code']]


def get_average_per_day(data):
    avg_temp = []
    common_code = []
    for summary in range(5):
        avg_temp_data = round(data['summaries'][summary]['temp_avg'])
        avg_temp.append(str(avg_temp_data))
        common_code_data = data['summaries'][summary]['common_code']
        common_code.append(speech.random_weather_descriptions(common_code_data))

    return avg_temp, common_code
