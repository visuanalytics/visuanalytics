"""
Dieses Modul enthält Hilfsfunktionen zum Bearbeiten von Dictionaries.
"""

from collections import abc


def select_pairs(keys, dict):
    """
    Wählt aus einem Dictionary nur die gewünschten Key-Value-Paare aus.

    Wird einer der übergebenen Keys nicht im Dictionary gefunden, fehlt dieser auch im Ausgabe-Dictionary (es wird
    also keine Exception geworfen!).
    Zu beachten ist außerdem, dass das übergebene Dictionary innerhalb der Methode verändert werden kann.

    :param keys: Liste von Attributen, die ausgewählt werden sollen.
    :type keys: list
    :param dict: Das Dictionary, aus dem die gewüschten Key-Value-Paare ausgewählt werden sollen.
    :type dict: dict

    :returns:
        dict: Das Dictionary, das nur die gewünschten Key-Value-Paare enthält.

    Example:
        person =  { "Name" : "Mustermann", "Vorname" : "Max", "Alter" : 25 }
        print(select_pairs(["Vorname", "Alter"], person))

        => Ausgabe:  { "Vorname" : "Max", "Alter" : 25 }
    """
    del_keys = []
    for k in dict:
        if k not in keys:
            del_keys.append(k)
    for k in del_keys:
        del (dict[k])
    return dict


def flatten(dict):
    """
    Durchsucht ein Dictionary nach Unter-Dictionaries und fügt diesem die Key-Value-Paare aus den Unter-Dictionaries hinzu.

    :param dict: Das Eingabe-Dictionary.
    :type dict: dict

    :returns: Das Ausgabe-Dictionary.
    :rtype: dict

    Example:
        person =  { "Vorname" : "David", "Telefon" : { "Handy" : "0157...", "Festnetz" : "0641..." } }
        print(flatten(person))

        => Ausgabe: { "Vorname" : "David", "Handy" : "0157...", "Festnetz" : "0641..."}
        Man beachte: Das Unter-Dictionary namens "Telefon" ist nicht im Ausgabe-Dictionary enthalten.
    """
    return _flatten(dict, False)


def flatten_rec(dict):
    """
    Durchsucht ein Dictionary rekursiv nach Unter-Dictionaries und fügt diesem alle gefundenen Key-Value-Paare hinzu.

    :param dict: Das Eingabe-Dictionary.
    :type dict: dict

    :returns:
        dict: Das Ausgabe-Dictionary.

    Example:
        foo =  { "A" : 1, "Y" : {"B" : 2, "Z" : { "C : 3 } }
        print(flatten(foo))

        => Ausgabe: { "A" : 1, "B" : 2, "C" : 3 }
    """
    return _flatten(dict, True)


def _flatten(dict, recursive):
    dicts = []
    key_values = {}
    for k in dict:
        if isinstance(dict[k], abc.Mapping):
            dicts.append(k)
            if recursive:
                dict[k] = _flatten(dict[k], True)
            for l in dict[k]:
                key_values[l] = dict[k][l]
    for k in dicts:
        del (dict[k])
    return combine([dict, key_values])


def combine(list):
    """
    Wandelt eine Liste von Dictionaries in ein einzelnes Dictionary um.

    Wenn unter den Dictionaries ein Key mehrmals vorkommt, wird nur das Key-Value-Pair in das Ergebnis aufgenommen,
    dessen Key als letztes in der Liste vorkommt.

    :param list: Liste von Dictionaries, die kombiniert werden sollen.
    :type list: list

    :returns: dict: Ein Dictionary, das alle Key-Value-Paare aus den in der Liste übergebenen Dictionaries enthält.
    :rtype: dict

    Example:
        Beispiel:
        a = { "A" : 1 }
        b = { "B" : 2 }
        c = { "C" : 3 }
        print(combine([a, b, c])

        => Ausgabe: { "A" : 1, "B" : 2, "C" : 3 }
    """
    dict = {}
    for i in list:
        for k in i:
            dict[k] = i[k]
    return dict
