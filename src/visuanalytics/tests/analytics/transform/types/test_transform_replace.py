import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformReplace(unittest.TestCase):
    def setUp(self):
        self.data = {
            "test1": "2.5",
            "test2": "2.4.6.2.5"
        }

    def test_replace_all(self):
        values = [
            {
                "type": "replace",
                "keys": ["_req|test1", "_req|test2"],
                "old_value": ".",
                "new_value": ","
            }
        ]

        expected_data = {
            "_req": {
                "test1": "2,5",
                "test2": "2,4,6,2,5"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "Replace all Failed")

    def test_replace_one(self):
        values = [
            {
                "type": "replace",
                "keys": ["_req|test1", "_req|test2"],
                "old_value": ".",
                "new_value": ",",
                "count": 1
            }
        ]

        expected_data = {
            "_req": {
                "test1": "2,5",
                "test2": "2,4.6.2.5"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "Replace one Failed")
