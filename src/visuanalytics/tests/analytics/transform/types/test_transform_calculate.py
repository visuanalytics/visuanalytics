import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformCalculate(unittest.TestCase):
    def setUp(self):
        self.data = {
            "testvalue1": 5,
            "testvalue2": 3.7,
            "testarray1": [5, 4, 7, 1, 3, 6],
            "testarray2": [9, 4, 12, 7.6, 1.75, 500],
            "icon": ["und", "und", "wie", "viel", "wie", "wie", "wir"],
            "array": [{"left": 4.5, "right": 2.7}, {"left": 2.7, "right": 8.5}, {"left": 1.8, "right": 3},
                      {"left": 3.3, "right": 3}]
        }

    def test_transform_calculate_mean(self):
        values = [
            {
                "type": "calculate",
                "action": "mean",
                "keys": [
                    "_req|testarray1",
                    "_req|testarray2"
                ],
                "decimal": 2
            }
        ]

        expected_data = {
            "_req": {
                "testvalue1": 5,
                "testvalue2": 3.7,
                "testarray1": 4.33,
                "testarray2": 89.06,
                "icon": ["und", "und", "wie", "viel", "wie", "wie", "wir"],
                "array": [{"left": 4.5, "right": 2.7}, {"left": 2.7, "right": 8.5}, {"left": 1.8, "right": 3},
                          {"left": 3.3, "right": 3}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate mean Failed")

    def test_transform_calculate_max(self):
        values = [
            {
                "type": "calculate",
                "action": "max",
                "keys": [
                    "_req|testarray1",
                    "_req|testarray2"
                ]
            }
        ]

        expected_data = {
            "_req": {
                "testvalue1": 5,
                "testvalue2": 3.7,
                "testarray1": 7,
                "testarray2": 500,
                "icon": ["und", "und", "wie", "viel", "wie", "wie", "wir"],
                "array": [{"left": 4.5, "right": 2.7}, {"left": 2.7, "right": 8.5}, {"left": 1.8, "right": 3},
                          {"left": 3.3, "right": 3}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate max Failed")

    def test_transform_calculate_min(self):
        values = [
            {
                "type": "calculate",
                "action": "min",
                "keys": [
                    "_req|testarray1",
                    "_req|testarray2"
                ]
            }
        ]

        expected_data = {
            "_req": {
                "testvalue1": 5,
                "testvalue2": 3.7,
                "testarray1": 1,
                "testarray2": 1.75,
                "icon": ["und", "und", "wie", "viel", "wie", "wie", "wir"],
                "array": [{"left": 4.5, "right": 2.7}, {"left": 2.7, "right": 8.5}, {"left": 1.8, "right": 3},
                          {"left": 3.3, "right": 3}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate min Failed")

    def test_transform_calculate_round_one(self):
        values = [
            {
                "type": "calculate",
                "action": "round",
                "keys": [
                    "_req|testvalue2"
                ],
                "count": 0
            }
        ]

        expected_data = {
            "_req": {
                "testvalue1": 5,
                "testvalue2": 4,
                "testarray1": [5, 4, 7, 1, 3, 6],
                "testarray2": [9, 4, 12, 7.6, 1.75, 500],
                "icon": ["und", "und", "wie", "viel", "wie", "wie", "wir"],
                "array": [{"left": 4.5, "right": 2.7}, {"left": 2.7, "right": 8.5}, {"left": 1.8, "right": 3},
                          {"left": 3.3, "right": 3}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate min Failed")

    def test_transform_calculate_mode(self):
        values = [
            {
                "type": "calculate",
                "action": "mode",
                "keys": [
                    "_req|icon"
                ]
            }
        ]

        expected_data = {
            "_req": {
                "testvalue1": 5,
                "testvalue2": 3.7,
                "testarray1": [5, 4, 7, 1, 3, 6],
                "testarray2": [9, 4, 12, 7.6, 1.75, 500],
                "icon": "wie",
                "array": [{"left": 4.5, "right": 2.7}, {"left": 2.7, "right": 8.5}, {"left": 1.8, "right": 3},
                          {"left": 3.3, "right": 3}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate mode Failed")
