from datetime import datetime

from visuanalytics.analytics.transform.transform_types import TRANSFORM_TYPES


def transform(transformations, data):
    for transformation in transformations:
        TRANSFORM_TYPES[transformation["type"]](transformation, data)


def transform_array(values, data):
    for idx, entry in enumerate(data[values["array_key"]]):
        entry["_idx"] = idx
        transform(values, entry)


def transform_select(values, data):
    assert False, "Not Implemented"


def transform_select_range(values, data):
    assert False, "Not Implemented"


def transform_append(values, data):
    assert False, "Not Implemented"


def transform_add_symbol(values, data):
    text = data[values["array_key"]]
    symbol = data[values["keys"]]
    data[values["patterns"]] = f"{text} {symbol} "


def transform_replace(values, data):
    for entry in enumerate(data[values["keys"]]):
        data[values["new_keys"][entry]] = entry.replace(values["old_value"], values["new_value"])


def transform_alias(values, data):
    assert False, "Not Implemented"


def transform_date_format(values, data):
    for entry in enumerate(data[values["keys"]]):
        data[values["keys"][entry]] = datetime.strptime(entry, values["format"]).date()


def transform_date_weekday(values, data):
    day_weekday = {
        0: "Montag",
        1: "Dienstag",
        2: "Mittwoch",
        3: "Donnerstag",
        4: "Freitag",
        5: "Samstag",
        6: "Sonntag",
    }
    for entry in enumerate(data[values["keys"]]):
        data[values["keys"][entry]] = day_weekday[datetime.strptime(entry, values["format"]).weekday()]


def transform_date_now(values, data):
    data[values["key"]] = datetime.strptime(data[values["key"]], values["format"]).today()


def transform_loop(values, data):
    assert False, "Not Implemented"
