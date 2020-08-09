import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformLength(unittest.TestCase):
    def setUp(self):
        self.data = {
            "list": ["Canada", "Argentina", "Cyprus", "Schweden", "Norway", "USA", "Germany", "United Kingdom", "Z"],
            "string": "Das ist ein Testfall",
            "tuple": [("Canada", 5), ("Argentina", 3), ("Cyprus", 2), ("Schweden", 1), ("Norway", 4), ("USA", 5),
                      ("Germany", 7), ("United Kingdom", 8), ("Z", 10)],
            "dict": {"Canada": 5, "Argentina": 3, "Cyprus": 2, "Schweden": 1, "Norway": 4,
                     "USA": 5, "Germany": 7, "United Kingdom": 8, "Z": 10},
        }

    def test_length_list(self):
        values = [
            {
                "type": "length",
                "keys": ["_req|list"],
                "new_keys": ["_req|len_list"]
            }
        ]

        expected_data = {
            "_req": {
                "list": ["Canada", "Argentina", "Cyprus", "Schweden", "Norway", "USA", "Germany", "United Kingdom",
                         "Z"],
                "string": [10, 4, 2, 6, 7, 3, 1, 5, 9, 8, 0],
                "tuple": [("Canada", 5), ("Argentina", 3), ("Cyprus", 2), ("Schweden", 1), ("Norway", 4), ("USA", 5),
                          ("Germany", 7), ("United Kingdom", 8), ("Z", 10)],
                "dict": {"Canada": 5, "Argentina": 3, "Cyprus": 2, "Schweden": 1, "Norway": 4,
                         "USA": 5, "Germany": 7, "United Kingdom": 8, "Z": 10},
                "len_list": 9
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "length list failed")

    def test_length_string(self):
        values = [
            {
                "type": "length",
                "keys": ["_req|string"],
                "new_keys": ["_req|len_string"]
            }
        ]

        expected_data = {
            "_req": {
                "list": ["Canada", "Argentina", "Cyprus", "Schweden", "Norway", "USA", "Germany", "United Kingdom",
                         "Z"],
                "string": [10, 4, 2, 6, 7, 3, 1, 5, 9, 8, 0],
                "tuple": [("Canada", 5), ("Argentina", 3), ("Cyprus", 2), ("Schweden", 1), ("Norway", 4), ("USA", 5),
                          ("Germany", 7), ("United Kingdom", 8), ("Z", 10)],
                "dict": {"Canada": 5, "Argentina": 3, "Cyprus": 2, "Schweden": 1, "Norway": 4,
                         "USA": 5, "Germany": 7, "United Kingdom": 8, "Z": 10},
                "len_string": 20
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "length string failed")

    def test_length_tuple(self):
        values = [
            {
                "type": "length",
                "keys": ["_req|tuple"],
                "new_keys": ["_req|tuple"]
            }
        ]

        expected_data = {
            "_req": {
                "list": ["Canada", "Argentina", "Cyprus", "Schweden", "Norway", "USA", "Germany", "United Kingdom",
                         "Z"],
                "string": [10, 4, 2, 6, 7, 3, 1, 5, 9, 8, 0],
                "tuple": [("Canada", 5), ("Argentina", 3), ("Cyprus", 2), ("Schweden", 1), ("Norway", 4), ("USA", 5),
                          ("Germany", 7), ("United Kingdom", 8), ("Z", 10)],
                "dict": {"Canada": 5, "Argentina": 3, "Cyprus": 2, "Schweden": 1, "Norway": 4,
                         "USA": 5, "Germany": 7, "United Kingdom": 8, "Z": 10},
                "len_tuple": 9
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "length tuple failed")

    def test_length_dict(self):
        values = [
            {
                "type": "length",
                "keys": ["_req|dict"],
                "new_keys": ["_req|len_dict"]
            }
        ]

        expected_data = {
            "_req": {
                "list": ["Canada", "Argentina", "Cyprus", "Schweden", "Norway", "USA", "Germany", "United Kingdom",
                         "Z"],
                "string": [10, 4, 2, 6, 7, 3, 1, 5, 9, 8, 0],
                "tuple": [("Canada", 5), ("Argentina", 3), ("Cyprus", 2), ("Schweden", 1), ("Norway", 4), ("USA", 5),
                          ("Germany", 7), ("United Kingdom", 8), ("Z", 10)],
                "dict": {"Canada": 5, "Argentina": 3, "Cyprus": 2, "Schweden": 1, "Norway": 4,
                         "USA": 5, "Germany": 7, "United Kingdom": 8, "Z": 10},
                "len_dict": 9
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "length dict failed")
