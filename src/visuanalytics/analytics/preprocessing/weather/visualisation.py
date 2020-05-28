"""
Dieses Modul enthält die Funktionalität zum Vorverarbeiten der Wettervorhersage-Daten von der Weatherbit-API.
"""

from visuanalytics.analytics.preprocessing.weather import transform

LOCATIONS_TOMOROW = [("Konstanz", (950, 900)), ("München", (1130, 822)),
                     ("Nürnberg", (980, 720)), ("Mainz", (725, 600)),
                     ("Gießen", (895, 540)), ("Dresden", (1155, 472)),
                     ("Hannover", (1055, 370)), ("Bremen", (805, 333)),
                     ("Hamburg", (1035, 200)), ("Berlin", (1197, 260)), ]

"""
list: Liste aus String, Tupel(int, int): X und Y Koordinaten der Positionen der Icons in der Vorhersage für morgen 
sortiert nach den verschiedenen Orten/Regionen.
"""

LOCATIONS_ICONS_THREEDAYS = [("Gießen", (110, 504), (735, 504), (1360, 504)),
                             ("Hamburg", (235, 270), (855, 270), (1472, 270)),
                             ("Dresden", (310, 427), (930, 427), (1554, 427)),
                             ("München", (272, 670), (890, 670), (1510, 670))]
"""
list: Liste aus String, Tupel(int, int)x3: X und Y Koordinaten der Positionen der Icons in der 3 Tages Vorhersage 
sortiert nach den verschiedenen Orten/Regionen.
"""

LOCATIONS_TEMP_MIN_THREEDAYS = [(213, 931), (833, 931), (1455, 931)]
"""
list: Liste aus Tupeln: X und Y Koordinaten der Min Temperaturen in der 3 Tages Vorhersage.
"""
LOCATIONS_TEMP_MAX_THREEDAYS = [(483, 931), (1102, 931), (1730, 931)]
"""
list:Liste aus Tupeln: X und Y Koordinaten der Max Temperaturen in der 3 Tages Vorhersage.
"""


def data_icon_oneday(data, date):
    """
    Simple Methode zum weiterverarbeiten der Daten in eine kleinere Liste -
    in diesem Fall eine Liste mit Icons an verschieden Orten für heute/morgen.

    :param data: die verabeiteten Daten der Wetter API aus der Methode preprocess_weather_data()
    :type: data: dict
    :param date : Der Tag für welchen die Icons erstellt werden soll, 0 = heute, 1 = morgen
    :type date: int
    :return: Eine Liste aus Tupeln bestehend aus den Koordinaten der Icons und Name des Icons
    :rtype: list

    Example:
    (Rückgabewert)
    [((898, 900), 'r04d'), ((1080, 822), 'c04d'), ((930, 720), 'c04d'), ((675, 610), 'c04d'), ((843, 540), 't02d'),
    ((1106, 482), 'c04d'), ((1006, 370), 'c04d'), ((755, 333), 'c04d'), ((986, 218), 'c04d'), ((1147, 270), 'c03d')]
    """
    out = []
    for entry in LOCATIONS_TOMOROW:
        out.append((entry[1], transform.get_weather_icon(data, entry[0], date)))
    return out


def data_temp_oneday(data, date):
    """
    Simple Methode zum weiterverarbeiten der Daten in eine kleinere Liste. -
    in diesem Fall eine Liste mit Temperaturen an verschieden Orten für heute/morgen.

    :param data: die verabeiteten Daten der Wetter API aus der Methode preprocess_weather_data()
    :type data: dict
    :param date : Der Tag für welchen die Icons erstellt werden soll, 0 = heute, 1 = morgen
    :type date: int
    :return: Eine Liste aus Tupeln bestehend aus den Koordinaten der Temperatur und der Temperatur
    :rtype: list

    Example:
    (Rückgabewert)
    [((898, 900), '14°'), ((1080, 822), '17°'), ((930, 720), '19°'), ((675, 610), '17°'), ((843, 540), '16°'),
    ((1106, 482), '18°'), ((1006, 370), '17°'), ((755, 333), '15°'), ((986, 218), '5°'), ((1147, 270), '-3°')]
    """
    out = []
    for entry in LOCATIONS_TOMOROW:
        out.append((entry[1], transform.get_weather_temp(data, entry[0], date)))
    return out


def data_mm_temp_threeday(data):
    """
    Simple Methode zum weiterverarbeiten der Daten in eine kleinere Liste -
    in diesem Fall eine Liste mit min und max Temperaturen für die 3-5 Tages Vorhersage.

    :param data: die verabeiteten Daten der Wetter API aus der Methode preprocess_weather_data()
    :type data: dict
    :return: Eine Liste aus Tupeln bestehend aus den Koordinaten der Temperatur und der min/max Temperatur
    :rtype: list

    Example:
    (Rückgabewert)
    [((160, 950), '1°'), ((790, 950), '-1°'), ((1400, 950), '0°'), ((450, 950), '19°'), ((1070, 950), '14°'),
    ((1700, 950), '14°')]
    """

    out = []
    for idx, entry in enumerate(LOCATIONS_TEMP_MIN_THREEDAYS):
        out.append((entry, transform.get_min_temp(data, idx + 2)))
    for idx, entry in enumerate(LOCATIONS_TEMP_MAX_THREEDAYS):
        out.append((entry, transform.get_max_temp(data, idx + 2)))
    return out


def data_icon_threeday(data):
    """
    Simple Methode zum weiterverarbeiten der Daten in eine kleinere Liste-
    in diesem Fall eine Liste mit Icons an verschieden Orten für die 3-5 Tages Vorhersage.

    :param data: die verarbeiteten Daten der Wetter API aus der Methode preprocess_weather_data()
    :type data: dict
    :return: Eine Liste aus Tupeln bestehend aus den Koordinaten der Icons und Name des Icons für die 2-4 Tages Vorhersage
    :rtype: list

    Example:
    (Rückgabewert)
    [((160, 534), (785, 534), (1410, 534), 'c04d', 'c03d', 'c02d'),
    ((255, 300), (875, 300), (1492, 300), 'c03d', 'c03d', 'r01d'),
    ((360, 447), (980, 447), (1604, 447), 'r01d', 'c03d', 'c03d'),
    ((272, 670), (890, 670), (1510, 670), 'r01d', 'r04d', 'r01d')]
    """
    out = []
    for entry in LOCATIONS_ICONS_THREEDAYS:
        out.append(
            (entry[1], entry[2], entry[3], transform.get_weather_icon(data, entry[0], 2),
             transform.get_weather_icon(data, entry[0], 3),
             transform.get_weather_icon(data, entry[0], 4)))
    return out
