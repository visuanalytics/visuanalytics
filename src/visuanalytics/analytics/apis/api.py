import json

import requests

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.util import resources


def api(values: dict, data: StepData):
    API_TYPES[values["api"]["type"]](values["api"], data, values["name"])


def api_request(values: dict, data: StepData, name):
    """Fragt einmal die gewünschten Daten einer API ab.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    url = data.format_api(values["url_pattern"], values["api_key_name"], values)
    header = values.get("header", None)
    if header is not None:
        header = data.format_header(header, values["api_key_name"], values)
    data.init_data({"_req": _fetch(url, header, data.data["_conf"].get("testing", False), name)})


def api_request_multiple(values: dict, data: StepData, name):
    """Fragt für einen variablen Key, mehrere Male gewünschte Daten einer API ab.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    header = values.get("header", None)
    if header is not None:
        header = data.format_header(header, values["api_key_name"], values)

    if data.format(values.get("use_loop_as_key", False), values):
        data_dict = {}

        for idx, key in enumerate(values["steps_value"]):
            data.save_loop(values, idx, key)
            url = data.format_api(values["url_pattern"], values["api_key_name"], values)
            data_dict[key] = _fetch(url, header, data.data["_conf"].get("testing", False), name)
        return data.init_data({"_req": data_dict})

    data_array = []

    for idx, value in enumerate(values["steps_value"]):
        data.save_loop(values, idx, value)
        url = data.format_api(values["url_pattern"], values["api_key_name"], values)
        data_array.append(_fetch(url, header, data.data["_conf"].get("testing", False), name))

    data.init_data({"_req": data_array})


def api_request_multiple_custom(values: dict, data: StepData, name):
    """Fragt unterschiedliche Daten einer API ab.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    for value in values["requests"]:
        # TODO(max) improve
        value["name"] = name
        api(value, data)


def _fetch(url, header, testing=False, name=""):
    """Abfrage einer API und Umwandlung der API-Antwort in ein Dictionary.

    :param url: url der gewünschten API-Anfrage
    :return: Antwort der API als Dictionary
    """
    if testing:
        with resources.open_resource(f"exampledata/{name}") as fp:
            return json.loads(fp.read())

        # TODO(max) Catch possible errors

    if header is None:
        response = requests.get(url)
    else:
        response = requests.get(url, header=header)
    if response.status_code != 200:
        raise ValueError("Response-Code: " + str(response.status_code))
    return json.loads(response.content)


API_TYPES = {
    "request": api_request,
    "request_multiple": api_request_multiple,
    "request_multiple_custom": api_request_multiple_custom
}
