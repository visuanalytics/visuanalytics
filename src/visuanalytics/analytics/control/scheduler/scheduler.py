import functools
import logging
import re
import threading
import time
import uuid
from datetime import datetime, time as dt_time, timedelta

from visuanalytics.analytics.control.procedures.pipeline import Pipeline
from visuanalytics.util import config_manager

logger = logging.getLogger(__name__)


def ignore_errors(func):
    @functools.wraps(func)
    def ignore_error_func(*kwargs, **args):
        try:
            func(*kwargs, **args)
        except (KeyboardInterrupt, SystemExit):
            raise
        except BaseException:
            logger.exception("An error occurred: ")

    return ignore_error_func


class Scheduler(object):
    """Klasse zum Ausführen der Jobs an vorgegebenen Zeitpunkten.

    Wenn :func:`start` aufgerufen wird, testet die Funktion jede Minute, ob ein Job ausgeführt werden muss.
     Ist dies der Fall, wird die dazugehörige Konfigurationsdatei aus der Datenbank geladen und
     der Job wird in einem anderen Thread ausgeführt. Um zu bestimmen, ob ein Job ausgeführt werden muss,
     werden die Daten aus der Datenbank mithilfe der Funktion :func:job.get_all_schedules` aus der Datenbak geholt
     und getestet, ob diese jetzt ausgeführt werden müssen.

    :param steps: Dictionary zum Übersetzen der Step-ID zu einer Step-Klasse.
    :type steps: dict
    """

    def __init__(self):
        self._interval = {}

    @staticmethod
    def _check_time(now: datetime, run_time: dt_time):
        return now.hour == run_time.hour and now.minute == run_time.minute

    @staticmethod
    def _check_times(now: datetime, run_times: list):
        for run_time in run_times:
            if Scheduler._check_time(now, datetime.strptime(run_time, "%H:%M").time()):
                return True

        return False

    @staticmethod
    def _check_dates(now: datetime, run_dates: list, date_is_string=False):
        for run_date in run_dates:
            # if run_date is string, convert to date Object
            if date_is_string:
                run_date = datetime.strptime(run_date, "%y-%m-%d").date()

            if now.date() == run_date:
                return True

        return False

    @staticmethod
    def _check_datetime(now: datetime, run_time: datetime):
        return now.date() >= run_time.date() and now.hour >= run_time.hour and now.minute >= run_time.minute

    def _check_interval(self, now: datetime, interval: dict, job_id: int):
        next_run = self._interval.get(job_id, None)
        run = False

        if not next_run is None:
            run = self._check_datetime(now, next_run)

        if run or next_run is None:
            self._interval[job_id] = now + timedelta(**interval)
            logger.info(f"job({job_id}) is executed next at {self._interval.get(job_id, None)}")

        return run

    def _start_job(self, job_id: int, job_name: str, steps_name: str, config: dict, log_to_db=False):
        # Add base_config if exists
        config = {**config_manager.STEPS_BASE_CONFIG, **config}
        config["job_name"] = re.sub(r'\s+', '-', job_name.strip())

        t = threading.Thread(
            target=Pipeline(job_id,
                            uuid.uuid4().hex,
                            steps_name,
                            config,
                            log_to_db
                            ).start)
        t.start()

    @ignore_errors
    def _check_all(self, now):
        assert False, "Not implemented"

    def start(self):
        """Startet den Scheduler (Blocking).

        Testet jede Minute, ob Jobs ausgeführt werden müssen. Ist dies der Fall, werden diese in
        einem anderen Thread ausgeführt.
        """
        logger.info("Scheduler started")
        while True:
            while True:
                # TODO(max) maby in onother thread to make sure it doesn't take more than a minute
                self._check_all(datetime.now())

                now = datetime.now().second

                time.sleep(60 - now)

    def start_unblocking(self):
        """Startet den Scheduler in einem neuen Thread.

        Testet jede Minute, ob Jobs ausgeführt werden müssen. Ist dies der Fall, werden diese in
        einem anderen Thread ausgeführt.
        """
        threading.Thread(target=self.start, daemon=True).start()
