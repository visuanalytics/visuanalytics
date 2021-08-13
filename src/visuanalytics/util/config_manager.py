"""Dieses Modul stellt Methoden für den Zugriff auf private sowie öffentliche Konfigurationsparameter bereit. """

import json
import os
from json import JSONDecodeError

from visuanalytics.util.dict_utils import merge_dict

CONFIG_LOCATION = "../config.json"
CONFIG_PRIVATE_LOCATION = "../instance/config.json"
STEPS_BASE_CONFIG = {}


def _get_config_path(config_location):
    return os.path.normpath(os.path.join(os.path.dirname(__file__), config_location))


def get_config():
    """
    Ermöglicht den Zugriff auf die Konfigurationsdateien.
    Verwendet zuerst die Konfigurationsdatei in `CONFIG_LOCATION`.
    Ist auch eine Konfigurationsdatei in `CONFIG_PRIVATE_LOCATION` vorhanden,
    werden beide Konfigurationen verwendet, bei Doppelungen werden die Einstellungen
    aus `CONFIG_PRIVATE_LOACTION` verwendet.
    Der Key `api_keys` wird von `CONFIG_PRIVATE_LOCATION` entfernt.

    :return: Die Konfigurationsdateien in Form eines Dictionaries.
    :rtype: dict
    """

    private_config = {}

    try:
        with open(_get_config_path(CONFIG_LOCATION)) as fh:
            public_config = json.loads(fh.read())

        # if exists get private config
        if os.path.exists(_get_config_path(CONFIG_PRIVATE_LOCATION)):
            with open(_get_config_path(CONFIG_PRIVATE_LOCATION)) as fh:
                private_config = json.loads(fh.read())
                private_config.pop("api_keys", "")

        merge_dict(public_config, private_config)

        return public_config

    except (FileNotFoundError, JSONDecodeError) as e:
        e.strerror = "Public configuration file does not exist"
        raise e


def get_private():
    """
    Ermöglicht den Zugriff auf die private Konfigurationsdatei.

    :return: Die private Konfigurationsdatei in Form eines Dictionaries.
    :rtype: dict

    :raises:
        FileNotFoundError: Wenn die private Konfigurationsdatei nicht existiert.

    Example:
      config = config_manager.get_private()
      print(config["api_keys"]["weatherbit"])
        => Gibt den API-Key auf der Konsole aus.
    """
    try:
        with open(os.path.normpath(os.path.join(os.path.dirname(__file__), CONFIG_PRIVATE_LOCATION))) as fh:
            return json.loads(fh.read())
    except FileNotFoundError as e:
        e.strerror = "Private configuration file does not exist"
        raise e


def set_private(new_config):
    """
    Setzt den Inhalt der privaten Konfigurationsdatei auf das übergeben Json-Objekt.

    :param new_config: Inhalt der neuen Konfigurationsdatei als Json-Objekt.
    :raises: FileNotFoundError: Wenn die private Konfigurationsdatei nicht existiert.
    """
    try:
        with open(os.path.normpath(os.path.join(os.path.dirname(__file__), CONFIG_PRIVATE_LOCATION)), "w") as fh:
            json.dump(new_config, fh)
    except FileNotFoundError as e:
        e.strerror = "Private configuration file does not exist"
        raise e


def assert_private_exists():
    """
    Generiert die private Konfigurationsdatei falls sie nicht vorhanden ist.
    """
    config_content = {
        "api_keys": {},
        "steps_base_config": {
            "output_path": "out",
            "testing": False,
            "h264_nvenc": False
        },
        "testing": True,
        "console_mode": False
    }
    path = os.path.normpath(os.path.join(os.path.dirname(__file__), CONFIG_PRIVATE_LOCATION))
    if not os.path.isfile(path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w") as f:
            json.dump(config_content, f)
