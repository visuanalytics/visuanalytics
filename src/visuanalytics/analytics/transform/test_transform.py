# TODO remove, File ist just for testting all transform funktions without use auf other funktions
import json

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.transform.transform import transform
from visuanalytics.analytics.util import resources


def test_transform(config_name, data: dict):
    with resources.open_resource(config_name) as fp:
        values = json.loads(fp.read())

    step_data = StepData({})
    step_data.init_data(data)

    transform(values, step_data)
    print(f"Data after Transform: {step_data.data}")


# Die daten die eigentlich aus der api kommen
data = {"_req": [{"test": [2, 3.4, 8, 9]}, {"test": [2.4, 1.4, 8, 1]}]}
print(f"Data: {data}")
test_transform("steps/example.json", data)
