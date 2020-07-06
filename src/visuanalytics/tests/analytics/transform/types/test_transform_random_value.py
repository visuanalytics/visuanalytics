import random
import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformRandomValue(unittest.TestCase):
    def setUp(self):
        self.data = {
            "test1": "2.5",
            "test2": "2.4.6.2.5",
            "test3": "values|array|{random.seed(4)}"
        }

    def test_random_value_one(self):
        random.seed(4)
        values = [
            {
                "type": "random_value",
                "keys": [
                    "_req|test1"
                ],
                "array": [
                    "Text 1",
                    "Text 2",
                    "Text 3",
                    "Text 4"
                ],
                "new_keys": [
                    "_req|test3"
                ]
            }
        ]
        expected_data = {
            "_req": {
                "test1": "2.5",
                "test2": "2.4.6.2.5",
                "test3": "Text 2"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "Random Value Failed")
