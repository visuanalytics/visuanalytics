import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformLength(unittest.TestCase):
    def setUp(self):
        self.data = {
            "list": ["Das", "ist", "ein", "Testfall"]
        }

    def test_join(self):
        values = [
            {
                "type": "join",
                "keys": ["_req|list"],
                "new_keys": ["_req|string"],
                "delimiter": " "
            }
        ]

        expected_data = {
            "_req": {
                "list": ["Das", "ist", "ein", "Testfall"],
                "string": "Das ist ein Testfall"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "join failed")

    def test_join_del(self):
        values = [
            {
                "type": "join",
                "keys": ["_req|list"],
                "new_keys": ["_req|string"],
                "delimiter": "-"
            }
        ]

        expected_data = {
            "_req": {
                "list": ["Das", "ist", "ein", "Testfall"],
                "string": "Das-ist-ein-Testfall"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "join_del failed")

    def test_join_none(self):
        values = [
            {
                "type": "join",
                "keys": ["_req|list"],
                "new_keys": ["_req|string"],
                "delimiter": ""
            }
        ]

        expected_data = {
            "_req": {
                "list": ["Das", "ist", "ein", "Testfall"],
                "string": "DasisteinTestfall"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "join_none failed")
