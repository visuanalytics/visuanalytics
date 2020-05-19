import os
import uuid

from visuanalytics.analytics.control.pipeline import Pipeline
from visuanalytics.analytics.control.procedures.weather import WeatherSteps
# TODO(Max) Implement (current just for testing)
from visuanalytics.analytics.util import resources


def main():
    # Not ready will be moved later
    os.makedirs(resources.get_resource_path("temp"), exist_ok=True)
    os.makedirs(resources.get_resource_path("out"), exist_ok=True)

    Pipeline(uuid.uuid4().hex, WeatherSteps({"testing": True})).start()


if __name__ == "__main__":
    main()
