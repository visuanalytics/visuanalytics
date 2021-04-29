"""Modul, welches Funktionen zur Benutzung von Ressourcen bereitstellt."""
import contextlib
import os
from datetime import datetime, timedelta

ROOT_LOCATION = "../"
"""
Relativer Pfad zur root-Location.
"""

RESOURCES_LOCATION = "resources"
"""
Pfad zum Ordner "resources" .
Wird beim Starten mit dem Wert aus der Konfigurationsdatei initialisiert.
"""

IMAGES_LOCATION = "images"
"""
Name des Bilderordners.
Wird beim Starten mit dem Wert aus der Konfigurationsdatei initialisiert.
"""

AUDIO_LOCATION = "audio"
"""
Name des Audioordners.
Wird beim Starten mit dem Wert aus der Konfigurationsdatei initialisiert.
"""

TEMP_LOCATION = "temp"
""" 
Name des Ordners für temporäre Dateien.
Wird beim Starten mit dem Wert aus der Konfigurationsdatei initialisiert.
"""

MEMORY_LOCATION = "memory"
"""
Name des Ordner für Memory-Dateien. Dient zum Abspeichern von vorherigen Berechnungen.
Wird beim Starten mit dem Wert aus der Konfigurationsdatei initialisiert.
"""

INFOPROVIDER_LOCATION = "infoprovider"
"""
Enthält den Pfad zu den Infoprovidern.
Dieser Pfad wird bei Start des Servers in `init.py` durch den Pfad in der `config.json` überschrieben.
"""

DATE_FORMAT = '%Y-%m-%d_%H-%M.%S'
"""
Datums- und Zeitformat in welchem die Dateien abgespeichert werden.
"""


def get_current_time():
    """
    Gibt die aktuelle Uhrzeit in Form eines Strings zurück.
    :return: Uhrzeit
    """
    return datetime.now().strftime(DATE_FORMAT)


def path_from_root(path):
    """
    Erstellt einen Pfad relativ zum root-Ordner (visuanalytics).

    :param path: relativer Pfad
    :return: absoluter Pfad zu root/path
    """
    return os.path.normpath(os.path.join(os.path.dirname(__file__), ROOT_LOCATION, path))


def get_resource_path(path: str):
    """Erstellt einen absoluten Pfad zu der übergebenen Ressource.

    Erstellt den Pfad aus `RESOURCES_LOCATION` und dem übergebenen Pfad.

    :param path: Pfad zur Ressource, relativ zum `resources`-Ordner.
    :return: Absoluter Pfad zur übergebenen Ressource.
    """
    return path_from_root(os.path.join(RESOURCES_LOCATION, path))


def get_infoprovider_path(path: str):
    """Erstellt einen absoluten Pfad zur übergebenen Infoprovider-Ressource.

    Der Pfad wird dabei aus `RESOURCES_LOCATION`, `INFOPROVIDER_LOCATION` und dem übergebenen Pfad erstellt.

    :param path: Pfad zum benötigten Infoprovider, relativ zum `resources/infoprovider`-Ordner.
    :return: Absoluter Pfad zum übergebenen Infoprovider.
    """
    return get_resource_path(os.path.join(INFOPROVIDER_LOCATION, path))


def get_image_path(path: str):
    """Erstellt einen absoluten Pfad zu der übergebenen Image-Ressource.

    Erstellt den Pfad aus `RESOURCES_LOCATION`, `IMAGE_LOCATION` und dem übergebenen Pfad.

    :param path: Pfad zur Ressource, relativ zum `resources/images`-Ordner.
    :return: Absoluter Pfad zur übergebenen Ressource.
    """
    return get_resource_path(os.path.join(IMAGES_LOCATION, path))


def get_audio_path(path: str):
    """Erstellt einen absoluten Pfad zu der übergebenen Audio-Ressource.

    Erstellt den Pfad aus `RESOURCES_LOCATION`, `AUDIO_LOCATION` und dem übergebenen Pfad.

    :param path: Pfad zur Ressource, relativ zum `resources/audio`-Ordner.
    :return: Absoluter Pfad zur übergebenen Ressource.
    """
    return get_resource_path(os.path.join(AUDIO_LOCATION, path))


