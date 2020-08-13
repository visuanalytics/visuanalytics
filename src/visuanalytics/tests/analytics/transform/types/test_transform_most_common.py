import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformMostCommon(unittest.TestCase):
    def setUp(self):
        self.data = {
            "test": ["Canada", "Schweden", "Canada", "Schweden", "Canada", "Canada", "Schweden", "Canada"]
        }

    def test_most_common(self):
        values = [
            {
                "type": "most_common",
                "keys": ["_req|test"],
                "new_keys": ["_req|test1"]
            }
        ]

        expected_data = {
            "_req": {
                "test": ["Canada", "Schweden", "Canada", "Schweden", "Canada", "Canada", "Schweden", "Canada"],
                "test1": ["Canada", "Schweden"]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "most_common failed")

    def test_most_common_include_count(self):
        values = [
            {
                "type": "most_common",
                "keys": ["_req|test"],
                "new_keys": ["_req|test1"],
                "include_count": True
            }
        ]

        expected_data = {
            "_req": {
                "test": ["Canada", "Schweden", "Canada", "Schweden", "Canada", "Canada", "Schweden", "Canada"],
                "test1": [("Canada", 5), ("Schweden", 3)]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "most_common_include_count failed")
