import json

import requests

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.util import resources
from visuanalytics.analytics.util.step_errors import APIError, raise_step_error
from visuanalytics.analytics.util.type_utils import get_type_func, register_type_func

API_TYPES = {}


@raise_step_error(APIError)
def api(values: dict, data: StepData):
    data.init_data(_api(values["api"], data, values["name"]))


@raise_step_error(APIError)
def _api(values: dict, data: StepData, name):
    api_func = get_type_func(values, API_TYPES)

    return api_func(values, data, name)


def register_api(func):
    return register_type_func(API_TYPES, APIError, func)


@register_api
def request(values: dict, data: StepData, name):
    """Fragt einmal die gewünschten Daten einer API ab.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    if data.data["_conf"].get("testing", False):
        return _load_test_data(name)

    url, header, body = _create_query(values, data)
    return _fetch(url, header, body, values.get("method", "get"))


@register_api
def request_memory(values: dict, data: StepData, name):
    """Ließt Daten aus einer Memory datei (Json-Format) zu einem bestimmtem Datum.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    # todo (jannik) möglichekit einbauen Daten aus letzem run zu nutzen
    try:
        with resources.open_memory_resource(values["timedelta"], data.format("{_conf|job_name}"), values["name"]) as fp:
            return json.loads(fp.read())
    except FileNotFoundError:
        return _api(values["alternative"], data, name)


@register_api
def request_multiple(values: dict, data: StepData, name):
    """Fragt für einen variablen Key, mehrere Male gewünschte Daten einer API ab.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """

    if data.data["_conf"].get("testing", False):
        return _load_test_data(name)

    method = values.get("method", "get")
    if data.format(values.get("use_loop_as_key", False), values):
        data_dict = {}
        for idx, key in data.loop_array(values["steps_value"], values):
            url, header, body = _create_query(values, data)
            data_dict[key] = _fetch(url, header, body, method)
        return data_dict

    data_array = []
    for idx, value in data.loop_array(values["steps_value"], values):
        url, header, body = _create_query(values, data)
        data_array.append(_fetch(url, header, body, method))
        return data_array


@register_api
def request_multiple_custom(values: dict, data: StepData, name):
    """Fragt unterschiedliche Daten einer API ab.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """

    if data.data["_conf"].get("testing", False):
        return _load_test_data(name)

    if values.get("use_loop_as_key", False):
        data_dict = {}

        for idx, key in enumerate(values["steps_value"]):
            data_dict[key] = _api(values["requests"][idx], data, name)
        return data_dict

    data_array = []
    for idx, value in enumerate(values["requests"]):
        data_array.append(_api(value, data, name))
    return data_array


def _create_query(values: dict, data: StepData):
    req_values = [values.get("header", None), values.get("body", None)]
    for idx, key in enumerate(req_values):
        if req_values[idx] is not None:
            req_values[idx] = data.format_json(req_values[idx], values.get("api_key_name", None), values)
    url = data.format_api(values["url_pattern"], values.get("api_key_name", None), values)
    return url, req_values[0], req_values[1]


def _load_test_data(name):
    with resources.open_resource(f"exampledata/{name}.json") as fp:
        return json.loads(fp.read())

    # TODO(max) Catch possible errors


def _fetch(url, header, body, method):
    """Abfrage einer API und Umwandlung der API-Antwort in ein Dictionary.

    :param url: url der gewünschten API-Anfrage
    :return: Antwort der API als Dictionary
    """
    if method.__eq__("get"):
        response = requests.get(url, headers=header, json=body)
    else:
        response = requests.post(url, headers=header, json=body)

    if response.status_code != 200:
        raise ValueError("Response-Code: " + str(response.status_code))
    return json.loads(response.content)
