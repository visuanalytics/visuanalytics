import statistics

from numpy import random

from visuanalytics.analytics.preprocessing.weather import speech, visualisation
from visuanalytics.analytics.util import date_time, dictionary, statistical

NUM_DAYS = 5
"""
int: Anzahl der Tage, für die die Wettervorhersage von der API bezogen wird.
"""

RELEVANT_DATA = ["valid_date", "max_temp", "min_temp", "app_min_temp", "app_max_temp",
                 "wind_cdir_full", "wind_spd", "icon", "code", "sunrise_ts", "sunset_ts", "rh", "pop"]
"""
list: Liste von JSON-Attributen, welche interessant für uns sind und aus den Daten rausgefiltert werden sollen.
"""


def preprocess_weather_data(api_data, single=False):
    """
    Wandelt eine Liste von Weatherbit-Forecast-API-Responses in ein Dictionary um, das die für uns relevanten Daten enthält.

    Um die weitere Verarbeitung zu vereinfachen, werden die Wettervorhersage-Daten in dieser Funktionen in eine leichter
    handzuhabende Struktur gebracht. Dazu werden irrelevante Parameter weggelassen und die allgemeine Struktur angepasst.

    :param api_data: Eine Liste von dictionaries, die jeweils eine JSON-Response mit den Wettervorhersage-Daten enthält.
    :type api_data: dict
    :param single: Boolean-Wert, welcher angibt, ob "summaries" im dictionary enthalten sein soll oder nicht
    :type single: bool

    :returns:
        Ein Dictionary folgender Struktur:
        {
          "cities" : {
              "Kiel" : [
                {
                  "valid_date": '2020-05-19',
                  "max_temp": 25,
                  "min_temp" : 11.7,
                  "app_max_temp " : 24.2,
                  "app_min_temp" : 11.7,
                  "wind_cdir_full" : 'north-northeast',
                  "wind_spd": 3.37202,
                  "icon": 'c02d',
                  "code": 801,
                  "sunrise_ts": 1589860056,
                  "sunset_ts": 1589915169,
                  "rh": 51,
                  "pop: 0"
                },
               ...
              ],
              ...
          },
          "summaries" : [
            {
              "temp_min" : 6.5,
              "temp_max" : 25,
              "temp_avg" : 21.436842105263157,
              "common_icon" : c02d,
              "common_code" : 804
            },
            ...
          ]
        }

        "cities" enthält zu jeder Stadt ("Kiel", "Berlin", "Dresden", "Hannover", "Bremen", "Düsseldorf", "Frankfurt", "Nürnberg", "Stuttgart",
        "München", "Saarbrücken", "Schwerin", "Hamburg", "Gießen", "Konstanz", "Magdeburg", "Leipzig", "Mainz",
        "Regensburg") fünf "Unter-Dictionaries", welche wiederum die Wetterdaten für je einen Tag
        enthalten (today, tomorrow, next_1, next_2, next_3).
        "summaries" enthält für jeden der fünf Tage ein Unter-Dictionary, welches jeweils die zusammenfassenden Daten für einen Tag angibt

    :rtype: dict

    :raises:
        KeyError: Wenn ein Schlüssel nicht im Dictionary enthalten ist. Dies sollte unter normalen Umständen nur
        vorkommen, wenn die Weatherbit-API geändert wird.
    """
    cities = dictionary.combine([_preprocess_single(d) for d in api_data])
    if single:
        return cities
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
    date = data['cities']['Kiel'][0]['valid_date']
    weekdays = date_time.date_to_weekday(date)
    weekdays_for_dict = {"today": weekdays[0], "tomorrow": weekdays[1], "next_1": weekdays[2], "next_2": weekdays[3],
                         "next_3": weekdays[4]}
    return weekdays_for_dict


def get_first_day(data):
    return data['cities']['Kiel'][0]['valid_date']


def get_first_day_single(data, city_name):
    return data[city_name][0]['valid_date']


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


