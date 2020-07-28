import numbers

from visuanalytics.analytics.control.procedures.step_data import StepData


def execute_type_option(values: dict, data: StepData):
    check = data.get_data(values["check"], values)

    if bool(check):
        return values.get("on_true", [])
    else:
        return values.get("on_false", [])


def execute_type_compare(values: dict, data: StepData):
    value_left = data.get_data(values["value_left"], values, numbers.Number)
    value_right = data.get_data(values["value_right"], values, numbers.Number)

    if value_left == value_right:
        return values.get("on_equal", [])

    # If on_not_equal is present return on not equal
    if values.get("on_not_equal", None) is not None:
        return values.get("on_not_equal", [])

    elif value_left > value_right:
        return values.get("on_higher", [])
    elif value_left < value_right:
        return values.get("on_lower", [])
