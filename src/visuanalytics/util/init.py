import logging
import os

from visuanalytics.server.db import db
from visuanalytics.server.db import job
from visuanalytics.util import external_programs, resources, config_manager


def init(config: dict):
    # check if all external programs are installed
    external_programs.all_installed(config.get("external_programs"))

    # initialize logging
    level = logging.INFO if config.get("testing", False) else logging.WARNING
    logging.basicConfig(format='%(module)s %(levelname)s: %(message)s', level=level)

    # if Graphic mode -> init db
    if not config["console_mode"]:
        # init db
        db.init_db(config["db"].get("topics", []), config["db"]["db_path"])

    # Init Log_limit
    job.LOG_LIMIT = config["log_limit"]

    # INit STEPS_BASE_CONFIG
    config_manager.STEPS_BASE_CONFIG = config["steps_base_config"]

    # Init resources locations
    res_paths = config["resources"]
    res_sub_paths = res_paths["sub_paths"]

    resources.RESOURCES_LOCATION = res_paths["main_path"]
    resources.TEMP_LOCATION = res_sub_paths["temp"]
    resources.IMAGES_LOCATION = res_sub_paths["images"]
    resources.MEMORY_LOCATION = res_sub_paths["memory"]

    # create resources folders
    os.makedirs(resources.path_from_root(res_paths["main_path"]), exist_ok=True)
    os.makedirs(resources.get_resource_path(res_sub_paths["temp"]), exist_ok=True)
    os.makedirs(resources.get_resource_path(res_sub_paths["images"]), exist_ok=True)
    os.makedirs(resources.get_resource_path(res_sub_paths["memory"]), exist_ok=True)

    # create out and instance folder
    out_dir = config.get("steps_base_config", {}).get("output_path", "out")
    os.makedirs(resources.path_from_root(out_dir), exist_ok=True)
    os.makedirs(resources.path_from_root("instance"), exist_ok=True)
