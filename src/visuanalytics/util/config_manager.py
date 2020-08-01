"""Dieses Modul stellt Methoden für den Zugriff auf private sowie öffentliche Konfigurationsparameter bereit. """

import json
import os
from json import JSONDecodeError

from visuanalytics.util.dict_utils import merge_dict

CONFIG_LOCATION = "../config.json"
CONFIG_PRIVATE_LOCATION = "../instance/config.json"


def _get_config_path(config_location):
    return os.path.normpath(os.path.join(os.path.dirname(__file__), config_location))


def get_config():
    """
    Ermöglicht den Zugriff auf die Konfigurations Dateien.
    Verwendet zuerst die Config datei in `CONFIG_LOCATION`,
    ist auch eine Config datei  in `CONFIG_PRIVATE_LOCATION` vorhanden
    werden beide configurationen verwendet, bei dopplungen werden die einstellungen
    aus `CONFIG_PRIVATE_LOACTION` verwendet.
    Der key `api_keys` wird von `CONFIG_PRIVATE_LOCATION` entfernt.

    :return: Die Konfigurationsdateien in form eines Dictionaries.
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
        e.strerror = "Public Configuration file does not exist"
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
        => gibt den API-Key auf der Konsole aus
    """
    try:
        with open(os.path.normpath(os.path.join(os.path.dirname(__file__), CONFIG_PRIVATE_LOCATION))) as fh:
            return json.loads(fh.read())
    except FileNotFoundError as e:
        e.strerror = "Private configuration file does not exist"
        raise e
