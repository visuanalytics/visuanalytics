import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformAppend(unittest.TestCase):
    def setUp(self):
        self.data = {
            "test": [
                {"hallo": 1, "test": 2},
                {"hallo": 1, "test": 3},
                {"hallo": 1, "test": 3},
                {"hallo": 1, "test": 6},
                {"hallo": 1, "test": 1}
            ]
        }

    def test_append_single(self):
        values = [
            {
                "type": "append",
                "key": "_req|test|0|test",
                "new_key": "_req|hallo"
            }
        ]

        expected_data = {
            "_req": {**self.data, **{"hallo": [2]}}
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(out, exp, "Append Single Invalid")

    def test_append_multi(self):
        values = [
            {
                "type": "transform_array",
                "array_key": "_req|test",
                "transform": [
                    {
                        "type": "append",
                        "key": "_loop|test",
                        "new_key": "_req|hallo"
                    }
                ]
            }
        ]

        expected_data = {
            "_req": {**self.data, **{"hallo": [2, 3, 3, 6, 1]}}
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(out, exp, "Append Multi Invalid")
