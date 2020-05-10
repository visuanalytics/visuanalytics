# Autor: Tanja

from numpy import random

def random_cities(city_name, city_descriptions):
    """Gibt eine Beschreibung der Stadt aus.

    Um die Texte des Wetterberichts automatisch zu generieren und sie trotzdem nicht immer gleich aussehen, wird
    hier ein Dictionary verwendet mit verschiedenen Beschreibungen zu einer Stadt. Dies kann ganz normal der Name
    der Stadt sein oder zum Beispiel die Lage der Stadt in Deutschland. Mithilfe der Random-Funktion wird eine
    dieser Beschreibungen ausgewählt und später im Text des Wetterberichts eingefügt.

    :param city_name: Die von der Weatherbit-API ausgegebene Stadt.
    :param city_descriptions: Dictionary mit verschiedenen Beschreibungen einer Stadt.
    :return text_city: Gibt eine Stadt oder eine Eigenschaft (wie z.B. Himmelsrichtung) der eingegebenen Stadt als
    Text aus.

    Example:
        city_name = "schwerin"
        x = random_cities(city_name, city_descriptions)
        print(x + " scheint am Donnerstag die Sonne.")
    """
    x = random.choice(["0", "1", "2"])
    text_city = str(city_descriptions[city_name][x])
    return text_city

city_descriptions = {
                   "berlin": {"0": "im Nordosten Deutschlands",
                              "1": "in der Hauptstadt",
                              "2": "in Berlin"},
                   "bremen": {"0": "im Norden Deutschlands",
                              "1": "in der norddeutschen Hansestadt",
                              "2": "in Bremen"},
                   "dresden": {"0": "im Osten Deutschlands",
                               "1": "in der Nähe der tschechischen und polnischen Grenze",
                               "2": "in Dresden"},
                   "duesseldorf": {"0": "im Westen Deutschlands",
                                  "1": "in der Nähe der niederländischen Grenze",
                                  "2": "in Düsseldorf"},
                   "frankfurt": {"0": "in der Mitte Deutschlands",
                                 "1": "in Hessen",
                                 "2": "in Frankfurt am Main"},
                   "garmisch-partenkirchen": {"0": "an der österreichischen Grenze",
                                              "1": "in der Nähe der Zugspitze",
                                              "2": "in Garmisch-Partenkirchen"},
                   "giessen": {"0": "in Mittelhessen",
                              "1": "in Gießen",
                              "2": "in Gießen an der Lahn"},
                   "hamburg": {"0": "in der Hafenstadt Hamburg",
                               "1": "im Norden Deutschlands",
                               "2": "in Hamburg"},
                   "hannover": {"0": "in Hannover",
                                "1": "in Hannover",
                                "2": "in Hannover"},
                   "kiel": {"0": "an der Ostsee",
                            "1": "in der Hafenstadt Kiel",
                            "2": "im Norden Deutschlands"},
                   "muenchen": {"0": "im Süden Deutschlands",
                               "1": "in der bayrischen Landeshauptstadt München",
                               "2": "in München"},
                   "nuernberg": {"0": "im Nordens Bayerns",
                                "1": "im Südosten Deutschlands",
                                "2": "in Nürnberg"},
                   "saarbruecken": {"0": "an der französischen Grenze",
                                   "1": "in der Nähe der franzäsischen Grenze",
                                   "2": "in Saarbrücken"},
                   "schwerin": {"0": "im Norden Deutschlands",
                                "1": "in der Landeshauptstadt Mecklenburg-Vorpommerns",
                                "2": "in Schwerin"},
                   "stuttgart": {"0": "in der Landeshauptstadt Baden-Württembergs",
                                 "1": "im Südwesten",
                                 "2": "in Stuttgart"}
                    }

