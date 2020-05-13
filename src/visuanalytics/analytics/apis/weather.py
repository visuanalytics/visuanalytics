"""
Dieses Modul enthält die Funktionalität zum Beziehen der Wettervorhersage-Daten von der Weatherbit-API.
"""

import json
import requests

from visuanalytics.analytics.util import resources

CITIES = ["Kiel", "Berlin", "Dresden", "Hannover", "Bremen", "Düsseldorf", "Frankfurt", "Nürnberg", "Stuttgart",
          "München", "Saarbrücken", "Schwerin", "Hamburg", "Gießen", "Garmisch-Partenkirchen"]
"""
list: Städte, für die wir die Wettervorhersage von der Weatherbit-API beziehen.
"""

WEATHERBIT_URL = "https://api.weatherbit.io/v2.0/forecast/daily?"

WEATHERBIT_API_KEY = ""


# TODO: Private config-Datei für unsere API-keys anlegen.
# Zum Testen der Funktionen dieses Moduls: Bitte den API-Key aus Postman entnehmen bzw. die Daten aus der
# example_weather.json-Datei einlesen und verwenden.


def get_forecasts():
    # TODO (David): Die Städtenamen als Parameter übergeben statt eine globale Konstante zu verwenden
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
    for c in CITIES:
        response = requests.get(_forecast_request(c))
        if response.status_code != 200:
            raise ValueError("Response-Code: " + str(response.status_code))
        json_data.append(json.loads(response.content))
    return json_data


# TODO (David): API-key als Parameter übergeben statt Konstante zu verwenden
def _forecast_request(location):
    return WEATHERBIT_URL + "city=" + location + "&key=" + WEATHERBIT_API_KEY


def get_example():
    """
    Bezieht die 16-Tage-Wettervorhersage für 15 Städte Deutschlands (aus der examples/weather.json)  und bündelt sie in einer Liste.

    :return: Eine Liste von Dictionaries, welche je eine JSON-Response der API repräsentieren ( aus der json datein gelesen)
    :rtype: list

    """
    with resources.open_resource("exampledata/example_weather.json", "r") as json_file:
        return json.load(json_file)
