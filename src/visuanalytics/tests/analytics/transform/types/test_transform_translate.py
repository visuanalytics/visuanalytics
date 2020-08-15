import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformTranslate(unittest.TestCase):
    def setUp(self):
        self.data = {
            "test1": "250",
            "test2": "350",
            "test3": "550"
        }

    def test_transform_translate_all(self):
        values = [
            {
                "type": "translate",
                "keys": [
                    "_req|test1",
                    "_req|test2",
                    "_req|test3"
                ],
                "new_keys": [
                    "_req|str_test1",
                    "_req|str_test2",
                    "_req|str_test3"
                ],
                "dict": {
                    "250": "Regen",
                    "350": "Gewitter",
                    "550": "Schneesturm",
                }
            }
        ]

        expected_data = {
            "_req": {
                "test1": "250",
                "test2": "350",
                "test3": "550",
                "str_test1": "Regen",
                "str_test2": "Gewitter",
                "str_test3": "Schneesturm",
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "translate Failed")
