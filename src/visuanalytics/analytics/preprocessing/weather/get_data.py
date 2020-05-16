from visuanalytics.analytics.preprocessing.weather import speech
from visuanalytics.analytics.util import date_time
from visuanalytics.analytics.preprocessing import preprocessing_weather

def get_weekday(data):
    date = data['cities']['Kiel'][0]['datetime']
    weekdays = date_time.date_to_weekday(date)
    weekdays_for_dict = {"today": weekdays[0], "tomorrow": weekdays[1], "next_1": weekdays[2], "next_2": weekdays[3], "next_3": weekdays[4]}
    return weekdays_for_dict

def get_data_today_tomorrow_three(data):
    data_min_max = {}
    for i in range(4):
        city_name_maximum, maximum_temp, code_maximum = preprocessing_weather.get_city_with_max_temp(data, i)
        city_name_minimum, minimum_temp, code_minimum = preprocessing_weather.get_city_with_min_temp(data, i)
        city_name_max = speech.random_city_descriptions(city_name_maximum)
        city_name_min = speech.random_city_descriptions(city_name_minimum)
        code_max = speech.random_weather_descriptions(code_maximum)
        code_min = speech.random_weather_descriptions(code_minimum)
        max_temp = str(maximum_temp)
        min_temp = str(minimum_temp)
        data_min_max.update({i: {"city_name_max": city_name_max, "max_temp": max_temp,
                                           "code_max": code_max, "city_name_min": city_name_min,
                                           "min_temp": min_temp, "code_min": code_min}})
    return data_min_max

def add_data_together(data):
    data_for_text = {}
    weekdays_for_dict = get_weekday(data)
    data_min_max = get_data_today_tomorrow_three(data)
    data_for_text.update({"today": {"weekday": weekdays_for_dict["today"],
                                      "city_name_max": data_min_max[0]["city_name_max"],
                                    "max_temp": data_min_max[0]["max_temp"],
                                    "code_max": data_min_max[0]["code_max"],
                                    "city_name_min": data_min_max[0]["city_name_min"],
                                    "min_temp": data_min_max[0]["min_temp"],
                                    "code_min": data_min_max[0]["code_min"]}})
    data_for_text.update({"tomorrow": {"weekday": weekdays_for_dict["tomorrow"],
                                    "city_name_max": data_min_max[1]["city_name_max"],
                                    "max_temp": data_min_max[1]["max_temp"],
                                    "code_max": data_min_max[1]["code_max"],
                                    "city_name_min": data_min_max[1]["city_name_min"],
                                    "min_temp": data_min_max[1]["min_temp"],
                                    "code_min": data_min_max[1]["code_min"]}})
    data_for_text.update({"next_1": {"weekday": weekdays_for_dict["next_1"],
                                    "city_name_max": data_min_max[2]["city_name_max"],
                                    "max_temp": data_min_max[2]["max_temp"],
                                    "code_max": data_min_max[2]["code_max"],
                                    "city_name_min": data_min_max[2]["city_name_min"],
                                    "min_temp": data_min_max[2]["min_temp"],
                                    "code_min": data_min_max[2]["code_min"]}})
    data_for_text.update({"next_2": {"weekday": weekdays_for_dict["next_2"],
                                    "city_name_max": data_min_max[3]["city_name_max"],
                                    "max_temp": data_min_max[3]["max_temp"],
                                    "code_max": data_min_max[3]["code_max"],
                                    "city_name_min": data_min_max[3]["city_name_min"],
                                    "min_temp": data_min_max[3]["min_temp"],
                                    "code_min": data_min_max[3]["code_min"]}})
    #data_for_text.update({"next_3": {"weekday": weekdays_for_dict["next_3"],
    #                                "city_name_max": data_min_max[4]["city_name_max"],
    #                                "max_temp": data_min_max[4]["max_temp"],
    #                                "code_max": data_min_max[4]["code_max"],
    #                                "city_name_min": data_min_max[4]["city_name_min"],
    #                                "min_temp": data_min_max[4]["min_temp"],
    #                                "code_min": data_min_max[4]["code_min"]}})
    #print(data_for_text)

    return data_for_text