import json
import os
import shutil
import unittest

from visuanalytics.analytics.preprocessing.history import speech as pre_speech_his
from visuanalytics.analytics.preprocessing.history import transform as transform_his
from visuanalytics.analytics.processing.history import speech as pro_speech_his
from visuanalytics.analytics.util import resources


class ProcessTest(unittest.TestCase):
    with resources.open_resource("exampledata/example_history.json") as file_handle:
        input = json.loads(file_handle.read())
        output = transform_his.preprocess_history_data(input)
        date = transform_his.get_date(output[0])
        os.mkdir(resources.get_resource_path("temp/pro_speech_his"))

    def test_if_get_all_audios_generates_audio(self):
        expected = pro_speech_his.get_all_audios("pro_speech_his", pre_speech_his.merge_data(self.output, self.date),
                                                 self.date)
        self.assertEqual(os.path.exists(expected[0]), 1)
        self.assertEqual(os.path.exists(expected[1]), 1)
        self.assertEqual(os.path.exists(expected[2]), 1)
        self.assertEqual(os.path.exists(expected[3]), 1)

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(resources.get_resource_path("temp/pro_speech_his"), ignore_errors=True)
