from visuanalytics.analytics.processing.weather import weather_visualization as ws
from visuanalytics.analytics.preprocessing import weather
from visuanalytics.analytics.apis import weather as api
from visuanalytics.analytics.processing.util import date_time
from visuanalytics.analytics.util import resources
import os

# todo needs to be finished when speech ready (to generate video)

TESTING_MODE = 1

if TESTING_MODE:
    json_data = api.get_example()
else:
    json_data = api.get_forecasts()
path = resources.get_resource_path("temp/weather")
if not os.path.exists(path):
    os.mkdir(path)

data = weather.preprocess_weather_data(json_data)
date = date_time.date_to_weekday(weather.get_first_day(data))

ws.get_oneday_icons_image(weather.data_icon_oneday(data, 0), date[0])
ws.get_oneday_temp_image(weather.data_temp_oneday(data, 0), date[0])

ws.get_oneday_icons_image(weather.data_icon_oneday(data, 1), date[1])
ws.get_oneday_temp_image(weather.data_temp_oneday(data, 1), date[1])

ws.get_threeday_image(weather.data_icon_threeday(data), weather.data_mm_temp_threeday(data), date[2:5])
