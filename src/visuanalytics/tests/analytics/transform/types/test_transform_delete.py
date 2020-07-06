import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformDelete(unittest.TestCase):
    def setUp(self):
        self.data = {
            "hallo": 1,
            "test": 8,
            "test2": {
                "hallo": [
                    1
                ]
            }
        }

    def test_delete_one(self):
        values = [
            {
                "type": "delete",
                "keys": [
                    "_req|hallo"
                ]
            }
        ]

        expected_data = {
            "_req": {
                "test": 8,
                "test2": {
                    "hallo": [
                        1
                    ]
                }
            }
        }

        out, exp = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(out, exp, "Invalid Deletion")


def test_delete_two(self):
    values = [
        {
            "type": "delete",
            "keys": [
                "_req|hallo",
                "_req|test"
            ]
        }
    ]

    expected_data = {
        "_req": {
            "test2": {
                "hallo": [
                    1
                ]
            }
        }
    }

    out, exp = prepare_test(values, self.data, expected_data)
    self.assertDictEqual(out, exp, "Invalid Deletion")


def test_delete_all(self):
    values = [
        {
            "type": "delete",
            "keys": [
                "_req|hallo",
                "_req|test",
                "_req|test2"
            ]
        }
    ]

    expected_data = {}
    out, exp = prepare_test(values, self.data, expected_data)
    self.assertDictEqual(out, exp, "Invalid Deletion")
