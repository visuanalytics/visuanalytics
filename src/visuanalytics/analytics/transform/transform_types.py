from visuanalytics.analytics.transform import transform

TRANSFORM_TYPES = {
    "name": transform.transform_get_weather_icon(data, location, date_in_future),
    "name": transform.transform_get_weather_temp(data, location, date_in_future),
    "name": transform.transform_get_max_temp(data, date_in_future),
    "name": transform.transform_get_min_temp(data, date_in_future),
    "name": transform.transform_get_city_with_min_temp(data, date_in_future),
    "name": transform.transform_get_cities_max_temp(data, date_in_future),
    "name": transform.transform_get_common_code_per_day(data)
}
