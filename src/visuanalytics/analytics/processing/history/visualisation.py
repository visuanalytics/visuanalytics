import random

import matplotlib.pyplot as plt
import numpy as np
from wordcloud import WordCloud

from visuanalytics.analytics.util import resources


# TODO docstring schreiben!!
def color_func(word, font_size, position, orientation, random_state=None, **kwargs):
    """
    Erstellt das Farbspektrum, in welcher die Wörter der wordcloud dargestellt werden
    
    :param word:
    :param font_size:
    :param position:
    :param orientation:
    :param random_state:
    :param kwargs:
    :return:
    """
    """
    return "hsl(38, 73%%, %d%%)" % random.randint(30, 80)


def get_all_images(pipeline_id, data, date):
    """
    Generiert alle Bilder (hier immer vier) mit Wordclouds, die für den historischen Bericht benötigt werden.
    Diese Wordclouds sind rund und farblich schwarz-weiß gehalten.

    :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
    :type pipeline_id: str
    :param data: Array mit vier vorbereiteten Strings
    :type data: array
    :param date:
    :return:
    """

    x, y = np.ogrid[:1000, :1000]
    mask = (x - 500) ** 2 + (y - 500) ** 2 > 400 ** 2
    mask = 255 * mask.astype(int)

    wordcloud_files_path = []
    for i in range(len(data)):
        wordcloud = WordCloud(background_color="white", width=1920, height=1080, collocations=False, max_font_size=400,
                              mask=mask).generate(data[i])
        wordcloud.recolor(color_func=color_func)

        plt.axis("off")
        plt.imshow(wordcloud, interpolation='bilinear')
        file = resources.new_temp_resource_path(pipeline_id, "png")
        plt.savefig(file, bbox_inches='tight')
        wordcloud_files_path.append(file)
    return wordcloud_files_path


def combine_images_audiolength(images, audiol):
    """

    :param images: Liste mit allen images
    :type images: list
    :param audiol: Liste aller Audiolängen
    :type audiol: list
    :return: Neues Tupel bestehend aus den sortierten images und audiolängen
    :rtype: tuple
    """
    return ([images[0], images[1], images[2], images[3]],
            [audiol[0], audiol[1], audiol[2], audiol[3]])
