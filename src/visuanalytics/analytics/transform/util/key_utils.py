"""

"""


def get_new_key(values: dict):
    """
    :param values: Werte aus der JSON-Datei
    :return:
    """
    return values["new_key"] if values.get("new_key", None) else values["key"]


def get_new_keys(values: dict, idx):
    """
    :param values: Werte aus der JSON-Datei
    :param idx: Index des Arrays, welches gerade betrachtet wird.
    :return:
    """
    return values["new_keys"][idx] if values.get("new_keys", None) else values["keys"][idx]
