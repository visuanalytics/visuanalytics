"""
Modul zum transformieren der Json data in eine handlichere Struktur sowie anpassung des Datums, sodass es später in der Audio datei erwähnt werden kann
"""

from visuanalytics.analytics.util import dictionary

RELEVANT_DATA = ["release_date", "title", "supertitle", "teaser_text"]
"""
list: Liste von JSON-Attributen, welche interessant für uns sind und aus den Daten rausgefiltert werden sollen.
"""


def preprocess_history_data(json_data):
    """
    Wandelt eine Liste von Zeit-Forecast-API-Responses in ein Tupel/Liste/Dictionary um, das die für uns relevanten Daten enthält.

    Um die weitere Verarbeitung zu vereinfachen, werden die Zeit-Daten in dieser Funktionen in eine leichter
    handzuhabende Struktur gebracht. Dazu werden irrelevante Parameter weggelassen und die allgemeine Struktur angepasst.

    Der Rückgabetyp hat folgende Struktur:
    (
        [
            [
                {   'title' : 'Ganz schön fetter Cocktail',
                    'release_date': '2019-05-31T18:50:44Z',
                    'supertitle': 'Old Fashioned',
                    'teaser_text': 'Der Old Fashioned ...... Bitter.'
                },
                {   'title ' : ...

                },
                {
                .... Je nachdem wie viele Artikel es sind (sollten immer 10 sein!)
                }
            ]
            [
                {   'title' : 'Ganz schön fetter Cocktail',
                    ....
                }, ....
            ] ... Es gibt so viele Listen wie viele Jahre angefordert wurden (sollten immer 4 sein!)

        ],
        [
            [ 'ukraine', 'ver.di', 'verteidigungsministerium', 'washington', 'widerstand', 'wiesbaden', ]
            [ 'ukraine', 'ver.di', 'verteidigungsministerium', 'washington', 'widerstand', 'wiesbaden', ]

            ...
            Ebensfalls hier, es gibt so viele Listen wie viele Jahre angefordert wurden (sollten immer 4 sein!)

            Die Einträge sind direkt nach der Häufigkeit sortiert, das erste Element der Liste hat die
            größte Zahl im Api Request
        ]
    )

    :param json_data:
    :rtype dict
    :return: tuple

    """
    output = ([], [])
    for idx in range(0, len(json_data)):
        data = []
        for i in range(0, len(json_data[idx]["matches"])):
            data.append(dictionary.select_pairs(RELEVANT_DATA, json_data[idx]["matches"][i]))
        output[0].append(data)
        tosort = {}
        data = []
        for i in range(0, int(len(json_data[idx]["facets"]["keyword"]) / 2)):
            tosort[json_data[idx]["facets"]["keyword"][i * 2]] = json_data[idx]["facets"]["keyword"][(i * 2) + 1]
        for w in sorted(tosort, key=tosort.get, reverse=True):
            data.append(w)
        output[1].append(data)
    return output


def get_date(data):
    # todo
    pass
