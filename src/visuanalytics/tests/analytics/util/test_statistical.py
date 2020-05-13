from visuanalytics.analytics.util import statistical
import unittest


class ModeTest(unittest.TestCase):

    def test_empty_list(self):
        self.assertRaises(IndexError, lambda: statistical.mode([]))

    def test_singleton_list(self):
        list = [7]
        actual = statistical.mode(list)
        expected = 7
        self.assertEqual(actual, expected)

    def test_single_mode(self):
        list = [1, 3, 2, 1, 5, 4, 6, -2, 0, 0, 3, 1, 10, 1]
        actual = statistical.mode(list)
        expected = 1
        self.assertEqual(actual, expected)

    def test_multiple_modes(self):
        list = [1, 2, 7, 1, 4, 10, 1, 2, 2]
        actual = statistical.mode(list)
        expected = 1
        self.assertEqual(actual, expected)
