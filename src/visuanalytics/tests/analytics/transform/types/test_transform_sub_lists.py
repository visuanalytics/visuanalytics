import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformSubLists(unittest.TestCase):
    def setUp(self):
        self.data = {
            "words": ["Canada", "Argentina", "Cyprus", "Schweden", "Norway", "USA", "Germany",
                      "United Kingdom",
                      "Z"],
            "numbers": [10, 4, 2, 6, 7, 3, 1, 5, 9, 8, 0]
        }

    def test_sub_lists_words(self):
        values = [
            {
                "type": "sub_lists",
                "array_key": "_req|words",
                "sub_lists": [
                    {
                        "new_key": "_req|words_1",
                        "range_end": 4
                    },
                    {
                        "new_key": "_req|words_2",
                        "range_start": 3,
                        "range_end": 7
                    }
                ]
            }
        ]

        expected_data = {
            "_req": {
                "words": ["Canada", "Argentina", "Cyprus", "Schweden", "Norway", "USA", "Germany",
                          "United Kingdom",
                          "Z"],
                "numbers": [10, 4, 2, 6, 7, 3, 1, 5, 9, 8, 0],
                "words_1": ["Canada", "Argentina", "Cyprus", "Schweden"],
                "words_2": ["Schweden", "Norway", "USA", "Germany"]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "sub_lists_words failed")

    def test_sub_lists_numbers(self):
        values = [
            {
                "type": "sub_lists",
                "array_key": "_req|numbers",
                "sub_lists": [
                    {
                        "new_key": "_req|numbers_1",
                        "range_end": 4
                    },
                    {
                        "new_key": "_req|numbers_2",
                        "range_start": 3,
                        "range_end": 7
                    }
                ]
            }
        ]

        expected_data = {
            "_req": {
                "words": ["Canada", "Argentina", "Cyprus", "Schweden", "Norway", "USA", "Germany",
                          "United Kingdom",
                          "Z"],
                "numbers": [10, 4, 2, 6, 7, 3, 1, 5, 9, 8, 0],
                "numbers_1": [10, 4, 2, 6],
                "numbers_2": [6, 7, 3, 1]
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "sub_lists_numbers failed")
