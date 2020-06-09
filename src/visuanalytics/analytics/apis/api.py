import json

import requests
from visuanalytics.analytics.control.procedures.step_data import StepData


def api_request(values: dict, data: StepData):
    """Fragt einmal die gewünschten Daten einer API ab.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    url = data.format_api(values["url_pattern"], values["api_key_name"])
    data.init_data(_fetch(url))


def api_request_multiple(values: dict, data: StepData):
    """Fragt für einen variablen Key, mehrere Male gewünschte Daten einer API ab.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for idx, value in values["steps_value"]:
        data.save_loop(values, idx, value)
        url = data.format_api(values["url_pattern"], values["api_key_name"])
        data.init_data(_fetch(url))


def api_request_multiple_custom(values: dict, data: StepData):
    """Fragt unterschiedliche Daten einer API ab.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for value in values["requests"]:
        api_request(value, data)


def _fetch(url):
    """Abfrage einer API und Umwandlung der API-Antwort in ein Dictionary.

    :param url: url der gewünschten API-Anfrage
    :return: Antwort der API als Dictionary
    """
    response = requests.get(url)
    if response.status_code != 200:
        raise ValueError("Response-Code: " + str(response.status_code))
    return json.loads(response.content)


API_TYPES = {
    "request": api_request,
    "request_multiple": api_request_multiple,
    "request_multiple_custom": api_request_multiple_custom
}
