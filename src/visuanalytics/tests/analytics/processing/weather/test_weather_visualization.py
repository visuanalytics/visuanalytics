import os

from visuanalytics.analytics.preprocessing.weather import visualisation
from visuanalytics.analytics.util import date_time
from visuanalytics.analytics.util import resources
from visuanalytics.analytics.processing.weather import visualisation
import unittest
import json


class PreprocessTest(unittest.TestCase):
    with resources.open_resource("exampledata/example_weather.json") as file_handle:
        input = json.loads(file_handle.read())
        output = visualisation.preprocess_weather_data(input)
        date = date_time.date_to_weekday(visualisation.get_first_day(output))
        path = resources.get_resource_path("temp/weather")
        if not os.path.exists(path):
            os.mkdir(path)
        cleanup = []

    def test_if_get_threeday_image_generates_image(self):
        expected = visualisation.get_threeday_image(visualisation.data_icon_threeday(self.output),
                                                    visualisation.data_mm_temp_threeday(self.output),
                                                            self.date[2:5])
        self.cleanup.append(expected)
        assert os.path.exists(resources.get_resource_path(expected)) == 1

    def test_if_get_oneday_icons_image_generates_image(self):
        expected = visualisation.get_oneday_icons_image(visualisation.data_icon_oneday(self.output, 0),
                                                        self.date[0])
        self.cleanup.append(expected)
        assert os.path.exists(resources.get_resource_path(expected)) == 1

    def test_if_get_oneday_temp_image_generates_image(self):
        expected = visualisation.get_oneday_temp_image(visualisation.data_temp_oneday(self.output, 0),
                                                       self.date[0])
        self.cleanup.append(expected)
        assert os.path.exists(resources.get_resource_path(expected)) == 1

    def tearDown(self):
        for clean in self.cleanup:
            resources.delete_resource(clean)
