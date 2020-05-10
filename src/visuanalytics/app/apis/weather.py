"""
Dieses Modul enthält Funktionen zum Beziehen und Vorverarbeiten der 16-Tage-Wettervorhersage-Daten von der
Weatherbit-API.
"""

import json
import statistics

from pip._vendor import requests

from visuanalytics.app.util import dictionary
from visuanalytics.app.util import util

RELEVANT_DATA = ["date_time", "temp", "low_temp", "min_temp", "high_temp", "max_temp", "app_min_temp", "app_max_temp",
                 "wind_cdir", "wind_dir", "icon", "code", "sunrise_ts", "sunset_ts"]
"""
list: Liste von JSON-Attributen, welche interessant für uns sind und aus den Daten rausgefiltert werden sollen.
"""

CITIES = ["Kiel", "Berlin", "Dresden", "Hannover", "Bremen", "Düsseldorf", "Frankfurt", "Nürnberg", "Stuttgart",
          "München", "Saarbrücken", "Schwerin", "Hamburg", "Gießen", "Garmisch-Partenkirchen"]
"""
list: Städte, für die wir die Wettervorhersage von der Weatherbit-API beziehen.
"""

WEATHERBIT_URL = "https://api.weatherbit.io/v2.0/forecast/daily?"

WEATHERBIT_API_KEY = ""
"""
TODO: Private config-Datei für unsere API-keys anlegen. Zum Testen der Funktionen dieses Moduls: Bitte den API-Key aus
Postman entnehmen bzw. die Daten aus der forecast.json-Datei einlesen und verwenden.
"""


def get_forecasts():
    """
    Bezieht die 16-Tage-Wettervorhersage für 15 Städte Deutschlands und bündelt sie in einer Liste.

    Jede JSON-Antwort wird mittels json.loads() in ein dictionary konvertiert und in einer Liste gespeichert.

    Returns:
        list: Eine Liste von Dictionaries, welche je eine JSON-Response der API repräsentieren.

    Raises:
        ValueError: Wenn der Response-Code eine andere Nummer als 200 enthält. Dies kann vor allem bei einem fehlenden
        oder ungültigen API-Key vorkommen.
        socket.gaierror: Wenn keine Verbindung zum Internet besteht.
    """
    json_data = []
    json_raw = ""
    for c in CITIES:
        response = requests.get(_forecast_request(c))
        if response.status_code != 200:
            print(c)
            raise ValueError("Response-Code: " + str(response.status_code))
        json_raw += str(response.content)
        json_data.append(json.loads(response.content))
    print(json_raw)
    return json_data


def _forecast_request(location):
    return WEATHERBIT_URL + "city=" + location + "&key=" + WEATHERBIT_API_KEY


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
    icons = [util.mode(_get_for_day(i, "icon", data)) for i in days]
    codes = [util.mode(_get_for_day(i, "code", data)) for i in days]
    return [{"temp_avg": avg_temp[i],
             "temp_min": min_temp[i],
             "temp_max": max_temp[i],
             "common_icon": icons[i],
             "common_code": codes[i]} for i in days]


def _get_for_day(day, attribute, data):
    days = [data[c][day] for c in data]
    return [d[attribute] for d in days]


print(util.mode([]))
