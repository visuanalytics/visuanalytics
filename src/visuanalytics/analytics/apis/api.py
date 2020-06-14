import json

import requests

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.util import resources


def api_request(values: dict, data: StepData):
    """Fragt einmal die gewünschten Daten einer API ab.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    url = data.format_api(values["url_pattern"], values["api_key_name"], values)
    data.init_data({"_req": _fetch(url, data.data["_conf"].get("testing", False), values["name"])})


def api_request_multiple(values: dict, data: StepData):
    """Fragt für einen variablen Key, mehrere Male gewünschte Daten einer API ab.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """

    if data.format(values.get("use_loop_as_key", False), values):
        data_dict = {}

        for idx, key in values["steps_value"]:
            data.save_loop(values, idx, key)
            url = data.format_api(values["url_pattern"], values["api_key_name"], values)
            data_dict[key] = _fetch(url, data.data["_conf"].get("testing", False), values["name"])
        return data.init_data({"_req": data_dict})

    data_array = []

    for idx, value in values["steps_value"]:
        data.save_loop(values, idx, value)
        url = data.format_api(values["url_pattern"], values["api_key_name"], values)
        data_array.append(_fetch(url, data.data["_conf"].get("testing", False), values["name"]))

    data.init_data({"_req": data_array})


def api_request_multiple_custom(values: dict, data: StepData):
    """Fragt unterschiedliche Daten einer API ab.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for value in values["requests"]:
        api_request(value, data)


def _fetch(url, testing=False, name=""):
    """Abfrage einer API und Umwandlung der API-Antwort in ein Dictionary.

    :param url: url der gewünschten API-Anfrage
    :return: Antwort der API als Dictionary
    """
    if testing:
        with resources.open_resource(f"exampledata/{name}") as fp:
            return json.loads(fp.read())

    response = requests.get(url)
    if response.status_code != 200:
        raise ValueError("Response-Code: " + str(response.status_code))
    return json.loads(response.content)


API_TYPES = {
    "request": api_request,
    "request_multiple": api_request_multiple,
    "request_multiple_custom": api_request_multiple_custom
}
