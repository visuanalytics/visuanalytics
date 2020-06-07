from visuanalytics.analytics.transform.transform import transform_array


def todo(value, data):
    assert False, "Not Implemented"


TRANSFORM_TYPES = {
    "transform_array": transform_array,
    "select": todo,
    "select_range": todo,
    "append": todo,
    "add_symbole": todo,
    "replace": todo,
    "alias": todo,
    "date_format": todo,
    "date_now": todo,
    "loop": todo
}
