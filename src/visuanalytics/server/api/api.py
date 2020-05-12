"""Grundfunktionen für alle API Requests.

Enthält Funktionen, um alle API Endpunkte mit gleichen Einstellungen beim Server zu registrieren.
"""
from flask import Flask

from visuanalytics.server.api import api_test

API_BASE_URL = "/api/v1"
"""Base URL der API"""


def register_all(app: Flask):
    """Registriert alle Api Blueprints bei der `API_BASE_URL`.

    :param app: Eine Flask Server Instanz.
    :type app: Flask
    """
    app.register_blueprint(api_test.bp, url_prefix=f"{API_BASE_URL}/test")
