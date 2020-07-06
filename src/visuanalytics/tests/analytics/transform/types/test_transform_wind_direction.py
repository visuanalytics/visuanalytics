import unittest

from visuanalytics.tests.analytics.transform.transform_test_helper import prepare_test


class TestTransformWindDirection(unittest.TestCase):
    def setUp(self):
        self.data = {
            "test1": "south",
            "test2": "south-southwest",
            "test3": "east",
            "test4": "southwest",
            "test5": "east-southeast"

        }

    def test_wind_direction_test1(self):
        values = [
            {
                "type": "wind_direction",
                "key": "_req|test1",
                "dict": {
                    "west": {
                        "0": "West",
                        "1": "Westen"
                    },
                    "southwest": {
                        "0": "Südwest",
                        "1": "Südwesten"
                    },
                    "northwest": {
                        "0": "Nordwest",
                        "1": "Nordwesten"
                    },
                    "south": {
                        "0": "Süd",
                        "1": "Süden"
                    },
                    "east": {
                        "0": "Ost",
                        "1": "Osten"
                    },
                    "southeast": {
                        "0": "Südost",
                        "1": "Südosten"
                    },
                    "northeast": {
                        "0": "Nordost",
                        "1": "Nordosten"
                    },
                    "north": {
                        "0": "Nord",
                        "1": "Norden"
                    }
                },
                "delimiter": "-"
            }
        ]

        expected_data = {
            "_req": {
                "test1": "Süden",
                "test2": "south-southwest",
                "test3": "east",
                "test4": "southwest",
                "test5": "east-southeast"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "Wind direction Failed")

    def test_wind_direction_test2(self):
        values = [
            {
                "type": "wind_direction",
                "key": "_req|test2",
                "dict": {
                    "west": {
                        "0": "West",
                        "1": "Westen"
                    },
                    "southwest": {
                        "0": "Südwest",
                        "1": "Südwesten"
                    },
                    "northwest": {
                        "0": "Nordwest",
                        "1": "Nordwesten"
                    },
                    "south": {
                        "0": "Süd",
                        "1": "Süden"
                    },
                    "east": {
                        "0": "Ost",
                        "1": "Osten"
                    },
                    "southeast": {
                        "0": "Südost",
                        "1": "Südosten"
                    },
                    "northeast": {
                        "0": "Nordost",
                        "1": "Nordosten"
                    },
                    "north": {
                        "0": "Nord",
                        "1": "Norden"
                    }
                },
                "delimiter": "-"
            }
        ]

        expected_data = {
            "_req": {
                "test1": "south",
                "test2": "Süd-Südwest",
                "test3": "east",
                "test4": "southwest",
                "test5": "east-southeast"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "Wind direction Failed")

    def test_wind_direction_test3(self):
        values = [
            {
                "type": "wind_direction",
                "key": "_req|test3",
                "dict": {
                    "west": {
                        "0": "West",
                        "1": "Westen"
                    },
                    "southwest": {
                        "0": "Südwest",
                        "1": "Südwesten"
                    },
                    "northwest": {
                        "0": "Nordwest",
                        "1": "Nordwesten"
                    },
                    "south": {
                        "0": "Süd",
                        "1": "Süden"
                    },
                    "east": {
                        "0": "Ost",
                        "1": "Osten"
                    },
                    "southeast": {
                        "0": "Südost",
                        "1": "Südosten"
                    },
                    "northeast": {
                        "0": "Nordost",
                        "1": "Nordosten"
                    },
                    "north": {
                        "0": "Nord",
                        "1": "Norden"
                    }
                },
                "delimiter": "-"
            }
        ]

        expected_data = {
            "_req": {
                "test1": "south",
                "test2": "south-southwest",
                "test3": "Osten",
                "test4": "southwest",
                "test5": "east-southeast"
            }
        }

        exp, out = prepare_test(values, self.data, expected_data)
        self.assertDictEqual(exp, out, "Wind direction Failed")


def test_wind_direction_test4(self):
    values = [
        {
            "type": "wind_direction",
            "key": "_req|test4",
            "dict": {
                "west": {
                    "0": "West",
                    "1": "Westen"
                },
                "southwest": {
                    "0": "Südwest",
                    "1": "Südwesten"
                },
                "northwest": {
                    "0": "Nordwest",
                    "1": "Nordwesten"
                },
                "south": {
                    "0": "Süd",
                    "1": "Süden"
                },
                "east": {
                    "0": "Ost",
                    "1": "Osten"
                },
                "southeast": {
                    "0": "Südost",
                    "1": "Südosten"
                },
                "northeast": {
                    "0": "Nordost",
                    "1": "Nordosten"
                },
                "north": {
                    "0": "Nord",
                    "1": "Norden"
                }
            },
            "delimiter": "-"
        }
    ]

    expected_data = {
        "_req": {
            "test1": "south",
            "test2": "south-southwest",
            "test3": "east",
            "test4": "Südwesten",
            "test5": "east-southeast"
        }
    }

    exp, out = prepare_test(values, self.data, expected_data)
    self.assertDictEqual(exp, out, "Wind direction Failed")


def test_wind_direction_test5(self):
    values = [
        {
            "type": "wind_direction",
            "key": "_req|test5",
            "dict": {
                "west": {
                    "0": "West",
                    "1": "Westen"
                },
                "southwest": {
                    "0": "Südwest",
                    "1": "Südwesten"
                },
                "northwest": {
                    "0": "Nordwest",
                    "1": "Nordwesten"
                },
                "south": {
                    "0": "Süd",
                    "1": "Süden"
                },
                "east": {
                    "0": "Ost",
                    "1": "Osten"
                },
                "southeast": {
                    "0": "Südost",
                    "1": "Südosten"
                },
                "northeast": {
                    "0": "Nordost",
                    "1": "Nordosten"
                },
                "north": {
                    "0": "Nord",
                    "1": "Norden"
                }
            },
            "delimiter": "-"
        }
    ]

    expected_data = {
        "_req": {
            "test1": "south",
            "test2": "south-southwest",
            "test3": "east",
            "test4": "southwest",
            "test5": "Süd-Südost"
        }
    }

    exp, out = prepare_test(values, self.data, expected_data)
    self.assertDictEqual(exp, out, "Wind direction Failed")
