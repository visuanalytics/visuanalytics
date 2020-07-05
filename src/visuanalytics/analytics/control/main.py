import logging
import os
import threading

from visuanalytics.analytics.control.scheduler.DbScheduler import DbScheduler
from visuanalytics.analytics.control.scheduler.JsonScheduler import JsonScheduler
from visuanalytics.analytics.util import resources, external_programs, config_manager
from visuanalytics.server.db import db
from visuanalytics.server import server


def main():
    config = config_manager.get_config()

    app = server.create_app()

    with app.app_context():
        init(config)

    app.run()

    # if db is in use start DbScheduler else run JsonScheduler
    if config["db"]["use"]:
        DbScheduler(config["steps_base_config"]).start()
    else:
        JsonScheduler("jobs.json", config["steps_base_config"]).start()


def init(config: dict):
    # check if all external programs are installed
    external_programs.all_installed(config.get("external_programs"))

    # initialize logging
    level = logging.INFO if config.get("testing", False) else logging.WARNING
    logging.basicConfig(format='%(module)s %(levelname)s: %(message)s', level=level)

    # if db is in use initialize database
    if config["db"]["use"]:
        # init db
        db.init_db()

    # create temp dir
    os.makedirs(resources.get_resource_path("temp"), exist_ok=True)
    os.makedirs(resources.get_resource_path("memory"), exist_ok=True)

    # create out and instance dir
    out_dir = config.get("steps_base_config", {}).get("output_path", "out")
    os.makedirs(resources.path_from_root(out_dir), exist_ok=True)
    os.makedirs(resources.path_from_root("instance"), exist_ok=True)


if __name__ == "__main__":
    main()
