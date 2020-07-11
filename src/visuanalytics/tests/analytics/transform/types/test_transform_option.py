import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformOption(unittest.TestCase):
    def setUp(self):
        self.data = {
            "test1": True,
            "test2": False,
            "text1": "1.2.3.4.5",
            "text2": "6.7.8.9.10"
        }

    def test_transform_option_true(self):
        values = [
            {
                "type": "option",
                "check": "_req|test1",
                "on_true": [
                    {
                        "type": "replace",
                        "keys": ["_req|text1", "_req|text2"],
                        "old_value": ".",
                        "new_value": ",",
                        "count": 1
                    }
                ],
                "on_false": [
                    {
                        "type": "replace",
                        "keys": ["_req|text1", "_req|text2"],
                        "old_value": ".",
                        "new_value": ","
                    }
                ]
            }
        ]

        expected_data = {
            "_req": {
                "test1": True,
                "test2": False,
                "text1": "1,2.3.4.5",
                "text2": "6,7.8.9.10"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "option true Failed")

    def test_transform_option_false(self):
        values = [
            {
                "type": "option",
                "check": "_req|test2",
                "on_true": [
                    {
                        "type": "replace",
                        "keys": ["_req|text1", "_req|text2"],
                        "old_value": ".",
                        "new_value": ",",
                        "count": 1
                    }
                ],
                "on_false": [
                    {
                        "type": "replace",
                        "keys": ["_req|text1", "_req|text2"],
                        "old_value": ".",
                        "new_value": ","
                    }
                ]
            }
        ]

        expected_data = {
            "_req": {
                "test1": True,
                "test2": False,
                "text1": "1,2,3,4,5",
                "text2": "6,7,8,9,10"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "option false Failed")
