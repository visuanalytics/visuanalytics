"""
Modul welches die erstellten Videos nach einem angegebenem Zeitraum wieder entfernt
"""

import os
from datetime import datetime, timedelta

from visuanalytics.server.db.db import logger
from visuanalytics.util import resources


def delete_video(steps_config, __config):
    """
    Ruft die verschiedenen Untermethoden der Video/Memory delete methoden auf.
    Sorgt dafür das es immern nur die max. Anzahl an Videos gibt die in der config vorgegeben
    sowie das die Namenskonventionen stimmen

    :param steps_config: Werte aus der config Datei
    :param __config: Werte aus der JSON-Datei
    """
    logger.info("Checking if Videos or Images needs to be deleted")
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


def delete_memory_on_time(jobs: dict):
    """
    Löscht Memory Datein nach dem angegebenm zeitraum in der config

    :param jobs: Liste aller Jobs die ausgeführt werden
    :return:
    """
    for job in jobs["jobs"]:
        time = job["schedule"].get("memory_removal_time", {})
        path = os.path.join(resources.get_resource_path(resources.MEMORY_LOCATION), job["name"])
        if os.path.exists(path):
            files = _get_list_of_files(path)
            for file in files:
                file_short = os.path.basename(file).replace(".json", "")
                date_time_obj = datetime.strptime(file_short, "%Y-%m-%d")
                if time != {}:
                    date_time_obj = date_time_obj + timedelta(days=time.get("days", 30))
                    if datetime.now() > date_time_obj:
                        os.remove(file)
                        logger.info(f"removal time of memory file {file_short}.json exceed, file has been deleted")


def _get_list_of_files(dir_name):
    list_of_files = os.listdir(dir_name)
    all_files = list()
    for entry in list_of_files:
        full_path = os.path.join(dir_name, entry)
        if os.path.isdir(full_path):
            all_files = all_files + _get_list_of_files(full_path)
        else:
            all_files.append(full_path)
    return all_files


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
                            logger.info(f"removal time of file {file} exceed, file has been deleted")
                except ValueError:
                    pass


def delete_amount_videos(job_name: str, output_path: str, count: int):
    """
    Methode zum löschen alter erstellten Videos, diese löscht alle Videos eines Jobs bis auf die vorgegebene Anzahl
    :param job_name: Ein String des Job Namens
    :param output_path: Der Pfad zum Output Ordner
    :param count: Die Anzahl an Video die erhalten bleiben sollen
    """
    files = os.listdir(resources.path_from_root(output_path))
    files.sort(reverse=True)
    delete = [[0, False], [0, False]]
    for file in files:
        if file.startswith(job_name):
            i = 0 if file.endswith(".mp4") else 1
            delete[i][0] += 1
            if delete[i][1]:
                os.remove(resources.path_from_root(os.path.join(output_path, file)))
                logger.info(f"old file {file} has been deleted")
            if delete[i][0] == count:
                delete[i][1] = True


def delete_fix_name_videos(job_name: str, fix_names: list, output_path: str, values: dict, thumbnail: bool):
    """
    Methode zum umbenenen der erstellten Video nach dem style in der config

    :param job_name: Ein String des Job Namens
    :param fix_names: Eine Liste wie die Video zu heißen haben
    :param output_path: Der Pfad zum Output Ordner
    :param values: Werte aus der JSON-Datei
    :param thumbnail: Boolean ob Thumbnails ebenso umbenannt werden sollen
    """
    out = resources.path_from_root(os.path.join(output_path))
    sym = ["", "_thumbnail"]
    format = [".mp4", ".png"]
    x = 2 if thumbnail else 1
    for i in range(0, x):
        old_file = os.path.join(out, f"{job_name}{fix_names[len(fix_names) - 1]}{sym[i]}{format[i]}")
        if os.path.exists(old_file):
            os.remove(old_file)
            logger.info(f"old file {old_file} has been deleted")
        for idx, name in enumerate(reversed(fix_names)):
            if idx <= len(fix_names) - 2:
                old_file = os.path.join(out, f"{job_name}{fix_names[len(fix_names) - 2 - idx]}{sym[i]}{format[i]}")
                if os.path.exists(old_file):
                    os.rename(
                        os.path.join(out, old_file),
                        os.path.join(out, f"{job_name}{name}{sym[i]}{format[i]}"))

    sequence_path = os.path.join(out, f"{job_name}{fix_names[0]}.mp4")
    os.rename(values["sequence"], sequence_path)
    values["sequence"] = sequence_path

    if thumbnail:
        thumbnail_path = os.path.join(out, f"{job_name}{fix_names[0]}_thumbnail.png")
        os.rename(values["thumbnail"], thumbnail_path)
        values["thumbnail"] = thumbnail_path