def get_city_with_min_temp(data, date_in_future):
    """
    Methode, um aus Dictionary zu einem bestimmten Tag eine Stadt mit der niedriegsten Temperatur herauszufinden
    :param data: Dictionary, dass in der Methode preprocess_weather_data erstellt wird
    :type data: dict
    :param date_in_future: Tag in der Zukunft; 0: heute, 1: morgen, 2, übermorgen, 3: überübermorgen, 4: überüberübermorgen
    :type date_in_future: int
    :return: eine Stadt, die an diesem Tag die Niedrigsttemperatur hat (wenn mehrere Städte gefunden werden, wird eine
        zufällig ausgesucht), die Niedrigsttemperatur und das zugrhörige Icon
    :rtype: str, str, str

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


def get_cities_max_temp(data, date_in_future):
    """
    Methode, um aus Dictionary data (erstellt in der Methode preprocess_weather_data) von allen Höchsttemperaturen der Städte (Teilmenge von 'cities':
    "Konstanz", "München", "Nürnberg", "Mainz", "Gießen", "Dresden", "Hannover", "Bremen", "Hamburg", "Berlin") an einem bestimmten Tag
    die Höchste und Niedrigste herauszufinden. Zusätzlich zu diesen Temperaturen, werden die dazugehörigen Städte (wenn mehrere Städte, dann zufällig
    ausgewählt) und der Code zum passenden Icon zurückgegeben.

    :param data: Dictionary, dass in der Methode preprocess_weather_data erstellt wird
    :type data: dict
    :param date_in_future: Tag in der Zukunft; 0: today, 1: tomorrow, 2, next_1, 3: next_2, 4: next_3
    :type date_in_future: int
    :return: Array [eine Stadt, die an diesem Tag die höchste Höchsttemperatur hat; höchste Höchsttemperatur; Iconcode zur höchsten Höchsttemperatur;
            eine Stadt, die an diesem Tag die niedrigste Höchstschnittstemperatur hat; niedrigste Höchsttemperatur; Iconcode zur niedrigsten Höchsttemperatur]
    :rtype: str[]
    Example:
    """

    cities_with_max_temp = []
    cities_with_highest_max_temp = []
    cities_with_lowest_max_temp = []
    for city in visualisation.LOCATIONS_TOMOROW:
        cities_with_max_temp.append(round(data['cities'][city[0]][date_in_future]['max_temp']))
    highest_max_temp = max(cities_with_max_temp)
    lowest_max_temp = min(cities_with_max_temp)
    for city in visualisation.LOCATIONS_TOMOROW:
        if round(data['cities'][city[0]][date_in_future]['max_temp']) == highest_max_temp:
            cities_with_highest_max_temp.append(city[0])
        if round(data['cities'][city[0]][date_in_future]['max_temp']) == lowest_max_temp:
            cities_with_lowest_max_temp.append(city[0])
    return_city_max = random.choice(cities_with_highest_max_temp)
    return_city_min = random.choice(cities_with_lowest_max_temp)

    return [return_city_max, round(data['cities'][return_city_max][date_in_future]['max_temp']),
            data['cities'][return_city_max][date_in_future]['code'],
            return_city_min, round(data['cities'][return_city_min][date_in_future]['max_temp']),
            data['cities'][return_city_min][date_in_future]['code']]


def get_common_code_per_day(data):
    """Nimmt den Common Code und gibt die Beschreibung dazu in Textform aus.

    Methode, die aus Dictionary (erstellt in der Methode preprocess_weather_data) aus 'summaries' für jeden Tag den
    Common Code herausfiltert, also ein Array aus den Common Codes für die Tage today, tomorrow, next_1, next_2,
    next_2 zurückgibt.

    :param data: Dictionary, dass in der Methode preprocess_weather_data erstellt wird
    :type data: dict
    :return: Array [common_code_today, common_code_tomorrow, common_code_next_1, common_code_next_2, common_code_next_3)
    :rtype: str[]
    """
    common_code = []
    for summary in range(5):
        common_code_data = data['summaries'][summary]['common_code']
        common_code.append(speech.random_weather_descriptions(common_code_data))

    return common_code
