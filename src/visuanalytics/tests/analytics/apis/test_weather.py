from visuanalytics.analytics.apis import weather
import unittest


class ForecastRequestTest(unittest.TestCase):
    def test_forecast_request(self):
        expected = ["https://api.weatherbit.io/v2.0/forecast/daily?city=Gießen&key=",
                    "https://api.weatherbit.io/v2.0/forecast/daily?city=Berlin&key=",
                    "https://api.weatherbit.io/v2.0/forecast/daily?city=Frankfurt&key=",
                    "https://api.weatherbit.io/v2.0/forecast/daily?city=&key="]
        actual = [weather._forecast_request("Gießen"),
                  weather._forecast_request("Berlin"),
                  weather._forecast_request("Frankfurt"),
                  weather._forecast_request("")]
        self.assertEqual(actual, expected)
