""" Flask Server Module.

Enthält die Startkonfiguration für den Flask-Server.
"""
import mimetypes

from flask import Flask, render_template

from visuanalytics.server.api import api
from visuanalytics.server.db import db


def create_app():
    """Erstellt die Flask server instance.

    Initialisiert die Server Konfiguration und registriert alle Endpunkte.
    Wenn eine `config.py` Datei im `instaances` Ordner existiert, wird diese Konfiguration benutzt.

    :return: Eine Instanz des Servers.
    :rtype: Flask
    """

    # create
    app = Flask(__name__, instance_relative_config=True, static_url_path="/")

    # configure the app
    app.config.from_mapping(
        SECRET_KEY='dev'
    )

    # load the instance config, if it exists
    app.config.from_pyfile('config.py', silent=True)

    db.init_db(app)

    # add js as mmetype to ensure that the content-type is correct for js files
    mimetypes.add_type("text/javascript", ".js")

    # Register the Blueprints
    api.register_all(app)

    # Serve index.html
    @app.route('/')
    def index():
        return render_template("index.html")

    return app
