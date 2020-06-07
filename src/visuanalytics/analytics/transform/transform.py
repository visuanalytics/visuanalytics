from visuanalytics.analytics.transform.transform_types import TRANSFORM_TYPES


def transform(values, data):
    for value in values:
        TRANSFORM_TYPES[value["type"]](value, data)


def transform_array(values, data):
    for idx, entry in enumerate(data[values["array_key"]]):
        entry["_idx"] = idx
        transform(values, entry)
