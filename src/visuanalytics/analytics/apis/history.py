import json

from visuanalytics.analytics.util import resources


def get_example():
    with resources.open_resource("exampledata/example_history.json", "r") as json_file:
        return json.load(json_file)


def get_forecasts(times=None):
    if times is None:
        keys1 = [1, 2, 10, 20]

    pass
