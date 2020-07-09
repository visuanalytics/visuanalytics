"""
Modul welches die erstellten Videos nach einem angegebenem zeitraum wieder entfernt
"""

import os
from datetime import datetime, timedelta

from visuanalytics.server.db.db import logger
from visuanalytics.util import resources


def delete_on_time(jobs: dict, output_path: str):
    """
    Methode zum löschen alter erstellten Videos, diese löscht Video nach einem vorgegebenem zeitraum

    :param jobs: Eine Liste aller Jobs
    :param output_path: Der Pfad zum Output Ordner
    """
    logger.info("Checking if Videos needs to be deleted")
    files = os.listdir(resources.path_from_root(output_path))
    for file in files:
        for job in jobs["jobs"]:
            if file.startswith(job["name"]):
                file_date = file[len(job["name"]) + 1:len(file) - 4]
                date_time_obj = datetime.strptime(file_date, resources.DATE_FORMAT)
                time = job["schedule"].get("removal_time", {})
                if time != {}:
                    date_time_obj = date_time_obj + timedelta(days=time.get("days", 0),
                                                              hours=time.get("hours", 0))
                    if datetime.now() > date_time_obj:
                        os.remove(resources.path_from_root(os.path.join(output_path, file)))
                        logger.info("removal time of file " + file + " exceed, file has been deleted")


def delete_old_videos(job_name: str, output_path: str, count: int):
    """
    Methode zum löschen alter erstellten Videos, diese löscht alle Videos eines Jobs bis auf die vorgegebene Anzahl

    :param job_name: Ein String des Job Namens
    :param output_path: Der Pfad zum Output Ordner
    :param count: Die Anzahl an Video die erhalten bleiben sollen
    """
    logger.info("Checking if Videos needs to be deleted")
    files = os.listdir(resources.path_from_root(output_path))
    files.sort(reverse=True)
    delete = False
    for idx, file in enumerate(files):
        if file.startswith(job_name):
            if delete:
                os.remove(resources.path_from_root(os.path.join(output_path, file)))
                logger.info("old video " + file + " has been deleted")
            if idx + 1 == count:
                delete = True
