import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformCopy(unittest.TestCase):
    def setUp(self):
        self.data = {
            "test": "test1",
            "hallo": "Hallo",
            "test2": "visuanalytics"
        }

    def test_transform_copy_replace_old(self):
        values = [
            {
                "type": "copy",
                "keys": [
                    "_req|test"
                ],
                "new_keys": [
                    "_req|test2"
                ]
            }
        ]

        expected_data = {
            "_req": {
                "test": "test1",
                "hallo": "Hallo",
                "test2": "test1"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "copy overwrite old Failed")

    def test_transform_copy_add_new(self):
        values = [
            {
                "type": "copy",
                "keys": [
                    "_req|test"
                ],
                "new_keys": [
                    "_req|test3"
                ]
            }
        ]

        expected_data = {
            "_req": {
                "test": "test1",
                "test3": "test1",
                "hallo": "Hallo",
                "test2": "visuanalytics"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "copy new key Failed")
