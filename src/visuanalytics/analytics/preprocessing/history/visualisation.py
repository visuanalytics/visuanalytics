# TODO wordclouds erstellen oder nur vorbereiten

from visuanalytics.analytics.preprocessing.history import transform


def merge_data(data, date):
    data = transform.grammar_keywords(data)

    """
    Filtert aus dem Tupel, welches in der Methode preprocess_history_data in preprocessing/history/transform.py erstellt wird,
    die Dictionaries heraus. In jedem Dictionary sind jeweils zu einem Jahr als Keys die Keywords und als Value
    der zugehörige Wert, wie häufig dieses in allen Artikeln insgesamt enthalten war. So häufig wie das Keyword vorkam, so oft
    wird es auch dem String hinzugefügt.

    :param data: vorverarbeitetes Data-Objekt der Zeit-Api
    :type data: tuple
    :param date:
    :type date:
    :return:
    """

    first_string = ""
    second_string = ""
    third_string = ""
    fourth_string = ""

    string = [first_string, second_string, third_string, fourth_string]

    for i in range(4):
        for item in data[2][i].items():
            for j in range(item[1]):
                string[i] = string[i] + item[0] + " "

    return string
