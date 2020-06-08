from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.transform.transform_types import TRANSFORM_TYPES


def transform(values: dict, data: StepData):
    for transformation in values["transformation"]:
        transformation["_loop_states"] = values.get("_loop_states", {})

        TRANSFORM_TYPES[transformation["type"]](transformation, data)


def transform_array(values: dict, data: StepData):
    for idx, entry in enumerate(data.get_data(values["array_key"])):
        data.save_loop(values, idx, entry)
        transform(values, entry)


def transform_loop(values: dict, data: StepData):
    for idx, value in enumerate(values["values"]):
        data.save_loop(values, idx, value)
        transform(values, value)
