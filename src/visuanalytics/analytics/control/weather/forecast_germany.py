from visuanalytics.analytics.apis import weather as api
from visuanalytics.analytics.processing.weather import weather_text_speech as speech
from visuanalytics.analytics.preprocessing.weather import get_data, weather as weather
from visuanalytics.analytics.processing.weather import weather_visualization as ws
from visuanalytics.analytics.util import date_time
from visuanalytics.analytics.util import audio
from visuanalytics.analytics.util import resources
from visuanalytics.analytics.linking import weather as videolinker
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

path = resources.get_resource_path("weather/output")
if not os.path.exists(path):
    os.mkdir(path)

images = []
data = weather.preprocess_weather_data(json_data)
date = date_time.date_to_weekday(weather.get_first_day(data))

images.append(ws.get_oneday_icons_image(weather.data_icon_oneday(data, 0), date[0]))
images.append(ws.get_oneday_temp_image(weather.data_temp_oneday(data, 0), date[0]))

images.append(ws.get_oneday_icons_image(weather.data_icon_oneday(data, 1), date[1]))
images.append(ws.get_oneday_temp_image(weather.data_temp_oneday(data, 1), date[1]))

images.append(ws.get_threeday_image(weather.data_icon_threeday(data), weather.data_mm_temp_threeday(data), date[2:5]))

audios = speech.first_weatherforecast_text_to_speech(get_data.add_data_together(data))
audiol = audio.get_audio_length(audios)
videolinker.to_forecast_germany(images, audios, audiol)

for i in images:
    resources.delete_resource(i)

for a in audios:
    resources.delete_resource(a)
