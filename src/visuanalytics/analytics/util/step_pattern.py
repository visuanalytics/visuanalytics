"""

"""
import operator
from functools import reduce
from string import Formatter

from visuanalytics.analytics.util.step_errors import StepKeyError


class StepPatternFormatter(Formatter):
    def __init__(self, split_key="|"):
        super().__init__()
        self.__split_key = split_key

    def get_value(self, key, args, kwargs):
        return data_get_pattern(key, args[0], self.__split_key)


def _to_int(x):
    return int(x) if x.isnumeric() else x


def _get_or_create(d, k):
    # TODO (max) may handle to large array idx (add elm)
    if not isinstance(d, list) and not operator.contains(d, k):
        operator.setitem(d, k, {})

    return operator.getitem(d, k)


def data_get_pattern(keys, data, split_key="|"):
    try:
        if isinstance(keys, str):
            keys_map = map(_to_int, keys.split(split_key))
            return reduce(operator.getitem, keys_map, data)

        return data[keys]
    except BaseException as e:
        raise StepKeyError("get_data", keys) from e


def data_insert_pattern(keys, data, value, split_key="|"):
    try:
        if isinstance(keys, str) and '|' in keys:
            key_array = keys.split(split_key)
            keys_map = map(_to_int, key_array[:-1])
            last = _to_int(key_array[-1])

            reduce(_get_or_create, keys_map, data)[last] = value
        else:
            data[keys] = value
    except BaseException as e:
        raise StepKeyError("insert_data", keys) from e


def data_remove_pattern(keys, data, split_key="|"):
    try:
        if isinstance(keys, str) and '|' in keys:
            key_array = keys.split(split_key)
            keys_map = map(_to_int, key_array[:-1])
            last = _to_int(key_array[-1])

            reduce(operator.getitem, keys_map, data).pop(last, None)
        else:
            data.pop(keys, None)
    except BaseException as e:
        raise StepKeyError("remove_data", keys) from e
