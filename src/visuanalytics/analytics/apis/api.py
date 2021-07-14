"""
Modul, welches die Funktionen bereitstellt, welche für API-Requests benötigt werden.
"""
import json
import logging
import time

import requests
import xmltodict

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.util.step_errors import APIError, raise_step_error, APiRequestError, TestDataError
from visuanalytics.analytics.util.type_utils import get_type_func, register_type_func
from visuanalytics.util import resources

logger = logging.getLogger(__name__)

API_TYPES = {}
"""Ein Dictionary bestehend aus allen API-Typ-Methoden.  """


@raise_step_error(APIError)
def api(values: dict, data: StepData):
    api_request(values["api"], data, values["name"], "_req")


@raise_step_error(APIError)
def api_request(values: dict, data: StepData, name: str, save_key, ignore_testing=False):
    api_func = get_type_func(values, API_TYPES)

    api_func(values, data, name, save_key, ignore_testing)


def register_api(func):
    """Registriert die übergebene Funktion und versieht sie mit einem `"try/except"`-Block.
    Fügt eine Typ-Funktion dem Dictionary API_TYPES hinzu.

    :param func: die zu registrierende Funktion
    :return: Funktion mit try/except-Block
    """
    return register_type_func(API_TYPES, APIError, func)


@register_api
def request(values: dict, data: StepData, name: str, save_key, ignore_testing=False):
    """Fragt einmal die gewünschten Daten einer API ab.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :param name: Testdatei, die geladen werden soll.
    :param save_key: Key, unter dem die Daten gespeichert werden.
    :param ignore_testing: Ob der Request durchgeführt werden soll, obwohl testing `true` ist.
    """
    if data.get_config("testing", False) and not ignore_testing:
        return _load_test_data(values, data, name, save_key)

    fetch(values, data, save_key)


@register_api
def input(values: dict, data: StepData, name: str, save_key, ignore_testing=False):
    """Hier können Daten angegeben werden, die einfach hinzugefügt werden.


    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :param name: Testdatei, die geladen werden soll.
    :param save_key: Key, unter dem die Daten gespeichert werden.
    :param ignore_testing: Ob der Request durchgeführt werden soll, obwohl testing `true` ist.
    """
    res = data.deep_format(values["data"], values=values)
    data.insert_data(save_key, res, values)


@register_api
def request_memory(values: dict, data: StepData, name: str, save_key, ignore_testing=False):
    """Ließt Daten aus einer memory-Datei (JSON-Format) zu einem bestimmtem Datum.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :param name: Testdatei, die geladen werden soll.
    :param save_key: Key, unter dem die Daten gespeichert werden.
    :param ignore_testing: Ob der Request durchgeführt werden soll, obwohl testing `true` ist.
    """
    try:
        if values.get("timedelta", None) is None:
            skip = values.get("skip_today", False)
            use_last = values.get("use_last", 1)
            hist_data = []
            for offset in range(1, use_last + 1):
                with resources.open_specific_memory_resource(data.get_config("job_name"), values["name"], skip, offset) as fp:
                    hist_data.append(json.loads(fp.read()))
            data.insert_data(save_key, hist_data, values)
        else:
            with resources.open_memory_resource(data.get_config("job_name"),
                                                values["name"], values["timedelta"]) as fp:
                data.insert_data(save_key, json.loads(fp.read()), values)
    except (FileNotFoundError, IndexError):
        api_request(values["alternative"], data, name, save_key, ignore_testing)


@register_api
def request_multiple(values: dict, data: StepData, name: str, save_key, ignore_testing=False):
    """Fragt für einen variablen Key, mehrere Male gewünschte Daten einer API ab.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :param name: Testdatei, die geladen werden soll.
    :param save_key: Key, unter dem die Daten gespeichert werden.
    :param ignore_testing: Ob der Request durchgeführt werden soll, obwohl testing `true` ist.
    """

    if data.get_config("testing", False) and not ignore_testing:
        return _load_test_data(values, data, name, save_key)

    if data.get_data(values.get("use_loop_as_key", False), values, bool):
        data.insert_data(save_key, {}, values)
        for _, key in data.loop_array(values["steps_value"], values):
            fetch(values, data, f"{save_key}|{key}")
            waiting_time = data.get_data(values.get("timer_between_requests", 0.0), values, float)
            if waiting_time > 0.0:
                time.sleep(waiting_time)
    else:
        data.insert_data(save_key, [None] * len(values["steps_value"]), values)
        for idx, _ in data.loop_array(values["steps_value"], values):
            fetch(values, data, f"{save_key}|{idx}", )


