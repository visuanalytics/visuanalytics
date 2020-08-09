import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformSort(unittest.TestCase):
    def setUp(self):
        self.data = {
            "test": ["Canada", "Argentina", "Cyprus", "Schweden", "Norway", "USA", "Germany", "United Kingdom", "Z"],
            "numbers": [10, 4, 2, 6, 7, 3, 1, 5, 9, 8, 0]
        }

    def test_sort_a2z(self):
        values = [
            {
                "type": "sort",
                "keys": ["_req|test"],
                "new_keys": ["_req|test1"]
            }
        ]

        expected_data = {
            "_req": {
                "test": ["Canada", "Argentina", "Cyprus", "Schweden", "Norway", "USA", "Germany", "United Kingdom",
                         "Z"],
                "numbers": [10, 4, 2, 6, 7, 3, 1, 5, 9, 8, 0],
                "test1": ["Argentina", "Canada", "Cyprus", "Germany", "Norway", "Schweden", "USA", "United Kingdom",
                          "Z"]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "sort a2z failed")

    def test_sort_z2a(self):
        values = [
            {
                "type": "sort",
                "keys": ["_req|test"],
                "new_keys": ["_req|test1"],
                "reverse": True

            }
        ]

        expected_data = {
            "_req": {
                "test": ["Canada", "Argentina", "Cyprus", "Schweden", "Norway", "USA", "Germany", "United Kingdom",
                         "Z"],
                "numbers": [10, 4, 2, 6, 7, 3, 1, 5, 9, 8, 0],
                "test1": ["Z", "United Kingdom", "USA", "Schweden", "Norway", "Germany", "Cyprus", "Canada",
                          "Argentina"]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "sort z2a failed")

    def test_sort_ascending(self):
        values = [
            {
                "type": "sort",
                "keys": ["_req|numbers"],
                "new_keys": ["_req|test1"]

            }
        ]

        expected_data = {
            "_req": {
                "test": ["Canada", "Argentina", "Cyprus", "Schweden", "Norway", "USA", "Germany", "United Kingdom",
                         "Z"],
                "numbers": [10, 4, 2, 6, 7, 3, 1, 5, 9, 8, 0],
                "test1": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "sort ascending failed")

    def test_sort_descending(self):
        values = [
            {
                "type": "sort",
                "keys": ["_req|numbers"],
                "new_keys": ["_req|test1"],
                "reverse": True
            }
        ]

        expected_data = {
            "_req": {
                "test": ["Canada", "Argentina", "Cyprus", "Schweden", "Norway", "USA", "Germany", "United Kingdom",
                         "Z"],
                "numbers": [10, 4, 2, 6, 7, 3, 1, 5, 9, 8, 0],
                "test1": [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "sort descending failed")
