import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformTime(unittest.TestCase):
    def setUp(self):
        self.data = {
            "timestamp": 1592758688.7606313,
            "date": "2020-06-21"
        }

    def test_timestamp(self):
        values = [
            {
                "type": "timestamp",
                "keys": ["_req|timestamp"],
                "format": "%Y-%m-%d %H:%M"
            }
        ]

        expected_data = {
            "_req": {
                "timestamp": "2020-06-21 18:58",
                "date": "2020-06-21"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "Select Range One Failed")

    def test_date_format(self):
        values = [
            {
                "type": "date_format",
                "keys": ["_req|date"],
                "given_format": "%Y-%m-%d",
                "format": "%d-%m-%Y"
            }
        ]

        expected_data = {
            "_req": {
                "timestamp": 1592758688.7606313,
                "date": "21-06-2020"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "Select Range One Failed")

    def test_weekday(self):
        values = [
            {
                "type": "date_weekday",
                "keys": ["_req|date"],
                "given_format": "%Y-%m-%d"
            }
        ]

        expected_data = {
            "_req": {
                "timestamp": 1592758688.7606313,
                "date": "Sonntag"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "Select Range One Failed")
        
    # TODO(Max) Test date_now
