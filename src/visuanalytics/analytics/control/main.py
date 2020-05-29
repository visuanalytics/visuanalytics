import logging
import os

from visuanalytics.analytics.control import job_from_config
from visuanalytics.analytics.control.schedule import Scheduler
from visuanalytics.analytics.util import resources, external_programms, config_manager

# TODO(Max) Implement (current just for testing)

testing = True
h264_nvenc = False


def main():
    init()

    # TODO(max) run in other Thread
    Scheduler(job_from_config.get_all_schedules, job_from_config.get_all_schedules_steps,
              job_from_config.get_job_config).start()

    # Pipeline(uuid.uuid4().hex, WeatherSteps({"testing": testing, "h264_nvenc": h264_nvenc})).start()
    # Pipeline(uuid.uuid4().hex, SingleWeatherSteps({"testing": testing, "city_name": "Giessen", "h264_nvenc": h264_nvenc})).start()
    # Pipeline(uuid.uuid4().hex, HistorySteps({"testing": testing, "h264_nvenc": h264_nvenc})).start()


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
