from datetime import datetime

from visuanalytics.analytics.control.procedures.step_data import StepData


def transform(values: dict, data: StepData):
    for transformation in values["transformation"]:
        transformation["_loop_states"] = values.get("_loop_states", {})

        TRANSFORM_TYPES[transformation["type"]](transformation, data)


def transform_array(values: dict, data: StepData):
    for idx, entry in enumerate(data.get_data(values["array_key"], values)):
        data.save_loop(values, idx, entry)
        transform(values, entry)


def transform_select(values: dict, data: StepData):
    for idx, key in enumerate(values["relevant_keys"]):
        data.save_loop_key(values, key, values)
        # TODO


def transform_select_range(values: dict, data: StepData):
    assert False, "Not Implemented"


def transform_append(values: dict, data: StepData):
    assert False, "Not Implemented"


def transform_add_symbol(values: dict, data: StepData):
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, idx, key)
        new_key = transform_get_new_keys(values, idx, key)

        new_values = data.format(values['pattern'], values)
        data.insert_data(new_key, new_values, values)


def transform_replace(values: dict, data: StepData):
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, idx, key)

        value = data.get_data(key, values)
        new_key = transform_get_new_keys(values, idx, key)

        new_value = value.replace(data.format(values["old_value"], values),
                                  data.get_data(values["new_value"], values),
                                  data.get_data(values.get("count", -1), values))
        data.insert_data(new_key, new_value, values)


def transform_alias(values: dict, data: StepData):
    assert False, "Not Implemented"


def transform_date_format(values: dict, data: StepData):
    for idx, entry in enumerate(values["keys"]):
        data.save_loop_key(values, idx, entry)

        value = data.get_data(values["format"], values)
        new_key = transform_get_new_keys(values, idx, entry)

        new_value = datetime.strptime(entry, value).date()
        data.insert_data(new_key, new_value, values)


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
    for idx, key in enumerate(values["keys"]):
        data.save_loop_key(values, idx, key)

        value = data.get_data(values["key"], values)
        date_format = data.get_data(values["format"], values)
        new_key = transform_get_new_keys(values, idx, key)

        new_value = day_weekday[datetime.strptime(value, date_format).weekday()]
        data.insert_data(new_key, new_value, values)


def transform_date_now(values: dict, data: StepData):
    value = data.get_data(values["key"], values)
    date_format = data.get_data(values["format"], values)

    new_key = datetime.strptime(value, date_format).today()

    data.insert_data(values["key"], new_key, values)


def transform_loop(values: dict, data: StepData):
    for idx, value in enumerate(data.get_data(values["values"], values)):
        data.save_loop(values, idx, value)
        transform(values, value)


def transform_get_new_keys(values: dict, idx, key):
    return values["new_keys"][idx] if values.get("new_keys", None) else key


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
