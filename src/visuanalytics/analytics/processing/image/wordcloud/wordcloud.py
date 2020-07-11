import random

from visuanalytics.analytics.util.step_errors import ImageError
from visuanalytics.analytics.util.type_utils import register_type_func

WORDCLOUD_TYPES = {}
"""Ein Dictionary bestehende aus allen Wordcloud Typ Methoden  """


def register_wordcloud(func):
    """
    Fügt eine Typ-Funktion dem Dictionary WORDCLOUD_TYPES hinzu.

    :param func: Eine Funktion
    :return: Die übergebene Funktion
    """
    return register_type_func(WORDCLOUD_TYPES, ImageError, func)


@register_wordcloud
def color_func(word, font_size, position, orientation, random_state=None, **kwargs):
    """
    Erstellt das Farbspektrum, in welcher die Wörter der wordcloud dargestellt werden
    """
    return "hsl(38, 73%%, %d%%)" % random.randint(30, 80)
