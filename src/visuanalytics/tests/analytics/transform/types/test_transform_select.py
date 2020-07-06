import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformSelect(unittest.TestCase):
    def setUp(self):
        self.data = {
            "hallo": 1,
            "test": 8,
            "test2": {
                "hallo": [
                    1
                ]
            }
        }

    def test_select_one(self):
        values = [
            {
                "type": "select",
                "relevant_keys": [
                    "_req|hallo"
                ]
            }
        ]

        expected_data = {
            "_req": {
                "hallo": 1
            }
        }

        out, exp = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(out, exp, "Invalid Selection")

    def test_select_two(self):
        values = [
            {
                "type": "select",
                "relevant_keys": [
                    "_req|hallo",
                    "_req|test"
                ]
            }
        ]

        expected_data = {
            "_req": {
                "hallo": 1,
                "test": 8
            }
        }

        out, exp = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(out, exp, "Invalid Selection")

    def test_select_all(self):
        values = [
            {
                "type": "select",
                "relevant_keys": [
                    "_req|hallo",
                    "_req|test",
                    "_req|test2"
                ]
            }
        ]
        out, exp = prepare_test(values, self.data, {"_req": self.data})
        self.assertDictEqual(out, exp, "Invalid Selection")
