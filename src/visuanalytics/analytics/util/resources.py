"""Module, dass Funktionen zur Benutzung von Ressourcen bereitstellt."""
import contextlib
import os
import datetime
import time

RESOURCES_LOCATION = "../../resources"
"""
Relativer Pfad zu dem resources Ordner.
"""


# TODO(Max) vtl. für tmp resources Funktionen erstellen die,
#  die resourcen mit id generierten Ordnernamen erstellt / bekommt.

def get_resource_path(path: str):
    """Erstellt einen Absoluten Pfad zu der übergebene Ressource.

    Erstellt den Pfad aus `RESOURCES_LOCATION` und dem übergebenen Pfad.

    :param path: Pfad zur Ressource, relativ zum `resources` Ordner.
    :return: Absoluter Pfad zur übergebener Ressource.
    """
    return os.path.normpath(os.path.join(os.path.dirname(__file__), RESOURCES_LOCATION, path))


def get_new_ressource_path(location="temp/weather/", format=".png"):
    """Erstellt einen neuen Ressource Pfad.

        Verwendet :func:`get_resource_path` um den Pfad der Ressource zu erstellen.

        :param location: Pfad der zu erstellenden Ressource.
        :type location : str
        :param format : Format der zu erstellenden Resource.
        :type format : str

        :raises: OSError
        """
    ts = time.time()
    return get_resource_path(
        location + str(datetime.datetime.fromtimestamp(ts).strftime('%d%m%Y_%H%M%S__%f')) + format)


def open_resource(path: str, mode: str = "rt"):
    """Öffnet die übergebene Ressource.

    Verwendet :func:`get_resource_path` um den Pfad der Ressource zu bekommen.
    Ist die Datei oder darüber liegende Ordner nicht vorhanden werden diese erstellt.

    :param path: Pfad zur Resource, Relativ zum `resources` Ordner.
    :param mode: Mode zum Öffnen der Datei siehe :func:`open`.

    :return: Die geöffnete Datei (siehe :func:`open`)

    :raises: OSError
    """
    res_path = get_resource_path(path)
    os.makedirs(os.path.dirname(res_path), exist_ok=True)

    return open(res_path, mode, encoding='utf-8')


def delete_resource(path: str):
    """Löscht die übergebene Ressource.

    Verwendet :func:`get_resource_path` um den Pfad der Ressource zu bekommen.
    Ist die Ressource nicht vorhanden wird das ignoriert.
    Ist der angegebene Pfad allerdings ein Ordner wird ein Fehler geworfen.

    :param path: Pfad zur Ressource, relativ zum `resources` Ordner.

    :raises: OSError
    """
    with contextlib.suppress(FileNotFoundError):
        os.remove(get_resource_path(path))
