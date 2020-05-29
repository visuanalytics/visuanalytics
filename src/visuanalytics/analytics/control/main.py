import logging
import os

from visuanalytics.analytics.control.schedule import Scheduler
from visuanalytics.analytics.util import resources, external_programms, config_manager
# TODO(Max) Implement (current just for testing)
from visuanalytics.server.db import db

testing = True
h264_nvenc = False


def main():
    init()

    # TODO(max) run in other Thread
    Scheduler().start()

    # Pipeline(uuid.uuid4().hex, WeatherSteps({"testing": testing, "h264_nvenc": h264_nvenc})).start()
    # Pipeline(uuid.uuid4().hex, SingleWeatherSteps({"testing": testing, "city_name": "Giessen", "h264_nvenc": h264_nvenc})).start()
    # Pipeline(uuid.uuid4().hex, HistorySteps({"testing": testing, "h264_nvenc": h264_nvenc})).start()


def init():
    # Check if all external Programmes are installed
    external_programms.all_installed(config_manager.get_public().get("external_programms", []))

    # initialize logging
    level = logging.INFO if testing else logging.WARNING
    logging.basicConfig(format='%(module)s %(levelname)s: %(message)s', level=level)

    # init db
    db.init_db()

    # create temp and out directory
    os.makedirs(resources.get_resource_path("temp"), exist_ok=True)
    os.makedirs(resources.get_resource_path("out"), exist_ok=True)


if __name__ == "__main__":
    main()
