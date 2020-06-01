import logging
import os

from visuanalytics.analytics.control.scheduler.scheduler import Scheduler
from visuanalytics.analytics.util import resources, external_programms, config_manager


# TODO(Max) Implement (current just for testing)
def main():
    config = config_manager.get_public()

    init(config)

    Scheduler().start()

    # Pipeline(uuid.uuid4().hex, WeatherSteps({"testing": config.get("testing", false), "h264_nvenc": config.get("h264_nvenc", false)})).start()
    # Pipeline(uuid.uuid4().hex, SingleWeatherSteps({"testing": config.get("testing", false), "h264_nvenc": config.get("h264_nvenc", false), "city_name": "Giessen"})).start()
    # Pipeline(uuid.uuid4().hex, HistorySteps({"testing": config.get("testing", false), "h264_nvenc": config.get("h264_nvenc", false)})).start()


def init(config: dict):
    # Check if all external Programmes are installed
    external_programms.all_installed(config.get("external_programms", []))

    # initialize logging
    level = logging.INFO if config.get("testing", False) else logging.WARNING
    logging.basicConfig(format='%(module)s %(levelname)s: %(message)s', level=level)

    # init db
    # DB is currently not in use
    # db.init_db()

    # create temp and out directory
    os.makedirs(resources.get_resource_path("temp"), exist_ok=True)
    os.makedirs(resources.get_resource_path("out"), exist_ok=True)


if __name__ == "__main__":
    main()
