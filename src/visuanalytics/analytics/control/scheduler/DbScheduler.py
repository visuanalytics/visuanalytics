"""
Modul welches den Datenbank Scheduler beeinhaltet.
Sorgt dafür das ein Video zur richtigen Zeit gerendert wird.
"""

import logging
from datetime import datetime

from visuanalytics.analytics.control.scheduler.scheduler import Scheduler, ignore_errors
from visuanalytics.analytics.util.video_delete import delete_on_time
from visuanalytics.server.db import job
from visuanalytics.server.db.job import get_interval
from visuanalytics.util import config_manager

logger = logging.getLogger(__name__)


class DbScheduler(Scheduler):
    def __run_jobs(self, job_id, is_job):
        if is_job:
            job_name, json_file_name, config = job.get_job_run_info(str(job_id))
            logger.info(f"Job {job_id}: '{job_name}' started")
            self._start_job(job_id, job_name, json_file_name, config, True)
        else:
            infoprovider_name = job.get_infoprovider_run_info(str(job_id))
            logger.info(f"Infoprovider {job_id}: '{infoprovider_name}' started")
            self._start_infoprovider(job_id, infoprovider_name, True)

    @ignore_errors
    def __check(self, row, now, is_job):
        # check if type is "interval" and job has to be run
        if row["s_type"] == "interval":
            if self._check_interval(now, get_interval(row), row["job_id" if is_job else "infoprovider_id"], True):
                self.__run_jobs(row["job_id" if is_job else "infoprovider_id"], is_job)
            return

        # check if time is current Time
        if not self._check_time(now, datetime.strptime(row["time"], "%H:%M").time()):
            return

        # check if date is today
        if row["s_type"] == "on_date" and row["date"] == now.date():
            # TODO Delete date schedule after run
            self.__run_jobs(row["job_id" if is_job else "infoprovider_id"], is_job)
            return

        # if type is "weekly" and check if weekday is same as today
        if row["s_type"] == "weekly" and now.weekday() in map(int, row["weekdays"].split(",")):
            self.__run_jobs(row["job_id" if is_job else "infoprovider_id"], is_job)
            return

        # check if type is "daily"
        if row["s_type"] == "daily":
            self.__run_jobs(row["job_id" if is_job else "infoprovider_id"], is_job)
            return

    def __get_delete_time(self, time):
        del_time = {}
        if not time["days"] is None:
            del_time["days"] = time["days"]

        if not time["hours"] is None:
            del_time["hours"] = time["hours"]

        return del_time

    @ignore_errors
    def _check_all(self, now: datetime):
        logger.info(f"Check if something needs to be done at: {now}")

        jobs = job.get_job_schedules()
        infoproviders = job.get_infoprovider_schedules()

        if int(now.strftime("%M")) == 00:
            delete_on_time(jobs, config_manager.STEPS_BASE_CONFIG["output_path"], "job_name",
                           lambda j: j["d_type"] == "on_day_hour",
                           lambda j: self.__get_delete_time(j))

        for j in jobs:
            self.__check(j, now, True)

        for i in infoproviders:
            self.__check(i, now, False)
