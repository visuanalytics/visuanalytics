from visuanalytics.analytics.preprocessing import weather
from visuanalytics.analytics.util import resources
import unittest
import json

input_single = {
    "city_name": "Gießen",
    "data": [
        {
            "temp": 15,
            "code": 802,
            "sunset_ts": 15887976
        },
        {
            "temp": 15,
            "code": 802,
            "sunset_ts": 15887976
        },
        {
            "temp": 15,
            "code": 802,
            "sunset_ts": 15887976
        },
        {
            "temp": 15,
            "code": 802,
            "sunset_ts": 15887976
        },
        {
            "temp": 15,
            "code": 802,
            "sunset_ts": 15887976
        }
    ]
}

city_names = ["Kiel", "Berlin", "Dresden", "Hannover", "Bremen", "Düsseldorf", "Frankfurt", "Nürnberg", "Stuttgart",
              "München", "Saarbrücken", "Schwerin", "Hamburg", "Gießen", "Garmisch-Partenkirchen"]

summary_param_names = ["temp_avg", "temp_min", "temp_max", "common_icon", "common_code"]

weather_param_names = ["datetime", "temp", "low_temp", "min_temp", "high_temp", "max_temp", "app_min_temp",
                       "app_max_temp", "wind_cdir", "wind_dir", "icon", "code", "sunrise_ts", "sunset_ts"]


class PreprocessSingleTest(unittest.TestCase):

    def test_only_four_days_taken(self):
        actual = len(weather._preprocess_single(input_single)["Gießen"])
        expected = 4
        self.assertEqual(actual, expected)

    def test_maximum_four_days_taken(self):
        input_single_three_days = {
            "city_name": "Gießen",
            "data": input_single["data"][:3]
        }
        actual = len(weather._preprocess_single(input_single_three_days)["Gießen"])
        expected = 3
        self.assertEqual(actual, expected)


class PreprocessTest(unittest.TestCase):
    with resources.open_resource("../../resources/exampledata/example_weather.json") as file_handle:
        input = json.loads(file_handle.read())
        output = weather.preprocess_weather_data(input)

    def test_contains_all_cities(self):
        actual = set((dict.keys(self.output["cities"])))
        expected = set(city_names)
        self.assertEqual(actual, expected)

    def test_contains_all_summary_params(self):
        actual = set(dict.keys(self.output["summaries"][0]))
        expected = set(summary_param_names)
        self.assertEqual(actual, expected)

    def test_contains_all_weather_params(self):
        actual = set(dict.keys(self.output["cities"]["Gießen"][0]))
        expected = set(weather_param_names)
        self.assertEqual(actual, expected)
