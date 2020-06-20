""" Flask Server Module.

Enthält die Startkonfiguration für den Flask-Server.
"""
import mimetypes

from flask import Flask, render_template, request

from visuanalytics.server.api import api


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

    # TODO start control main

    # add js as mmetype to ensure that the content-type is correct for js files
    mimetypes.add_type("text/javascript", ".js")

    # Register the Blueprints
    api.register_all(app)

    # Serve index.html
    @app.route("/", methods=["GET"])
    def index():
        return render_template("index.html")

    # Serve topic list
    @app.route("/topics", methods=["GET"])
    def topics():
        return "topic list"
        # TODO retrieve actual topic list

    # Serve parameter information for a given topic
    # GET-Parameter: "topic"
    @app.route("/params", methods=["GET"])
    def params():
        topic = request.args.get("topic")
        return "params for topic: " + topic
        # TODO: retrieve actual parameter list

    # Serve job list
    @app.route("/jobs", methods=["GET"])
    def jobs():
        return "jobs"
        # TODO: retrieve actual job list

    # Add job
    @app.route("/add", methods=["POST"])
    def add():
        job = request.json
        # TODO: add data base entry for the new job

    # Edit job
    @app.route("/edit", methods=["POST"])
    def edit():
        job = request.json
        return "edit"
        # TODO: update data base entry with the given job id

    # Remove job
    @app.route("/remove", methods=["POST"])
    def remove():
        job = request.json
        # TODO: remove job from data base

    return app
