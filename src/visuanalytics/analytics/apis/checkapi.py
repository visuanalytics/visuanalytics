"""
Modul welches eine Methode bereit stellt mit der eine API auf ihre Keys untersucht werden kann.
"""
import json
import xmltodict
import requests
from visuanalytics.analytics.apis import api

list_limit = 10
datatype_converter = {
    "int": "Zahl",
    "float": "Gleitkommazahl",
    "str": "Text",
    "bool": "Wahrheitswert",
    "nonetype": "Ohne Wert",
    "dict": "JSON",
    "list": "Liste"
}


def check_api(req_data):
    """
    Führt eine Request an eine API aus, und abstrahiert im Anschluss die Response für die Datenselektierung im
    Frontend.

    :param req_data: Enthält Informationen über das Request-Objekt
    :type req_data: dict
    :return: Abstrahierte Version der Response oder Fehlermeldung und einen Boolean mit einer Aussage über den Erfolg der Funktion
    """
    req = requests.Request(req_data["method"], req_data["url"], headers=req_data["headers"],
                           json=req_data.get("json", None), data=req_data.get("other", None), params=req_data["params"])
    # Make the http request
    s = requests.session()
    response = s.send(req.prepare())

    try:
        list_keys = [
            "same_type",
            "length",
            "object"
        ]
        if req_data["response_type"] == "xml":
            content = get_content(json.loads(json.dumps(xmltodict.parse(response.content), indent=4)))
            if "error" in content:
                return {
                    "err_msg": "An error occurred while loading the api-data"
                }, False
            if list_keys == list(filter(lambda x: x in list_keys, content.keys())):
                content = {
                    "$toplevel_array$": content
                }
            return content, True
        elif req_data["response_type"] == "json":
            content = get_content(response.json())
            if "error" in content:
                return {
                    "err_msg": "An error occurred while loading the api-data"
                }, False
            if list_keys == list(filter(lambda x: x in list_keys, content.keys())):
                content = {
                    "$toplevel_array$": content
                }
            return content, True
        else:
            return {
                "err_msg": f"Content-Type {req_data['repsonse_type']} of api-request not supported"
            }, False
    except Exception:
        return {
            "err_msg": "An error occurred while loading the api-data"
        }, False


def get_content(obj):
    """
    Abstrahiert das übergebene Objekt je nach Typ (dict, list, str, int etc.)

    :param obj: zu abstrahierendes Objekt
    :return: Beschreibung des Datentyps eines Objektes
    """
    if type(obj) == list:
        if len(obj) == 0:
            return {
                "same_type": True,
                "length"   : len(obj),
                "object"   : None
            }
        elif same_datatypes(obj):
            obj_type = type(obj[0]).__name__.lower()
            if obj_type == "list" or obj_type == "dict":
                return {
                    "same_type": True,
                    "length"   : len(obj),
                    "object"   : get_content(obj[0])
                }
            else:
                return {
                    "same_type": True,
                    "length"   : len(obj),
                    "type"     : get_content(obj[0])
                }
        else:
            result = {
                "same_type": False,
                "length"   : len(obj),
                "type"     : list(map(lambda x: datatype_converter[type(x).__name__.lower()], obj[:list_limit]))
            }
            if len(obj) > list_limit:
                result.update({"max_elements": list_limit})
            return result
    elif type(obj) == dict:
        return dict(zip(obj.keys(), [get_content(obj[key]) for key in obj.keys()]))
    else:
        return datatype_converter[type(obj).__name__.lower()]  # obj


def same_datatypes(lst):
    """
    Überprüft für eine Liste, ob sie nur Daten vom selben Typ enthält. Dabei spielen Keys, Länge der Objekte etc. eine Rolle

    :param lst: Liste, die überprüft werden soll
    :type lst: list
    :return: Boolean, je nach Ausgang der Überprüfung
    """
    datatype = type(lst[0]).__name__
    for item in lst:
        if type(item).__name__ != datatype:  # return False, wenn die Liste verschiedene Datentypen enthält
            return False
    # Datentypen sind gleich, aber sind deren Strukturen auch gleich? (für komplexe Datentypen)
    if datatype == "dict":
        keys = lst[0].keys()
        for item in lst:
            if item.keys() != keys:  # return False, wenn die Keys der Dictionaries verschieden sind
                return False
    elif datatype == "list":
        if sum([len(x) for x in lst]) / len(lst) != len(lst[0]):  # return False, falls die Listen in der Liste verschiedene Längen haben
            return False
        datatypes = list(map(lambda x: type(x).__name__, lst[0]))
        for item in lst:
            if list(map(lambda x: type(x).__name__, item)) != datatypes:  # return False, falls die Elemente der inneren Listen verschiedene Datenytpen haben
                return False

    return True
