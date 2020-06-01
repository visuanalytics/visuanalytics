# TODO wordclouds erstellen oder nur vorbereiten

def merge_data(data, date):
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
    first_dictionary_for_string = data[2][0]
    second_dictionary_for_string = data[2][1]
    third_dictionary_for_string = data[2][2]
    forth_dictionary_for_string = data[2][3]

    first_string = ""
    second_string = ""
    third_string = ""
    forth_string = ""

    for item in first_dictionary_for_string.items():
        for i in range(item[1]):
            first_string = first_string + item[0] + " "

    for item in second_dictionary_for_string.items():
        for i in range(item[1]):
            second_string = second_string + item[0] + " "

    for item in third_dictionary_for_string.items():
        for i in range(item[1]):
            third_string = third_string + item[0] + " "

    for item in forth_dictionary_for_string.items():
        for i in range(item[1]):
            forth_string = forth_string + item[0] + " "

    return [first_string, second_string, third_string, forth_string]
