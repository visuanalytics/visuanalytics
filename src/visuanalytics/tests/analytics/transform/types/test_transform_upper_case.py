import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformUpperCase(unittest.TestCase):
    def setUp(self):
        self.data = {
            "test": ["canada", "CANADA", "CaNaDa", "cAnAdA", "Canada"]
        }

    def test_upper_case(self):
        values = [
            {
                "type": "upper_case",
                "keys": ["_req|test"],
                "new_keys": ["_req|test1"]
            }
        ]

        expected_data = {
            "_req": {
                "test": ["canada", "CANADA", "CaNaDa", "cAnAdA", "Canada"],
                "test1": ["CANADA", "CANADA", "CANADA", "CANADA", "CANADA"]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "upper case failed")
