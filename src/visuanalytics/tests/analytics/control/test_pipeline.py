import unittest

from visuanalytics.analytics.control.pipeline import Pipeline
from visuanalytics.analytics.control.procedures.steps import Steps


class StepTestDummy(Steps):
    """Hilfs Step implementierung für die Pipeline Tests."""

    def __init__(self, config):
        super().__init__(config)
        self.executed = 0
        self.executed_order = []

    def apis(self, pipeline_id: str):
        self.executed += 1
        self.executed_order.append("apis")

    def preprocessing(self, pipeline_id: str):
        self.executed += 1
        self.executed_order.append("preprocessing")

    def processing(self, pipeline_id: str):
        self.executed += 1
        self.executed_order.append("processing")

    def linking(self, pipeline_id: str):
        self.executed += 1
        self.executed_order.append("linking")


class StepTestDummyError(Steps):
    """Hilfs Step implementierung für die Pipeline Tests."""

    def apis(self, pipeline_id: str):
        raise FileNotFoundError

    def preprocessing(self, pipeline_id: str):
        pass

    def processing(self, pipeline_id: str):
        pass

    def linking(self, pipeline_id: str):
        pass


class TestPipeline(unittest.TestCase):
    """Teset die Pipeline Klasse."""

    def setUp(self):
        self.steps = StepTestDummy({})
        self.pipeline = Pipeline("1", self.steps)

    def test_start_step(self):
        """Testet den Start Schritt der Pipeline."""
        self.assertEqual(self.pipeline.progress(), (0, 5), "Invalid start Step")

    def test_end_step(self):
        """Testet Ob der End Schritt dem Letzten entspricht."""
        self.assertEqual(self.pipeline.start(), True)
        self.assertEqual(self.pipeline.progress(), (5, 5), "Invalid end Step")

    def test_all_steps_run(self):
        """Testet ob alle Schritte ausgeführt wurden."""
        self.pipeline.start()
        self.assertEqual(self.steps.executed, self.steps.step_max, "Pipeline not executed all Steps")

    def test_all_steps_run_in_order(self):
        """Testet ob alle Schritte in der richtigen reihnfolge ausgeführt wurden."""
        self.pipeline.start()
        self.assertListEqual(self.steps.executed_order, ["apis", "preprocessing", "processing", "linking"],
                             "Pipeline executed not all Steps in the right Order")

    def test_error(self):
        """Testet ob bei einem Fehler `False` zurückgegeben wird."""
        pipeline = Pipeline("2", StepTestDummyError({}))
        self.assertEqual(pipeline.start(), False, "Error on Pipeline not return False")
