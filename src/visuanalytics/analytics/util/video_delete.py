"""
Modul welches die erstellten Videos nach einem angegebenem zeitraum wieder entfernt
"""

from datetime import datetime, timedelta

from visuanalytics.server.db.db import logger
from visuanalytics.analytics.util import resources

import os


def delete_videos(job, output_path, single=False):
    """
    Methode zum löschen alter erstellten Videos, sie hat 2 Funktionen:
    1. In der config kann angegeben wie lange ein Video verfügbar sein soll, nach diesem zeitraum wird es entfernt
    2. In der config kann aber auch ebenso eingestellt werden das ein Video gelöscht wird sobal ein neues der gleichen Art erstellt wurde

    :param job: Ein String oder eine Liste aller Jobnamen
    :param output_path: Der Pfad zum Output Ordner
    :param single: Je nachdem ob single true oder false ist wird _delete_on_time oder _delete_old_videos aufgerufen
    :return:
    """
    logger.info("Checking if Videos needs to be deleted")
    current = os.curdir
    os.chdir(resources.path_from_root(output_path))
    files = os.listdir()
    if single:
        files.sort(reverse=True)
        _delete_old_videos(job, files)
    else:
        _delete_on_time(job, files)
    os.chdir(current)


def _delete_on_time(jobs, files):
    for file in files:
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


def _delete_old_videos(job_name, files):
    second = False
    for file in files:
        if file.startswith(job_name):
            if second:
                os.remove(file)
                logger.info("old video " + file + " has been deleted")
            second = True
