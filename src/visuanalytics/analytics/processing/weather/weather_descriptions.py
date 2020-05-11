"""
Globale Variable: WEATHER_DESCRIPTIONS: Dictionary mit verschiedenen Beschreibungen des Wetters anhand eines Codes.
Funktion: random_weather_descriptions(code): Sucht eine Beschreibung für einen bestimmten Wetter-Code als String aus und
gibt diesen zurück.
"""
from numpy import random

WEATHER_DESCRIPTIONS = {
    "200": {"0": "kommt es zu Gewittern mit leichtem Regen",
            "1": "ist mit Gewitter und leichtem Regen zu rechnen"},
    "201": {"0": "kommt es zu Gewittern mit Regen",
            "1": "ist mit Gewitter und Regen zu rechnen"},
    "202": {"0": "kommt es zu Gewittern mit starkem Regen",
            "1": "ist mit Gewitter und starkem Regen zu rechnen"},
    "230": {"0": "kommt es zu Gewittern mit leichtem Nieselregen",
            "1": "ist mit Gewitter und leichtem Nieselregen zu rechnen"},
    "231": {"0": "kommt es zu Gewittern mit Nieselregen",
            "1": "ist mit Gewitter und Nieselregen zu rechnen"},
    "232": {"0": "kommt es zu Gewittern mit starkem Nieselregen",
            "1": "ist mit Gewitter und starkem Nieselregen zu rechnen"},
    "233": {"0": "kommt es zu Gewittern mit Hagel",
            "1": "ist mit Gewitter und Hagel zu rechnen"},
    "300": {"0": "kommt es zu leichtem Nieselregen",
            "1": "ist mit leichtem Nieselregen zu rechnen"},
    "301": {"0": "kommt es zu Nieselregen",
            "1": "ist mit Nieselregen zu rechnen"},
    "302": {"0": "kommt es zu starkem Nieselregen",
            "1": "ist mit starkem Nieselregen zu rechnen"},
    "500": {"0": "kommt es zu leichtem Regen",
            "1": "ist es leicht regnerisch"},
    "501": {"0": "kommt es zu mäßigem Regen",
            "1": "ist es regnerisch"},
    "502": {"0": "kommt es zu starkem Regen",
            "1": "ist es stark regnerisch"},
    "511": {"0": "kommt es zu Eisregen",
            "1": "ist mit Eisregen zu rechnen"},
    "520": {"0": "kommt es zu leichtem Regenschauer",
            "1": "ist mit leichten Regenschauern zu rechnen"},
    "521": {"0": "kommt es zu Regenschauer",
            "1": "ist mit Regenschauern zu rechnen"},
    "522": {"0": "kommt es zu starkem Regenschauer",
            "1": "ist mit starken Regenschauern zu rechnen"},
    "600": {"0": "kommt es zu leichtem Schneefall",
            "1": "ist mit leichtem Schneefall zu rechnen"},
    "601": {"0": "kommt es zu Schnee",
            "1": "ist mit Schnee zu rechnen"},
    "602": {"0": "kommt es zu starkem Schneefall",
            "1": "ist mit starkem Schneefall zu rechnen"},
    "610": {"0": "kommt es zu einem Mix aus Schnee und Regen",
            "1": "ist mit einem Mix aus Schnee und Regen zu rechnen"},
    "611": {"0": "kommt es zu Schneeregen",
            "1": "ist mit Schneeregen zu rechnen"},
    "612": {"0": "kommt es zu starkem Schneeregen",
            "1": "ist mit starkem Schneeregen zu rechnen"},
    "621": {"0": "kommt es zu Schneeschauer",
            "1": "ist mit Schneeschauern zu rechnen"},
    "622": {"0": "kommt es zu starkem Schneeschauer",
            "1": "ist mit starken Schneeschauern zu rechnen"},
    "623": {"0": "kommt es zu Windböen",
            "1": "ist mit Windböen zu rechnen"},
    "700": {"0": "kommt es zu Nebel",
            "1": "ist mit Nebel zu rechnen"},
    "711": {"0": "kommt es zu Nebel",
            "1": "ist mit Nebel zu rechnen"},
    "721": {"0": "kommt es zu Dunst",
            "1": "ist mit Nebel zu rechnen"},
    "731": {"0": "kommt es zu Staub in der Luft",
            "1": "ist mit Staub in der Luft zu rechnen"},
    "741": {"0": "kommt es zu Nebel",
            "1": "ist mit Nebel zu rechnen"},
    "751": {"0": "kommt es zu Eisnebel",
            "1": "ist mit Eisnebel zu rechnen"},
    "800": {"0": "ist der Himmel klar",
            "1": "wird es heiter mit klarem Himmel"},
    "801": {"0": "sind nur wenige Wolken am Himmel",
            "1": "ist es leicht bewölkt"},
    "802": {"0": "sind vereinzelte Wolken am Himmel",
            "1": "ist es vereinzelt bewölkt"},
    "803": {"0": "ist die Bewölkung durchbrochen",
            "1": "sind durchbrochene Wolken am Himmel"},
    "804": {"0": "kommt es zu bedecktem Himmel",
            "1": "ist es bewölkt"},
    "900": {"0": "kommt es zu unbekanntem Niederschlag",
            "1": "ist mit unbekanntem Niederschlag zu rechnen"}
}


def random_weather_descriptions(code):
    """Nimmt den Code vom Wetter-Icon aus der Weatherbit-API und generiert einen Satzteil als String.

    Innerhalb des Moduls wird der Code vom Wetter-Icon in einen String umgewandelt und im Dictionary
    weather_descriptions nachgeschaut, welcher Satzteil dazugehört. Es sind mehrere Satzteile pro
    Code möglich, daher wird mit der random-Funktion einer der möglichen Satzteile ausgesucht und als
    String ausgegeben. Dieser Satzteil wird ein Teil des späteren Wetterberichts (.txt-Datei), welcher
    dann in eine Audio-Datei umgewandelt wird.

    :param code: Wetter-Icon aus der Weatherbit-API, z.B. 501 als Integer.
    :param weather_descriptions: Dictionary mit verschiedenen Satzteilen zu einer Wetterbeschreibung.
    :return text_weather: String. Wird am Ende als Beschreibung zum Wetter als Satzteil in den Wetterbericht eingebaut.

    Example:
        code = 601
        text = random_weather_descriptions(code)
        print("In Berlin " + text + ".")
    """

    icon_code = str(code)
    x = random.choice(["0", "1"])
    text_weather = str(WEATHER_DESCRIPTIONS[icon_code][x])
    return text_weather
