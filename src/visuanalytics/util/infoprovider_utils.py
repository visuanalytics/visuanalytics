import json
import logging
from typing import Optional, Union

from ast2json import str2json

logger = logging.getLogger()

splitString = "uzjhnjtdryfguljkm"

def get_transformation(formula: str, decimal: Optional[int], key_name: str):
    calculation = {
      "type": "calculate",
      "action": "formula",
      # TODO solve better (get formula without splitString)
      "formula":formula.replace(splitString, "|"),
      "decimal": decimal if decimal else 2,
      "new_key": key_name
    }

    return calculation


def parse_to_own_format(rep, decimal, loop_var=None):
    """
    Generiert rekursiv den abstrakten Syntaxbaum mit nur den relevanten Daten, der für die get_transformations-Funktion verständlich ist.

    :param rep: Dictionary, welches von der ast2json-Bibliothek generiert wurde
    :type rep: dict
    :param decimal: Anzahl der Nachkommastellen der Zwischenergebnisse
    :type decimal: int
    :param loop_var: Name der Loop-Variable
    :type loop_var: str

    :return: je nach '_type' wird ein Variablenname, eine Zahl oder ein Dictionary in verständlichem Format zurückgegeben
    """
    if rep["_type"].lower() == "binop":
        return {
            "operator": rep["op"]["_type"][:3].upper(),
            "decimal": decimal,
            "lop": parse_to_own_format(rep["left"], decimal=decimal),
            "rop": parse_to_own_format(rep["right"], decimal=decimal)
        }
    elif rep["_type"].lower() == "name":
        return rep["id"] if not loop_var or (loop_var and rep["id"] != "_loop") else loop_var
    elif rep["_type"].lower() == "constant":
        return rep["value"]
    return None  # raise error?!


def parse_string(calculation_string):
    """
    Wandelt mit Hilfe der ast2json-Bibliothek einen String in einen abstrakten Syntaxbaum. Kann auch zur Überprüfung der Syntax einer Formel genutzt werden.

    :param calculation_string: Stringrepräsentation einer Formel
    :type calculation_string: str

    :return: Formel als abstrakter Syntaxbaum (Dictionary) repräsentiert
    """
    try:
        return str2json(calculation_string)
    except Exception:
        return None


def generate_step_transform(formula, key_name, copy=None, array_key=None, loop_key="", decimal=2):
    """
    Erstellt die Liste der Transformtypen für eine Formel, falls die Formel keinen syntaktischen Fehler hat.
    Dabei kann die Formel auf einen einzelnen Key, oder ein ganzes Array angewendet werden.

    :param formula: Stringrepräsentation der Formel
    :type formula: str
    :param key_name: Name der Formel, unter dem das Ergebnis später zu finden ist
    :type key_name: str
    :param copy: Key, unter dem die Kopie des Arrays zu finden ist
    :type copy: str
    :param array_key: Key des Arrays, über welches u.U. iteriert werden soll (für Arrays)
    :type array_key: str
    :param loop_key: Key des Dictionaries, auf den die Formel bei der Iteration über ein Array angewendet werden soll (für Arrays mit Dictionaries)
    :type loop_key: str
    :param decimal: Anzahl der Nachkommastellen für das Ergebnis und die Zwischenergebnisse
    :type decimal: int

    :return: Liste der Transformtypen
    """
    if copy and not array_key:
        return None
    result = []
    if copy:
        result.append({
            "type": "copy",
            "keys": [array_key],
            "new_keys": [copy]
        })

    loop_var = "_loop|" + loop_key
    if loop_var[-1] == "|":
        loop_var = loop_var.replace("|", "")
    formula = formula.replace("array_var", loop_var).replace("|", splitString)

    transformation = get_transformation(formula, decimal, key_name)

    if array_key:
        result.append({
            "type": "transform_array",
            "array_key": copy if copy else array_key,
            "transform": [transformation]
        })
    else:
        result.append(transformation)

    return result
