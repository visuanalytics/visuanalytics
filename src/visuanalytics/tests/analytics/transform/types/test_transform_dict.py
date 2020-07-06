import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformDict(unittest.TestCase):
    def setUp(self):
        self.data = {
            "test": {
                "hallo": 1
            },
            "test1": {
                "hallo": 4
            },
            "test2": {
                "hallo": 5
            },
        }

    def test_looped_all(self):
        values = [
            {
                "type": "transform_dict",
                "dict_key": "_req",
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
            "_req": {
                "test": {
                    "hallo": "test"
                },
                "test1": {
                    "hallo": "test"
                },
                "test2": {
                    "hallo": "test"
                },
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "transform_dict loop_all Failed")

    def test_idx_is_set_right(self):
        values = [
            {
                "type": "transform_dict",
                "dict_key": "_req",
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
            "_req": {
                "test": {
                    "hallo": "test"
                },
                "test1": {
                    "hallo": "test1"
                },
                "test2": {
                    "hallo": "test2"
                },
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "transform_dict _idx is Right Failed")
