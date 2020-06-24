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
    if not operator.contains(d, k):
        operator.setitem(d, k, {})

    return operator.getitem(d, k)


def data_get_pattern(keys, data, split_key="|"):
    try:
        if isinstance(keys, str):
            keys = map(_to_int, keys.split(split_key))
            return reduce(operator.getitem, keys, data)

        return data[keys]
    except KeyError as e:
        # TODO(max) may catch other error
        raise StepKeyError("get_data", e.__str__()) from e


def data_insert_pattern(keys, data, value, split_key="|"):
    try:
        if isinstance(keys, str) and '|' in keys:
            key_array = keys.split(split_key)
            keys = map(_to_int, key_array[:-1])
            last = _to_int(key_array[-1])

            reduce(_get_or_create, keys, data)[last] = value
        else:
            data[keys] = value
    except KeyError as e:
        # TODO(max) may catch other error
        raise StepKeyError("insert_data", e.__str__()) from e


# TODO(max) maybe move
def data_remove_pattern(keys, data, split_key="|"):
    try:
        if isinstance(keys, str) and '|' in keys:
            key_array = keys.split(split_key)
            keys = map(_to_int, key_array[:-1])
            last = _to_int(key_array[-1])

            reduce(operator.getitem, keys, data).pop(last, None)
        else:
            data.pop(keys, None)
    except KeyError as e:
        # TODO(max) may catch other error
        raise StepKeyError("remove_data", e.__str__()) from e
