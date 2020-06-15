import logging
from datetime import datetime

from visuanalytics.analytics.control.scheduler.scheduler import Scheduler
from visuanalytics.server.db import job

logger = logging.getLogger(__name__)


class DbScheduler(Scheduler):
    def __init__(self, base_config=None):
        super().__init__(base_config)

    def __run_jobs(self, schedule_id):
        for job_step in job.get_all_schedules_steps(schedule_id):
            logger.info(f"Job {job_step['job_id']} started")

            steps_name, config = job.get_job_run_infos(job_step['job_id'])

            self._start_job(steps_name, config)

    def _check_all(self, now: datetime):
        logger.info(f"Check if something needs to be done at: {now}")

        for schedule in job.get_all_schedules():
            # Check if time is current Time
            if not self._check_time(now, datetime.strptime(schedule["time"], "%H:%M").time()):
                continue
            # If date is not none check if date is today
            if schedule["date"] and not schedule["date"] == now.date():
                # TODO Delete date schedule after run
                continue

            # If weekday is not none check if weekday is same as today
            if schedule["weekday"] and not schedule["weekday"] == now.weekday():
                continue

            # if daily is not none check if daily is true
            if schedule["daily"] is not None and not schedule["daily"]:
                continue

            self.__run_jobs(schedule["id"])
