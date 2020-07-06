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

    def _check_all(self, now: datetime):
        logger.info(f"Check if something needs to be done at: {now}")

        for row in job.get_job_schedules():
            # Check if time is current Time
            if not self._check_time(now, datetime.strptime(row["time"], "%H:%M").time()):
                continue

            # If date is not none check if date is today
            if row["on_date"] and not row["date"] == now.date():
                # TODO Delete date schedule after run
                continue

            # If weekday is not none check if weekday is same as today
            if row["weekly"] and not now.weekday() in row["weekdays"]:
                continue

            # if daily is not none check if daily is true
            if row["daily"] is not None and not row["daily"]:
                continue

            self.__run_jobs(row["job_id"])
