""" Flask Server Module.

Enthält die Startkonfiguration für den Flask-Server.
"""
import os

from flask import Flask

from visuanalytics.server.api import api
from visuanalytics.server.db import db
from visuanalytics.server.home import home_views


def create_app():
    """Erstellt die Flask server instance.

    Initialisiert die Server Konfiguration und registriert alle Endpunkte.
    Wenn eine `config.py` Datei im `instaances` Ordner existiert, wird diese Konfiguration benutzt.

    :return: Eine Instanz des Servers.
    :rtype: Flask
    """

    # create
    app = Flask(__name__, instance_relative_config=True)

    # set the right instance folder
    app.instance_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../instance"))

    # configure the app
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'visuanalytics.db')
    )

    # load the instance config, if it exists
    app.config.from_pyfile('config.py', silent=True)

    db.init_db(app)

    # Register the Blueprints
    api.register_all(app)
    app.register_blueprint(home_views.home_bp, url_prefix="/")

    return app
