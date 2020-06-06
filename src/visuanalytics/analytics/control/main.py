import logging
import os

from visuanalytics.analytics.control.scheduler.DbScheduler import DbScheduler
from visuanalytics.analytics.control.scheduler.JsonScheduler import JsonScheduler
from visuanalytics.analytics.util import resources, external_programms, config_manager
from visuanalytics.server.db import db


def main():
    config = config_manager.get_public()

    init(config)

    # If db is in use Start DbScheduler else run JsonScheduler
    if config["db"]["use"]:
        DbScheduler(config["steps_base_config"]).start()
    else:
        JsonScheduler("jobs.json", config["steps_base_config"]).start()


def init(config: dict):
    # Check if all external Programmes are installed
    external_programms.all_installed(config.get("external_programms"))

    # initialize logging
    level = logging.INFO if config.get("testing", False) else logging.WARNING
    logging.basicConfig(format='%(module)s %(levelname)s: %(message)s', level=level)

    # if db is in use Inizalisize Database
    if config["db"]["use"]:
        # init db
        db.init_db()

    # create temp dir
    os.makedirs(resources.get_resource_path("temp"), exist_ok=True)

    # create out und instance dir
    out_dir = config.get("steps_base_config", {}).get("output_path", "out")
    os.makedirs(resources.path_from_root(out_dir), exist_ok=True)
    os.makedirs(resources.path_from_root("instance"), exist_ok=True)


if __name__ == "__main__":
    main()
