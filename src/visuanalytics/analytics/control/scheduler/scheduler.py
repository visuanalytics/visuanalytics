import functools
import logging
import re
import threading
import time
import uuid
from datetime import datetime, time as dt_time

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

    Wenn :func:`start` aufgerufen wird, testet die Funktion jede Minute, ob ein Job ausgeführt werden muss,
     ist dies der Fall, wird die dazugehörige config aus der Datenbank geladen und
     der Job wird in einem anderen Thread ausgeführt. Um zu bestimmen, ob ein Job ausgeführt werden muss,
     werden die Daten aus der Datenbank mithilfe der Funktion :func:job.get_all_schedules` aus der Datenbak geholt
     und getestet, ob diese jetzt ausgeführt werden mussen.

    :param steps: Dictionary zum übersetzen der Step id zu einer Step Klasse.
    :type steps: dict
    """

    @staticmethod
    def _check_time(now: datetime, run_time: dt_time):
        return now.hour == run_time.hour and now.minute == run_time.minute

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

    def _check_all(self, now):
        assert False, "Not implemented"

    def start(self):
        """Started den Scheduler (Blocking).

        Testet jede Minute, ob Jobs ausgeführt werden müssen, ist dies der Fall werden diese in
        einem andern Thread ausgeführt.
        """
        logger.info("Scheduler started")
        while True:
            while True:
                try:
                    # TODO(max) maby in onother thread to make sure it doesn't take more than a minute
                    self._check_all(datetime.now())
                except (KeyboardInterrupt, SystemExit):
                    raise
                except:
                    logger.exception("An error occurred: ")

                now = datetime.now().second

                time.sleep(60 - now)

    def start_unblocking(self):
        """Started den Scheduler in einem neuen Thread.

        Testet jede Minute, ob Jobs ausgeführt werden müssen, ist dies der Fall werden diese in
        einem andern Thread ausgeführt.
        """
        threading.Thread(target=self.start, daemon=True).start()
