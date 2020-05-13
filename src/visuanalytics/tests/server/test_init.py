"""Enthält Initialisierungsfunktionen für Flask Server Testmodule."""
from visuanalytics.server import server


def setup_client():
    """Flask Server Testclient einrichten.

    erstellt, eine neue Flask Server Instanz,
    konfiguriert diese zum Testen und erstellten einen Test Client.

    :return: einen Server Test Client.
    :rtype: FlaskClient
    """
    server_instance = server.create_app()
    server_instance.config["Testing"] = True
    server_instance.config['DEBUG'] = False

    return server_instance.test_client()
