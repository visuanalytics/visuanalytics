import json
import os
import shutil
import unittest

from visuanalytics.analytics.preprocessing.weather import transform
from visuanalytics.analytics.preprocessing.weather import speech as pre_speech
from visuanalytics.analytics.processing.weather import speech as pro_speech
from visuanalytics.analytics.util import date_time
from visuanalytics.analytics.util import resources


class ProcessTest(unittest.TestCase):
    with resources.open_resource("exampledata/example_weather.json") as file_handle:
        input = json.loads(file_handle.read())
        output = transform.preprocess_weather_data(input)
        os.mkdir(resources.get_resource_path("temp/pro_speech"))

    def test_if_get_all_audios_single_city_generates_audio(self):
        expected = pro_speech.first_weatherforecast_text_to_speech("pro_speech", pre_speech.merge_data(self.output))
        self.assertEqual(os.path.exists(expected[0]), 1)
        self.assertEqual(os.path.exists(expected[1]), 1)
        self.assertEqual(os.path.exists(expected[2]), 1)
        self.assertEqual(os.path.exists(expected[3]), 1)
        self.assertEqual(os.path.exists(expected[4]), 1)


    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(resources.get_resource_path("temp/pro_speech"), ignore_errors=True)
