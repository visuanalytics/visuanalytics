def wind_data_to_text(wind_cdir_full, wind_dir, wind_spd):
    """Wandelt alle Winddaten so um, dass sie flüssig vorgelesen werden können.

    Diese Eingabeparameter sind Werte aus der Weatherbit-API.
    Im Dictionary directions_dictionary sind die englischen Wörter für die Himmelsrichtungen auf zwei verschiedene
    Weisen auf Deutsch übersetzt. Die Übersetzungen dienen später der flüssigeren Wiedergabe des Textes als Audiodatei.

    :param wind_cdir_full: Angabe der Windrichtung Beispiel: west-southwest
    :param wind_dir: Angabe der Windrichtung in Grad
    :param wind_spd: Angabe der Windgeschwindigkeit in m/s
    :return: wind_direction, wind_dir_degree, wind_spd_text

    Example:
        wind_cdir_full = "west-southwest"
        wind_dir = 252
        wind_spd = 0.827464
        wind_cdir_full, wind_dir, wind_spd = wind_data_to_text(wind_cdir_full, wind_dir, wind_spd)
        print(wind_cdir_full)
        print(wind_dir)
        print(wind_spd)
    """
    directions_dictionary = {
        "west": {"noun": "West", "adjective": "westlich"},
        "southwest": {"noun": "Südwest", "adjective": "südwestlich"},
        "northwest": {"noun": "Nordwest", "adjective": "nordwestlich"},
        "south": {"noun": "Süd", "adjective": "südlich"},
        "east": {"noun": "Ost", "adjective": "östlich"},
        "southeast": {"noun": "Südost", "adjective": "südöstlich"},
        "northeast": {"noun": "Nordost", "adjective": "nordöstlich"},
        "north": {"noun": "Nord", "adjective": "nördlich"}
    }

    wind_cdir = wind_cdir_full.split("-")
    wind_direction_1 = directions_dictionary[wind_cdir[0]]["noun"]
    wind_direction_2 = directions_dictionary[wind_cdir[1]]["noun"]
    wind_direction_text = wind_direction_1 + " " + wind_direction_2
    wind_dir_degree_text = str(wind_dir) + " Grad"
    wind_spd_text = str(round(wind_spd, 2)).replace(".",",") + " Metern pro Sekunde"
    return wind_direction_text, wind_dir_degree_text, wind_spd_text

