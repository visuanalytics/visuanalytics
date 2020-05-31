from numpy import random

from visuanalytics.analytics.preprocessing.history import speech


def random_teaser_text(data):
    """Generiert 2 random ausgewählte Teaser-Texte von einer Auswahl von 10 Stück aus.

    Diese Methode generiert aus einer Auswahl von 10 Teaser-Texten eine random Unterauswahl von zwei Teaser-Texten
    und gibt diese zurück.

    :param data: 10 Artikel aus Zeitraum in der Vergangenheit
    :type data: eine Liste mit 10 Dictionaries
    :return: zwei Teaser-Texte als Strings in einer Liste
    :rtype: str[]
    """
    num_list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    x_1, x_2 = random.choice(num_list, 2, replace=False)
    teaser_text_1 = data[x_1]['teaser_text']
    teaser_text_2 = data[x_2]['teaser_text']
    return [teaser_text_1, teaser_text_2]


def most_often_keys(data):
    """Nimmt die ersten drei Einträge der jeweiligen Keyword-Liste aus data (insgesamt 4) und gibt diese als Liste zurück.

    Diese Methode Nimmt die ersten drei Einträge der jeweiligen Keyword-Liste aus data (insgesamt 4) und gibt diese als
    Liste zurück. Nimmt also die vier Listen und gibt die jeweils ersten drei Wörter zurück. Diese 3 Wörter kommen am
    häufigsten in den vier ausgewählten Zeiträumen in allen Artikeln vor. Diese wurden schon vorsortiert, die
    jeweils darauffolgenden Keywords sind alphabetisch sortiert.

    :param data: Bekommt die vorverarbeiteten Daten der Zeit-API mit 4x 10 Artikeln und 4 Listen mit Keywords
    :type data: list
    :return: Gibt eine Liste mit 4 Listen mit jeweils drei Einträgen zurück
    :rtype: list[]
    """
    keyword_list_1 = []
    keyword_list_2 = []
    keyword_list_3 = []
    keyword_list_4 = []
    for i in range(3):
        keyword_list_1.append(data[1][0][i])
        keyword_list_2.append(data[1][1][i])
        keyword_list_3.append(data[1][2][i])
        keyword_list_4.append(data[1][3][i])
    return [keyword_list_1, keyword_list_2, keyword_list_3, keyword_list_4]


def get_teaser_texts(data, most_often_keys):
    """Gibt zwei Teaser-Texte zurück.

    Sucht aus 10 Artikeln zwei Artikel aus, die am Ende vorgelesen werden sollen.

    :param data: Dictionary mit 10 Einträgen zu einem bestimmten Zeitraum
    :type data: dict
    :param most_often_keys: Liste mit vier Einträgen, die wiederum jeweils drei Einträge haben mit den am häufigsten
        aufgetretenen Keywords in Artikeln in dem jeweiligen Zeitraum
    :type most_often_keys: list[]
    :return: Zwei Teaser Texte als str
    :rtype: str, str
    """
    teaser_with_keyword = []
    for i in range(4):
        for j in range(3):
            for y in range(10):
                txt = data[y]['teaser_text']
                txtlower = txt.lower()
                if (txtlower.find(most_often_keys[i][j]) != -1):
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
        raise Exception("No teaser texts available.")

    return teaser_text_1, teaser_text_2


def merge_data(data, date):
    """Fügt alle Daten bzw. Satzteile für die Audiodateien in einem Dictionary zusammen.

    Fügt alle für die zu erstellenden Audiodateien benötigten Werte und Texte in einem Dictionary
    zusammen.

    :param data: Vorbereitete Daten aus der API mit beiden Teilen (10 Artikel, 4 Listen)
    :type: list
    :param date: wurde in preprocessing.history.transform.get_date erstellt [date[10], historical_year, years_ago]
    :type: list[]
    :return: Dictionary mit relevanten Daten für die Audiodateien
    :rtype: dict
    """
    dictionary = {}
    most_often_keys = speech.most_often_keys(data)
    first_teaser_1, second_teaser_1 = speech.get_teaser_texts(data[0][0], most_often_keys)
    first_teaser_2, second_teaser_2 = speech.get_teaser_texts(data[0][1], most_often_keys)
    first_teaser_3, second_teaser_3 = speech.get_teaser_texts(data[0][2], most_often_keys)
    first_teaser_4, second_teaser_4 = speech.get_teaser_texts(data[0][3], most_often_keys)
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
