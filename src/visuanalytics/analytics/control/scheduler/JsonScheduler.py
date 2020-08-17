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
            return json.loads(file.read())

    @ignore_errors
    def __check(self, job, now):
        # if Time is not current continue
        if not self._check_time(now, datetime.strptime(job["schedule"]["time"], "%H:%M").time()):
            return
        # if date is set and not today continue
        if "date" in job and not datetime.strptime(job["schedule"]["date"], "%y-%m-%d").date() == now.date():
            return

        # if weekday is set and not the same as today continue
        if "weekday" in job and not now.weekday() in job["schedule"]["weekday"]:
            return

        # if daily is set and not True continue
        if "daily" in job and not job["schedule"]["daily"]:
            return

        # If Step id is valid run
        logger.info(f"Job {job['id']}:'{job['name']}' started")
        self._start_job(job['id'], job['name'], job["steps"], job.get("config", {}))

    def _check_all(self, now: datetime):
        logger.info(f"Check if something needs to be done at: {now}")

        jobs = self.__get_jobs()

        if int(now.strftime("%M")) == 00:
            delete_on_time(jobs, config_manager.STEPS_BASE_CONFIG["output_path"])

        for job in jobs.get("jobs", []):
            self.__check(job, now)
