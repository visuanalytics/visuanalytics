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

    def test_transform_calculate_multiply_value_right(self):
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
                "array": [{"left": 4.5, "right": 2.7}, {"left": 2.7, "right": 8.5}, {"left": 1.8, "right": 3},
                          {"left": 3.3, "right": 3}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate multiply value right Failed")

    def test_transform_calculate_multiply_data_value_right(self):
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
                "array": [{"left": 4.5, "right": 2.7}, {"left": 2.7, "right": 8.5}, {"left": 1.8, "right": 3},
                          {"left": 3.3, "right": 3}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate multiply data value right Failed")

    def test_transform_calculate_multiply_value_left(self):
        values = [
            {
                "type": "calculate",
                "keys": [
                    "_req|testvalue1"
                ],
                "action": "multiply",
                "value_left": 3.6,
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
                "array": [{"left": 4.5, "right": 2.7}, {"left": 2.7, "right": 8.5}, {"left": 1.8, "right": 3},
                          {"left": 3.3, "right": 3}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate multiply value Failed")

    def test_transform_calculate_multiply_data_value_left(self):
        values = [
            {
                "type": "calculate",
                "keys": [
                    "_req|testvalue1"
                ],
                "action": "multiply",
                "value_left": "_req|testvalue2",
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
                "array": [{"left": 4.5, "right": 2.7}, {"left": 2.7, "right": 8.5}, {"left": 1.8, "right": 3},
                          {"left": 3.3, "right": 3}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate multiply data value Failed")

    def test_transform_calculate_multiply_array_value_right(self):
        values = [
            {
                "type": "transform_array",
                "array_key": "_req|array",
                "transform": [
                    {
                        "type": "calculate",
                        "keys": [
                            "_loop|left"
                        ],
                        "action": "multiply",
                        "value_right": "_loop|right",
                        "new_keys": [
                            "_req|result|{_idx}|result"
                        ],
                        "decimal": 2
                    }
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
                "array": [{"left": 4.5, "right": 2.7}, {"left": 2.7, "right": 8.5}, {"left": 1.8, "right": 3},
                          {"left": 3.3, "right": 3}],
                "result": {0: {"result": 12.15}, 1: {"result": 22.95}, 2: {"result": 5.4}, 3: {"result": 9.9}}
            }
        }

    def test_transform_calculate_multiply_array_keys_right(self):
        values = [
            {
                "type": "transform_array",
                "array_key": "_req|array",
                "transform": [
                    {
                        "type": "calculate",
                        "keys": [
                            "_loop|left"
                        ],
                        "action": "multiply",
                        "keys_right": ["_loop|right"],
                        "new_keys": [
                            "_req|result|{_idx}|result"
                        ],
                        "decimal": 2
                    }
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
                "array": [{"left": 4.5, "right": 2.7}, {"left": 2.7, "right": 8.5}, {"left": 1.8, "right": 3},
                          {"left": 3.3, "right": 3}],
                "result": {0: {"result": 12.15}, 1: {"result": 22.95}, 2: {"result": 5.4}, 3: {"result": 9.9}}
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate multiply array keys right Failed")

    def test_transform_calculate_multiply_array_value_left(self):
        values = [
            {
                "type": "transform_array",
                "array_key": "_req|array",
                "transform": [
                    {
                        "type": "calculate",
                        "keys": [
                            "_loop|left"
                        ],
                        "action": "multiply",
                        "value_left": "_loop|right",
                        "new_keys": [
                            "_req|result|{_idx}|result"
                        ],
                        "decimal": 2
                    }
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
                "array": [{"left": 4.5, "right": 2.7}, {"left": 2.7, "right": 8.5}, {"left": 1.8, "right": 3},
                          {"left": 3.3, "right": 3}],
                "result": {0: {"result": 12.15}, 1: {"result": 22.95}, 2: {"result": 5.4}, 3: {"result": 9.9}}
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate multiply array value left Failed")
