"""
Dieses Modul enthält die Funktionalität zum Vorverarbeiten der Wettervorhersage-Daten von der Weatherbit-API.
"""

import statistics

from visuanalytics.analytics.util import dictionary
from visuanalytics.analytics.util import statistical

RELEVANT_DATA = ["datetime", "temp", "low_temp", "min_temp", "high_temp", "max_temp", "app_min_temp", "app_max_temp",
                 "wind_cdir", "wind_dir", "icon", "code", "sunrise_ts", "sunset_ts"]

"""
list: Liste von JSON-Attributen, welche interessant für uns sind und aus den Daten rausgefiltert werden sollen.
"""

LOCATIONS_TOMOROW = [("Garmisch-Partenkirchen", (898, 900)), ("München", (1080, 822)),
                     ("Nürnberg", (930, 720)), ("Frankfurt", (675, 610)),
                     ("Gießen", (843, 540)), ("Dresden", (1106, 482)),
                     ("Hannover", (1006, 370)), ("Bremen", (755, 333)),
                     ("Kiel", (986, 218)), ("Berlin", (1147, 270)), ]
"""
list: Liste aus String, Tupel(int, int): X und Y Koordinaten der Positionen der Icons in der Vorhersage für morgen sortiert nach den verschiedenen Orten/Regionen.
"""

LOCATIONS_ICONS_THREEDAYS = [("Gießen", (160, 534), (785, 534), (1410, 534)),
                             ("Hamburg", (255, 300), (875, 300), (1492, 300)),
                             ("Dresden", (360, 447), (980, 447), (1604, 447)),
                             ("München", (272, 670), (890, 670), (1510, 670))]
"""
list: Liste aus String, Tupel(int, int)x3: X und Y Koordinaten der Positionen der Icons in der 3 Tages Vorhersage sortiert nach den verschiedenen Orten/Regionen.
"""

LOCATIONS_TEMP_MIN_THREEDAYS = [(160, 946), (783, 946), (1400, 946)]
"""
list: Liste aus Tupeln: X und Y Koordinaten der Min Temperaturen in der 3 Tages Vorhersage.
"""
LOCATIONS_TEMP_MAX_THREEDAYS = [(433, 946), (1052, 946), (1680, 946)]
"""
list:Liste aus Tupeln: X und Y Koordinaten der Max Temperaturen in der 3 Tages Vorhersage.
"""


def preprocess_weather_data(api_data):
    """
    Wandelt eine Liste von Weatherbit-Forecast-API-Responses in ein Dictionary um, das die für uns relevanten Daten enthält.

    Um die weitere Verarbeitung zu vereinfachen, werden die Wettervorhersage-Daten in dieser Funktionen in eine leichter
    handzuhabende Struktur gebracht. Dazu werden irrelevante Parameter weggelassen und die allgemeine Struktur angepasst.

    Args:
        api_data (list): Eine Liste von dictionaries, die jeweils eine JSON-Response mit den Wettervorhersage-Daten enthält.

    Returns:
        dict: Ein Dictionary folgender Struktur:

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

    Raises:
        KeyError: Wenn ein Schlüssel nicht im Dictionary enthalten ist. Dies sollte unter normalen Umständen nur
        vorkommen, wenn die Weatherbit-API geändert wird.
    """
    cities = dictionary.combine([_preprocess_single(d) for d in api_data])
    summaries = _summaries(cities)
    return {"cities": cities, "summaries": summaries}


def _preprocess_single(data):
    city = data["city_name"]
    four_days = data["data"][:4]
    selected_data = [dictionary.select_pairs(RELEVANT_DATA, dictionary.flatten(d)) for d in four_days]
    return {city: selected_data}


def _summaries(data):
    days = range(4)
    avg_temp = [statistics.mean(_get_for_day(i, "temp", data)) for i in days]
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


def get_ico_tomorow(data):
    """
    Simple Methode zum weiterverarbeiten der Daten in eine kleinere Liste. In diesem Fall eine Liste mit Icons an verschieden Orten für morgen



    :param data: die verabeiteten Daten der Wetter API aus der Methode preprocess_weather_data()
    :type data:list
    :return: Eine Liste aus Tupeln bestehend aus den Koordinaten der Icons und Name des Icons
    :rtype: list

    Example:
    (Rückgabewert)
    [((898, 900), 'r04d'), ((1080, 822), 'c04d'), ((930, 720), 'c04d'), ((675, 610), 'c04d'), ((843, 540), 't02d'),
    ((1106, 482), 'c04d'), ((1006, 370), 'c04d'), ((755, 333), 'c04d'), ((986, 218), 'c04d'), ((1147, 270), 'c03d')]
    """
    out = []
    for entry in LOCATIONS_TOMOROW:
        out.append((entry[1], _get_weather_icon(data, entry[0], 0)))
    return out


