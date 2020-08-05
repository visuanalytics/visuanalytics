import logging
from datetime import datetime

from visuanalytics.analytics.control.scheduler.scheduler import Scheduler
from visuanalytics.server.db import job

logger = logging.getLogger(__name__)


class DbScheduler(Scheduler):
    def __init__(self, base_config=None):
        super().__init__(base_config)

    def __run_jobs(self, job_id):
        job_name, json_file_name, config = job.get_job_run_info(str(job_id))
        logger.info(f"Job {job_id}: '{job_name}' started")
        self._start_job(job_name, json_file_name, config)
        # todo für db scheduler muss noch delete_old_on_new abgefragt werden (da wo jetzt false steht)

    def _check_all(self, now: datetime):
        logger.info(f"Check if something needs to be done at: {now}")

        for row in job.get_job_schedules():
            # check if time is current Time
            if not self._check_time(now, datetime.strptime(row["time"], "%H:%M").time()):
                continue

            # check if date is today
            if row["date"] == now.date():
                # TODO Delete date schedule after run
                self.__run_jobs(row["job_id"])
                continue

            # if type is "weekly" check if weekday is same as today
            if row["type"] == "weekly" and now.weekday() in map(int, row["weekdays"].split(",")):
                self.__run_jobs(row["job_id"])
                continue

            # check if type is "daily"
            if row["type"] == "daily":
                self.__run_jobs(row["job_id"])
                continue
