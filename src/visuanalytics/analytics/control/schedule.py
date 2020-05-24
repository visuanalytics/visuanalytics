import asyncio
import logging
import threading
import time
import uuid
from datetime import datetime, time as dt_time

from visuanalytics.analytics.control.pipeline import Pipeline
from visuanalytics.analytics.control.procedures.weather import WeatherSteps
from visuanalytics.analytics.control.procedures.weather_single import SingleWeatherSteps
from visuanalytics.server.db import job

logger = logging.getLogger(__name__)


class Scheduler(object):
    steps = {1: WeatherSteps, 2: SingleWeatherSteps}

    def __init__(self):
        super().__init__()

    def _check_time(self, now: datetime, run_time: dt_time):
        return now.hour == run_time.hour and now.minute == run_time.minute

    def _run_jobs(self, schedule_id):
        for job_step in job.get_all_schedules_steps(schedule_id):
            if job_step["step_id"] < len(Scheduler.steps):
                logger.info(f"Job {job_step['job_id']} started")
                # TODO(max) vtl. use Process instated to use other cpu cores
                # TODO(max) get config from db
                t = threading.Thread(
                    target=Pipeline(uuid.uuid4().hex,
                                    Scheduler.steps[job_step["step_id"]]({"testing": True})).start)
                t.start()
            else:
                # For the Step id in the Database where no Step Klass found
                logger.warning(f"Invalid Step id: '{job_step['step_id']}', for job {job_step['job_id']}")

    def check_all(self, now: datetime):
        logger.info(f"Check if something needs to be done at: {now}")
        for schedule in job.get_all_schedules():
            # Check if time is current Time
            if not self._check_time(now, datetime.strptime(schedule["time"], "%H:%M").time()):
                continue
            # If date is not none check if date is today
            if schedule["date"] and not schedule["date"] == now.date():
                continue

            # If weekday is not none check if weekday is same as today
            if schedule["weekday"] and not schedule["weekday"] == now.weekday():
                continue

            # if daily is not none check if daily is true
            if schedule["daily"] is not None and not schedule["daily"]:
                continue

            self._run_jobs(schedule["id"])

    def start(self):
        logger.info("Scheduler started")
        while True:
            while True:
                now = datetime.now().second

                # TODO maby in onother thread to make sure it doesn't take more than a minute
                self.check_all(datetime.now())

                time.sleep(60 - now)


async def test():
    await asyncio.sleep(10)
    print("test")
