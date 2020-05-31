def get_all_images(pipeline_id, data, date):
    """Generiert alle Bilder mit Wordclouds, die für den historischen Bericht benötigt werden

    :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
    :type pipeline_id: str
    :param data: sollte am besten alle vier vorbereiteten Strings enthalten
    :param date:
    :return:
    """
    pass


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