@register_api
def request_multiple_custom(values: dict, data: StepData, name: str, save_key, ignore_testing=False):
    """Fragt unterschiedliche Daten einer API ab.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    :param name: Testdatei, die geladen werden soll.
    :param save_key: Key, unter dem die Daten gespeichert werden.
    :param ignore_testing: Ob der Request durchgeführt werden soll, obwohl testing `true` ist.
    """

    if data.get_config("testing", False) and not ignore_testing:
        return _load_test_data(values, data, name, save_key)

    if values.get("use_loop_as_key", False):
        data.insert_data(save_key, {}, values)

        for idx, key in enumerate(values["steps_value"]):
            api_request(values["requests"][idx], data, name, f"{save_key}|{key}", ignore_testing)
    else:
        data.insert_data(save_key, [None] * len(values["requests"]), values)

        for idx, value in enumerate(values["requests"]):
            api_request(value, data, name, f"{save_key}|{idx}", ignore_testing)


def _load_test_data(values: dict, data: StepData, name, save_key):
    logger.info(f"Loading test data from 'exampledata/{name}.json'")
    try:
        with resources.open_resource(f"exampledata/{name}.json") as fp:
            data.insert_data(save_key, json.loads(fp.read()), values)
    except IOError as e:
        raise TestDataError(name) from e


def fetch(values: dict, data: StepData, save_key):
    """Abfrage einer API und Umwandlung der API-Antwort in ein angegebenes Format.

    :param req_data: Dictionary, das alle Informationen für den request enthält.
    :return: Antwort der API im angegebenen Format
    """
    # Build http request
    req_data = _create_query(values, data)

    req = requests.Request(req_data["method"], req_data["url"], headers=req_data["headers"],
                           json=req_data.get("json", None),
                           data=req_data.get("other", None), params=req_data["params"])
    # Make the http request
    s = requests.session()
    response = s.send(req.prepare())

    if not response.ok:
        raise APiRequestError(response)

    # Get the right return format
    if req_data["res_format"].__eq__("json"):
        res = response.json()
    elif req_data["res_format"].__eq__("text"):
        res = response.text
    elif req_data["res_format"].__eq__("xml"):
        res = xmltodict.parse(response.text, **req_data["xml_config"])
    else:
        res = response.content

    if req_data["include_headers"]:
        res = {"headers": response.headers, "content": res}

    data.insert_data(save_key, res, values)


def _create_query(values: dict, data: StepData):
    req = {}
    api_key_name = values.get("api_key_name", None)

    # Get/Format method and headers
    req["method"] = data.format(values.get("method", "get"))
    req["headers"] = data.deep_format(values.get("headers", None), api_key_name, values)

    # Get/Format body data
    req["body_type"] = data.format(values.get("body_type", "json"), values)

    if req["body_type"].__eq__("json"):
        req["json"] = data.deep_format(values.get("body", None), api_key_name, values)
    else:
        req["other"] = data.format(values["body"]) if "body" in values else None

        if values.get("body_encoding", None) is not None:
            req[req["body_type"]] = req[req["body_type"]].encode(values["body_encoding"])

    # Get/Format url
    req["url"] = data.format_api(values["url_pattern"], api_key_name, values)

    # Get/Format params
    req["params"] = data.deep_format(values.get("params", None), api_key_name, values)
    if values.get("params_array", None) is not None:
        _build_params_array(values, data, api_key_name, req)

    # Get/Format response, format
    req["res_format"] = data.format(values.get("response_format", "json"))
    # TODO use Format
    req["xml_config"] = data.deep_format(values.get("xml_config", {}), values=values)
    req["include_headers"] = data.get_data(values.get("include_headers", False), values, bool)

    return req


def _build_params_array(values: dict, data: StepData, api_key_name: str, req: dict):
    if req["params"] is None:
        req["params"] = {}

    for params in values["params_array"]:
        params_array = data.get_data(params["array"], values, list)
        data.deep_format(params_array, api_key_name, values)

        param = "".join(
            [
                f"{data.format(params['pattern'], values)}{data.format(params.get('delimiter', ''), values)}"
                for _ in data.loop_array(params_array, values)
            ])
        req["params"][params["key"]] = param[:-1]
