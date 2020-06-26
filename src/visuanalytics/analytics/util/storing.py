import json

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.util.resources import new_memory_resource_path
from visuanalytics.analytics.util.step_errors import raise_step_error, TransformError


@raise_step_error(TransformError)
def storing(values: dict, data: StepData):
    if values.get("storing", False) is not False:
        with open(new_memory_resource_path(data.format("{_conf|job_name}")), 'w') as fp:
            json.dump(data.data["_req"], fp)
