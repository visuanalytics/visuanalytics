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


def transform_select(values: dict, data: StepData):
    for idx, entry in enumerate(data.get_data(values["relevant_keys"])):
        data.save_loop(values, entry)


def transform_select_range(values: dict, data: StepData):
    assert False, "Not Implemented"


def transform_append(values: dict, data: StepData):
    assert False, "Not Implemented"


def transform_add_symbol(values: dict, data: StepData):
    for idx, entry in enumerate(data.get_data(values["keys"])):
        data.save_loop(values, idx, entry)
        new_entry = transform_get_new_keys(values, data, idx, entry)
        new_values = data.format(data.get_data(values['pattern']))
        data.insert_data_array(new_entry, new_values, idx, entry)


def transform_replace(values: dict, data: StepData):
    for idx, entry in enumerate(data.get_data(values["keys"])):
        data.save_loop(values, idx, entry)
        new_entry = transform_get_new_keys(values, data, idx, entry)
        new_value = data.get_data(entry).replace(data.get_data(values["old_value"]), data.get_data(values["new_value"]),
                                                 data.get_data(values.get("count", -1)))
        data.insert_data_array(new_entry, new_value, idx, entry)


def transform_alias(values: dict, data: StepData):
    assert False, "Not Implemented"


def transform_date_format(values: dict, data: StepData):
    for idx, entry in enumerate(data.get_data(values["keys"])):
        data.save_loop(values, idx, entry)
        new_entry = transform_get_new_keys(values, data, idx, entry)
        new_value = datetime.strptime(entry, data.get_data(values["format"])).date()
        data.insert_data_array(new_entry, new_value, idx, entry)


def transform_date_weekday(values: dict, data: StepData):
    day_weekday = {
        0: "Montag",
        1: "Dienstag",
        2: "Mittwoch",
        3: "Donnerstag",
        4: "Freitag",
        5: "Samstag",
        6: "Sonntag"
    }
    for idx, entry in enumerate(data.get_data(values["keys"])):
        data.save_loop(values, idx, entry)
        new_entry = transform_get_new_keys(values, data, idx, entry)
        new_value = day_weekday[datetime.strptime(entry, data.get_data(values["format"])).weekday()]
        data.insert_data_array(new_entry, new_value, idx, entry)


def transform_date_now(values: dict, data: StepData):
    entry = data.get_data(values["key"])
    new_entry = data.get_data(values["new_keys"][0]) if data.get_data(values.get("new_keys")) else entry
    new_value = datetime.strptime(data.get_data(values["key"]), data.get_data(values["format"])).today()
    data.insert(new_entry, new_value)


def transform_loop(values: dict, data: StepData):
    for idx, value in enumerate(data.get_data(values["values"])):
        data.save_loop(values, idx, value)
        transform(values, value)


def transform_get_new_keys(values: dict, data: StepData, idx, entry):
    return data.get_data(values["new_keys"][idx]) if data.get_data(values.get("new_keys")) else entry


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
