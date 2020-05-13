from visuanalytics.analytics.util import dictionary
import unittest
import copy


class SelectTest(unittest.TestCase):

    def test_empty_dictionary(self):
        actual = dictionary.select_pairs(["a", "b", "c"], {})
        expected = {}
        self.assertEqual(actual, expected)

    def test_empty_collection(self):
        actual = dictionary.select_pairs([], {"a": 1, "b": 2, "c": 3})
        expected = {}
        self.assertEqual(actual, expected)

    def test_dict_contains_no_selected_key(self):
        actual = dictionary.select_pairs(["d", "e", "f"], {"a": 1, "b": 2, "c": 3})
        expected = {}
        self.assertEqual(actual, expected)

    def test_result_only_contains_selected_keys(self):
        actual = dictionary.select_pairs(["a", "c"], {"a": 1, "b": 2, "c": 3})
        expected = {"a": 1, "c": 3}
        self.assertEqual(actual, expected)

    def test_selection_order_does_not_matter(self):
        dict = {"a": 1, "b": 2, "c": 3, "d": 4}
        dict_copy = copy.deepcopy(dict)
        a = dictionary.select_pairs(["a", "b", "d"], dict)
        b = dictionary.select_pairs(["d", "a", "b"], dict_copy)
        self.assertEqual(a, b, "Die Reihenfolge der übergebenen Keys sollte keine Rolle spielen.")


class FlattenTest(unittest.TestCase):

    def test_empty_dict(self):
        self.assertEqual(dictionary.flatten({}), {})

    def test_no_sub_dicts(self):
        dict = {"a": 1, "b": 2, "c": 3}
        dict_copy = copy.deepcopy(dict)
        actual = dictionary.flatten(dict)
        expected = dict_copy
        self.assertEqual(actual, expected)

    def test_sub_dicts(self):
        dict = {"a": 1, "cb": {"b": 2, "c": 3}, "d": 4}
        actual = dictionary.flatten(dict)
        expected = {"a": 1, "b": 2, "c": 3, "d": 4}
        self.assertEqual(actual, expected)

    def test_sub_sub_dicts(self):
        dict = {"a": 1, "bcd": {"b": 2, "cd": {"c": 3, "d": 4}}, "e": 5}
        actual = dictionary.flatten(dict)
        expected = {"a": 1, "b": 2, "cd": {"c": 3, "d": 4}, "e": 5}
        self.assertEqual(actual, expected)


class FlattenRecTest(unittest.TestCase):

    def test_empty_dict(self):
        self.assertEqual(dictionary.flatten_rec({}), {})

    def test_no_sub_dicts(self):
        dict = {"a": 1, "b": 2, "c": 3}
        dict_copy = copy.deepcopy(dict)
        actual = dictionary.flatten_rec(dict)
        expected = dict_copy
        self.assertEqual(actual, expected)

    def test_sub_dicts(self):
        dict = {"a": 1, "cb": {"b": 2, "c": 3}, "d": 4}
        actual = dictionary.flatten_rec(dict)
        expected = {"a": 1, "b": 2, "c": 3, "d": 4}
        self.assertEqual(actual, expected)

    def test_sub_sub_dicts(self):
        dict = {"a": 1, "bcd": {"b": 2, "cd": {"c": 3, "d": 4}}, "e": 5}
        actual = dictionary.flatten_rec(dict)
        expected = {"a": 1, "b": 2, "c": 3, "d": 4, "e": 5}
        self.assertEqual(actual, expected)


class CombineTest(unittest.TestCase):
    def test_empty_list(self):
        actual = dictionary.combine([])
        expected = {}
        self.assertEqual(actual, expected)

    def test_singleton_list(self):
        list = [{"a": 1}]
        actual = dictionary.combine(list)
        expected = list[0]
        self.assertEqual(actual, expected)

    def test_multiple(self):
        list = [{"a": 1}, {"b": 2, "c": 3}, {"d": 4}]
        actual = dictionary.combine(list)
        expected = {"a": 1, "b": 2, "c": 3, "d": 4}
        self.assertEqual(actual, expected)

    def test_equal_key(self):
        actual = dictionary.combine([{"a": 1}, {"b": 2}, {"a": 4}])
        expected = {"a": 4, "b": 2}
        self.assertEqual(actual, expected)
