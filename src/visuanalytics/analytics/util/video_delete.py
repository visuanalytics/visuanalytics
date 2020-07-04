from datetime import datetime, timedelta

from visuanalytics.server.db.db import logger
from visuanalytics.analytics.util import resources

import os


def delete_on_time(jobs, base_config):
    logger.info("Checking if Videos needs to be deleted")
    current = os.curdir
    os.chdir(resources.path_from_root(base_config["output_path"]))
    for file in os.listdir():
        for job in jobs["jobs"]:
            if file.startswith(job["name"]):
                file_date = file[len(job["name"]) + 1:len(file) - 4]
                date_time_obj = datetime.strptime(file_date, '%Y-%m-%d_%H-%M.%S')
                time = job.get("removal_time", {"days": 7})
                date_time_obj = date_time_obj + timedelta(days=time.get("days", 7),
                                                          hours=time.get("hours", 0),
                                                          minutes=time.get("minutes", 0))
                if datetime.now() > date_time_obj:
                    os.remove(file)
                    logger.info("removal time of file " + file + " exceed, file has been deleted")


def delete_old_videos(steps_config):
    logger.info("Checking if Videos needs to be deleted")
    current = os.curdir
    os.chdir(resources.path_from_root(steps_config["output_path"]))
    second = False
    files = os.listdir()
    files.sort(reverse=True)
    for file in files:
        if file.startswith(steps_config["job_name"]):
            if second:
                os.remove(file)
                logger.info("old video " + file + " has been deleted")
            second = True
    os.chdir(current)
