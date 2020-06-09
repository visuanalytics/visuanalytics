import json

import requests
from visuanalytics.analytics.control.procedures.step_data import StepData


def api_request(values: dict, data: StepData):
    # api_key_name = data.get_data(values["api_key_name"])
    # api_key = config_manager.get_private()["api_keys"][api_key_name]
    url = data.get_data(values["url_pattern"])
    data.append(_fetch(requests.get(url)))


def api_request_multiple(values: dict, data: StepData):
    # api_key_name = data.get_data(values["api_key_name"])
    # api_key = config_manager.get_private()["api_keys"][api_key_name]
    url = data.get_data(values['url_pattern'])
    for c in values["steps_value"]:
        data.append(_fetch(requests.get(url)))


def api_request_multiple_custom(values: dict, data: StepData):
    for idx, value in values["request"]:
        api_request(values["request"][idx])


def _fetch(response):
    if response.status_code != 200:
        raise ValueError("Response-Code: " + str(response.status_code))
    return json.loads(response.content)


API_TYPES = {
    "request": api_request,
    "request_multiple": api_request_multiple,
    "request_multiple_custom": api_request_multiple_custom
}
