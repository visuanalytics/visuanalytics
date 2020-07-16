import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformConvert(unittest.TestCase):
    def setUp(self):
        self.data = {
            "test1": "1.573",
            "test2": 2,
            "test3": "True",
            "test4": "-45"
        }

    def test_transform_convert_to_string(self):
        values = [
            {
                "type": "convert",
                "keys": [
                    "_req|test2"
                ],
                "to": "str",
                "new_keys": [
                    "_req|result"
                ]
            }
        ]

        expected_data = {
            "_req": {
                "test1": "1.573",
                "test2": 2,
                "result": "2",
                "test3": "True",
                "test4": "-45"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "convert to string Failed")

    def test_transform_convert_to_int(self):
        values = [
            {
                "type": "convert",
                "keys": [
                    "_req|test4"
                ],
                "to": "int",
                "new_keys": [
                    "_req|result"
                ]
            }
        ]

        expected_data = {
            "_req": {
                "test1": "1.573",
                "test2": 2,
                "test3": "True",
                "test4": "-45",
                "result": -45
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "convert to int Failed")

    def test_transform_convert_to_float(self):
        values = [
            {
                "type": "convert",
                "keys": [
                    "_req|test1"
                ],
                "to": "float",
                "new_keys": [
                    "_req|result"
                ]
            }
        ]

        expected_data = {
            "_req": {
                "test1": "1.573",
                "result": 1.573,
                "test2": 2,
                "test3": "True",
                "test4": "-45"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "convert to float Failed")

    def test_transform_convert_to_bool(self):
        values = [
            {
                "type": "convert",
                "keys": [
                    "_req|test3"
                ],
                "to": "bool",
                "new_keys": [
                    "_req|result"
                ]
            }
        ]

        expected_data = {
            "_req": {
                "test1": "1.573",
                "test2": 2,
                "test3": "True",
                "result": True,
                "test4": "-45"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "convert to bool Failed")
