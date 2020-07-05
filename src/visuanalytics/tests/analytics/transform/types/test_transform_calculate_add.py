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

    def test_transform_calculate_add_value_right(self):
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
                "array": [{"left": 4.5, "right": 2.7}, {"left": 2.7, "right": 8.5}, {"left": 1.8, "right": 3},
                          {"left": 3.3, "right": 3}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate add value right Failed")

    def test_transform_calculate_add_data_value_right(self):
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
                "array": [{"left": 4.5, "right": 2.7}, {"left": 2.7, "right": 8.5}, {"left": 1.8, "right": 3},
                          {"left": 3.3, "right": 3}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate add data value right Failed")

    def test_transform_calculate_add_value_left(self):
        values = [
            {
                "type": "calculate",
                "keys": [
                    "_req|testvalue1"
                ],
                "action": "add",
                "value_left": 3.6,
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
                "array": [{"left": 4.5, "right": 2.7}, {"left": 2.7, "right": 8.5}, {"left": 1.8, "right": 3},
                          {"left": 3.3, "right": 3}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate add value left Failed")

    def test_transform_calculate_add_data_value_left(self):
        values = [
            {
                "type": "calculate",
                "keys": [
                    "_req|testvalue1"
                ],
                "action": "add",
                "value_left": "_req|testvalue2",
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
                "array": [{"left": 4.5, "right": 2.7}, {"left": 2.7, "right": 8.5}, {"left": 1.8, "right": 3},
                          {"left": 3.3, "right": 3}]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate add data value left Failed")

    def test_transform_calculate_add_array_value_right(self):
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
                        "action": "add",
                        "value_right": "_loop|right",
                        "new_keys": [
                            "_req|result|{_idx}|result"
                        ]
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
                "result": {0: {"result": 7.2}, 1: {"result": 11.2}, 2: {"result": 4.8}, 3: {"result": 6.3}}
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate add array value right Failed")

    def test_transform_calculate_add_array_value_left(self):
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
                        "action": "add",
                        "value_left": "_loop|right",
                        "new_keys": [
                            "_req|result|{_idx}|result"
                        ]
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
                "result": {0: {"result": 7.2}, 1: {"result": 11.2}, 2: {"result": 4.8}, 3: {"result": 6.3}}
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "calculate add array value left Failed")
