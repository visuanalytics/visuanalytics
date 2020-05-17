"""
Dieses Modul enthält Hilfsfunktionen für statistische Berechnungen.
"""

import collections


def mode(list):
    """
    Bestimmt den Modus (das am häufigsten auftretende Element) einer Liste.

    :param list: Die Eingabeliste, für die der Modus bestimmt werden soll.
    :type list: list

    :returns:
        Das am häufigsten auftretende Element der Liste. Treten mehrere Elemente gleich häufig auf, wird von
        diesen das erste gefundene Element ausgewählt.

    :raise:
        IndexError: Bei einer leeren Liste.
    """
    return collections.Counter(list).most_common()[0][0]
