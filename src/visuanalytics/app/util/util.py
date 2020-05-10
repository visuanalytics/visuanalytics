"""
Dieses Modul enthält Allgemeine Hilfsfunktionen.
"""

import collections


def mode(list):
    """
    Bestimmt den Modus (das am häufigsten auftretende Element) einer Liste.

    Args:
        list (list): Die Eingabeliste, für die der Modus bestimmt werden soll.

    Returns:
        elem: Das am häufigsten auftretende Element der Liste. Treten mehrere Elemente gleich häufig auf, wird von
        diesen das erste gefundene Element ausgewählt.

    Raises:
        IndexError: Bei einer leeren Liste.
    """
    return collections.Counter(list).most_common()[0][0]
