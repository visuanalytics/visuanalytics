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
    """Klasse zum ausführen der Jobs an Vorgegebenen zeitpunkten.

    Wenn :func:`start` aufgerufen wird testet die Funktion jede minute ob ein job ausgeführt werden muss,
     ist dies der fall wird die dazugehörige config aus der Datenbank geladen und
     der Job wird in einem anderen Thread ausgeführt. Um zu besstimmen ob ein Job ausgeführt werden muss
     werden die daten aus der Datenbank mithilfe der Funktion :func:job.get_all_schedules` aus der Datenbak geholt
     und getestet ob diese jetzt ausgeführt werden mussen.

    :param steps: Dictionary zum überstezen der Step id zu einer Step Klasse.
    :type steps: dict
    """
    steps = {1: WeatherSteps, 2: SingleWeatherSteps}

    def __init__(self, get_all_schedules=job.get_all_schedules, get_all_steps=job.get_all_schedules_steps,
                 get_job_config=job.get_job_config):
        super().__init__()
        self.__get_all_schedules = get_all_schedules
        self.__get_all_steps = get_all_steps
        self.__get_job_config = get_job_config

    def __check_time(self, now: datetime, run_time: dt_time):
        return now.hour == run_time.hour and now.minute == run_time.minute

    def __run_jobs(self, schedule_id):
        for job_step in self.__get_all_steps(schedule_id):
            # If Step id is valid run
            if job_step["step_id"] < len(Scheduler.steps):
                logger.info(f"Job {job_step['job_id']} started")

                config = self.__get_job_config(job_step['job_id'])

                t = threading.Thread(
                    target=Pipeline(uuid.uuid4().hex,
                                    Scheduler.steps[job_step["step_id"]](config)).start)
                t.start()
            else:
                # For the Step id in the Database where no Step Klass found
                logger.warning(f"Invalid Step id: '{job_step['step_id']}', for job {job_step['job_id']}")

    def __check_all(self, now: datetime):
        logger.info(f"Check if something needs to be done at: {now}")

        for schedule in self.__get_all_schedules():
            # Check if time is current Time
            if not self.__check_time(now, datetime.strptime(schedule["time"], "%H:%M").time()):
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

    def start(self):
        """Started den Scheduler.

        Testet jede Minute ob jobs ausgeführt werden müssen, ist dies der fall werden diese in
        einem andern Thread ausgeführt.
        """
        logger.info("Scheduler started")
        while True:
            while True:
                # TODO(max) vtl move try catch in for Loop to continue looping and not skip all jobs
                try:
                    # TODO(max) maby in onother thread to make sure it doesn't take more than a minute
                    self.__check_all(datetime.now())
                except:
                    logger.exception("An error occurred: ")

                now = datetime.now().second

                time.sleep(60 - now)
