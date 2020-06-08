from datetime import datetime

from visuanalytics.analytics.control.procedures.step_data import StepData


def transform(values: dict, data: StepData):
    for transformation in values["transformation"]:
        transformation["_loop_states"] = values.get("_loop_states", {})

        TRANSFORM_TYPES[transformation["type"]](transformation, data)


def transform_array(values: dict, data: StepData):
    for idx, entry in enumerate(data.get_data(values["array_key"])):
        data.save_loop(values, idx, entry)
        transform(values, entry)


def transform_select(values, data):
    assert False, "Not Implemented"


def transform_select_range(values, data):
    assert False, "Not Implemented"


def transform_append(values, data):
    assert False, "Not Implemented"


def transform_add_symbol(values, data):
    for idx, entry in enumerate(data[values["keys"]]):
        new_entry = transform_get_new_keys(values, idx, entry)
        data.insert_data_array(new_entry, data.format(values['pattern']), idx, entry)


def transform_replace(values, data):
    for idx, entry in enumerate(data[values["keys"]]):
        new_entry = transform_get_new_keys(values, idx, entry)
        new_value = data.get_data(entry).replace(values["old_value"], values["new_value"], values.get("count", -1))
        data.insert_data_array(new_entry, new_value, idx, entry)


def transform_alias(values, data):
    assert False, "Not Implemented"


def transform_date_format(values, data):
    for idx, entry in enumerate(data[values["keys"]]):
        new_entry = transform_get_new_keys(values, idx, entry)
        new_value = datetime.strptime(entry, values["format"]).date()
        data.insert_data_array(new_entry, new_value, idx, entry)


def transform_date_weekday(values, data):
    day_weekday = {
        0: "Montag",
        1: "Dienstag",
        2: "Mittwoch",
        3: "Donnerstag",
        4: "Freitag",
        5: "Samstag",
        6: "Sonntag"
    }
    for idx, entry in enumerate(data[values["keys"]]):
        new_entry = transform_get_new_keys(values, idx, entry)
        new_value = day_weekday[datetime.strptime(entry, values["format"]).weekday()]
        data.insert_data_array(new_entry, new_value, idx, entry)


def transform_date_now(values, data):
    entry = data[values["key"]]
    new_entry = values["new_keys"][0] if values.get("new_keys") else entry
    new_value = datetime.strptime(data[values["key"]], values["format"]).today()
    data.insert(new_entry, new_value)


def transform_loop(values: dict, data: StepData):
    for idx, value in enumerate(values["values"]):
        data.save_loop(values, idx, value)
        transform(values, value)


def transform_get_new_keys(values, idx, entry):
    return values["new_keys"][idx] if values.get("new_keys") else entry


TRANSFORM_TYPES = {
    "transform_array": transform_array,
    "select": transform_select,
    "select_range": transform_select_range,
    "append": transform_append,
    "add_symbol": transform_add_symbol,
    "replace": transform_replace,
    "alias": transform_alias,
    "date_format": transform_date_format,
    "date_weekday": transform_date_weekday,
    "date_now": transform_date_now,
    "loop": transform_loop
}
