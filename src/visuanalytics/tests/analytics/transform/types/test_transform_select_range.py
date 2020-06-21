import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformSelectRange(unittest.TestCase):
    def setUp(self):
        self.data = {
            "test": [
                "hallo",
                "test",
                "hallo2"
            ]
        }

    def test_select_range_one(self):
        values = [
            {
                "type": "select_range",
                "array_key": "_req|test",
                "range_start": 0,
                "range_end": 1,
            }
        ]

        expected_data = {
            "_req": {
                "test": [
                    "hallo"
                ]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "Select Range One Failed")

    def test_select_range_all(self):
        values = [
            {
                "type": "select_range",
                "array_key": "_req|test",
                "range_start": 0,
                "range_end": 3,
            }
        ]

        exp, out = prepare_test(values, self.data, {"_req": self.data})
        self.assertDictEqual(exp, out, "Select Range One Failed")

    def test_select_range_without_start(self):
        values = [
            {
                "type": "select_range",
                "array_key": "_req|test",
                "range_end": 3,
            }
        ]

        exp, out = prepare_test(values, self.data, {"_req": self.data})
        self.assertDictEqual(exp, out, "Select Range One Failed")
