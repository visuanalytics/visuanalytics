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
    req = requests.Request(req_data["method"], req_data["url"], headers=req_data["headers"],
                           json=req_data.get("json", None), data=req_data.get("other", None), params=req_data["params"])
    # Make the http request
    s = requests.session()
    response = s.send(req.prepare())

    try:
        if req_data["response_type"] == "xml":
            content = get_content(json.loads(json.dumps(xmltodict.parse(response.content), indent=4)))
            if "error" in content:
                return {
                    "err_msg": "An error occurred while loading the api-data"
                }, False
            return content, True
        elif req_data["response_type"] == "json":
            content = get_content(response.json())
            if "error" in content:
                return {
                    "err_msg": "An error occurred while loading the api-data"
                }, False
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
    if type(obj) == list:
        if len(obj) == 0:
            return {
                "same_type": True,
                "length"   : len(obj),
                "object" : None
            }
        elif same_datatypes(obj):
            return {
                "same_type": True,
                "length"   : len(obj),
                "object" : get_content(obj[0])
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
    datatype = type(lst[0]).__name__
    for item in lst:
        if type(item).__name__ != datatype:  # return false, if the list contains different datatypes
            return False
    # datatypes are the same, but are the structures of the complex datatypes the same?
    if datatype == "dict":
        keys = lst[0].keys()
        for item in lst:
            if item.keys() != keys:  # return false, if the keys of the dicts are different
                return False
    elif datatype == "list":
        if sum([len(x) for x in lst]) / len(lst) != len(lst[0]):  # return false, if lists in list have different length
            return False
        datatypes = list(map(lambda x: type(x).__name__, lst[0]))
        for item in lst:
            if list(map(lambda x: type(x).__name__, item)) != datatypes:  # return false, if datatypes of the elements in the lists are different
                return False

    return True