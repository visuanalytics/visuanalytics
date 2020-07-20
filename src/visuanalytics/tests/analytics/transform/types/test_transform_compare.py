import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformCompare(unittest.TestCase):
    def setUp(self):
        self.data = {
            "value1": 5,
            "value2": 5,
            "value3": 30,
            "text1": "result"
        }

    def test_transform_compare_equal(self):
        values = [
            {
                "type": "compare",
                "value_left": "_req|value1",
                "value_right": "_req|value2",
                "on_equal": [
                    {
                        "type": "replace",
                        "keys": ["_req|text1"],
                        "old_value": "result",
                        "new_value": "equal"
                    }
                ],
                "on_higher": [
                    {
                        "type": "replace",
                        "keys": ["_req|text1"],
                        "old_value": "result",
                        "new_value": "value_left is higher"
                    }
                ],
                "on_lower": [
                    {
                        "type": "replace",
                        "keys": ["_req|text1"],
                        "old_value": "result",
                        "new_value": "value_left is lower"
                    }
                ]
            }
        ]

        expected_data = {
            "_req": {
                "value1": 5,
                "value2": 5,
                "value3": 30,
                "text1": "equal"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "compare equal Failed")

    def test_transform_compare_not_equal(self):
        values = [
            {
                "type": "compare",
                "value_left": "_req|value1",
                "value_right": "_req|value3",
                "on_not_equal": [
                    {
                        "type": "replace",
                        "keys": ["_req|text1"],
                        "old_value": "result",
                        "new_value": "not equal"
                    }
                ],
                "on_higher": [
                    {
                        "type": "replace",
                        "keys": ["_req|text1"],
                        "old_value": "result",
                        "new_value": "value_left is higher"
                    }
                ],
                "on_lower": [
                    {
                        "type": "replace",
                        "keys": ["_req|text1"],
                        "old_value": "result",
                        "new_value": "value_left is lower"
                    }
                ]
            }
        ]

        expected_data = {
            "_req": {
                "value1": 5,
                "value2": 5,
                "value3": 30,
                "text1": "not equal"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "compare not equal Failed")

    def test_transform_compare_higher(self):
        values = [
            {
                "type": "compare",
                "value_left": "_req|value3",
                "value_right": "_req|value2",
                "on_equal": [
                    {
                        "type": "replace",
                        "keys": ["_req|text1"],
                        "old_value": "result",
                        "new_value": "equal"
                    }
                ],
                "on_higher": [
                    {
                        "type": "replace",
                        "keys": ["_req|text1"],
                        "old_value": "result",
                        "new_value": "value_left is higher"
                    }
                ],
                "on_lower": [
                    {
                        "type": "replace",
                        "keys": ["_req|text1"],
                        "old_value": "result",
                        "new_value": "value_left is lower"
                    }
                ]
            }
        ]

        expected_data = {
            "_req": {
                "value1": 5,
                "value2": 5,
                "value3": 30,
                "text1": "value_left is higher"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "compare higher Failed")

    def test_transform_compare_lower(self):
        values = [
            {
                "type": "compare",
                "value_left": "_req|value2",
                "value_right": "_req|value3",
                "on_equal": [
                    {
                        "type": "replace",
                        "keys": ["_req|text1"],
                        "old_value": "result",
                        "new_value": "equal"
                    }
                ],
                "on_higher": [
                    {
                        "type": "replace",
                        "keys": ["_req|text1"],
                        "old_value": "result",
                        "new_value": "value_left is higher"
                    }
                ],
                "on_lower": [
                    {
                        "type": "replace",
                        "keys": ["_req|text1"],
                        "old_value": "result",
                        "new_value": "value_left is lower"
                    }
                ]
            }
        ]

        expected_data = {
            "_req": {
                "value1": 5,
                "value2": 5,
                "value3": 30,
                "text1": "value_left is lower"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "compare lower Failed")
