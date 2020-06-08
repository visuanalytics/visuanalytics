"""
Generierung eines Audiodatei im mp3-Format.

Zuvor erstellter bzw. übergebener Text wird in eine Audiodatei im mp3-Format umgewandelt.
"""
import gtts.tokenizer.symbols
from gtts import gTTS
from gtts.tokenizer import pre_processors
from gtts.tokenizer import tokenizer_cases
from gtts.tokenizer.core import Tokenizer

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


def text_to_mp3_with_prepro_tok(pipeline_id, text):
    """Der übergebene Text wird in eine Audiodatei im mp3-Format umgewandelt.

    Der übergebene Text wird in eine Audiodatei im mp3-Format umgewandelt und in einem bestimmten Ordner abgespeichert.

    :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
    :type pipeline_id: str
    :param text:
    :type text: str
    :return: Dateipfad als String
    :rtype: str
    """
    gtts.tokenizer.symbols.SUB_PAIRS = add_sub_pairs()
    text = pre_processors.abbreviations(text)
    text = pre_processors.end_of_line(text)
    text = pre_processors.tone_marks(text)
    text = pre_processors.word_sub(text)
    tts = gTTS(text, lang='de', slow=False, lang_check=True, pre_processor_funcs=[pre_processors.tone_marks,
                                                                                  pre_processors.end_of_line,
                                                                                  pre_processors.abbreviations,
                                                                                  pre_processors.word_sub],
               tokenizer_func=Tokenizer([tokenizer_cases.tone_marks, tokenizer_cases.period_comma,
                                         tokenizer_cases.colon, tokenizer_cases.other_punctuation]).run)
    file_path = resources.new_temp_resource_path(pipeline_id, "mp3")
    tts.save(file_path)
    return file_path


def add_sub_pairs():
    # append SUB_PAIRS
    gtts.tokenizer.symbols.SUB_PAIRS.append(('z.B.', 'zum Beispiel'))
    gtts.tokenizer.symbols.SUB_PAIRS.append(('usw.', 'und so weiter'))
    gtts.tokenizer.symbols.SUB_PAIRS.append(('o.Ä.', 'oder Ähnliches'))
    gtts.tokenizer.symbols.SUB_PAIRS.append(('P.S.', 'PS'))
    return gtts.tokenizer.symbols.SUB_PAIRS
