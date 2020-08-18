from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.transform.transform import transform


def prepare_test(values: list, data, expected_data: dict, config=None):
    if config is None:
        config = {}

    step_data = StepData(config, "0", 0)
    step_data.insert_data("_req", data, {})
    transform({"transform": values}, step_data)

    # removed Temporary set data
    step_data.data.pop("_conf")
    step_data.data.pop("_pipe_id")
    step_data.data.pop("_job_id")

    return step_data.data, expected_data
