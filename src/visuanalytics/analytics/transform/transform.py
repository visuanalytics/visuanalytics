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


# TODO: code to weather_description
# TODO: wind_cdir_full to text string
def transform_key_to_random_dicttext(values: dict, data: StepData):
    # for idx, entry in enumerate(data.get_data(values["keys"], values)):
    #    data.save_loop(values, idx, entry)
    #    new_entry = transform_get_new_keys(values, data, idx, entry)
    #    icon_code = str(code)
    #    x = random.choice([0, 1])
    #    text_weather = str(WEATHER_DESCRIPTIONS[icon_code][x])
    #    new_value = entry.replace(entry, data.get_data(values["new_value"], values))
    #    data.insert_data(new_entry, new_value)
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


DIRECTIONS = {
    "west": {0: "West", 1: "westlich", 2: "Westen"},
    "southwest": {0: "Südwest", 1: "südwestlich", 2: "Südwesten"},
    "northwest": {0: "Nordwest", 1: "nordwestlich", 2: "Nordwesten"},
    "south": {0: "Süd", 1: "südlich", 2: "Süden"},
    "east": {0: "Ost", 1: "östlich", 2: "Osten"},
    "southeast": {0: "Südost", 1: "südöstlich", 2: "Südosten"},
    "northeast": {0: "Nordost", 1: "nordöstlich", 2: "Nordosten"},
    "north": {0: "Nord", 1: "nördlich", 2: "Norden"}
}

WEATHER_DESCRIPTIONS = {
    "200": {0: "kommt es zu Gewittern mit leichtem Regen",
            1: "ist mit Gewitter und leichtem Regen zu rechnen",
            2: "Gewitter"},
    "201": {0: "kommt es zu Gewittern mit Regen",
            1: "ist mit Gewitter und Regen zu rechnen",
            2: "Gewitter"},
    "202": {0: "kommt es zu Gewittern mit starkem Regen",
            1: "ist mit Gewitter und starkem Regen zu rechnen",
            2: "Gewitter"},
    "230": {0: "kommt es zu Gewittern mit leichtem Nieselregen",
            1: "ist mit Gewitter und leichtem Nieselregen zu rechnen",
            2: "Gewitter"},
    "231": {0: "kommt es zu Gewittern mit Nieselregen",
            1: "ist mit Gewitter und Nieselregen zu rechnen",
            2: "Gewitter"},
    "232": {0: "kommt es zu Gewittern mit starkem Nieselregen",
            1: "ist mit Gewitter und starkem Nieselregen zu rechnen",
            2: "Gewitter"},
    "233": {0: "kommt es zu Gewittern mit Hagel",
            1: "ist mit Gewitter und Hagel zu rechnen",
            2: "Gewitter"},
    "300": {0: "kommt es zu leichtem Nieselregen",
            1: "ist mit leichtem Nieselregen zu rechnen",
            2: "regnerisch"},
    "301": {0: "kommt es zu Nieselregen",
            1: "ist mit Nieselregen zu rechnen",
            2: "Nieselregen"},
    "302": {0: "kommt es zu starkem Nieselregen",
            1: "ist mit starkem Nieselregen zu rechnen",
            2: "regnerisch"},
    "500": {0: "kommt es zu leichtem Regen",
            1: "ist es leicht regnerisch",
            2: "Regen"},
    "501": {0: "kommt es zu mäßigem Regen",
            1: "ist es regnerisch",
            2: "Regen"},
    "502": {0: "kommt es zu starkem Regen",
            1: "ist es stark regnerisch",
            2: "Regen"},
    "511": {0: "kommt es zu Eisregen",
            1: "ist mit Eisregen zu rechnen",
            2: "Eisregen"},
    "520": {0: "kommt es zu leichtem Regenschauer",
            1: "ist mit leichten Regenschauern zu rechnen",
            2: "Regenschauer"},
    "521": {0: "kommt es zu Regenschauer",
            1: "ist mit Regenschauern zu rechnen",
            2: "Regenschauer"},
    "522": {0: "kommt es zu starkem Regenschauer",
            1: "ist mit starken Regenschauern zu rechnen",
            2: "Regenschauer"},
    "600": {0: "kommt es zu leichtem Schneefall",
            1: "ist mit leichtem Schneefall zu rechnen",
            2: "Schnee"},
    "601": {0: "kommt es zu Schnee",
            1: "ist mit Schnee zu rechnen",
            2: "Schnee"},
    "602": {0: "kommt es zu starkem Schneefall",
            1: "ist mit starkem Schneefall zu rechnen",
            2: "Schnee"},
    "610": {0: "kommt es zu einem Mix aus Schnee und Regen",
            1: "ist mit einem Mix aus Schnee und Regen zu rechnen",
            2: "Schnee"},
    "611": {0: "kommt es zu Schneeregen",
            1: "ist mit Schneeregen zu rechnen",
            2: "Schneeregen"},
    "612": {0: "kommt es zu starkem Schneeregen",
            1: "ist mit starkem Schneeregen zu rechnen",
            2: "Schneeregen"},
    "621": {0: "kommt es zu Schneeschauer",
            1: "ist mit Schneeschauern zu rechnen",
            2: "Schneeschauer"},
    "622": {0: "kommt es zu starkem Schneeschauer",
            1: "ist mit starken Schneeschauern zu rechnen",
            2: "Schneeschauer"},
    "623": {0: "kommt es zu Windböen",
            1: "ist mit Windböen zu rechnen",
            2: "windig"},
    "700": {0: "kommt es zu Nebel",
            1: "ist mit Nebel zu rechnen",
            2: "nebelig"},
    "711": {0: "kommt es zu Nebel",
            1: "ist mit Nebel zu rechnen",
            2: "nebelig"},
    "721": {0: "kommt es zu Dunst",
            1: "ist mit Nebel zu rechnen",
            2: "nebelig"},
    "731": {0: "kommt es zu Staub in der Luft",
            1: "ist mit Staub in der Luft zu rechnen",
            2: "staubig"},
    "741": {0: "kommt es zu Nebel",
            1: "ist mit Nebel zu rechnen",
            2: "nebelig"},
    "751": {0: "kommt es zu Eisnebel",
            1: "ist mit Eisnebel zu rechnen",
            2: "Eisnebel"},
    "800": {0: "ist der Himmel klar",
            1: "wird es heiter mit klarem Himmel",
            2: "heiter"},
    "801": {0: "sind nur wenige Wolken am Himmel",
            1: "ist es leicht bewölkt",
            2: "leicht bewölkt"},
    "802": {0: "sind vereinzelte Wolken am Himmel",
            1: "ist es vereinzelt bewölkt",
            2: "leicht bewölkt"},
    "803": {0: "ist es bewölkt, vereinzelt kommt die Sonne durch",
            1: "ist es bewölkt, vereinzelt kommt die Sonne durch",
            2: "leicht bewölkt"},
    "804": {0: "kommt es zu bedecktem Himmel",
            1: "ist es bewölkt",
            2: "bewölkt"},
    "900": {0: "kommt es zu unbekanntem Niederschlag",
            1: "ist mit unbekanntem Niederschlag zu rechnen",
            2: "unbekannt"}
}

TRANSFORM_TYPES = {
    "transform_array": transform_array,
    "select": transform_select,
    "select_range": transform_select_range,
    "append": transform_append,
    "add_symbol": transform_add_symbol,
    "replace": transform_replace,
    "key_to_dicttext": transform_key_to_dicttext,
    "alias": transform_alias,
    "date_format": transform_date_format,
    "date_weekday": transform_date_weekday,
    "date_now": transform_date_now,
    "loop": transform_loop
}
