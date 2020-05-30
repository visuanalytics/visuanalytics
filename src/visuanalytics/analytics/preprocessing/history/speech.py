from numpy import random

from visuanalytics.analytics.preprocessing.history import speech


def random_teaser_text(data):
    num_list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    x_1 = random.choice(num_list)
    num_list.remove(x_1)
    x_2 = random.choice(num_list)
    teaser_text_1 = data[x_1]['teaser_text']
    teaser_text_2 = data[x_2]['teaser_text']
    return [teaser_text_1, teaser_text_2]


def most_often_keys(data):
    keyword_list_1 = []
    keyword_list_2 = []
    keyword_list_3 = []
    keyword_list_4 = []
    for i in range(3):
        keyword_list_1.append((data[1][0][i]).capitalize())
        keyword_list_2.append((data[1][1][i]).capitalize())
        keyword_list_3.append((data[1][2][i]).capitalize())
        keyword_list_4.append((data[1][3][i]).capitalize())
    return [keyword_list_1, keyword_list_2, keyword_list_3, keyword_list_4]


def most_key_teaser_text(data, most_often_keys):
    teaser_with_keyword = []
    for i in range(4):
        for j in range(3):
            for y in range(10):
                txt = data[y]['teaser_text']
                if (txt.find(most_often_keys[i][j]) != -1):
                    teaser_with_keyword.append(txt)

    if (len(teaser_with_keyword) == 0):
        teaser_text_1, teaser_text_2 = random_teaser_text(data)

    elif (len(teaser_with_keyword) == 1):
        text_1, text_2 = random_teaser_text(data)
        teaser_text_1 = teaser_with_keyword[0]
        teaser_text_2 = text_1

    elif (len(teaser_with_keyword) >= 2):
        teaser_text_1 = teaser_with_keyword[0]
        teaser_text_2 = teaser_with_keyword[1]
    else:
        print("Fehler")

    return teaser_text_1, teaser_text_2


def merge_data(data, date):
    """

    :param data: Vorbereitete Daten aus der API mit beiden Teilen (10 Artikel, 4 Listen)
    :param date: wurde in preprocessing.history.transform.get_date erstellt [date[10], historical_year, years_ago]
    :return:
    """
    dictionary = {}
    most_often_keys = speech.most_often_keys(data)
    first_teaser_1, second_teaser_1 = speech.most_key_teaser_text(data[0][0], most_often_keys)
    first_teaser_2, second_teaser_2 = speech.most_key_teaser_text(data[0][1], most_often_keys)
    first_teaser_3, second_teaser_3 = speech.most_key_teaser_text(data[0][2], most_often_keys)
    first_teaser_4, second_teaser_4 = speech.most_key_teaser_text(data[0][3], most_often_keys)
    date_string = []
    for i in range(4):
        if date[2][i] == "1":
            date_string.append("einem Jahr")
        else:
            date_string.append(f"{date[2][i]} Jahren")

    dictionary.update({1: {'year': date[1][0],
                           'years_ago': date_string[0],
                           'teaser_1': first_teaser_1,
                           'teaser_2': second_teaser_1}})
    dictionary.update({2: {'year': date[1][1],
                           'years_ago': date_string[1],
                           'teaser_1': first_teaser_2,
                           'teaser_2': second_teaser_2}})
    dictionary.update({3: {'year': date[1][2],
                           'years_ago': date_string[2],
                           'teaser_1': first_teaser_3,
                           'teaser_2': second_teaser_3}})
    dictionary.update({4: {'year': date[1][3],
                           'years_ago': date_string[3],
                           'teaser_1': first_teaser_4,
                           'teaser_2': second_teaser_4}})
    return dictionary
