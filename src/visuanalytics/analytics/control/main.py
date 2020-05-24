import logging
import os

from visuanalytics.analytics.control.schedule import Scheduler
from visuanalytics.analytics.util import resources, external_programms, config_manager

# TODO(Max) Implement (current just for testing)

testing = True


def main():
    # Not ready will be moved later
    init()

    Scheduler().start()
    # Pipeline(uuid.uuid4().hex, WeatherSteps({"testing": testing})).start()
    # Pipeline(uuid.uuid4().hex, SingleWeatherSteps({"testing": testing, "city_name": "Giessen"})).start()


def init():
    # Check if all external Programmes are installed
    external_programms.all_installed(config_manager.get_public().get("external_programms", []))

    # initialize logging
    level = logging.INFO if testing else logging.WARNING
    logging.basicConfig(format='%(module)s %(levelname)s: %(message)s', level=level)

    # create temp and out directory
    os.makedirs(resources.get_resource_path("temp"), exist_ok=True)
    os.makedirs(resources.get_resource_path("out"), exist_ok=True)


if __name__ == "__main__":
    main()
