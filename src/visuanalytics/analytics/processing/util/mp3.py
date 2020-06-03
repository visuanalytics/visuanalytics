"""
Generierung eines Audiodatei im mp3-Format.

Zuvor erstellter bzw. übergebener Text wird in eine Audiodatei im mp3-Format umgewandelt.
"""
from gtts import gTTS

from visuanalytics.analytics.util import resources


def text_to_mp3(pipeline_id, text):
    """Der übergebene Text wird in eine Audiodatei im mp3-Format umgewandelt.

    Der übergebene Text wird in eine Audiodatei im mp3-Format umgewandelt und in einem bestimmten Ordner abgespeichert.

    :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
    :type pipeline_id: str
    :param text: Text der in Audio umgewandelt werdne soll
    :type text: str
    :return: Dateipfad als String
    :rtype: str
    """
    tts = gTTS(text, lang='de')
    file_path = resources.new_temp_resource_path(pipeline_id, "mp3")
    tts.save(file_path)
    return file_path
