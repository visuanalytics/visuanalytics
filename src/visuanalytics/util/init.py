import logging
import os

from visuanalytics.server.db import db
from visuanalytics.util import external_programs, resources


def init(config: dict):
    # check if all external programs are installed
    external_programs.all_installed(config.get("external_programs"))

    # initialize logging
    level = logging.INFO if config.get("testing", False) else logging.WARNING
    logging.basicConfig(format='%(module)s %(levelname)s: %(message)s', level=level)

    # if Graphic mode -> init db
    if not config["console_mode"]:
        # init db
        db.init_db()

    # create temp dir
    os.makedirs(resources.get_resource_path("temp"), exist_ok=True)
    os.makedirs(resources.get_resource_path("memory"), exist_ok=True)

    # create out and instance dir
    out_dir = config.get("steps_base_config", {}).get("output_path", "out")
    os.makedirs(resources.path_from_root(out_dir), exist_ok=True)
    os.makedirs(resources.path_from_root("instance"), exist_ok=True)
