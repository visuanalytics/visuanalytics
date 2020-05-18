"""Module, dass Funktionen zur Benutzung von Ressourcen bereitstellt."""
import contextlib
import os
from datetime import datetime

RESOURCES_LOCATION = "../../resources"
"""
Relativer Pfad zu dem resources Ordner.
"""

TEMP_LOCATION = "temp"


# TODO(Max) vtl. für tmp resources Funktionen erstellen die,
#  die resourcen mit id generierten Ordnernamen erstellt / bekommt.

def get_resource_path(path: str):
    """Erstellt einen Absoluten Pfad zu der übergebene Ressource.

    Erstellt den Pfad aus `RESOURCES_LOCATION` und dem übergebenen Pfad.

    :param path: Pfad zur Ressource, relativ zum `resources` Ordner.
    :return: Absoluter Pfad zur übergebener Ressource.
    """
    return os.path.normpath(os.path.join(os.path.dirname(__file__), RESOURCES_LOCATION, path))


def get_temp_resource_path(path: str, pipeline_id: str):
    """Erstellt einen Absoluten Pfad zu der übergebene Ressource im Temp Ordner.

    :param path: Pfad zur Ressource, relativ zum `resources/temp` Ordner.
    :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
    :type pipeline_id: str
    """
    return get_resource_path(os.path.join(TEMP_LOCATION, pipeline_id, path))


def new_temp_resource_path(pipeline_id: str, extension):
    """Erstellt einen Absoluten Pfad für eine neue resource.

    Generiert einen neuen Namen mit Aktuellem zeitsteppel.
    Verwendet um den pfad zu generieren :func:`get_temp_resource_path` mit dem ordner der `pipeline_id`.

    :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
    :type pipeline_id: str
    :param extension: Dateierweiterung ohne `.`.
    :param extension: str
    """
    return get_temp_resource_path(f"{datetime.now().strftime('%Y-%m-%d_%H-%M.%S.%f')}.{extension}", pipeline_id)


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


def open_temp_resource(path: str, pipeline_id: str, mode: str = "rt"):
    """Öffnet die übergebene Temp Ressource.

    Verwendet :func:`get_temp_resource_path`

    :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
    :param path: Pfad zur Resource, Relativ zum `resources` Ordner.
    :param mode: Mode zum Öffnen der Datei siehe :func:`open`.

    """
    return open_resource(os.path.join(TEMP_LOCATION, pipeline_id, path), mode)


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
