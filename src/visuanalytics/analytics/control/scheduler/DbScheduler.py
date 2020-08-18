import logging
from datetime import datetime

from visuanalytics.analytics.control.scheduler.scheduler import Scheduler, ignore_errors
from visuanalytics.server.db import job
from visuanalytics.server.db.job import get_interval

logger = logging.getLogger(__name__)


class DbScheduler(Scheduler):
    def __run_jobs(self, job_id):
        job_name, json_file_name, config = job.get_job_run_info(str(job_id))
        logger.info(f"Job {job_id}: '{job_name}' started")
        self._start_job(job_id, job_name, json_file_name, config, True)

    @ignore_errors
    def __check(self, row, now):
        # check if type is "interval" and job has to be run
        if row["type"] == "interval":
            if self._check_interval(now, get_interval(row), row["job_id"]):
                self.__run_jobs(row["job_id"])
            return

        # check if time is current Time
        if not self._check_time(now, datetime.strptime(row["time"], "%H:%M").time()):
            return

        # check if date is today
        if row["type"] == "on_date" and row["date"] == now.date():
            # TODO Delete date schedule after run
            self.__run_jobs(row["job_id"])
            return

        # if type is "weekly" and check if weekday is same as today
        if row["type"] == "weekly" and now.weekday() in map(int, row["weekdays"].split(",")):
            self.__run_jobs(row["job_id"])
            return

        # check if type is "daily"
        if row["type"] == "daily":
            self.__run_jobs(row["job_id"])
            return

    @ignore_errors
    def _check_all(self, now: datetime):
        logger.info(f"Check if something needs to be done at: {now}")

        # todo für db scheduler muss noch delete_old_on_new abgefragt werden (da wo jetzt false steht)

        for row in job.get_job_schedules():
            self.__check(row, now)
