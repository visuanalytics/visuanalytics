# TODO remove, File ist just for testting all transform funktions without use auf other funktions
import json
import time

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.processing.image import visualization
from visuanalytics.analytics.transform.transform import transform
from visuanalytics.analytics.util import resources

CITIES = ["Kiel", "Berlin", "Dresden", "Hannover", "Bremen", "Düsseldorf", "Frankfurt", "Nürnberg", "Stuttgart",
          "München", "Saarbrücken", "Schwerin", "Hamburg", "Gießen", "Konstanz", "Magdeburg", "Leipzig", "Mainz",
          "Regensburg"]


def test_transform(x, config_name, data: dict):
    with resources.open_resource(config_name) as fp:
        values = json.loads(fp.read())

    step_data = StepData(x, "0")
    step_data.init_data(data)

    # api(values, step_data)
    transform(values, step_data)
    print(f"Data after Transform: {step_data.data}")
    generate_audios(values, step_data)

    visualization.generate_all_images(values, step_data)
    print(values["images"])


def test():
    with resources.open_resource("exampledata/weather_germany.json") as fp:
        api_data = json.loads(fp.read())

    new_data = {}
    for idx, key in enumerate(CITIES):
        new_data[key] = api_data[idx]
    # Die daten die eigentlich aus der api kommen
    t1 = time.time()
    data = {"_req": new_data}
    print(f"Data: {data}")
    test_transform({"out_path": "output_path", "h264_nvenc": "true"},
                   "steps/weather_germany.json", data)
    print(time.time() - t1)


def test2():
    with resources.open_resource("exampledata/weather_single.json") as fp:
        api_data = json.loads(fp.read())

    # Die daten die eigentlich aus der api kommen
    t1 = time.time()
    data = {"_req": api_data}
    print(f"Data: {data}")
    test_transform(
        {"city_name": "Biebertal", "p_code": "35444", output_path": "out", "h264_nvenc": "true"},
        "steps/weather_single.json", data)
    print(time.time() - t1)


if __name__ == "__main__":
    test()
