import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformAlias(unittest.TestCase):
    def setUp(self):
        self.data = {
            "test": "test"
        }

    def test_alias(self):
        values = [
            {
                "type": "alias",
                "keys": ["_req|test"],
                "new_keys": ["_req|test2"]
            }
        ]

        expected_data = {
            "_req": {
                "test2": "test",
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "Select Range One Failed")
