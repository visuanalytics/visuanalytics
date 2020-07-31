import json
import logging
from datetime import datetime

from visuanalytics.analytics.control.scheduler.scheduler import Scheduler
from visuanalytics.analytics.util.video_delete import delete_on_time, delete_memory_on_time
from visuanalytics.util import resources

logger = logging.getLogger(__name__)


class JsonScheduler(Scheduler):
    def __init__(self, file_path, base_config=None):
        super().__init__(base_config)
        self.__file_path = file_path

    @staticmethod
    def __get_jobs():
        with resources.open_resource("jobs.json") as file:
            return json.loads(file.read())

    def _check_all(self, now: datetime):
        logger.info(f"Check if something needs to be done at: {now}")

        jobs = self.__get_jobs()

        if int(now.strftime("%M")) == 00:
            delete_on_time(jobs, self.base_config["output_path"])
            if int(now.strftime("%H")) == 00:
                delete_memory_on_time(jobs)

        for job in jobs.get("jobs", []):
            # if Time is not current continue
            # TODO error if time is not set
            if not self._check_time(now, datetime.strptime(job["schedule"]["time"], "%H:%M").time()):
                continue
            # if date is set and not today continue
            if "date" in job and not datetime.strptime(job["schedule"]["date"], "%y-%m-%d").date() == now.date():
                # TODO Delete date schedule after run
                continue

            # if weekday is set and not the same as today continue
            if "weekday" in job and not now.weekday() in job["schedule"]["weekday"]:
                continue

            # if daily is set and not True continue
            if "daily" in job and not job["schedule"]["daily"]:
                continue

            # If Step id is valid run
            logger.info(f"Job {job['id']}:'{job['name']}' started")
            self._start_job(job['name'], job["steps"], job.get("config", {}))
