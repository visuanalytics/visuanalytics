import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformLoop(unittest.TestCase):
    # TODO
    def setUp(self):
        self.data = [
            {"hallo": 1},
            {"hallo": 4},
            {"hallo": 5},
        ]

    def test_looped_all(self):
        values = [
            {
                "type": "transform_array",
                "array_key": "_req|0",
                "transform": [
                    {
                        "type": "loop",
                        "range_start": 0,
                        "range_stop": 2,
                        "transform": [
                            {
                                "type": "add_symbol",
                                "keys": ["_loop|0"],
                                "pattern": "test"
                            }
                        ]
                    }
                ]
            }
        ]

        expected_data = {
            "_req": [
                {"hallo": "test"},
                {"hallo": "test"},
                {"hallo": "test"},
            ]
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "loop_all Failed")

    def test_loop_idx(self):
        values = [
            {
                "type": "transform_array",
                "array_key": "_req",
                "transform": [
                    {
                        "type": "loop",
                        "values": "{_idx}",
                        "transform": [
                            {
                                "type": "add_symbol",
                                "keys": ["_loop|0"],
                                "pattern": "{_key}"
                            }
                        ]
                    }
                ]
            }
        ]

        expected_data = {
            "_req": [
                {"hallo": 0},
                {"hallo": 1},
                {"hallo": 2},
            ]
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "loop_idx Failed")
