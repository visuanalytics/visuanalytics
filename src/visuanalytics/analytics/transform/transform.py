from visuanalytics.analytics.transform.transform_types import TRANSFORM_TYPES


def transform(transformations, data):
    for transformation in transformations:
        TRANSFORM_TYPES[transformation["type"]](transformation, data)


def transform_array(values, data):
    for idx, entry in enumerate(data[values["array_key"]]):
        entry["_idx"] = idx
        transform(values, entry)
