import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformToDict(unittest.TestCase):
    def setUp(self):
        self.data = {
            "list": [["Canada", 5], ["Argentina", 3], ["Cyprus", 2], ["Schweden", 1], ["Norway", 4], ["USA", 5],
                     ["Germany", 7],
                     ["United Kingdom", 8], ["Z", 10]],
            "tuple": [("Canada", 5), ("Argentina", 3), ("Cyprus", 2), ("Schweden", 1), ("Norway", 4), ("USA", 5),
                      ("Germany", 7), ("United Kingdom", 8), ("Z", 10)]
        }

    def test_to_dict_list(self):
        values = [
            {
                "type": "to_dict",
                "keys": ["_req|list"],
                "new_keys": ["_req|dict_list"]
            }
        ]

        expected_data = {
            "_req": {
                "list": [["Canada", 5], ["Argentina", 3], ["Cyprus", 2], ["Schweden", 1], ["Norway", 4], ["USA", 5],
                         ["Germany", 7],
                         ["United Kingdom", 8], ["Z", 10]],
                "tuple": [("Canada", 5), ("Argentina", 3), ("Cyprus", 2), ("Schweden", 1), ("Norway", 4), ("USA", 5),
                          ("Germany", 7), ("United Kingdom", 8), ("Z", 10)],
                "dict_list": {"Canada": 5, "Argentina": 3, "Cyprus": 2, "Schweden": 1, "Norway": 4,
                              "USA": 5, "Germany": 7, "United Kingdom": 8, "Z": 10}
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "to_dict list failed")

    def test_to_dict_tuple(self):
        values = [
            {
                "type": "to_dict",
                "keys": ["_req|tuple"],
                "new_keys": ["_req|dict_tuple"]
            }
        ]

        expected_data = {
            "_req": {
                "list": [["Canada", 5], ["Argentina", 3], ["Cyprus", 2], ["Schweden", 1], ["Norway", 4], ["USA", 5],
                         ["Germany", 7],
                         ["United Kingdom", 8], ["Z", 10]],
                "tuple": [("Canada", 5), ("Argentina", 3), ("Cyprus", 2), ("Schweden", 1), ("Norway", 4), ("USA", 5),
                          ("Germany", 7), ("United Kingdom", 8), ("Z", 10)],
                "dict_tuple": {"Canada": 5, "Argentina": 3, "Cyprus": 2, "Schweden": 1, "Norway": 4,
                               "USA": 5, "Germany": 7, "United Kingdom": 8, "Z": 10}
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "to_dict tuple failed")
