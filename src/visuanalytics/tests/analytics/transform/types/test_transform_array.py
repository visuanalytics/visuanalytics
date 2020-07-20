import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformArray(unittest.TestCase):
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
                "array_key": "_req",
                "transform": [
                    {
                        "type": "add_symbol",
                        "keys": ["_loop|hallo"],
                        "pattern": "test"
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
        self.assertDictEqual(exp, out, "transform_array loop_all Failed")

    def test_idx_is_set_right(self):
        values = [
            {
                "type": "transform_array",
                "array_key": "_req",
                "transform": [
                    {
                        "type": "add_symbol",
                        "keys": ["_loop|hallo"],
                        "pattern": "{_idx}"
                    }
                ]
            }
        ]

        expected_data = {
            "_req": [
                {"hallo": "0"},
                {"hallo": "1"},
                {"hallo": "2"},
            ]
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "transform_array _idx is Right Failed")
