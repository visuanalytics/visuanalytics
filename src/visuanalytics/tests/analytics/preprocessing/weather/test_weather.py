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

weather_param_names = ["valid_date", "max_temp", "min_temp", "app_min_temp", "app_max_temp",
                       "wind_cdir_full", "wind_spd", "icon", "code", "sunrise_ts", "sunset_ts", "rh", "pop"]


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

    def test_get_weekday(self):
        """
        Datum: 2020-05-19
        """
        actual = transform.get_weekday(self.output)
        expected = {
            'today': 'Dienstag',
            'tomorrow': 'Mittwoch',
            'next_1': 'Donnerstag',
            'next_2': 'Freitag',
            'next_3': 'Samstag'
        }
        self.assertEqual(actual, expected)

    def test_get_city_with_max_temp(self):
        actual_city, actual_temp, actual_code = transform.get_city_with_max_temp(self.output, 0)
        city_array = []
        code_array = []
        for city in self.output['cities']:
            if (round(self.output['cities'][city][0]['max_temp']) > actual_temp):
                assert False
            if (round(self.output['cities'][city][0]['max_temp']) == actual_temp):
                city_array.append(city)
                code_array.append(self.output['cities'][city][0]['code'])
        for i in range(len(city_array)):
            if (actual_city == city_array[i]):
                assert actual_code == code_array[i]

    def test_get_city_with_min_temp(self):
        actual_city, actual_temp, actual_code = transform.get_city_with_min_temp(self.output, 0)
        city_array = []
        code_array = []
        for city in self.output['cities']:
            if (round(self.output['cities'][city][0]['min_temp']) < actual_temp):
                assert False
            if (round(self.output['cities'][city][0]['min_temp']) == actual_temp):
                city_array.append(city)
                code_array.append(self.output['cities'][city][0]['code'])
        for i in range(len(city_array)):
            if (actual_city == city_array[i]):
                assert actual_code == code_array[i]
