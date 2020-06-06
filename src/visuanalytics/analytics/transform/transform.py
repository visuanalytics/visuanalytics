from numpy import random

from visuanalytics.analytics.preprocessing.weather import speech, visualisation
from numpy import random

from visuanalytics.analytics.preprocessing.weather import speech, visualisation


def transform_get_weather_icon(data, location, date_in_future):
    return data['cities'][location][date_in_future]['icon']


def transform_get_weather_temp(data, location, date_in_future):
    temp = round(data['cities'][location][date_in_future]['max_temp'])
    return f"{temp}\u00B0"


def transform_get_max_temp(data, date_in_future):
    max_temp = round(data['summaries'][date_in_future]['temp_max'])
    return f"{max_temp}\u00B0"


def transform_get_min_temp(data, date_in_future):
    min_temp = round(data['summaries'][date_in_future]['temp_min'])
    return f"{min_temp}\u00B0"


def transform_get_city_with_min_temp(data, date_in_future):
    min_temp = round(data['summaries'][date_in_future]['temp_min'])
    cities_with_min_temp = []
    for city in data['cities']:
        if round(data['cities'][city][date_in_future]['min_temp']) == min_temp:
            cities_with_min_temp.append(city)

    return_city = random.choice(cities_with_min_temp)
    return return_city, min_temp, data['cities'][return_city][date_in_future]['code']


def transform_get_cities_max_temp(data, date_in_future):
    cities_with_max_temp = []
    cities_with_highest_max_temp = []
    cities_with_lowest_max_temp = []
    for city in visualisation.LOCATIONS_TOMOROW:
        cities_with_max_temp.append(round(data['cities'][city[0]][date_in_future]['max_temp']))
    highest_max_temp = max(cities_with_max_temp)
    lowest_max_temp = min(cities_with_max_temp)
    for city in visualisation.LOCATIONS_TOMOROW:
        if round(data['cities'][city[0]][date_in_future]['max_temp']) == highest_max_temp:
            cities_with_highest_max_temp.append(city[0])
        if round(data['cities'][city[0]][date_in_future]['max_temp']) == lowest_max_temp:
            cities_with_lowest_max_temp.append(city[0])
    return_city_max = random.choice(cities_with_highest_max_temp)
    return_city_min = random.choice(cities_with_lowest_max_temp)

    return [return_city_max, round(data['cities'][return_city_max][date_in_future]['max_temp']),
            data['cities'][return_city_max][date_in_future]['code'],
            return_city_min, round(data['cities'][return_city_min][date_in_future]['max_temp']),
            data['cities'][return_city_min][date_in_future]['code']]


def transform_get_common_code_per_day(data):
    common_code = []
    for summary in range(5):
        common_code_data = data['summaries'][summary]['common_code']
        common_code.append(speech.random_weather_descriptions(common_code_data))

    return common_code
