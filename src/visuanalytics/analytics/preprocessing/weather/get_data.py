from visuanalytics.analytics.preprocessing.weather import speech, weather
from visuanalytics.analytics.util import date_time


def get_weekday(data):
    date = data['cities']['Kiel'][0]['datetime']
    weekdays = date_time.date_to_weekday(date)
    weekdays_for_dict = {"today": weekdays[0], "tomorrow": weekdays[1], "next_1": weekdays[2], "next_2": weekdays[3],
                         "next_3": weekdays[4]}
    return weekdays_for_dict


def get_data_today_tomorrow_three(data):
    data_min_max = {}
    for i in range(5):
        city_name_maximum, maximum_temp, code_maximum = weather.get_city_with_max_temp(data, i)
        city_name_minimum, minimum_temp, code_minimum = weather.get_city_with_min_temp(data, i)
        avg_temperatur = weather.get_city_with_max_min_avg_temp(data, i)
        city_name_max = speech.random_city_descriptions(city_name_maximum)
        city_name_min = speech.random_city_descriptions(city_name_minimum)
        avg_temperatur[0] = speech.random_city_descriptions(avg_temperatur[0])
        avg_temperatur[3] = speech.random_city_descriptions(avg_temperatur[3])
        code_max = speech.random_weather_descriptions(code_maximum)
        code_min = speech.random_weather_descriptions(code_minimum)
        avg_temperatur[2] = speech.random_weather_descriptions(avg_temperatur[2])
        avg_temperatur[5] = speech.random_weather_descriptions(avg_temperatur[5])
        max_temp = str(maximum_temp)
        min_temp = str(minimum_temp)
        data_min_max.update({i: {"city_name_max": city_name_max, "max_temp": max_temp,
                                 "code_max": code_max, "city_name_min": city_name_min,
                                 "min_temp": min_temp, "code_min": code_min,
                                 "city_name_max_avg": avg_temperatur[0], "max_avg_temp": avg_temperatur[1],
                                 "code_max_avg": avg_temperatur[2], "city_name_min_avg": avg_temperatur[3],
                                 "min_avg_temp": avg_temperatur[4], "code_min_avg": avg_temperatur[5]}})
    return data_min_max


def add_data_together(data):
    data_for_text = {}
    weekdays_for_dict = get_weekday(data)
    average_temp, common_code = weather.get_average_per_day(data)
    data_min_max = get_data_today_tomorrow_three(data)
    data_for_text.update({"today": {"weekday": weekdays_for_dict["today"],
                                    "average_temp": average_temp[0],
                                    "common_code": common_code[0],
                                    "city_name_max": data_min_max[0]["city_name_max"],
                                    "max_temp": data_min_max[0]["max_temp"],
                                    "code_max": data_min_max[0]["code_max"],
                                    "city_name_min": data_min_max[0]["city_name_min"],
                                    "min_temp": data_min_max[0]["min_temp"],
                                    "code_min": data_min_max[0]["code_min"],
                                    "city_name_max_avg": data_min_max[0]["city_name_max_avg"],
                                    "max_avg_temp": data_min_max[0]["max_avg_temp"],
                                    "code_max_avg": data_min_max[0]["code_max_avg"],
                                    "city_name_min_avg": data_min_max[0]["city_name_min_avg"],
                                    "min_avg_temp": data_min_max[0]["min_avg_temp"],
                                    "code_min_avg": data_min_max[0]["code_min_avg"]}})
    data_for_text.update({"tomorrow": {"weekday": weekdays_for_dict["tomorrow"],
                                       "average_temp": average_temp[1],
                                       "common_code": common_code[1],
                                       "city_name_max": data_min_max[1]["city_name_max"],
                                       "max_temp": data_min_max[1]["max_temp"],
                                       "code_max": data_min_max[1]["code_max"],
                                       "city_name_min": data_min_max[1]["city_name_min"],
                                       "min_temp": data_min_max[1]["min_temp"],
                                       "code_min": data_min_max[1]["code_min"],
                                       "city_name_max_avg": data_min_max[1]["city_name_max_avg"],
                                       "max_avg_temp": data_min_max[1]["max_avg_temp"],
                                       "code_max_avg": data_min_max[1]["code_max_avg"],
                                       "city_name_min_avg": data_min_max[1]["city_name_min_avg"],
                                       "min_avg_temp": data_min_max[1]["min_avg_temp"],
                                       "code_min_avg": data_min_max[1]["code_min_avg"]}})
    data_for_text.update({"next_1": {"weekday": weekdays_for_dict["next_1"],
                                     "average_temp": average_temp[2],
                                     "common_code": common_code[2],
                                     "city_name_max": data_min_max[2]["city_name_max"],
                                     "max_temp": data_min_max[2]["max_temp"],
                                     "code_max": data_min_max[2]["code_max"],
                                     "city_name_min": data_min_max[2]["city_name_min"],
                                     "min_temp": data_min_max[2]["min_temp"],
                                     "code_min": data_min_max[2]["code_min"],
                                     "city_name_max_avg": data_min_max[2]["city_name_max_avg"],
                                     "max_avg_temp": data_min_max[2]["max_avg_temp"],
                                     "code_max_avg": data_min_max[2]["code_max_avg"],
                                     "city_name_min_avg": data_min_max[2]["city_name_min_avg"],
                                     "min_avg_temp": data_min_max[2]["min_avg_temp"],
                                     "code_min_avg": data_min_max[2]["code_min_avg"]}})
    data_for_text.update({"next_2": {"weekday": weekdays_for_dict["next_2"],
                                     "average_temp": average_temp[3],
                                     "common_code": common_code[3],
                                     "city_name_max": data_min_max[3]["city_name_max"],
                                     "max_temp": data_min_max[3]["max_temp"],
                                     "code_max": data_min_max[3]["code_max"],
                                     "city_name_min": data_min_max[3]["city_name_min"],
                                     "min_temp": data_min_max[3]["min_temp"],
                                     "code_min": data_min_max[3]["code_min"],
                                     "city_name_max_avg": data_min_max[3]["city_name_max_avg"],
                                     "max_avg_temp": data_min_max[3]["max_avg_temp"],
                                     "code_max_avg": data_min_max[3]["code_max_avg"],
                                     "city_name_min_avg": data_min_max[3]["city_name_min_avg"],
                                     "min_avg_temp": data_min_max[3]["min_avg_temp"],
                                     "code_min_avg": data_min_max[3]["code_min_avg"]}})
    data_for_text.update({"next_3": {"weekday": weekdays_for_dict["next_3"],
                                     "average_temp": average_temp[4],
                                     "common_code": common_code[4],
                                     "city_name_max": data_min_max[4]["city_name_max"],
                                     "max_temp": data_min_max[4]["max_temp"],
                                     "code_max": data_min_max[4]["code_max"],
                                     "city_name_min": data_min_max[4]["city_name_min"],
                                     "min_temp": data_min_max[4]["min_temp"],
                                     "code_min": data_min_max[4]["code_min"],
                                     "city_name_max_avg": data_min_max[4]["city_name_max_avg"],
                                     "max_avg_temp": data_min_max[4]["max_avg_temp"],
                                     "code_max_avg": data_min_max[4]["code_max_avg"],
                                     "city_name_min_avg": data_min_max[4]["city_name_min_avg"],
                                     "min_avg_temp": data_min_max[4]["min_avg_temp"],
                                     "code_min_avg": data_min_max[4]["code_min_avg"]}})
    return data_for_text
