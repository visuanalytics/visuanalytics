import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformLoop(unittest.TestCase):
    # TODO
    def setUp(self):
        self.data = {
            "value": 0,
            "values": []
        }

    def test_range(self):
        values = [
            {
                "type": "loop",
                "range_start": 0,
                "range_stop": 3,
                "transform": [
                    {
                        "type": "calculate",
                        "action": "add",
                        "keys": ["_req|value"],
                        "value_right": "_loop",
                    }
                ]
            }
        ]

        expected_data = {
            "_req": {
                "value": 3,
                "values": []
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "loop_all Failed")

    def test_values(self):
        values = [
            {
                "type": "loop",
                "values": ["a", "b", "c", "d"],
                "transform": [
                    {
                        "type": "append",
                        "key": "_loop",
                        "new_key": "_req|values"
                    }
                ]
            }
        ]

        expected_data = {
            "_req": {
                "value": 0,
                "values": ["a", "b", "c", "d"]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "loop_idx Failed")
