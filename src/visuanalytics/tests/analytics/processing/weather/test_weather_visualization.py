import json
import os
import shutil
import unittest

from visuanalytics.analytics.preprocessing.weather import transform
from visuanalytics.analytics.preprocessing.weather import visualisation as pre_visualisation
from visuanalytics.analytics.processing.weather import visualisation as pro_visualisation
from visuanalytics.analytics.util import date_time
from visuanalytics.analytics.util import resources


class PreprocessTest(unittest.TestCase):
    with resources.open_resource("exampledata/example_weather.json") as file_handle:
        input = json.loads(file_handle.read())
        output = transform.preprocess_weather_data(input)
        date = date_time.date_to_weekday(transform.get_first_day(output))
        os.mkdir(resources.get_resource_path("temp/pre_1"))

    def test_if_get_threeday_image_generates_image(self):
        expected = pro_visualisation._get_threeday_image("pre_1", pre_visualisation.data_icon_threeday(self.output),
                                                         pre_visualisation.data_mm_temp_threeday(self.output),
                                                         self.date[2:5], 0)
        assert os.path.exists(resources.get_resource_path(expected)) == 1

    def test_if_get_oneday_icons_image_generates_image(self):
        expected = pro_visualisation._get_oneday_icons_image("pre_1",
                                                             pre_visualisation.data_icon_oneday(self.output, 0),
                                                             self.date[0])
        assert os.path.exists(resources.get_resource_path(expected)) == 1

    def test_if_get_oneday_temp_image_generates_image(self):
        expected = pro_visualisation._get_oneday_temp_image("pre_1", pre_visualisation.data_temp_oneday(self.output, 0),
                                                            self.date[0])
        assert os.path.exists(resources.get_resource_path(expected)) == 1

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(resources.get_resource_path("temp/pre_1"), ignore_errors=True)
