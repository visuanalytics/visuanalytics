from visuanalytics.analytics.processing.weather import weather_visualization as ws
from visuanalytics.analytics.preprocessing import weather
from visuanalytics.analytics.apis import weather as api

# todo needs to be finished when speech ready (to generate video)

TESTING_MODE = 1

if TESTING_MODE:
    json_data = api.get_example()
else:
    json_data = api.get_forecasts()

data = weather.preprocess_weather_data(json_data)

ws.get_three_pic(weather.get_ico_three(data),
                 weather.get_temp_mm_three(data), weather.get_first_day(data))
ws.get_tomo_icons(weather.get_ico_tomorow(data))
ws.get_tomo_temperatur(weather.get_temp_tomorow(data))
