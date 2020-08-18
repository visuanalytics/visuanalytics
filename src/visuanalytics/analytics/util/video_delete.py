"""
Modul, welches die erstellten Videos nach einem angegebenem Zeitraum wieder entfernt.
"""

import os
import re
from datetime import datetime, timedelta

from visuanalytics.server.db.db import logger
from visuanalytics.util import resources
from visuanalytics.util.resources import get_resource_path, MEMORY_LOCATION


def delete_video(steps_config, __config):
    if steps_config.get("fix_names", None) is not None:
        fix_names = []
        if steps_config["fix_names"].get("names", None) is None:
            for i in range(1, steps_config["fix_names"].get("count", 3) + 1):
                fix_names.append(f"_{i}")
        else:
            fix_names = steps_config["fix_names"]["names"]
        delete_fix_name_videos(steps_config["job_name"], fix_names,
                               steps_config["output_path"], __config,
                               steps_config.get("thumbnail", False))
    else:
        if steps_config.get("keep_count", -1) > 0:
            delete_amount_videos(steps_config["job_name"], steps_config["output_path"],
                                 steps_config["keep_count"])


def delete_on_time(jobs: dict, output_path: str):
    """
    Methode zum Löschen alter (erstellter) Videos nach einem vorgegebenem Zeitraum.

    :param jobs: eine Liste aller Jobs
    :param output_path: Pfad zum Output-Ordner
    """
    logger.info("Checking if videos needs to be deleted")
    files = os.listdir(resources.path_from_root(output_path))
    for file in files:
        for job in jobs["jobs"]:
            job["name"] = re.sub(r'\s+', '-', job["name"].strip())
            if file.startswith(job["name"]):
                try:
                    file_without_thumb = file.replace("_thumbnail", "")
                    file_date = file_without_thumb[len(job["name"]) + 1:len(file_without_thumb) - 4]
                    date_time_obj = datetime.strptime(file_date, resources.DATE_FORMAT)
                    time = job["schedule"].get("removal_time", {})
                    if time != {}:
                        date_time_obj = date_time_obj + timedelta(days=time.get("days", 0),
                                                                  hours=time.get("hours", 0))
                        if datetime.now() > date_time_obj:
                            os.remove(resources.path_from_root(os.path.join(output_path, file)))
                            logger.info("removal time of file " + file + " exceeded, file has been deleted")
                except ValueError:
                    pass


def delete_amount_videos(job_name: str, output_path: str, count: int):
    """
    Methode zum Löschen alter (erstellten) Videos. Diese Methode löscht alle Videos eines Jobs bis auf die vorgegebene
    Anzahl (die letzten x Videos sollen erhalten bleiben).

    :param job_name: ein String des Job Namens
    :param output_path: Pfad zum Output-Ordner
    :param count: Die Anzahl an Videos, die erhalten bleiben sollen
    """
    logger.info("Checking if videos or images need to be deleted")
    files = os.listdir(resources.path_from_root(output_path))
    files.sort(reverse=True)
    delete = [[0, False], [0, False]]
    for file in files:
        if file.startswith(job_name):
            i = 0 if file.endswith(".mp4") else 1
            delete[i][0] += 1
            if delete[i][1]:
                os.remove(resources.path_from_root(os.path.join(output_path, file)))
                logger.info("old file " + file + " has been deleted")
            if delete[i][0] == count:
                delete[i][1] = True


def delete_fix_name_videos(job_name: str, fix_names: list, output_path: str, values: dict, thumbnail: bool):
    """
    Methode zum Umbenennen der erstellten Videos nach dem Style in der Config.

    :param job_name: String des Job Namens
    :param fix_names: eine Liste wie die Videos heißen sollen
    :param output_path: Pfad zum Output Ordner
    :param values: Werte aus der JSON-Datei
    :param sym: Boolean, ob Thumbnails ebenso umbenannt werden sollen
    """
    logger.info("Checking if videos or images need to be deleted")
    out = resources.path_from_root(os.path.join(output_path))
    sym = ["", "_thumbnail"]
    format = [".mp4", ".png"]
    x = 2 if thumbnail else 1
    for i in range(0, x):
        if os.path.exists(os.path.join(out, f"{job_name}{fix_names[len(fix_names) - 1]}{sym[i]}{format[i]}")):
            os.remove(os.path.join(out, f"{job_name}{fix_names[len(fix_names) - 1]}{sym[i]}{format[i]}"))
            logger.info(
                f"old file {job_name}{fix_names[len(fix_names) - 1]}{sym[i]}{format[i]} has been deleted")
        for idx, name in enumerate(reversed(fix_names)):
            if idx <= len(fix_names) - 2:
                if os.path.exists(
                        os.path.join(out, f"{job_name}{fix_names[len(fix_names) - 2 - idx]}{sym[i]}{format[i]}")):
                    os.rename(
                        os.path.join(out, f"{job_name}{fix_names[len(fix_names) - 2 - idx]}{sym[i]}{format[i]}"),
                        os.path.join(out, f"{job_name}{name}{sym[i]}{format[i]}"))

    os.rename(values["sequence"], os.path.join(out, f"{job_name}{fix_names[0]}.mp4"))
    values["sequence"] = os.path.join(out, f"{job_name}{fix_names[0]}.mp4")

    if thumbnail:
        os.rename(values["thumbnail"], os.path.join(out, f"{job_name}{fix_names[0]}_thumbnail.png"))
        values["thumbnail"] = os.path.join(out, f"{job_name}{fix_names[0]}_thumbnail.png")


def delete_memory_files(job_name: str, name: str, count: int):
    """Löscht memory-Dateien, sobald zu viele vorhanden sind.

    :param job_name: Job-Name, von dem die Funktion aufgerufen wurde.
    :param name: Name des Dictionaries, das exportiert wurde
    :param count: Anzahl an memory-Dateien, die vorhanden sein sollen (ältere werden gelöscht)
    """
    files = os.listdir(get_resource_path(os.path.join(MEMORY_LOCATION, job_name, name)))
    files.sort(reverse=True)
    for idx, file in enumerate(files):
        if idx >= count:
            os.remove(get_resource_path(os.path.join(MEMORY_LOCATION, job_name, name, file)))
            logger.info(
                f"old memory file {file} has been deleted")
