# TODO remove, File ist just for testting all transform funktions without use auf other funktions
import json
import time

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.transform.transform import transform
from visuanalytics.analytics.util import resources


def test_transform(config_name, data: dict):
    with resources.open_resource(config_name) as fp:
        values = json.loads(fp.read())

    step_data = StepData({}, "1")
    step_data.init_data(data)

    transform(values, step_data)
    print(f"Data after Transform: {step_data.data}")


def test():
    with resources.open_resource("exampledata/example_weather.json") as fp:
        api_data = json.loads(fp.read())

    # Die daten die eigentlich aus der api kommen
    t1 = time.time()
    data = {"_req": api_data}
    print(f"Data: {data}")
    test_transform("steps/example.json", data)
    print(time.time() - t1)


if __name__ == "__main__":
    test()
