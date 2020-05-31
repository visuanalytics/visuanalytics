from visuanalytics.analytics.processing.util import mp3 as fp


def get_all_audios(pipeline_id, data, date):
    """Lässt vier Audiodateien (zu jedem abgefragten Zeitraum eine) generieren.

    Lässt _generate_audio viermal ausführen (einmal zu jedem abgefragten Zeitraum).

    :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
    :type pipeline_id: str
    :param data: Dictionary mit vorverarbeiteten Daten aus preprocessing -> merge_data
    :type data: dict
    #TODO ggf. date entfernen, da die Daten auch in data stehen
    :param date:
    :return: Liste mit Dateinamen der vier erstellten Audiodateien
    :rtype: list[]
    """
    return [_generate_audio(pipeline_id, data[1]),
            _generate_audio(pipeline_id, data[2]),
            _generate_audio(pipeline_id, data[3]),
            _generate_audio(pipeline_id, data[4])]


def _generate_audio(pipeline_id, data):
    """Erstellt einen Text aus den Daten des übergebenen Dictionaries und lässt sich daraus eine Audiodatei generieren.

    Erstellt einen Text aus den Daten des übergebenen Dictionaries (zu einem bestimmten Zeitraum in der Vergangenheit)
    und lässt sich daraus eine Audiodatei generieren. Ausgabeparameter ist der Pfad zu der Audiodatei.

    :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
    :type pipeline_id: str
    :param data: Erhält folgende Daten aus dem einem data-Dictionary-Eintrag: year, years_ago, teaser_1, teaser_2
    :type data: dict
    :return: Pfad zu der mit fp.text_to_mp3() erstellten Audio-Datei
    :rtype: str
    """
    text = (
        f"Heute vor {data['years_ago']} war das Jahr {data['year']}. "
        f"Ein Thema war damals: {data['teaser_1']}. "
        f"Ein weiteres Thema war damals: {data['teaser_2']}. "
    )
    file_path = fp.text_to_mp3(pipeline_id, text)
    return file_path
