import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformRemoveFromList(unittest.TestCase):
    def setUp(self):
        self.data = {
            "test": ["Canada", "Argentina", "Cyprus", "Schweden", "Kacke", "Norway", "USA", "Germany", "United Kingdom",
                     "Z"]
        }

    def test_remove_from_list_ignore_case_False(self):
        values = [
            {
                "type": "remove_from_list",
                "keys": ["_req|test"],
                "new_keys": ["_req|test1"],
                "to_remove": ["Canada", "USa", "germany"],
                "use_stopwords": False,
                "ignore_case": False
            }
        ]

        expected_data = {
            "_req": {
                "test": ["Canada", "Argentina", "Cyprus", "Schweden", "Kacke", "Norway", "USA", "Germany",
                         "United Kingdom",
                         "Z"],
                "test1": ["Argentina", "Cyprus", "Schweden", "Kacke", "Norway", "USA", "Germany", "United Kingdom", "Z"]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "remove_from_list_ignore_case_False failed")

    def test_remove_from_list_ignore_case_True(self):
        values = [
            {
                "type": "remove_from_list",
                "keys": ["_req|test"],
                "new_keys": ["_req|test1"],
                "to_remove": ["Canada", "USa", "germany"],
                "use_stopwords": False,
                "ignore_case": True
            }
        ]

        expected_data = {
            "_req": {
                "test": ["Canada", "Argentina", "Cyprus", "Schweden", "Kacke", "Norway", "USA", "Germany",
                         "United Kingdom",
                         "Z"],
                "test1": ["Argentina", "Cyprus", "Schweden", "Kacke", "Norway", "United Kingdom", "Z"]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "remove_from_list_ignore_case_True failed")

    def test_remove_from_list_use_stopwords_True(self):
        values = [
            {
                "type": "remove_from_list",
                "keys": ["_req|test"],
                "new_keys": ["_req|test1"],
                "to_remove": ["Canada", "USa", "germany"],
                "use_stopwords": True,
                "ignore_case": True
            }
        ]

        expected_data = {
            "_req": {
                "test": ["Canada", "Argentina", "Cyprus", "Schweden", "Kacke", "Norway", "USA", "Germany",
                         "United Kingdom",
                         "Z"],
                "test1": ["Argentina", "Cyprus", "Schweden", "Norway", "United Kingdom", "Z"]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "remove_from_list_use_stopwords_True failed")
