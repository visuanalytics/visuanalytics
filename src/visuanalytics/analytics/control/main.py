import os
import uuid

from visuanalytics.analytics.control.pipeline import Pipeline
from visuanalytics.analytics.control.procedures.weather_single import SingleWeatherSteps
from visuanalytics.analytics.control.procedures.weather import WeatherSteps
import logging
# TODO(Max) Implement (current just for testing)
from visuanalytics.analytics.util import resources


def main():
    # Not ready will be moved later

    testing = True

    # initialize logging
    level = logging.INFO if testing else logging.WARNING
    logging.basicConfig(format='%(module)s %(levelname)s: %(message)s', level=level)

    # create temp and out directory
    os.makedirs(resources.get_resource_path("temp"), exist_ok=True)
    os.makedirs(resources.get_resource_path("out"), exist_ok=True)

    Pipeline(uuid.uuid4().hex, WeatherSteps({"testing": testing})).start()
    # Pipeline(uuid.uuid4().hex, SingleWeatherSteps({"testing": testing, "cityname": "Giessen"})).start()


if __name__ == "__main__":
    main()
