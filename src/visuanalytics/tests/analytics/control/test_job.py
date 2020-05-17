import unittest

from visuanalytics.analytics.control.job import Job
from visuanalytics.analytics.control.procedures.steps import Steps


class StepTestDummy(Steps):
    """Hilfs Step implementierung für die Job Tests."""

    def __init__(self, config):
        super().__init__(config)
        self.executed = 0
        self.executed_order = []

    def apis(self, job_id: str):
        self.executed += 1
        self.executed_order.append("apis")

    def preprocessing(self, job_id: str):
        self.executed += 1
        self.executed_order.append("preprocessing")

    def processing(self, job_id: str):
        self.executed += 1
        self.executed_order.append("processing")

    def linking(self, job_id: str):
        self.executed += 1
        self.executed_order.append("linking")


class StepTestDummyError(Steps):
    """Hilfs Step implementierung für die Job Tests."""

    def apis(self, job_id: str):
        raise FileNotFoundError

    def preprocessing(self, job_id: str):
        pass

    def processing(self, job_id: str):
        pass

    def linking(self, job_id: str):
        pass


class TestJob(unittest.TestCase):
    """Teset die Job Klasse."""

    def setUp(self):
        self.steps = StepTestDummy({})
        self.job = Job("1", self.steps)

    def test_start_step(self):
        """Testet den Start Schritt des Jobs."""
        self.assertEqual(self.job.progress(), (0, 5), "Invalid start Step")

    def test_end_step(self):
        """Testet Ob der End Schritt dem Letzten entspricht."""
        self.assertEqual(self.job.start(), True)
        self.assertEqual(self.job.progress(), (5, 5), "Invalid end Step")

    def test_all_steps_run(self):
        """Testet ob alle Schritte ausgeführt wurden."""
        self.job.start()
        self.assertEqual(self.steps.executed, self.steps.step_max, "Job not executed all Steps")

    def test_all_steps_run_in_order(self):
        """Testet ob alle Schritte in der richtigen reihnfolge ausgeführt wurden."""
        self.job.start()
        self.assertListEqual(self.steps.executed_order, ["apis", "preprocessing", "processing", "linking"],
                             "Job executed not all Steps in the right Order")

    def test_error(self):
        """Testet ob bei einem Fehler `False` zurückgegeben wird."""
        job = Job("2", StepTestDummyError({}))
        self.assertEqual(job.start(), False, "Error on Job not return False")
