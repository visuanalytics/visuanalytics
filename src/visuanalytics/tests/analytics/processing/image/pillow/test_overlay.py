import os
import shutil
import unittest

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.processing.image.visualization import generate_all_images
from visuanalytics.analytics.util import resources


def prepare_overlay_test(values, data, config=None):
    if config is None:
        config = {}

    step_data = StepData(config, "0")
    step_data.init_data({"_test": data})
    values = {
        "images": {
            "testbild": {
                "type": "pillow",
                "path": "Test_Bild_1.png",
                "overlay": [values]
            }
        },
        "presets": {
            "test_preset": {
                "color": "black",
                "font_size": 20,
                "font": "Test_Font.ttf"
            },
        }
    }
    step_data.data["_pipe_id"] = "100"
    generate_all_images(values, step_data)

    return values["images"]["testbild"]


class PreprocessTest(unittest.TestCase):
    def setUp(self):
        resources.RESOURCES_LOCATION = "../../tests/resources"
        os.makedirs(resources.get_resource_path("temp"), exist_ok=True)
        os.makedirs(resources.get_temp_resource_path("", "100"), exist_ok=True)

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
        expected = prepare_overlay_test(values, data)
        self.assertEquals(os.path.exists(resources.get_resource_path(expected)), 1)

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
        expected = prepare_overlay_test(values, data)
        self.assertEquals(os.path.exists(resources.get_resource_path(expected)), 1)

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
        expected = prepare_overlay_test(values, data)
        self.assertEquals(os.path.exists(resources.get_resource_path(expected)), 1)

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
        expected = prepare_overlay_test(values, data)
        self.assertEquals(os.path.exists(resources.get_resource_path(expected)), 1)

    def test_option(self):
        values = {
            "type": "option",
            "check": "_req|_test|checker",
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
        expected = prepare_overlay_test(values, data)
        self.assertEquals(os.path.exists(resources.get_resource_path(expected)), 1)

    def tearDown(self):
        shutil.rmtree(resources.get_temp_resource_path("", "100"), ignore_errors=True)
