import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformAddData(unittest.TestCase):
    def setUp(self):
        self.data = {
            "test": "test"
        }

    def test_add_data(self):
        values = [
            {
                "type": "add_data",
                "new_key": "_req|test1",
                "pattern": "1"
            }
        ]

        expected_data = {
            "_req": {
                "test": "test",
                "test1": "1"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "add_data Failed")

    def test_add_data_with_data(self):
        values = [
            {
                "type": "add_data",
                "new_key": "_req|test1",
                "pattern": "{_req|test}: 1"
            }
        ]

        expected_data = {
            "_req": {
                "test": "test",
                "test1": "test: 1"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "add_data Single Failed")
