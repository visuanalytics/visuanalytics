import unittest

from visuanalytics.analytics.control.procedures.steps import Steps


class TestSteps(unittest.TestCase):
    """Testet die Klasse :class:`Steps`"""

    def setUp(self):
        self.steps = Steps({})

    def test_step_max(self):
        """Testet ob `step_max = max(seqence)` ist."""
        self.assertEqual(self.steps.step_max, max(self.steps.sequence), "Step_max must be equal to max(sequence)")

    def test_step_contains_error_steps(self):
        """Testet ob Fehler und Start Schritt vorhanden sind."""
        self.assertIn(-1, self.steps.sequence.keys(), "Sequence Must contains Not Started (-1) key")
        self.assertIn(-2, self.steps.sequence.keys(), "Sequence Must contains Error (-2) key")
