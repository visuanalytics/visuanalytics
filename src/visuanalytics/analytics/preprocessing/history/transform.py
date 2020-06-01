"""
Modul zum transformieren der Json data in eine handlichere Struktur sowie anpassung des Datums, sodass es später in der Audio datei erwähnt werden kann
"""
from datetime import datetime

from visuanalytics.analytics.util import dictionary

RELEVANT_DATA = ["release_date", "title", "supertitle", "teaser_text"]
"""
list: Liste von JSON-Attributen, welche interessant für uns sind und aus den Daten rausgefiltert werden sollen.
"""


def preprocess_history_data(json_data):
    """
    Wandelt eine Liste von Zeit-Forecast-API-Responses in ein Tupel um, das die für uns relevanten Daten enthält. Dieses Tupel besteht
    aus drei Listen.
    Die erste Liste enthält Listen und zwar so viele, wie in Jahren angefordert wurden (hier immer 4 Jahre). Diese Listen enthalten
    jeweils Dictionaries und zwar so viele, wie es Artikel gibt (hier immer 10 Jahre), in denen Infos zu und der Teasertext selbst drin steht.
    Die zweite Liste enthält Listen (hier wieder 4). In jeder Liste sind jeweils zu einem Jahr die Keywords zu allen Artikeln enthalten und
    zwar in absteigender Reihenfolge ihres Aufkommens. Also die Liste fängt mit einem am häufigsten vorkommenen Keyword an und endet mit
    einem Keyword, dass am seltesten vorkam.
    Die dritte Liste enthält Dictionaries (hier wieder 4). In jedem Dictionary sind jeweils zu einem Jahr als Keys die Keywords und als Value
    der zugehörige Wert, wie häufig dieses vorgekommen ist, zu allen Artikeln enthalten.

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
        ],
        [
            {   'aachen': 1,
                'afd': 4,
                'afrika': 1,
                'altersunterschied': 1,
                'altona': 2,
                usw.
            }
        ]
    )

    :param json_data: Json-Data der Zeit-Api (oder eingelesenen Data aus der Testdatei)
    :rtype dict
    :return: vorverarbeitetes Data-Objekt der Zeit-Api
    :rtype: tuple

    """
    output = ([], [], [])
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
        key_dict = {}
        for j in range(0, int(len(json_data[idx]["facets"]["keyword"]) / 2)):
            key_dict.update(
                {json_data[idx]["facets"]["keyword"][j * 2]: json_data[idx]["facets"]["keyword"][(j * 2) + 1]})
        output[2].append(key_dict)
    # print(output[2])
    return output


# TODO: am Anfang der Steps Klasse erstellen lassen, sonst könnte es Probleme geben
def get_date(data):
    """Wandelt 'release_date' in Daten, Jahr und " vor wie vielen Jahren" um.
    
    In der Zeit-API wird das Datum wie folgt dargestellt: 2019-05-31T18:50:44Z (UTC ISO 8601: YYYY-MM-DDThh:mm:ssZ)
    Dieses Format wird eingelesen und am Ende wird das Datum des Artikels und das Jahr des Artikels ausgegeben.
    
    :param data: Dictionary der JSON-Daten, aber nur der erste Teil in dem 10 Einträge/Artikel stehen.
    :type data: dict
    :return: Daten der aller Einträge/Artikel im Format YYYY-MM-DDThh:mm:ssZ, Jahr (einmal) und wie viele Jahre es ab heute her ist (einmal)
    :rtype: str[], str, int
    """
    today = datetime.now()
    date = []
    historical_year = []
    years_ago = []
    for i in range(4):
        for j in range(10):
            date_api = data[i][j]['release_date']
            historical_date = datetime.strptime(date_api, "%Y-%m-%dT%H:%M:%SZ")
            new_format = "%Y-%m-%d"
            date.append(historical_date.strftime(new_format))

        date_api = data[i][j]['release_date']
        historical_date = datetime.strptime(date_api, "%Y-%m-%dT%H:%M:%SZ")
        year = "%Y"
        historical_year.append(historical_date.strftime(year))
        years_ago.append(str(int(today.year) - int(historical_year[i])))

    # TODO: kind of error handling
    # for j in range(1, 10):
    #    date_api_test = data[0][j]['release_date']
    #    historical_date_test = datetime.strptime(date_api_test, "%Y-%m-%dT%H:%M:%SZ")
    #    year = "%Y"
    #    historical_year_test = historical_date_test.strftime(year)
    #    if (historical_year_test != historical_year):
    #        raise Exception("Fehler: unterschiedliche Jahre in der Vergangenheit")

    return [date, historical_year, years_ago]


UPPERCASE_WORDS = ["spd", "Spd", "csu", "Csu", "cdu", "Cdu", "usa", "Usa", "eu", "Eu", "fdp", "Fdp", "bbc", "Bbc",
                   "faz", "Faz", "fc", "Fc", "hsv", "Hsv"]
"""
Liste mit Wörtern bei denen wir wissen, dass sie gegebenenfalls als Keyword auftauchen und wissen, dass sie komplett
groß geschrieben werden.
"""


def grammar_keywords(data):
    """Korrigiert die Groß- und Kleinschreibung der Keywords aus den API-Daten.

    :param data: Bekommt die vorverarbeiteten Daten aus der API
    :type data: Liste
    :return: Gibt die Data so wieder aus, nur dass die Keywords nun die Groß- und Kleinschreibung beachten.
    :rtype: Liste
    """
    # TODO: was passiert bei Namen und Bindestrichen?
    for i in range(4):
        for keyword in data[1][i]:
            if keyword in UPPERCASE_WORDS:
                keyword.upper()
            else:
                keyword.capitalize()
    return data


def string_formatting(text):
    """Überprüft auf " und ersetzt diese mit \".

    :param text: Erhält einen String und prüft diesen auf " z.B. bei Zitaten und ändert diese um in \", damit es kein
    Problem gibt, bei der Erstellung der Texte mit Hilfe von formatted strings.
    :type: str
    :return: Geprüfter Text, ggf. mit ersetztem "
    :rtype: str
    """
    return_text = text.replace('"', '\"')
    return return_text
