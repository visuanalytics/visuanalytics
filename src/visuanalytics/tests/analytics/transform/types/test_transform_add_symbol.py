import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformAddSymbol(unittest.TestCase):
    def setUp(self):
        self.data = {
            "test": "test",
            "hallo": "Hallo",
            "test2": "visuanalytics"
        }

    def test_transform_add_symbol_single(self):
        values = [
            {
                "type": "add_symbol",
                "keys": ["_req|test"],
                "pattern": "{_key} 1"
            }
        ]

        expected_data = {
            "_req": {
                "test": "test 1",
                "hallo": "Hallo",
                "test2": "visuanalytics"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "add_symbol Single Failed")

    def test_transform_add_symbol_single_new(self):
        values = [
            {
                "type": "add_symbol",
                "keys": ["_req|test"],
                "new_keys": ["_req|test3"],
                "pattern": "{_key} 1"
            }
        ]

        expected_data = {
            "_req": {
                "test": "test",
                "test3": "test 1",
                "hallo": "Hallo",
                "test2": "visuanalytics"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "add_symbol Single new Failed")

    def test_transform_add_symbol_multi(self):
        values = [
            {
                "type": "add_symbol",
                "keys": ["_req|test", "_req|hallo"],
                "pattern": "{_key} 1"
            }
        ]
        expected_data = {
            "_req": {
                "test": "test 1",
                "hallo": "Hallo 1",
                "test2": "visuanalytics"
            }
        }
        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "add_symbol Multi Failed")

    def test_transform_add_symbol_multi_new(self):
        values = [
            {
                "type": "add_symbol",
                "keys": ["_req|test", "_req|hallo"],
                "new_keys": ["_req|test3", "_req|hallo2"],
                "pattern": "{_key} hallo"
            }
        ]
        expected_data = {
            "_req": {
                "test": "test",
                "test3": "test hallo",
                "hallo": "Hallo",
                "hallo2": "Hallo hallo",
                "test2": "visuanalytics"
            }
        }
        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "add_symbol Multi new Failed")
