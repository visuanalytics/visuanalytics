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
            "array1": [{"left": 4.5}, {"left": 2.7}, {"left": 1.8}, {"left": 3.3}],
            "array2": [{"right": 2.7}, {"right": 8.5}, {"right": 3}, {"right": -5}]
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
                "array1": [{"left": 4.5}, {"left": 2.7}, {"left": 1.8}, {"left": 3.3}],
                "array2": [{"right": 2.7}, {"right": 8.5}, {"right": 3}, {"right": -5}]
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
                "array1": [{"left": 4.5}, {"left": 2.7}, {"left": 1.8}, {"left": 3.3}],
                "array2": [{"right": 2.7}, {"right": 8.5}, {"right": 3}, {"right": -5}]
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
                "array1": [{"left": 4.5}, {"left": 2.7}, {"left": 1.8}, {"left": 3.3}],
                "array2": [{"right": 2.7}, {"right": 8.5}, {"right": 3}, {"right": -5}]
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
                "array1": [{"left": 4.5}, {"left": 2.7}, {"left": 1.8}, {"left": 3.3}],
                "array2": [{"right": 2.7}, {"right": 8.5}, {"right": 3}, {"right": -5}]
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
                "array1": [{"left": 4.5}, {"left": 2.7}, {"left": 1.8}, {"left": 3.3}],
                "array2": [{"right": 2.7}, {"right": 8.5}, {"right": 3}, {"right": -5}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate mode Failed")

    def test_transform_calculate_multiply_value(self):
        values = [
            {
                "type": "calculate",
                "keys": [
                    "_req|testvalue1"
                ],
                "action": "multiply",
                "value_right": 3.6,
                "new_keys": [
                    "_req|result"
                ]
            }
        ]

        expected_data = {
            "_req": {
                "testvalue1": 5,
                "result": 18,
                "testvalue2": 3.7,
                "testarray1": [5, 4, 7, 1, 3, 6],
                "testarray2": [9, 4, 12, 7.6, 1.75, 500],
                "icon": ["und", "und", "wie", "viel", "wie", "wie", "wir"],
                "array1": [{"left": 4.5}, {"left": 2.7}, {"left": 1.8}, {"left": 3.3}],
                "array2": [{"right": 2.7}, {"right": 8.5}, {"right": 3}, {"right": -5}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate multiply value Failed")

    def test_transform_calculate_multiply_data_value(self):
        values = [
            {
                "type": "calculate",
                "keys": [
                    "_req|testvalue1"
                ],
                "action": "multiply",
                "value_right": "_req|testvalue2",
                "new_keys": [
                    "_req|result"
                ]
            }
        ]

        expected_data = {
            "_req": {
                "testvalue1": 5,
                "result": 18.5,
                "testvalue2": 3.7,
                "testarray1": [5, 4, 7, 1, 3, 6],
                "testarray2": [9, 4, 12, 7.6, 1.75, 500],
                "icon": ["und", "und", "wie", "viel", "wie", "wie", "wir"],
                "array1": [{"left": 4.5}, {"left": 2.7}, {"left": 1.8}, {"left": 3.3}],
                "array2": [{"right": 2.7}, {"right": 8.5}, {"right": 3}, {"right": -5}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate multiply data value Failed")

    def test_transform_calculate_multiply_array_value(self):
        values = [
            {
                "type": "calculate",
                "keys": [
                    "_req|array1|left"
                ],
                "action": "multiply",
                "value_right": "_loop|array2|right",
                "new_keys": [
                    "_req|result|result"
                ]
            }
        ]

        expected_data = {
            "_req": {
                "testvalue1": 5,
                "testvalue2": 3.7,
                "testarray1": [5, 4, 7, 1, 3, 6],
                "testarray2": [9, 4, 12, 7.6, 1.75, 500],
                "icon": ["und", "und", "wie", "viel", "wie", "wie", "wir"],
                "array1": [{"left": 4.5}, {"left": 2.7}, {"left": 1.8}, {"left": 3.3}],
                "result": [{"result": 12.15}, {"result": 22.95}, {"result": 5.4}, {"result": -16.5}],
                "array2": [{"right": 2.7}, {"right": 8.5}, {"right": 3}, {"right": -5}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate multiply array value Failed")

    def test_transform_calculate_divide_value(self):
        values = [
            {
                "type": "calculate",
                "keys": [
                    "_req|testvalue1"
                ],
                "action": "divide",
                "value_right": 3.6,
                "new_keys": [
                    "_req|result"
                ],
                "decimal": 2
            }
        ]

        expected_data = {
            "_req": {
                "testvalue1": 5,
                "result": 1.39,
                "testvalue2": 3.7,
                "testarray1": [5, 4, 7, 1, 3, 6],
                "testarray2": [9, 4, 12, 7.6, 1.75, 500],
                "icon": ["und", "und", "wie", "viel", "wie", "wie", "wir"],
                "array1": [{"left": 4.5}, {"left": 2.7}, {"left": 1.8}, {"left": 3.3}],
                "array2": [{"right": 2.7}, {"right": 8.5}, {"right": 3}, {"right": -5}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate divide value Failed")

    def test_transform_calculate_divide_data_value(self):
        values = [
            {
                "type": "calculate",
                "keys": [
                    "_req|testvalue1"
                ],
                "action": "divide",
                "value_right": "_req|testvalue2",
                "new_keys": [
                    "_req|result"
                ],
                "decimal": 2
            }
        ]

        expected_data = {
            "_req": {
                "testvalue1": 5,
                "result": 1.35,
                "testvalue2": 3.7,
                "testarray1": [5, 4, 7, 1, 3, 6],
                "testarray2": [9, 4, 12, 7.6, 1.75, 500],
                "icon": ["und", "und", "wie", "viel", "wie", "wie", "wir"],
                "array1": [{"left": 4.5}, {"left": 2.7}, {"left": 1.8}, {"left": 3.3}],
                "array2": [{"right": 2.7}, {"right": 8.5}, {"right": 3}, {"right": -5}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate divide data value Failed")

    def test_transform_calculate_divide_array_value(self):
        values = [
            {
                "type": "calculate",
                "keys": [
                    "_req|array1|left"
                ],
                "action": "divide",
                "value_right": "_loop|array2|right",
                "new_keys": [
                    "_req|result|result"
                ],
                "decimal": 2
            }
        ]

        expected_data = {
            "_req": {
                "testvalue1": 5,
                "testvalue2": 3.7,
                "testarray1": [5, 4, 7, 1, 3, 6],
                "testarray2": [9, 4, 12, 7.6, 1.75, 500],
                "icon": ["und", "und", "wie", "viel", "wie", "wie", "wir"],
                "array1": [{"left": 4.5}, {"left": 2.7}, {"left": 1.8}, {"left": 3.3}],
                "result": [{"result": 1.67}, {"result": 0.32}, {"result": 0.6}, {"result": -0.66}],
                "array2": [{"right": 2.7}, {"right": 8.5}, {"right": 3}, {"right": -5}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate divide array value Failed")

    def test_transform_calculate_subtract_value(self):
        values = [
            {
                "type": "calculate",
                "keys": [
                    "_req|testvalue1"
                ],
                "action": "subtract",
                "value_right": 3.6,
                "new_keys": [
                    "_req|result"
                ],
                "decimal": 1
            }
        ]

        expected_data = {
            "_req": {
                "testvalue1": 5,
                "result": 1.4,
                "testvalue2": 3.7,
                "testarray1": [5, 4, 7, 1, 3, 6],
                "testarray2": [9, 4, 12, 7.6, 1.75, 500],
                "icon": ["und", "und", "wie", "viel", "wie", "wie", "wir"],
                "array1": [{"left": 4.5}, {"left": 2.7}, {"left": 1.8}, {"left": 3.3}],
                "array2": [{"right": 2.7}, {"right": 8.5}, {"right": 3}, {"right": -5}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate subtract value Failed")

    def test_transform_calculate_subtract_data_value(self):
        values = [
            {
                "type": "calculate",
                "keys": [
                    "_req|testvalue1"
                ],
                "action": "subtract",
                "value_right": "_req|testvalue2",
                "new_keys": [
                    "_req|result"
                ],
                "decimal": 2
            }
        ]

        expected_data = {
            "_req": {
                "testvalue1": 5,
                "result": 1.3,
                "testvalue2": 3.7,
                "testarray1": [5, 4, 7, 1, 3, 6],
                "testarray2": [9, 4, 12, 7.6, 1.75, 500],
                "icon": ["und", "und", "wie", "viel", "wie", "wie", "wir"],
                "array1": [{"left": 4.5}, {"left": 2.7}, {"left": 1.8}, {"left": 3.3}],
                "array2": [{"right": 2.7}, {"right": 8.5}, {"right": 3}, {"right": -5}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate subtract data value Failed")

    def test_transform_calculate_subtract_array_value(self):
        values = [
            {
                "type": "calculate",
                "keys": [
                    "_req|array1|left"
                ],
                "action": "subtract",
                "value_right": "_loop|array2|right",
                "new_keys": [
                    "_req|result|result"
                ]
            }
        ]

        expected_data = {
            "_req": {
                "testvalue1": 5,
                "testvalue2": 3.7,
                "testarray1": [5, 4, 7, 1, 3, 6],
                "testarray2": [9, 4, 12, 7.6, 1.75, 500],
                "icon": ["und", "und", "wie", "viel", "wie", "wie", "wir"],
                "array1": [{"left": 4.5}, {"left": 2.7}, {"left": 1.8}, {"left": 3.3}],
                "result": [{"result": 1.8}, {"result": -5.8}, {"result": -1.2}, {"result": 8.3}],
                "array2": [{"right": 2.7}, {"right": 8.5}, {"right": 3}, {"right": -5}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate subtract array value Failed")

    def test_transform_calculate_add_value(self):
        values = [
            {
                "type": "calculate",
                "keys": [
                    "_req|testvalue1"
                ],
                "action": "add",
                "value_right": 3.6,
                "new_keys": [
                    "_req|result"
                ],
                "decimal": 2
            }
        ]

        expected_data = {
            "_req": {
                "testvalue1": 5,
                "testvalue2": 3.7,
                "result": 8.6,
                "testarray1": [5, 4, 7, 1, 3, 6],
                "testarray2": [9, 4, 12, 7.6, 1.75, 500],
                "icon": ["und", "und", "wie", "viel", "wie", "wie", "wir"],
                "array1": [{"left": 4.5}, {"left": 2.7}, {"left": 1.8}, {"left": 3.3}],
                "array2": [{"right": 2.7}, {"right": 8.5}, {"right": 3}, {"right": -5}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate add value Failed")

    def test_transform_calculate_add_data_value(self):
        values = [
            {
                "type": "calculate",
                "keys": [
                    "_req|testvalue1"
                ],
                "action": "add",
                "value_right": "_req|testvalue2",
                "new_keys": [
                    "_req|result"
                ],
                "decimal": 2
            }
        ]

        expected_data = {
            "_req": {
                "testvalue1": 5,
                "result": 8.7,
                "testvalue2": 3.7,
                "testarray1": [5, 4, 7, 1, 3, 6],
                "testarray2": [9, 4, 12, 7.6, 1.75, 500],
                "icon": ["und", "und", "wie", "viel", "wie", "wie", "wir"],
                "array1": [{"left": 4.5}, {"left": 2.7}, {"left": 1.8}, {"left": 3.3}],
                "array2": [{"right": 2.7}, {"right": 8.5}, {"right": 3}, {"right": -5}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate add data value Failed")

    def test_transform_calculate_add_array_value(self):
        values = [
            {
                "type": "calculate",
                "keys": [
                    "_req|array1|left"
                ],
                "action": "add",
                "value_right": "_loop|array2|right",
                "new_keys": [
                    "_req|result|result"
                ]
            }
        ]

        expected_data = {
            "_req": {
                "testvalue1": 5,
                "testvalue2": 3.7,
                "testarray1": [5, 4, 7, 1, 3, 6],
                "testarray2": [9, 4, 12, 7.6, 1.75, 500],
                "icon": ["und", "und", "wie", "viel", "wie", "wie", "wir"],
                "array1": [{"left": 4.5}, {"left": 2.7}, {"left": 1.8}, {"left": 3.3}],
                "result": [{"result": 7.2}, {"result": 11.2}, {"result": 4.8}, {"result": -5.2}],
                "array2": [{"right": 2.7}, {"right": 8.5}, {"right": 3}, {"right": -5}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate add array value Failed")
