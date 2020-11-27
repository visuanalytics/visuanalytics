import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformCheckKey(unittest.TestCase):
    def setUp(self):
        self.data = {
            "test": "test"
        }

    def test_check_key(self):
        values = [
            {
                "type": "check_key",
                "keys": [
                    "_req|test",
                    "_req|test1"
                ],
                "new_keys": ["_req|check1", "_req|check2"],
            }
        ]

        expected_data = {
            "_req": {
                "test": "test",
                "check1": True,
                "check2": False
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "check_key Failed")

    def test_check_key_with_init(self):
        values = [
            {
                "type": "check_key",
                "keys": [
                    "_req|test",
                    "_req|test1"
                ],
                "init_with": "hallo"
            }
        ]

        expected_data = {
            "_req": {
                "test": "test",
                "test1": "hallo"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "check_key with init Failed")
