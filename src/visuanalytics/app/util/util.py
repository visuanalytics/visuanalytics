"""Allgemeine Hilfsfunktionen"""

import collections


def mode(list):
    return collections.Counter(list).most_common()[0][0]
