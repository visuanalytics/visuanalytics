"""
Modul welches den Json Scheduler beeinhaltet.
Sorgt dafür das ein Video zur richtigen Zeit gerendert wird.
"""

import json
import logging
from datetime import datetime

from visuanalytics.analytics.control.scheduler.scheduler import Scheduler, ignore_errors
from visuanalytics.analytics.util.video_delete import delete_on_time
from visuanalytics.util import resources, config_manager

logger = logging.getLogger(__name__)


class JsonScheduler(Scheduler):
    def __init__(self, file_path):
        super().__init__()
        self.__file_path = file_path

    @staticmethod
    def __get_jobs():
        with resources.open_resource("jobs.json") as file:
            jobs = json.loads(file.read())

        with resources.open_resource("infoprovider.json") as file:
            return jobs, json.loads(file.read())

    @ignore_errors
    def __check(self, job, now, is_job):
        schedule = job["schedule"]

        # if Time is set and not current continue
        if "times" in schedule and not self._check_times(now, schedule["times"]):
            return

        # if date is set and not today continue
        if "dates" in schedule and not self._check_dates(now, schedule["dates"], True):
            return

        # if weekday is set and not the same as today continue
        if "weekday" in schedule and not now.weekday() in schedule["weekday"]:
            return

        # if daily is set and not True continue
        if "daily" in schedule and not schedule["daily"]:
            return

        # if interval is set and not the nex_run time is not now continue
        if "interval" in schedule and not self._check_interval(now, schedule["interval"], job["id"]):
            return

        # If Step id is valid run
        if is_job:
            logger.info(f"Job {job['id']}:'{job['name']}' started")
            self._start_job(job['id'], job['name'], job["steps"], job.get("config", {}))
        else:
            logger.info(f"Infoprovider {job['id']}:'{job['name']}' started")
            self._start_infoprovider(job['id'], job['name'], {})

    @ignore_errors
    def _check_all(self, now: datetime):
        logger.info(f"Check if something needs to be done at: {now}")
        jobs, infoproviders = self.__get_jobs()

        if int(now.strftime("%M")) == 00:
            delete_on_time(jobs["jobs"], config_manager.STEPS_BASE_CONFIG["output_path"], "name",
                           lambda j: "removal_time" in j["schedule"],
                           lambda j: j["schedule"].get("removal_time", None))

        for job in jobs.get("jobs", []):
            self.__check(job, now, True)

        for infoprovider in infoproviders.get("infoproviders", []):
            self.__check(infoprovider, now, False)
