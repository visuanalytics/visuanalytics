"""
Hilfsfunktionen zum Bearbeiten von Dictionaries.
TODO(David):  Doku hinzufügen.
"""

import collections


def select_pairs(keys, dict):
    del_keys = []
    for k in dict:
        if k not in keys:
            del_keys.append(k)
    for k in del_keys:
        del (dict[k])
    return dict


def flatten(dict):
    return flatten_(dict, False)


def flatten_rec(dict):
    return flatten_(dict, True)


def flatten_(dict, recursive):
    dicts = []
    key_values = {}
    for k in dict:
        if isinstance(dict[k], collections.Mapping):
            dicts.append(k)
            if recursive:
                dict[k] = flatten_(dict[k], True)
            for l in dict[k]:
                key_values[l] = dict[k][l]
    for k in dicts:
        del (dict[k])
    return combine([dict, key_values])


def combine(list):
    dict = {}
    for i in list:
        for k in i:
            dict[k] = i[k]
    return dict
