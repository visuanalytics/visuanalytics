""" Flask Server Module.

Enthält die Startkonfiguration für den Flask-Server.
"""
import mimetypes

from flask import Flask, render_template, abort
from jinja2 import TemplateNotFound

from visuanalytics.analytics.control.scheduler.DbScheduler import DbScheduler
from visuanalytics.server.api import api
from visuanalytics.util import config_manager
from visuanalytics.util.init import init


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

    start_backend()

    # add js as mmetype to ensure that the content-type is correct for js files
    mimetypes.add_type("text/javascript", ".js")

    # Register the Blueprints
    app.register_blueprint(api.api, url_prefix="/visuanalytics")

    # Serve index.html
    @app.route("/", methods=["GET"])
    def index():
        try:
            return render_template("index.html")
        except TemplateNotFound:
            abort(404)

    return app


def start_backend():
    # Start Scheduler and init Programm
    config = config_manager.get_config()

    # Ensure that console_mode is false
    config["console_mode"] = False

    init(config)

    DbScheduler(config["steps_base_config"]).start_unblocking()
