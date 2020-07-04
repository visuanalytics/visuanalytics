import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformLoop(unittest.TestCase):
    def setUp(self):
        self.data = {
            "test": [
                "hallo",
                "test",
                "hallo2"
            ]
        }

    def test_loop_through(self):
        values = [
            {
                "type": "loop",
                "array_key": "_req|test",
                "loop": ["hallo", "test"]
            }
        ]

        expected_data = {
            "_req": {
                "test": [
                    "hallo",
                    "test",
                    "hallo2"
                ]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "Loop through Failed")