def get_temp_tomorow(data):
    """
    Simple Methode zum weiterverarbeiten der Daten in eine kleinere Liste. In diesem Fall eine Liste mit Temperaturen an verschieden Orten für morgen

    :param data: die verabeiteten Daten der Wetter API aus der Methode preprocess_weather_data()
    :type data:list
    :return: Eine Liste aus Tupeln bestehend aus den Koordinaten der Temperatur und der Temperatur
    :rtype: list

    Example:
    (Rückgabewert)
    [((898, 900), '14°'), ((1080, 822), '17°'), ((930, 720), '19°'), ((675, 610), '17°'), ((843, 540), '16°'),
    ((1106, 482), '18°'), ((1006, 370), '17°'), ((755, 333), '15°'), ((986, 218), '5°'), ((1147, 270), '-3°')]

    """
    out = []
    for entry in LOCATIONS_TOMOROW:
        out.append((entry[1], _get_weather_temp(data, entry[0], 0)))
    return out


def get_temp_mm_three(data):
    """
    Simple Methode zum weiterverarbeiten der Daten in eine kleinere Liste. In diesem Fall eine Liste mit min und max Temperaturen für die 2-4 Tages Vorhersage

    :param data: die verabeiteten Daten der Wetter API aus der Methode preprocess_weather_data()
    :type data:list
    :return: Eine Liste aus Tupeln bestehend aus den Koordinaten der Temperatur und der min/max Temperatur
    :rtype: list

    Example:
    (Rückgabewert)
    [((160, 950), '1°'), ((790, 950), '-1°'), ((1400, 950), '0°'), ((450, 950), '19°'), ((1070, 950), '14°'),
    ((1700, 950), '14°')]

    """

    out = []
    for idx, entry in enumerate(LOCATIONS_TEMP_MIN_THREEDAYS):
        out.append((entry, _get_min_temp(data, idx + 1)))
    for idx, entry in enumerate(LOCATIONS_TEMP_MAX_THREEDAYS):
        out.append((entry, _get_max_temp(data, idx + 1)))
    return out


def get_ico_three(data):
    """
    Simple Methode zum weiterverarbeiten der Daten in eine kleinere Liste. In diesem Fall eine Liste mit Icons an verschieden Orten für die 2-4 Tages Vorhersage



    :param data: die verabeiteten Daten der Wetter API aus der Methode preprocess_weather_data()
    :type data:list
    :return: Eine Liste aus Tupeln bestehend aus den Koordinaten der Icons und Name des Icons für die 2-4 Tages Vorhersage
    :rtype: list

    Example:
    (Rückgabewert)
    [((160, 534), (785, 534), (1410, 534), 'c04d', 'c03d', 'c02d'),
    ((255, 300), (875, 300), (1492, 300), 'c03d', 'c03d', 'r01d'),
    ((360, 447), (980, 447), (1604, 447), 'r01d', 'c03d', 'c03d'),
    ((272, 670), (890, 670), (1510, 670), 'r01d', 'r04d', 'r01d')]

    """
    out = []
    for entry in LOCATIONS_ICONS_THREEDAYS:
        out.append(
            (entry[1], entry[2], entry[3], _get_weather_icon(data, entry[0], 1), _get_weather_icon(data, entry[0], 2),
             _get_weather_icon(data, entry[0], 3)))
    return out


def get_day(data):
    return data['cities']['Kiel'][0]['datetime']
    pass


def _get_weather_icon(data, location, date_in_future):
    return data['cities'][location][date_in_future]['icon']


def _get_weather_temp(data, location, date_in_future):
    temp = round(data['cities'][location][date_in_future]['temp'])
    return f"{temp}\u00B0"


def _get_max_temp(data, date_in_future):
    max_temp = round(data['summaries'][date_in_future]['temp_max'])
    return f"{max_temp}\u00B0"


def _get_min_temp(data, date_in_future):
    min_temp = round(data['summaries'][date_in_future]['temp_min'])
    return f"{min_temp}\u00B0"
