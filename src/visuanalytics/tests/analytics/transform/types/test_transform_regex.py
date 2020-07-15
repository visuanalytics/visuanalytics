import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformRegex(unittest.TestCase):
    def setUp(self):
        self.data = {
            "test1": "2.5",
            "test2": "2.4.6.2.5",
            "test3": "Hallo",
            "test4": "Tschüss",
            "test5": "H4e2l4lo"
        }

    def test_regex_all_dots(self):
        values = [
            {
                "type": "regex",
                "keys": ["_req|test1", "_req|test2"],
                "regex": "[.]+",
                "replace_by": ","
            }
        ]

        expected_data = {
            "_req": {
                "test1": "2,5",
                "test2": "2,4,6,2,5",
                "test3": "Hallo",
                "test4": "Tschüss",
                "test5": "H4e2l4lo"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "Regex all dots Failed")

    def test_regex_replace_various_characters(self):
        values = [
            {
                "type": "regex",
                "keys": ["_req|test3", "_req|test5"],
                "regex": "[al]",
                "replace_by": "XX"
            }
        ]

        expected_data = {
            "_req": {
                "test1": "2.5",
                "test2": "2.4.6.2.5",
                "test3": "HXXXXXXo",
                "test4": "Tschüss",
                "test5": "H4e2XX4XXo"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "Regex various characters Failed")

    def test_regex_either_or(self):
        values = [
            {
                "type": "regex",
                "keys": ["_req|test3", "_req|test4"],
                "regex": "ll|ss",
                "replace_by": "xx"
            }
        ]

        expected_data = {
            "_req": {
                "test1": "2.5",
                "test2": "2.4.6.2.5",
                "test3": "Haxxo",
                "test4": "Tschüxx",
                "test5": "H4e2l4lo"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "Regex either or Failed")

    def test_regex_ends_with(self):
        values = [
            {
                "type": "regex",
                "keys": ["_req|test3", "_req|test4"],
                "regex": "o$",
                "replace_by": "END"
            }
        ]

        expected_data = {
            "_req": {
                "test1": "2.5",
                "test2": "2.4.6.2.5",
                "test3": "HallEND",
                "test4": "Tschüss",
                "test5": "H4e2l4lo"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "Regex ends with Failed")

    def test_regex_starts_with(self):
        values = [
            {
                "type": "regex",
                "keys": ["_req|test3", "_req|test4"],
                "regex": "^H|T",
                "replace_by": "START"
            }
        ]

        expected_data = {
            "_req": {
                "test1": "2.5",
                "test2": "2.4.6.2.5",
                "test3": "STARTallo",
                "test4": "STARTschüss",
                "test5": "H4e2l4lo"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "Regex starts with Failed")

    def test_regex_character_set(self):
        values = [
            {
                "type": "regex",
                "keys": ["_req|test5"],
                "regex": "[0-9]",
                "replace_by": ""
            }
        ]

        expected_data = {
            "_req": {
                "test1": "2.5",
                "test2": "2.4.6.2.5",
                "test3": "Hallo",
                "test4": "Tschüss",
                "test5": "Hello"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "Regex character set Failed")
