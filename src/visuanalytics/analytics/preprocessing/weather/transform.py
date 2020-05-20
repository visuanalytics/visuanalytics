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
    for city in visualisation.LOCATIONS_TOMOROW:
        cities_with_avg_temp.append(round(data['cities'][city[0]][date_in_future]['max_temp']))
    maxtemp_temp = max(cities_with_avg_temp)
    mintemp_temp = min(cities_with_avg_temp)
    for city in visualisation.LOCATIONS_TOMOROW:
        if round(data['cities'][city[0]][date_in_future]['max_temp']) == maxtemp_temp:
            cities_with_max_avg_temp.append(city[0])
        if round(data['cities'][city[0]][date_in_future]['max_temp']) == mintemp_temp:
            cities_with_min_avg_temp.append(city[0])
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
