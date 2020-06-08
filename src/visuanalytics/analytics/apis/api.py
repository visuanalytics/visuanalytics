import json

from visuanalytics.analytics.control.procedures.step_data import StepData


def api_request(values: dict, data: StepData):
    assert False, "Not Implemented"


def api_request_multiple(values: dict, data: StepData):
    assert False, "Not Implemented"


def api_request_multiple_custom(values: dict, data: StepData):
    assert False, "Not Implemented"


def _fetch(response):
    if response.status_code != 200:
        raise ValueError("Response-Code: " + str(response.status_code))
    return json.loads(response.content)


API_TYPES = {
    "request": api_request,
    "request_multiple": api_request_multiple,
    "request_multiple_custom": api_request_multiple_custom
}
