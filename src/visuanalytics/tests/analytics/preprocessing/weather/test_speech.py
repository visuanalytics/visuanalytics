import unittest

from visuanalytics.analytics.preprocessing.weather import speech


class SpeechTest(unittest.TestCase):

    def test_air_data_to_text(self):
        actual = speech.air_data_to_text(58, 1000.27)
        expected = "58 Prozent", "1000,27 Millibar"
        self.assertEqual(actual, expected)

    def test_wind_data_to_text(self):
        actual = speech.wind_data_to_text("south-southeast", 252, 0.82764)
        expected = "Süd Südost", "252 Grad", "0,83 Metern pro Sekunde"
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
