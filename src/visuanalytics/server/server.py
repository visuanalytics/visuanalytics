""" Flask Server Module.

Enthält die Startkonfiguration für den Flask-Server.

"""
from flask import Flask

from visuanalytics.server.api import api
from visuanalytics.server.home import home_views


def create_app():
    """Erstellt die Flask server instance.

    Initialisiert die Server Konfiguration und registriert alle Endpunkte.
    Wenn eine 'config.py' Datei im 'instaances' Ordner existiert, wird diese Konfiguration benutzt.

     Returns:
         Flask: Eine Instanz des Servers.
    """

    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev'
    )

    # load the instance config, if it exists
    app.config.from_pyfile('config.py', silent=True)

    # Register the Blueprints
    api.register_all(app)
    app.register_blueprint(home_views.home_bp, url_prefix="/")

    return app