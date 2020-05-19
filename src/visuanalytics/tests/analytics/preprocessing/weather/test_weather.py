import json
import unittest

from visuanalytics.analytics.preprocessing.weather import transform
from visuanalytics.analytics.preprocessing.weather import visualisation
from visuanalytics.analytics.util import resources

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
              "München", "Saarbrücken", "Schwerin", "Hamburg", "Gießen", "Konstanz", "Magdeburg", "Leipzig", "Mainz",
              "Regensburg"]

summary_param_names = ["temp_avg", "temp_min", "temp_max", "common_icon", "common_code"]

weather_param_names = ["datetime", "temp", "low_temp", "min_temp", "high_temp", "max_temp", "app_min_temp",
                       "app_max_temp", "wind_cdir", "wind_dir", "icon", "code", "sunrise_ts", "sunset_ts"]


class PreprocessSingleTest(unittest.TestCase):

    def test_only_four_days_taken(self):
        actual = len(transform._preprocess_single(input_single)["Gießen"])
        expected = 5
        self.assertEqual(actual, expected)

    def test_maximum_four_days_taken(self):
        input_single_three_days = {
            "city_name": "Gießen",
            "data": input_single["data"][:3]
        }
        actual = len(transform._preprocess_single(input_single_three_days)["Gießen"])
        expected = 3
        self.assertEqual(actual, expected)


class PreprocessTest(unittest.TestCase):
    with resources.open_resource("exampledata/example_weather.json") as file_handle:
        input = json.loads(file_handle.read())
        output = transform.preprocess_weather_data(input)

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

    def test_data_icon_oneday_contains_allentrys(self):
        actual = len(visualisation.data_icon_oneday(self.output, 0))
        expected = 10
        self.assertEqual(actual, expected)

    def test_data_temp_oneday_contains_allentrys(self):
        actual = len(visualisation.data_temp_oneday(self.output, 0))
        expected = 10
        self.assertEqual(actual, expected)

    def test_data_mm_temp_threeday_contains_allentrys(self):
        actual = len(visualisation.data_mm_temp_threeday(self.output))
        expected = 6
        self.assertEqual(actual, expected)

    def test_data_icon_threeday_contains_allentrys(self):
        actual = len(visualisation.data_icon_threeday(self.output))
        expected = 4
        self.assertEqual(actual, expected)

    def test_data_icon_oneday_check_if_tuple(self):
        self.assertIsInstance(visualisation.data_icon_oneday(self.output, 0)[0][0], tuple)

    def test_data_temp_oneday_check_if_tuple(self):
        self.assertIsInstance(visualisation.data_temp_oneday(self.output, 0)[0][0], tuple)

    def test_data_mm_temp_threeday_check_if_tuple(self):
        self.assertIsInstance(visualisation.data_mm_temp_threeday(self.output)[0][0], tuple)

    def test_data_icon_threeday_check_if_tuple(self):
        self.assertIsInstance(visualisation.data_icon_threeday(self.output)[0][0], tuple)

    def test_data_icon_oneday_check_if_string(self):
        self.assertIsInstance(visualisation.data_icon_oneday(self.output, 0)[0][1], str)

    def test_data_temp_oneday_check_if_string(self):
        self.assertIsInstance(visualisation.data_temp_oneday(self.output, 0)[0][1], str)

    def test_data_mm_temp_threeday_check_if_string(self):
        self.assertIsInstance(visualisation.data_mm_temp_threeday(self.output)[0][1], str)

    def test_data_icon_threeday_check_if_string(self):
        self.assertIsInstance(visualisation.data_icon_threeday(self.output)[0][3], str)
