import operator
from functools import reduce
from string import Formatter


class KeyFormatter(Formatter):
    def __init__(self, split_key="|"):
        super().__init__()
        self.__split_key = split_key

    def get_value(self, key, args, kwargs):
        if isinstance(key, str):
            key = map(lambda x: int(x) if x.isnumeric() else x, key.split(self.__split_key))
            return reduce(operator.getitem, key, args[0])

        return args[0][key]
