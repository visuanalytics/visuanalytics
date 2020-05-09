def air_data_to_text(rh, pres):
    """Wandelt die von der Weatherbit-API gegebenen Werte rh und pres in Text um.

    Diese Eingabeparameter sind Werte aus der Weatherbit-API.
    Die Ausgabeparameter dienen später der flüssigeren Wiedergabe des Textes als Audiodatei.

    :param rh: relative Luftfeuchtigkeit in % (Prozent)
    :param pres: Luftdruck in mbar (Millibar)
    :return: rh_text, pres_text

    Example:
        rh = 58
        pres = 1000.27
        r, p = air_data_to_text(rh, pres)
        print(r)
        print(p)
    """
    rh_text = str(rh) + " Prozent"
    pres_text = str(pres).replace(".",",") + " Millibar"
    return rh_text, pres_text

