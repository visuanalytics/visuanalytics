"""Module, dass Funktionen zur Benutzung von Ressourcen bereitstellt."""
import contextlib
import os
from datetime import datetime, timedelta

ROOT_LOCATION = "../"
"""
Relativer Pfad zur root location.
"""

RESOURCES_LOCATION = "resources"
"""
Pfad zu dem resources Ordner.
Wird beim starten mit dem Wert aus der Config datei inizalisiert.
"""

IMAGES_LOCATION = "images"
"""
Bilder Ordner Name.
Wird beim starten mit dem Wert aus der Config datei inizalisiert.
"""

TEMP_LOCATION = "temp"
""" 
Temporärer Datei Ordner Name.
Wird beim starten mit dem Wert aus der Config datei inizalisiert.
"""

MEMORY_LOCATION = "memory"
"""
Memory Datei Ordner Name, zum abspeichern von vorherigen berechnungen.
Wird beim starten mit dem Wert aus der Config datei inizalisiert.
"""

DATE_FORMAT = '%Y-%m-%d_%H-%M.%S'
"""
Date Format in welchem unsere Datein abgespeichert werden
"""


def get_current_time():
    """
    Gibt die aktuelle Uhrzeit in Form eines Strings zurück
    :return: Uhrzeit
    """
    return datetime.now().strftime(DATE_FORMAT)


def path_from_root(path):
    """
    Erstellt einen pfad relativ zum root ordner (visuanalytics)

    :param path: relativer pfad
    :return: absoluter pfad zu root/path
    """
    return os.path.normpath(os.path.join(os.path.dirname(__file__), ROOT_LOCATION, path))


def get_resource_path(path: str):
    """Erstellt einen Absoluten Pfad zu der übergebene Ressource.

    Erstellt den Pfad aus `RESOURCES_LOCATION` und dem übergebenen Pfad.

    :param path: Pfad zur Ressource, relativ zum `resources` Ordner.
    :return: Absoluter Pfad zur übergebener Ressource.
    """
    return path_from_root(os.path.join(RESOURCES_LOCATION, path))


def get_image_path(path: str):
    """Erstellt einen Absoluten Pfad zu der übergebene Image Ressource.

    Erstellt den Pfad aus `RESOURCES_LOCATION` und dem übergebenen Pfad.

    :param path: Pfad zur Ressource, relativ zum `resources` Ordner.
    :return: Absoluter Pfad zur übergebener Ressource.
    """
    return get_resource_path(os.path.join(IMAGES_LOCATION, path))


def get_temp_resource_path(path: str, pipeline_id: str):
    """Erstellt einen Absoluten Pfad zu der übergebene Ressource im Temp Ordner.

    :param path: Pfad zur Ressource, relativ zum `resources/temp` Ordner.
    :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
    :type pipeline_id: str
    """
    return get_resource_path(os.path.join(TEMP_LOCATION, pipeline_id, path))


def get_relative_temp_resource_path(path: str, pipeline_id: str):
    """Erstellt einen Relativen Pfad zu der übergebene Ressource im Temp Ordner.

        :param path: Pfad zur Ressource, relativ zum `resources/temp` Ordner.
        :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
        :type pipeline_id: str
        """
    return os.path.join(RESOURCES_LOCATION, TEMP_LOCATION, pipeline_id, path)


def get_memory_path(path: str, name: str, job_name: str):
    """Erstellt einen Absoluten Pfad zu der übergebene Ressource in den Memory Ordner.

    :param path: Pfad zur Ressource, relativ zum `resources/memory` Ordner.
    :param job_name: Job Name, von der die Funktion aufgerufen wurde.
    """
    return get_resource_path(os.path.join(MEMORY_LOCATION, job_name, name, path))


def get_specific_memory_path(job_name: str, name: str, number: int):
    """Erstellt einen Absoluten Pfad zu der memory datei im übergebenen Ordner.

    :param job_name: Job Name, von der die Funktion aufgerufen wurde.
    :param name: Name des dicts das exportiert wurde
    :param number: Angabe welche Datei ausgewählt werden soll 0= zuletz erstellt, 1 = Zweit zuletzt erstellt etc.
    """
    files = os.listdir(get_resource_path(os.path.join(MEMORY_LOCATION, job_name, name)))
    files.sort(reverse=True)
    return get_resource_path(os.path.join(MEMORY_LOCATION, job_name, name, files[number]))


def new_temp_resource_path(pipeline_id: str, extension):
    """Erstellt einen Absoluten Pfad für eine neue resource.

    Generiert einen neuen Namen mit Aktuellem Zeitstempel.
    Verwendet um den pfad zu generieren :func:`get_temp_resource_path` mit dem ordner der `pipeline_id`.

    :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
    :type pipeline_id: str
    :param extension: Dateierweiterung ohne `.`.
    :type extension: str
    """
    return get_temp_resource_path(f"{datetime.now().strftime('%Y-%m-%d_%H-%M.%S.%f')}.{extension}", pipeline_id)


def new_memory_resource_path(job_name: str, name: str):
    """Erstellt einen Absoluten Pfad für eine neue memory resource.

    Generiert einen neuen Namen mit aktuellem Zeitstempel.
    Verwendet um den pfad zu generieren :func:`get_memory_path` mit dem ordner des `job_name`.

   :param job_name: Job Name, von der die Funktion aufgerufen wurde.
   :param name: Name der Datei (ohne datum)
    """
    os.makedirs(get_memory_path("", name, job_name), exist_ok=True)
    return get_memory_path(f"{datetime.now().strftime('%Y-%m-%d')}.json", name, job_name)


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


def open_memory_resource(job_name: str, name: str, time_delta, mode: str = "rt"):
    """Öffnet die übergebene Memory Ressource.

    :param time_delta: Tage die abgezogen werden sollen vom heutigem Tage zum öffnen der richtigen Ressource
    :param job_name: Job Name, von der die Funktion aufgerufen wurde.
    :param name: Name der Datei (ohne datum)
    :param mode: Mode zum Öffnen der Datei siehe :func:`open`.

    """
    res_name = (datetime.now() - timedelta(time_delta)).strftime('%Y-%m-%d') + ".json"
    return open_resource(os.path.join(MEMORY_LOCATION, job_name, name, res_name), mode)


def open_specific_memory_resource(job_name: str, name: str, number: int = 1, mode: str = "rt"):
    """Öffnet die angegebene Memory Ressource.

    :param job_name: Job Name, von der die Funktion aufgerufen wurde.
    :param name: Name des dicts das exportiert wurde
    :param number: Angabe welche Datei ausgewählt werden soll 0= zuletz erstellt, 1 = Zweit zuletzt erstellt etc.
    :param mode: Mode zum Öffnen der Datei siehe :func:`open`.

    """
    return open_resource(get_specific_memory_path(job_name, name, number - 1), mode)


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


def get_out_path(time, out_path, job_name, format=".mp4", thumbnail=False):
    """
    Liefert die aktuelle Uhrzeit in Form eines String zurück

    :param out_path: Path an dem das Video abgelegt werden soll
    :type out_path: str
    :param job_name: Eine Beschreibung des Jobs der gerade ausgeführt wird
    :type job_name: str
    :param format: Format in das gespeichert werden soll
    :type format: str
    :param thumbnail: Ob es sich um ein Thumbnail handelt
    :return: Die aktuelle Uhrzeit für den Dateinamen zum erstellen des Videos
    :rtype: str
    """
    if thumbnail:
        return path_from_root(os.path.join(out_path, f"{job_name}-{time}_thumbnail{format}"))
    return path_from_root(os.path.join(out_path, f"{job_name}-{time}{format}"))
