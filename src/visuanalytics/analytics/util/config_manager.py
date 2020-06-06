"""Dieses Modul stellt Methoden für den Zugriff auf private sowie öffentliche Konfigurationsparameter bereit. """

import json
import os

CONFIG_LOCATION = "../../config.json"
CONFIG_PRIVATE_LOCATION = "../../instance/config.json"


def get_public():
    """
    Ermöglicht den Zugriff auf die öffentliche Konfigurationsdatei.

    :return: Die öffentliche Konfigurationsdatei in Form eines Dictionaries.
    :rtype: dict

    :raises:
        FileNotFoundError: Wenn die öffentliche Konfigurationsdatei nicht existiert.
    """
    try:
        with open(os.path.normpath(os.path.join(os.path.dirname(__file__), CONFIG_LOCATION))) as fh:
            return json.loads(fh.read())
    except FileNotFoundError as e:
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
        => gibt den API-Key auf der Konsole aus
    """
    try:
        with open(os.path.normpath(os.path.join(os.path.dirname(__file__), CONFIG_PRIVATE_LOCATION))) as fh:
            return json.loads(fh.read())
    except FileNotFoundError as e:
        e.strerror = "Private configuration file does not exist"
        raise e
