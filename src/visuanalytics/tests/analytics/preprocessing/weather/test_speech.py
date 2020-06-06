import unittest

from visuanalytics.analytics.preprocessing.weather import speech


class SpeechTest(unittest.TestCase):

    def test_percent_to_text(self):
        actual = speech.percent_to_text(58)
        expected = "58 Prozent"
        self.assertEqual(actual, expected)

    def test_wind_cdir_full_data_to_text(self):
        actual = speech.wind_cdir_full_data_to_text("south-southeast")
        expected = "Süd Südost"
        self.assertEqual(actual, expected)

    def test_random_weather_descriptions(self):
        actual = speech.random_weather_descriptions(302)
        expected1 = "kommt es zu starkem Nieselregen"
        expected2 = "ist mit starkem Nieselregen zu rechnen"
        self.assertTrue((actual == expected1) | (actual == expected2))

    def test_city_name_to_text(self):
        actual = speech.city_name_to_text("Gießen")
        expected = "in Gießen"
        self.assertEqual(actual, expected)
