"""Api base file.

Contains Functions to Register all Api sub Routes the same.

"""
from flask import Flask

from visuanalytics.server.api import api_test

API_BASE_URL = "/api/v1"


def register_all(app:Flask):
    """Register all Api Blueprints with the `API_BASE_URL`.

    Args:
        app(Flask): the Flask app instance.
    """
    app.register_blueprint(api_test.bp, url_prefix=f"{API_BASE_URL}/test")