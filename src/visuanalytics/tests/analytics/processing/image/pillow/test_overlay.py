import os
import shutil
import unittest

from visuanalytics.analytics.util import resources
from visuanalytics.tests.analytics.processing.image import image_test_helper


class PreprocessTest(unittest.TestCase):
    os.makedirs(resources.get_temp_resource_path("", "100", True), exist_ok=True)

    def test_text(self):
        values = {
            "type": "text",
            "anchor_point": "center",
            "pos_x": 200,
            "pos_y": 200,
            "preset": "test_preset",
            "pattern": "{_req|_test|test_1}"
        }
        data = {
            "test_1": "Test text"
        }
        expected = image_test_helper.prepare_overlay_test(values, data)
        assert os.path.exists(resources.get_resource_path(expected)) == 1

    def test_text_array(self):
        values = {
            "type": "text_array",
            "anchor_point": "center",
            "pos_x": [
                120, 170, 10, 140
            ],
            "pos_y": [
                20, 20, 24, 48
            ],
            "preset": "test_preset",
            "pattern": [
                "{_req|_test|test_1}",
                "{_req|_test|test_2}",
                "{_req|_test|test_2}",
                "{_req|_test|test_1}"
            ]
        }
        data = {
            "test_1": "Test text",
            "test_2": "Test text 2"
        }
        expected = image_test_helper.prepare_overlay_test(values, data)
        assert os.path.exists(resources.get_resource_path(expected)) == 1

    def test_image(self):
        values = {
            "type": "image",
            "pos_x": 187,
            "pos_y": 462,
            "size_x": 300,
            "size_y": 5,
            "colour": "RGBA",
            "pattern": "Test_Bild_2.png",
            "transparency": False
        }
        data = {}
        expected = image_test_helper.prepare_overlay_test(values, data)
        assert os.path.exists(resources.get_resource_path(expected)) == 1

    def test_image_array(self):
        values = {
            "type": "image_array",
            "pos_x": [187, 190, 45],
            "pos_y": [462, 47, 145],
            "size_x": 300,
            "size_y": 5,
            "colour": ["RGBA", "L", "RGBA"],
            "pattern": ["Test_Bild_2.png", "Test_Bild_2.png", "Test_Bild_2.png"],
            "transparency": False
        }
        data = {}
        expected = image_test_helper.prepare_overlay_test(values, data)
        assert os.path.exists(resources.get_resource_path(expected)) == 1

    def test_option(self):
        values = {
            "type": "option",
            "check": "{_req|_test|checker}",
            "on_true": [
                {
                    "type": "text_array",
                    "anchor_point": "center",
                    "pos_x": [
                        90,
                        104
                    ],
                    "pos_y": [
                        40,
                        40
                    ],
                    "preset": "test_preset",
                    "pattern": [
                        "{_req|_test|test_1}",
                        "{_req|_test|test_1}"
                    ]
                },
            ],
            "on_false": [
                {
                    "type": "text",
                    "anchor_point": "center",
                    "pos_x": 50,
                    "pos_y": 45,
                    "preset": "test_preset",
                    "pattern": "Hallo"
                }
            ]
        }
        data = {
            "test_1": "Test text",
            "checker": False
        }
        expected = image_test_helper.prepare_overlay_test(values, data)
        assert os.path.exists(resources.get_resource_path(expected)) == 1

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(resources.get_temp_resource_path("", "100", True), ignore_errors=True)
