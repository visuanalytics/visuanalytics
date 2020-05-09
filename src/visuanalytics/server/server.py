""" Flask Main Server File.

Holds the start Configuration for the Flask server.

"""
from flask import Flask

from visuanalytics.server.api import api
from visuanalytics.server.home import home_views


def create_app():
    """Create the Flask server instance.

     Initialise the Flask server Config and Register all Blueprints.
     If a config.py file exists in the `instances` folder, its configuration is used.

     Returns:
         Flask: the Flask server instance.
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