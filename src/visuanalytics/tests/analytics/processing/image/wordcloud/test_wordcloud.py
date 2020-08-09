import os
import shutil
import unittest

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.processing.image.visualization import generate_all_images
from visuanalytics.util import resources


def prepare_wordcloud_test(values, data, config=None):
    if config is None:
        config = {}

    step_data = StepData(config, "0")
    step_data.insert_data("_req", {"_test": data}, {})
    values = {
        "images": {
            "testbild": {
                "type": "wordcloud",
                "text": "_req|dict_all",
                "preset": "wordcloud"
            }
        },
        "presets": {
            "wordcloud": {
                "stopwords": "Cyprus",
                "use_global_stopwords": False,
                "color_func_words": "145 46 5 35",
                "parameter": {
                    "figure": "square",
                    "width": 1000,
                    "height": 1000,
                    "collocations": False,
                    "max_font_size": 400,
                    "max_words": 2000,
                    "contour_width": 3,
                    "contour_color": "white",
                    "color_func": True,
                    "colormap": "viridis"
                }
            }
        }
    }

    step_data.data["_pipe_id"] = "100"

    generate_all_images(values, step_data)

    return values["images"]["testbild"]


class WordcloudTest(unittest.TestCase):
    def setUp(self):
        resources.RESOURCES_LOCATION = "../tests/resources"
        resources.IMAGES_LOCATION = "../tests/resources/images"
        os.makedirs(resources.get_resource_path("temp"), exist_ok=True)
        os.makedirs(resources.get_temp_resource_path("", "100"), exist_ok=True)

    def test_wordcloud(self):
        values = {}
        data = {
            "text": "Canada, Argentina, Cyprus, Schweden, Norway, USA, Germany, United Kingdom, Argentina, Norway, USA, Argentina"
        }
        expected = prepare_wordcloud_test(values, data)
        self.assertEqual(os.path.exists(resources.get_resource_path(expected)), 1)

    def tearDown(self):
        shutil.rmtree(resources.get_temp_resource_path("", "100"), ignore_errors=True)
