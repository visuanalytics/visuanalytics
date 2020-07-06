import os
import shutil
import unittest

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.processing.image.visualization import generate_all_images
from visuanalytics.analytics.util import resources


def prepare_draw_test(values, data, config=None):
    if config is None:
        config = {}

    step_data = StepData(config, "0")
    step_data.init_data({"_test": data})
    values = {
        "images": {
            "testbild": {
                "type": "pillow",
                "path": "Test_Bild_1.png",
                "overlay": [
                    {
                        "type": "text",
                        "anchor_point": values,
                        "pos_x": 100,
                        "pos_y": 50,
                        "preset": "test_preset",
                        "pattern": "Test"
                    },
                ]
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
    step_data.data["_pipe_id"] = "101"
    generate_all_images(values, step_data)

    return values["images"]["testbild"]


class PreprocessTest(unittest.TestCase):
    def setUp(self):
        resources.RESOURCES_LOCATION = "../../tests/resources"
        os.makedirs(resources.get_resource_path("temp"), exist_ok=True)
        os.makedirs(resources.get_temp_resource_path("", "101"), exist_ok=True)

    def test_left(self):
        values = "left"
        data = {}
        expected = prepare_draw_test(values, data)
        self.assertEqual(os.path.exists(resources.get_resource_path(expected)), 1)

    def test_center(self):
        values = "center"
        data = {}
        expected = prepare_draw_test(values, data)
        self.assertEqual(os.path.exists(resources.get_resource_path(expected)), 1)

    def tearDown(self):
        shutil.rmtree(resources.get_temp_resource_path("", "101"), ignore_errors=True)