def get_temp_resource_path(path: str, pipeline_id: str):
    """Erstellt einen absoluten Pfad zu der übergebene Ressource im Temp-Ordner.

    :param path: Pfad zur Ressource, relativ zum `resources/temp`-Ordner.
    :param pipeline_id: id der Pipeline von der die Funktion aufgerufen wurde.
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
    """Erstellt einen absoluten Pfad zu der übergebenen Ressource im Memory-Ordner.

    :param path: Pfad zur Ressource, relativ zum `resources/memory`-Ordner.
    :param job_name: Name des Jobs von der die Funktion aufgerufen wurde.
    """
    return get_resource_path(os.path.join(MEMORY_LOCATION, job_name, name, path))


def get_specific_memory_path(job_name: str, name: str, number: int, skip: bool):
    """Erstellt einen absoluten Pfad zu der Memory-Datei im übergebenen Ordner.

    :param job_name: Name des Jobs von der die Funktion aufgerufen wurde.
    :param name: Name des Dictionaries, das exportiert wurde.
    :param number: Angabe, welche Datei ausgewählt werden soll (0= zuletzt erstellt, 1 = als vorletztes erstellt etc.)
    """
    files = os.listdir(get_resource_path(os.path.join(MEMORY_LOCATION, job_name, name)))
    files.sort(reverse=True)
    if skip:
        now = datetime.now()
        if files[0] == now.strftime("%Y-%m-%d.json"):
            number += 1
    return get_resource_path(os.path.join(MEMORY_LOCATION, job_name, name, files[number]))


def new_temp_resource_path(pipeline_id: str, extension):
    """Erstellt einen absoluten Pfad für eine neue Resource.

    Generiert einen neuen Namen mit aktuellem Zeitstempel.
    Verwendet um den Pfad zu generieren :func:`get_temp_resource_path` mit dem Ordner der `pipeline_id`.

    :param pipeline_id: id der Pipeline von der die Funktion aufgerufen wurde.
    :type pipeline_id: str
    :param extension: Dateierweiterung ohne `.`
    :type extension: str
    """
    return get_temp_resource_path(f"{datetime.now().strftime('%Y-%m-%d_%H-%M.%S.%f')}.{extension}", pipeline_id)


def new_memory_resource_path(job_name: str, name: str):
    """Erstellt einen absoluten Pfad für eine neue Memory-Resource.

    Generiert einen neuen Namen mit aktuellem Zeitstempel.
    Verwendet um den Pfad zu generieren :func:`get_memory_path` mit dem Ordner des `job_name`.

   :param job_name: Name des Jobs von der die Funktion aufgerufen wurde.
   :param name: Name der Datei (ohne Datum)
    """
    os.makedirs(get_memory_path("", name, job_name), exist_ok=True)
    return get_memory_path(f"{datetime.now().strftime('%Y-%m-%d')}.json", name, job_name)


def open_resource(path: str, mode: str = "rt"):
    """Öffnet die übergebene Ressource.

    Verwendet :func:`get_resource_path`, um den Pfad der Ressource zu bekommen.
    Ist die Datei oder darüber liegende Ordner nicht vorhanden, werden diese erstellt.

    :param path: Pfad zur Resource, relativ zum `resources`-Ordner.
    :param mode: Mode zum Öffnen der Datei siehe :func:`open`.

    :return: Die geöffnete Datei (siehe :func:`open`).

    :raises: OSError
    """
    res_path = get_resource_path(path)
    os.makedirs(os.path.dirname(res_path), exist_ok=True)

    return open(res_path, mode, encoding='utf-8')


def open_infoprovider_resource(path: str, mode: str = "rt"):
    """Gibt einen geöffneten Infoprovider zurück.

    Sollte die Datei oder ein zu dieser Datei führender Ordner fehlen, so werden diese erstellt.

    :param path: Pfad der zu öffnenden Datei.
    :param mode: Der Modus, mit welcher die Datei geöffnet wird. Für eine nähere Information siehe :func:`open`

    :return: Die geöffnete Datei.

    :raises: OSError
    """
    res_path = get_infoprovider_path(path)
    os.makedirs(os.path.dirname(res_path), exist_ok=True)
    return open(res_path, mode, encoding='utf-8')


def open_temp_resource(path: str, pipeline_id: str, mode: str = "rt"):
    """Öffnet die übergebene Temp-Ressource.

    Verwendet :func:`get_temp_resource_path`

    :param pipeline_id: id der Pipeline von der die Funktion aufgerufen wurde.
    :param path: Pfad zur Resource, relativ zum `resources`-Ordner.
    :param mode: Mode zum Öffnen der Datei siehe :func:`open`.

    """
    return open_resource(os.path.join(TEMP_LOCATION, pipeline_id, path), mode)


def open_memory_resource(job_name: str, name: str, time_delta, mode: str = "rt"):
    """Öffnet die übergebene Memory-Ressource.

    :param time_delta: Tage, die abgezogen werden sollen vom heutigen Tag. Zum Öffnen der richtigen Ressource.
    :param job_name: Name des Jobs von der die Funktion aufgerufen wurde.
    :param name: Name der Datei (ohne Datum).
    :param mode: Mode zum Öffnen der Datei siehe :func:`open`.

    """
    res_name = (datetime.now() - timedelta(time_delta)).strftime('%Y-%m-%d') + ".json"
    return open_resource(os.path.join(MEMORY_LOCATION, job_name, name, res_name), mode)


def open_specific_memory_resource(job_name: str, name: str, skip, number: int = 1, mode: str = "rt"):
    """Öffnet die angegebene Memory-Ressource.

    :param job_name: Name des Jobs von der die Funktion aufgerufen wurde.
    :param name: Name des Dictionaries, das exportiert wurde.
    :param number: Angabe, welche Datei ausgewählt werden soll (0= zuletz erstellt, 1 = als vorletztes erstellt etc.)
    :param mode: Mode zum Öffnen der Datei siehe :func:`open`.

    """
    return open_resource(get_specific_memory_path(job_name, name, number - 1, skip), mode)


def delete_infoprovider_resource(path: str):
    """Löscht den übergebenen Infoprovider aus dem resources-Ordner.

    Dabei wird :func:`get_infoprovider_path` verwendet, um die richtige Ressource zu finden.

    Sollte der Infoprovider nicht vorhanden sein, so wird der Löschversuch ignoriert. Wird hingegen versucht einen Ordner zu löschen, so wirft dies einen Fehler.

    :param path: Infoprovider, welcher gelöscht werden soll, relativ zu `resources/infoprovider`

    :raises: OSError
    """

    with contextlib.suppress(FileNotFoundError):
        os.remove(get_infoprovider_path(path))

def delete_resource(path: str):
    """Löscht die übergebene Ressource.

    Verwendet :func:`get_resource_path`, um den Pfad der Ressource zu bekommen.
    Ist die Ressource nicht vorhanden, wird das ignoriert.
    Ist der angegebene Pfad allerdings ein Ordner, wird ein Fehler geworfen.

    :param path: Pfad zur Ressource, relativ zum `resources`-Ordner.

    :raises: OSError
    """
    with contextlib.suppress(FileNotFoundError):
        os.remove(get_resource_path(path))


def get_out_path(time, out_path, job_name, format=".mp4", thumbnail=False):
    """
    Gibt die aktuelle Uhrzeit in Form eines String zurück.

    :param out_path: Pfad, an dem das Video abgelegt werden soll.
    :type out_path: str
    :param job_name: Eine Beschreibung des Jobs, der gerade ausgeführt wird.
    :type job_name: str
    :param format: Format in welchem gespeichert werden soll.
    :type format: str
    :param thumbnail: Ob es sich um einen Thumbnail handelt.
    :return: Die aktuelle Uhrzeit für den Dateinamen (zum Erstellen des Videos).
    :rtype: str
    """
    if thumbnail:
        return path_from_root(os.path.join(out_path, f"{job_name}-{time}_thumbnail{format}"))
    return path_from_root(os.path.join(out_path, f"{job_name}-{time}{format}"))
