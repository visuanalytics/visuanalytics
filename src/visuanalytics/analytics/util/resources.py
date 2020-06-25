"""Module, dass Funktionen zur Benutzung von Ressourcen bereitstellt."""
import contextlib
import os
from datetime import datetime

RESOURCES_LOCATION = "../../resources"
"""
Relativer Pfad zu dem resources Ordner.
"""

TEST_RESOURCES_LOCATION = "../../tests/resources"
"""
Relativer Pfad zu dem Test resources Ordner.
"""

ROOT_LOCATION = "../../"
"""
Relativer Pfad zur root location.
"""

TEMP_LOCATION = "temp"


def get_resource_path(path: str, tests=False):
    """Erstellt einen Absoluten Pfad zu der übergebene Ressource.

    Erstellt den Pfad aus `RESOURCES_LOCATION` und dem übergebenen Pfad.

    :param path: Pfad zur Ressource, relativ zum `resources` Ordner.
    :param tests: Angabe ob es sich um den Test ressource folder handelt
    :return: Absoluter Pfad zur übergebener Ressource.
    """
    if tests:
        return os.path.normpath(os.path.join(os.path.dirname(__file__), TEST_RESOURCES_LOCATION, path))
    return os.path.normpath(os.path.join(os.path.dirname(__file__), RESOURCES_LOCATION, path))


def get_temp_resource_path(path: str, pipeline_id: str, tests=False):
    """Erstellt einen Absoluten Pfad zu der übergebene Ressource im Temp Ordner.

    :param path: Pfad zur Ressource, relativ zum `resources/temp` Ordner.
    :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
    :param tests: Angabe ob es sich um den Test ressource folder handelt
    :type pipeline_id: str
    """
    return get_resource_path(os.path.join(TEMP_LOCATION, pipeline_id, path), tests)


def new_temp_resource_path(pipeline_id: str, extension, tests=False):
    """Erstellt einen Absoluten Pfad für eine neue resource.

    Generiert einen neuen Namen mit Aktuellem zeitsteppel.
    Verwendet um den pfad zu generieren :func:`get_temp_resource_path` mit dem ordner der `pipeline_id`.

    :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
    :type pipeline_id: str
    :param extension: Dateierweiterung ohne `.`.
    :param tests: Angabe ob es sich um den Test ressource folder handelt
    :type extension: str
    """
    return get_temp_resource_path(f"{datetime.now().strftime('%Y-%m-%d_%H-%M.%S.%f')}.{extension}", pipeline_id, tests)


def open_resource(path: str, mode: str = "rt", tests=False):
    """Öffnet die übergebene Ressource.

    Verwendet :func:`get_resource_path` um den Pfad der Ressource zu bekommen.
    Ist die Datei oder darüber liegende Ordner nicht vorhanden werden diese erstellt.

    :param path: Pfad zur Resource, Relativ zum `resources` Ordner.
    :param mode: Mode zum Öffnen der Datei siehe :func:`open`.
    :param tests: Angabe ob es sich um den Test ressource folder handelt

    :return: Die geöffnete Datei (siehe :func:`open`)

    :raises: OSError
    """
    res_path = get_resource_path(path, tests)
    os.makedirs(os.path.dirname(res_path), exist_ok=True)

    return open(res_path, mode, encoding='utf-8')


def open_temp_resource(path: str, pipeline_id: str, mode: str = "rt", tests=False):
    """Öffnet die übergebene Temp Ressource.

    Verwendet :func:`get_temp_resource_path`

    :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
    :param path: Pfad zur Resource, Relativ zum `resources` Ordner.
    :param mode: Mode zum Öffnen der Datei siehe :func:`open`.
    :param tests: Angabe ob es sich um den Test ressource folder handelt

    """
    return open_resource(os.path.join(TEMP_LOCATION, pipeline_id, path), mode, tests)


def delete_resource(path: str, tests=False):
    """Löscht die übergebene Ressource.

    Verwendet :func:`get_resource_path` um den Pfad der Ressource zu bekommen.
    Ist die Ressource nicht vorhanden wird das ignoriert.
    Ist der angegebene Pfad allerdings ein Ordner wird ein Fehler geworfen.

    :param path: Pfad zur Ressource, relativ zum `resources` Ordner.
    :param tests: Angabe ob es sich um den Test ressource folder handelt

    :raises: OSError
    """
    with contextlib.suppress(FileNotFoundError):
        os.remove(get_resource_path(path, tests))


def path_from_root(path):
    """
    Erstellt einen pfad relativ zum root ordner (visuanalytics)

    :param path: relativer pfad
    :return: absoluter pfad zu root/path
    """
    return os.path.normpath(os.path.join(os.path.dirname(__file__), ROOT_LOCATION, path))


def get_out_path(out_path, job_name, format=".mp4"):
    """
    Liefert die aktuelle Uhrzeit in Form eines String zurück

    :param out_path: Path an dem das Video abgelegt werden soll
    :type out_path: str
    :param job_name: Eine Beschreibung des Jobs der gerade ausgeführt wird
    :type job_name: str
    :param format: Format in das gespeichert werden soll
    :type format: str
    :return: Die aktuelle Uhrzeit für den Dateinamen zum erstellen des Videos
    :rtype: str
    """
    return path_from_root(os.path.join(out_path, f"{job_name}-{datetime.now().strftime('%Y-%m-%d_%H-%M.%S')}{format}"))
