import logging
import threading
import time
import uuid
from datetime import datetime, time as dt_time

from visuanalytics.analytics.control.pipeline import Pipeline

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

    def __init__(self, base_config=None):
        super().__init__()
        if base_config is None:
            base_config = {}
        self._base_config = base_config

    @staticmethod
    def _check_time(now: datetime, run_time: dt_time):
        return now.hour == run_time.hour and now.minute == run_time.minute

    def _start_job(self, steps_name: str, config: dict):
        # Add base_config if exists
        config = {**self._base_config, **config}

        t = threading.Thread(
            target=Pipeline(uuid.uuid4().hex,
                            steps_name,
                            config).start)
        t.start()

    def _check_all(self, now):
        assert False, "Not implemented"

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
                    self._check_all(datetime.now())
                except:
                    logger.exception("An error occurred: ")

                now = datetime.now().second

                time.sleep(60 - now)
