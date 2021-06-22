"""
Enthält die API-Endpunkte.
"""

import flask
import logging

from flask import (Blueprint, request, send_file, send_from_directory)
from werkzeug.utils import secure_filename
from os import path

from visuanalytics.server.db import db, queries

from visuanalytics.analytics.processing.image.matplotlib.diagram import generate_test_diagram
from visuanalytics.util.resources import TEMP_LOCATION, get_resource_path
from visuanalytics.util.config_manager import get_private, set_private

from ast2json import str2json
from base64 import b64encode
from visuanalytics.analytics.apis.checkapi import check_api

logger = logging.getLogger()

api = Blueprint('api', __name__)


@api.teardown_app_request
def close_db_con(exception):
    db.close_con_f()


@api.route("/infprovtestdatensatz", methods=["GET"])
def infprovtestdatensatz():
    # Muss noch angepasst werden
    last_id = queries.get_last_infoprovider_id()
    infoprovider = {
        "infoprovider_name": "Test" + str(last_id),
        "datasources": [
            {
                "datasource_name": "wetter_api",
                "api": {
                    "api_info": {
                        "type": "request",
                        "api_key_name": "appid||e2fda2d8f176a37636832ca955377714",
                        "url_pattern": "http://api.openweathermap.org/data/2.5/weather?q=berlin"
                    },
                    "method": "KeyInQuery",
                    "response_type": "json"
                },
                "transform": [
                    {
                        "type": "select",
                        "relevant_keys": [
                            "_req|wetter_api|main|temp",
                            "_req|wetter_api|main|feels_like",
                            "_req|wetter_api|main|temp_min",
                            "_req|wetter_api|main|temp_max"
                        ]
                    },
                    {
                        "type": "transform_dict",
                        "dict_key": "_req|wetter_api|main",
                        "transform": [
                            {
                                "type": "append",
                                "keys": [
                                    "_loop"
                                ],
                                "new_keys": [
                                    "test"
                                ],
                                "append_type": "list"
                            }
                        ]
                    }
                ],
                "storing": [
                    {
                        "name": "test",
                        "key": "test"
                    }
                ],
                "formulas": [
                    {
                        "formelName": "A",
                        "formelString": "( _req|wetter_api|main|temp * 24 ) / 7"
                    }
                ],
                "schedule": {
                    "type": "daily",
                    "time": "15:24"
                }
            },
            {
                "datasource_name": "joke_api",
                "api": {
                    "api_info": {
                        "type": "request",
                        "api_key_name": "",
                        "url_pattern": "https://official-joke-api.appspot.com/jokes/ten"
                    },
                    "method": "noAuth",
                    "response_type": "json"
                },
                "transform": [
                    {
                        "type": "select",
                        "relevant_keys": [
                            "_req|joke_api"
                        ]
                    }
                ],
                "storing": [
                    {
                        "name": "jokes",
                        "key": "_req|joke_api"
                    }
                ],
                "schedule": {
                    "type": "weekly",
                    "time": "10:09",
                    "weekdays": [0, 5]
                },
                "formulas": []
            }
        ],
        "diagrams": {
            "test": {
                "type": "diagram_custom",
                "diagram_config": {
                    "type": "custom",
                    "name": "Jokes",
                    "infoprovider": "jokes_test",
                    "source_type": "Array",
                    "plots": [
                        {
                            "custom_labels": False,
                            "primitive": False,
                            "plot": {
                                "type": "line",
                                "y": "{_req|api}",
                                "numeric_attribute": "id",
                                "string_attribute": "punchline"
                            }
                        }
                    ]
                }
            }
        },
        "diagrams_original": {},
        "arrays_used_in_diagrams": []
    }
    queries.insert_infoprovider(infoprovider)
    last_id = queries.get_last_infoprovider_id()
    infoprovider["infoprovider_name"] = "Test" + str(last_id)
    queries.insert_infoprovider(infoprovider)
    last_id += 1
    infoprovider["infoprovider_name"] = "Test" + str(last_id)
    queries.insert_infoprovider(infoprovider)
    last_id += 1
    infoprovider["infoprovider_name"] = "Test" + str(last_id)
    queries.insert_infoprovider(infoprovider)
    return "", 200


@api.route("/testdiagram", methods=["POST"])
def test_diagram():
    """
    Erzeugt ein Testbild mit Zufallswerten zu einem Diagramm.

    Die Response enthält das Bild als BLOB-File.
    """
    diagram_info = request.json
    try:
        file_path = generate_test_diagram(diagram_info)

        return send_file(file_path, "application/json", True)
        # return send_from_directory(get_resource_path(TEMP_LOCATION), filename="test_diagram.png")
        # return file_path, 200
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while generating a test-diagram"})
        return err, 400


@api.route("/checkapi", methods=["POST"])
def checkapi():
    """
    Endpunkt `/checkapi`.

    Übermitteltes JSON enthält die API-Daten in dem Format:
    {   'url': '<url + query>',
        'api_key': '<api-key falls einer gegeben ist>',
        'has_key': <true falls ein api-key gegeben ist>
    }

    Die Response enthält alle Keys die bei der gegebenen API abgefragt werden können
    """
    api_info = request.json
    try:
        if "api_info" not in api_info:
            err = flask.jsonify({"err_msg": "Missing field 'api'"})
            return err, 400

        if "api_key_name" not in api_info["api_info"]:
            err = flask.jsonify({"err_msg": "Missing API-Key"})
            return err, 400

        if "url_pattern" not in api_info["api_info"]:
            err = flask.jsonify({"err_msg": "Missing URL"})
            return err, 400

        if "method" not in api_info:
            err = flask.jsonify({"err_msg": "Missing Field 'method'"})
            return err, 400

        if "response_type" not in api_info:
            err = flask.jsonify({"err_msg": "Missing field 'response_type'"})
            return err, 400

        header, parameter = queries.generate_request_dicts(api_info["api_info"], api_info["method"])

        url, params = queries.update_url_pattern(api_info["api_info"]["url_pattern"])
        parameter.update(params)
        req_data = {
            "method": api_info["api_info"].get("method", "get"),
            "url": url,
            "headers": header,
            "params": parameter,
            "response_type": api_info["response_type"]
        }

        keys, success = check_api(req_data)

        return flask.jsonify({"status": 0, "api_keys": keys}) if success else flask.jsonify({"status": 1, "api_keys": keys})

    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while checking a new api"})
        return err, 400


@api.route("/infoprovider", methods=["POST"])
def add_infoprovider():
    """
    Endpunkt `/infoprovider`.

    Route zum Hinzufügen eines Infoproviders.
    """
    infoprovider = request.json
    try:
        if "infoprovider_name" not in infoprovider:
            err = flask.jsonify({"err_msg": "Missing Infoprovider-Name"})
            return err, 400

        if "datasources" not in infoprovider:
            err = flask.jsonify({"err_msg": "Missing Datasources"})
            return err, 400

        if "diagrams" not in infoprovider:
            err = flask.jsonify({"err_msg": "Missing field 'diagrams'"})
            return err, 400

        if "diagrams_original" not in infoprovider:
            err = flask.jsonify({"err_msg": "Missing field 'diagrams_original'"})
            return err, 400

        for datasource in infoprovider["datasources"]:
            if "datasource_name" not in datasource:
                err = flask.jsonify({"err_msg": "Missing field 'datasource_name' in a datasource"})
                return err, 400

            if "api" not in datasource:
                err = flask.jsonify({f"err_msg": f"Missing field 'api' in datasource {datasource['name']}"})
                return err, 400

            if "transform" not in datasource:
                err = flask.jsonify({f"err_msg": f"Missing field 'api' in datasource {datasource['name']}"})
                return err, 400

            if "storing" not in datasource:
                err = flask.jsonify({f"err_msg": f"Missing field 'api' in datasource {datasource['name']}"})
                return err, 400

            if "formulas" not in datasource:
                err = flask.jsonify({f"err_msg": f"Missing field 'api' in datasource {datasource['name']}"})
                return err, 400

            if "schedule" not in datasource:
                err = flask.jsonify({f"err_msg": f"Missing field schedule for datasource {datasource['name']}"})
                return err, 400

        if not queries.insert_infoprovider(infoprovider):
            err = flask.jsonify({"err_msg": f"There already exists an infoprovider with the name "
                                            f"{infoprovider['infoprovider_name']}"})
            return err, 400

        return "", 204
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while adding an infoprovider"})
        return err, 400


@api.route("/videojob", methods=["POST"])
def add_videojob():
    """
    Endpunkt `/videojob`.

    Route zum Hinzufügen eines Video-Jobs.
    """
    video = request.json
    try:
        if "name" not in video:
            err = flask.jsonify({"err_msg": "Missing Name"})
            return err, 400

        if "infoprovider_names" not in video:
            err = flask.jsonify({"err_msg": "Missing Infoprovider-Names"})
            return err, 400

        if "images" not in video:
            err = flask.jsonify({"err_msg": "Missing Images"})
            return err, 400

        if "audio" not in video:
            err = flask.jsonify({"err_msg": "Missing Audio"})
            return err, 400

        if "sequence" not in video:
            err = flask.jsonify({"err_msg": "Missing Sequence"})
            return err, 400

        if "schedule" not in video:
            err = flask.jsonify({"err_msg": "Missing Schedule"})
            return err, 400

        if not queries.insert_video_job(video):
            err = flask.jsonify({"err_msg": f"There already exists a video with the name "
                                            f"{video['video_name']}"})
            return err, 400

        return "", 204
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while adding an video"})
        return err, 400


@api.route("/infoprovider/schedules", methods=["GET"])
def show_schedule():
    """
    Endpunkt '/infoprovider/schedules'.

    Response enthält eine Liste von Einträgen aus der Tabelle "schedule_historisation".
    Jeder Eintrag enthält die Keys schedule_historisation_id und den Typ des Schedules.
    """
    try:
        return flask.jsonify(queries.show_schedule())
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while loading all infoproviders"})
        return err, 400


@api.route("/infoprovider/showweekly", methods=["GET"])
def show_weekly():
    """
    Endpunkt '/infoprovider/showweekly'.

    Response enthält eine Liste von Einträgen aus der Tabelle "schedule_historisation_weekday".
    Jeder Eintrag enthält die Keys schedule_historisation_id, schedule_weekday_historisation_id und weekday.
    """
    try:
        return flask.jsonify(queries.show_weekly())
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while loading all infoproviders"})
        return err, 400


@api.route("/infoprovider/all", methods=["GET"])
def get_all_infoproviders():
    """
    Endpunkt `/infoproviders`.

    Response enthält alle, in der Datenbank enthaltenen, Infoprovider.
    """
    try:
        return flask.jsonify(queries.get_infoprovider_list())
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while loading all infoproviders"})
        return err, 400


@api.route("/infoprovider/<infoprovider_id>", methods=["PUT"])
def update_infoprovider(infoprovider_id):
    """
    Endpunkt `/infoprovider/<infoprovider_id>`.

    Route zum Ändern eines Infoproviders.

    :param infoprovider_id: ID des Infoproviders.
    """
    updated_data = request.json
    try:
        if "infoprovider_name" not in updated_data:
            err = flask.jsonify({"err_msg": "Missing Infoprovider-Name"})
            return err, 400

        if "datasources" not in updated_data:
            err = flask.jsonify({"err_msg": "Missing Datasources"})
            return err, 400

        if "diagrams" not in updated_data:
            err = flask.jsonify({"err_msg": "Missing field 'diagrams'"})
            return err, 400

        for datasource in updated_data["datasources"]:
            if "datasource_name" not in datasource:
                err = flask.jsonify({"err_msg": "Missing field 'name' in a datasource"})
                return err, 400

            if "api" not in datasource:
                err = flask.jsonify({f"err_msg": f"Missing field 'api' in datasource {datasource['name']}"})
                return err, 400

            if "transform" not in datasource:
                err = flask.jsonify({f"err_msg": f"Missing field 'api' in datasource {datasource['name']}"})
                return err, 400

            if "storing" not in datasource:
                err = flask.jsonify({f"err_msg": f"Missing field 'api' in datasource {datasource['name']}"})
                return err, 400

            if "formulas" not in datasource:
                err = flask.jsonify({f"err_msg": f"Missing field 'api' in datasource {datasource['name']}"})
                return err, 400

            if "schedule" not in datasource:
                err = flask.jsonify({f"err_msg": f"Missing field schedule for datasource {datasource['name']}"})
                return err, 400

        update_info = queries.update_infoprovider(infoprovider_id, updated_data)

        if update_info is not None:
            err = flask.jsonify(update_info)
            return err, 400

        return flask.jsonify({"status": "successful"})
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while updating an infoprovider"})
        return err, 400


@api.route("/videojob/<videojob_id>", methods=["PUT"])
def update_videojob(videojob_id):
    """
    Endpunkt `/videojob/<videojob_id>`.

    Route zum Ändern eines Video-Jobs.
    """
    updated_data = request.json
    try:
        if "name" not in updated_data:
            err = flask.jsonify({"err_msg": "Missing Name"})
            return err, 400

        if "infoprovider_names" not in updated_data:
            err = flask.jsonify({"err_msg": "Missing Infoprovider-Names"})
            return err, 400

        if "images" not in updated_data:
            err = flask.jsonify({"err_msg": "Missing Images"})
            return err, 400

        if "audio" not in updated_data:
            err = flask.jsonify({"err_msg": "Missing Audio"})
            return err, 400

        if "sequence" not in updated_data:
            err = flask.jsonify({"err_msg": "Missing Sequence"})
            return err, 400

        if "schedule" not in updated_data:
            err = flask.jsonify({"err_msg": "Missing Schedule"})
            return err, 400

        update_info = queries.insert_video_job(updated_data, update=True, job_id=videojob_id)

        if update_info is not None:
            err = flask.jsonify(update_info)
            return err, 400

        return flask.jsonify({"status": "successful"})
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while updating a videojob"})
        return err, 400


@api.route("/infoprovider/<infoprovider_id>", methods=["GET"])
def get_infoprovider(infoprovider_id):
    """
    Endpunkt `/infoprovider/<infoprovider_id>`.

    Response enthält das Json zum Infoprovider.
    :param infoprovider_id: ID des Infoproviders.
    """
    try:
        infoprovider_json = queries.get_infoprovider(infoprovider_id)

        if infoprovider_json is {}:
            err = flask.jsonify({"err_msg": "Unknown infoprovider"})
            return err, 400

        return flask.jsonify(infoprovider_json)
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while loading an Infoprovider"})
        return err, 400


@api.route("/videojob/<videojob_id>", methods=["GET"])
def get_videojob(videojob_id):
    """
    Endpunkt `/videojob/<videojob_id>`.

    Response enthält das Json zum Videojob.
    :param videojob_id: ID des Videojobs.
    """
    try:
        videojob_json = queries.get_videojob(int(videojob_id))

        if videojob_json is {}:
            err = flask.jsonify({"err_msg": "Unknown videojob"})
            return err, 400

        return flask.jsonify(videojob_json)
        #return videojob_json
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while loading a Videojob"})
        return err, 400


@api.route("/infoprovider/<infoprovider_id>", methods=["DELETE"])
def delete_infoprovider(infoprovider_id):
    """
    Endpunkt `/infoprovider/<infoprovider_id>`.

    Route zum Löschen eines Infoproviders.

    :param infoprovider_id: ID des Infoproviders.
    """
    try:
        return flask.jsonify({"status": "successful"}) if queries.delete_infoprovider(infoprovider_id) else \
            flask.jsonify({"err_msg": f"Infoprovider with ID {infoprovider_id} could not be removed"})
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while removing an infoprovider"})
        return err, 400


@api.route("/videojob/<videojob_id>", methods=["DELETE"])
def delete_videojob(videojob_id):
    """
    Endpunkt `/videojob/<videojob_id>`.

    Route zum Löschen eines Videojobs.

    :param videojob_id: ID des Videojobs.
    """
    try:
        return flask.jsonify({"status": "successful"}) if queries.delete_videojob(int(videojob_id)) else \
            flask.jsonify({"err_msg": f"Videojob with ID {videojob_id} could not be removed"})
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while removing a Videojob"})
        return err, 400


@api.route("/testformula", methods=["POST"])
def testformula():
    """
    Endpunkt `/testformula`.

    Route zum Testen einer gegebenen Formel.
    Die Response enthält einen boolschen Wert welcher angibt ob die Formel syntaktisch richtig ist.
    """
    formula = request.json
    try:
        if "formula" not in formula:
            err = flask.jsonify({"err_msg": "Missing field 'formula'"})
            return err, 400

        str2json(formula["formula"])
        return flask.jsonify({"accepted": True})

    except SyntaxError:
        return flask.jsonify({"accepted": False})

    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while testing a formula"})
        return err, 400


@api.route("/scene", methods=["POST"])
def add_scene():
    """
    Endpunkt '/scene'.

    Route zum Hinzufügen einer neuen Szene.
    """
    scene = request.json
    try:
        if "scene_name" not in scene:
            err = flask.jsonify({"err_msg": "Missing Scene-Name"})
            return err, 400

        if "used_images" not in scene:
            err = flask.jsonify({"err_msg": "Missing list of used images"})
            return err, 400

        if "used_infoproviders" not in scene:
            err = flask.jsonify({"err_msg": "missing list of used infoproviders'"})
            return err, 400

        if "images" not in scene:
            err = flask.jsonify({"err_msg": "Missing field 'images'"})
            return err, 400

        msg = queries.insert_scene(scene)
        if msg:
            err = flask.jsonify({"err_msg": msg})
            return err, 400

        return "", 200
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while adding a scene"})
        return err, 400


@api.route("/scene/all", methods=["GET"])
def get_all_scenes():
    """
    Endpunkt '/scene/all'.

    Route über welche Informationen über alle vorhandenen Szenen ausgelesen werden kann.
    """
    try:

        return flask.jsonify(queries.get_scene_list())
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occuured while loading information about all scenes"})
        return err, 400


@api.route("/scene/<id>", methods=["GET"])
def get_scene(id):
    """
    Endpunkt '/scene/<id>' (GET).

    Route über die das Json-Objekt der Szene geladen werden kann.
    :param id: Die ID zu der Szene welche geladen werden soll.
    """
    try:
        scene_json = queries.get_scene(id)
        if scene_json is None:
            err = flask.jsonify({"err_msg": f"Could not load scene with ID {id}"})
            return err, 400

        return flask.jsonify(scene_json)
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": f"An error occurred while loading a scene"})
        return err, 400


@api.route("/scene/<id>", methods=["PUT"])
def update_scene(id):
    """
    Endpunkt '/scene/<id>' (PUT).

    Route über die die Daten einer Szene verändert werden können.
    Request muss das Json-Objekt enthälten welches das alte Objekt überschreiben soll.
    :param id: ID der Szene die überschrieben werden soll.
    """
    updated_data = request.json
    try:
        if "scene_name" not in updated_data:
            err = flask.jsonify({"err_msg": "Missing Scene-Name"})
            return err, 400

        if "used_images" not in updated_data:
            err = flask.jsonify({"err_msg": "Missing list of used images"})
            return err, 400

        if "used_infoproviders" not in updated_data:
            err = flask.jsonify({"err_msg": "missing list of used infoproviders'"})
            return err, 400

        if "images" not in updated_data:
            err = flask.jsonify({"err_msg": "Missing field 'images'"})
            return err, 400

        update_info = queries.update_scene(id, updated_data)

        if update_info is not None:
            err = flask.jsonify(update_info)
            return err, 400

        return "Successful", 200
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": f"An error occurred while updating the scene with the ID {id}"})
        return err, 400


@api.route("/scene/<id>", methods=["DELETE"])
def delete_scene(id):
    """
    Endpunkt '/scene/<id>' (DELETE).

    Route über die eine Szene anhand ihrer ID gelöscht werden kann.
    :param id: ID der Szene die gelöscht werden soll.
    """
    try:
        success = queries.delete_scene(id)
        return "", 200 if success else flask.jsonify({"err_msg": f"Could not remove scene with ID {id}"})
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": f"An error occurred while deleting the scene with the ID {id}"})
        return err, 400


@api.route("/image/add", methods=["POST"])
def add_scene_image():
    """
    Endpunkt '/image/add'.

    Route über die ein neues Bild für eine Szene hinzugefügt werden kann.
    Request-Form muss den key name und das Bild selbst enthalten.
    """
    try:
        if "image" not in request.files:
            err = flask.jsonify({"err_msg": "Missing Image"})
            return err, 400

        if "name" not in request.form:
            err = flask.jsonify({"err_msg": "Missing Image Name"})
            return err, 400

        image = request.files["image"]
        name = request.form["name"]

        if image.filename == '':
            err = flask.jsonify({"err_msg": "Missing Image Filename"})
            return err, 400

        if not _check_image_extention(image.filename):
            err = flask.jsonify({"err_msg": "Invalid file extension"})
            return err, 400

        file_extension = secure_filename(image.filename).rsplit(".", 1)[1]
        file_path = queries.get_scene_image_path(name + "." + file_extension)

        if path.exists(file_path):
            err = flask.jsonify({"err_msg": "Invalid Image Name (Image maybe exists already)"})
            return err, 400

        if not queries.insert_image(name + "." + file_extension):
            err = flask.jsonify({"err_msg": "Image could not be added to the database"})
            return err, 400

        image.save(file_path)
        return "", 204
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while adding an image"})
        return err, 400


@api.route("/image/all", methods=["GET"])
def get_all_scene_images():
    """
    Endpunkt '/image/all'.

    Route über die Informationen über alle Szene-Bilder erhalten werden können.
    Response enthält eine Liste von Bild-Elementen. Jedes Bild-Element enthält die ID, den Namen und das Bild selbst.
    """
    try:
        images = queries.get_image_list()

        return flask.jsonify(images)
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while loading information about all images"})
        return err, 400


@api.route("/image/<id>", methods=["GET"])
def get_image(id):
    """
    Endpunkt '/image/<id>' (GET).

    Route über die ein Szenen-Bild geladen werden kann.
    :param id: ID des Bilders welches gesendet werden soll.
    """
    try:
        file_path = queries.get_scene_image_file(id)

        #return send_file(file_path, "application/json", True)
        images = ["Corona_Regional", "Corona_Bundesland"]
        return send_file(queries._get_image_path(images[id], "corona", "png"), "application/json", True)
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while loading a scene-image"})
        return err, 400


@api.route("/image/<id>", methods=["DELETE"])
def delete_scene_image(id):
    """
    Endpunkt '/image/<id>' (DELETE).

    Route über die ein Szenen-Bild gelöscht werden kann.
    :param id: ID des Bildes welches gelöscht werden soll.
    """
    try:
        success = queries.delete_scene_image(id)

        return flask.jsonify({"success": success})
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while deleting an image"})
        return err, 400


@api.route("/thumbnailpreview", methods=["POST"])
def set_preview():
    try:

        return "Not Implemented", 400
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while setting an image as the preview of a scene"})
        return err, 400


@api.route("/topics", methods=["GET"])
def topics():
    """
    Endpunkt `/topics`.

    Die Response enthält die Liste, der zur Videogenerierung verfügbaren Themen.
    """
    try:
        return flask.jsonify(queries.get_topic_names())
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while retrieving the list of topics"})
        return err, 400


@api.route("/topic", methods=["PUT"])
def add_topic():
    """
    Endpunkt `/topic`.

    Route zum hinzufügen eines Themas.
    """
    try:
        if "config" not in request.files:
            err = flask.jsonify({"err_msg": "Missing File"})
            return err, 400

        if "name" not in request.form:
            err = flask.jsonify({"err_msg": "Missing Topic name"})
            return err, 400

        file = request.files["config"]
        name = request.form["name"]

        if file.filename == '':
            err = flask.jsonify({"err_msg": "Missing File"})
            return err, 400

        if not _check_json_extention(file.filename):
            err = flask.jsonify({"err_msg": "Invalid file extention"})
            return err, 400

        filename = secure_filename(file.filename).rsplit(".", 1)[0]
        file_path = queries._get_steps_path(filename)

        if path.exists(file_path):
            err = flask.jsonify({"err_msg": "Invalid File Name (File maybe exists already)"})
            return err, 400

        queries.add_topic(name, filename)
        file.save(queries._get_steps_path(filename))
        return "", 204
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred"})
        return err, 500


@api.route("/image", methods=["PUT"])
def add_image():
    """
    Endpunkt `/image`.

    Route zum hinzufügen eines Bildes für ein Thema.
    """
    try:
        if "image" not in request.files:
            err = flask.jsonify({"err_msg": "Missing Image"})
            return err, 400

        if "name" not in request.form:
            err = flask.jsonify({"err_msg": "Missing Image Name"})
            return err, 400

        if "folder" in request.form:
            folder = request.form["folder"]
        else:
            folder = ''

        image = request.files["image"]
        name = request.form["name"]

        if image.filename == '':
            err = flask.jsonify({"err_msg": "Missing Image"})
            return err, 400

        if not _check_image_extention(image.filename):
            err = flask.jsonify({"err_msg": "Invalid file extension"})
            return err, 400

        file_extension = secure_filename(image.filename).rsplit(".", 1)[1]
        file_path = queries._get_image_path(name, folder, file_extension)

        if path.exists(file_path):
            err = flask.jsonify({"err_msg": "Invalid Image Name (Image maybe exists already)"})
            return err, 400

        image.save(file_path)
        return "", 204
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred"})
        return err, 500


@api.route("/audio", methods=["PUT"])
def add_audio():
    """
    Endpunkt `/audio`.

    Route zum hinzufügen eines Audiostückes.
    """
    try:
        if "audio" not in request.files:
            err = flask.jsonify({"err_msg": "Missing Audio File"})
            return err, 400

        if "name" not in request.form:
            err = flask.jsonify({"err_msg": "Missing Audio File Name"})
            return err, 400

        audio = request.files["audio"]
        name = request.form["name"]

        if audio.filename == '':
            err = flask.jsonify({"err_msg": "Missing Audio Name"})
            return err, 400

        if not _check_mp3_extention(audio.filename):
            err = flask.jsonify({"err_msg": "Invalid file extension"})
            return err, 400

        file_path = queries._get_audio_path(name)

        if path.exists(file_path):
            err = flask.jsonify({"err_msg": "Invalid Audio File Name (Audio File maybe exists already)"})
            return err, 400

        audio.save(file_path)
        return "", 204
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred"})
        return err, 500


@api.route("/topic/<topic_id>", methods=["GET"])
def get_topic(topic_id):
    """
    Endpunkt `/topic/<topic_id>`.

    Der Response enthält die JSON-Datei des Thema.
    """
    try:
        file_path = queries.get_topic_file(topic_id)

        if file_path is None:
            err = flask.jsonify({"err_msg": "Unknown topic"})
            return err, 400

        return send_file(file_path, "application/json", True)
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred"})
        return err, 400


@api.route("/topic/<topic_id>", methods=["DELETE"])
def delete_topic(topic_id):
    """
    Endpunkt `/topic/<topic_id>`.

    Route zum löschen eines Themas.
    """
    try:
        queries.delete_topic(topic_id)
        return "", 204
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred"})
        return err, 400


@api.route("/params/<topic_id>", methods=["GET"])
def params(topic_id):
    """
    Endpunkt `/params`.

    GET-Parameter: "topic".
    Die Response enthält die Parameterinformationen für das übergebene Thema.
    """
    try:
        params = queries.get_params(topic_id)
        if (params == None):
            err = flask.jsonify({"err_msg": "Unknown topic"})
            return err, 400
        return flask.jsonify(params)
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while retrieving the parameters for Topic ID: " + topic_id})
        return flask.jsonify(err, 400)


@api.route("/jobs", methods=["GET"])
def jobs():
    """
    Endpunkt `/jobs`.

    Die Response enthält, die in der Datenbank angelegten, Jobs.
    """
    try:
        return flask.jsonify(queries.get_job_list())
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while retrieving the list of jobs"})
        return err, 400


@api.route("/add", methods=["POST"])
def add():
    """
    Endpunkt `/add`.

    Der Request-Body enthält die Informationen für den neuen Job im JSON-Format.
    """
    job = request.json
    try:
        queries.insert_job(job)
        return "", 204
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while adding the job"})
        return err, 400


@api.route("/edit/<job_id>", methods=["PUT"])
def edit(job_id):
    """
    Endpunkt `/edit`.

    Aktualisert den Job-Datenbank-Eintrag mit der übergebenen ID.
    Der Request-Body enthält die Informationen, mit denen der Job aktualisert werden soll.

    :param id: URL-Parameter <id>
    :type id: str
    """
    updated_job_data = request.json
    try:
        queries.update_job(job_id, updated_job_data)
        return "", 204
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while updating job information"})
        return err, 400


@api.route("/remove/<job_id>", methods=["DELETE"])
def remove(job_id):
    """
    Endpunkt `/remove`.

    Löscht den Job-Datenbank-Eintrag mit der übergebenen ID.

    :param id: URL-Parameter <id>
    :type id: str
    """
    try:
        queries.delete_job(job_id)
        return "", 204
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while deleting the job"})
        return err, 400


@api.route("/logs", methods=["GET"])
def logs():
    """
    Endpunkt `/logs`.

    Gibt die Logs der Jobs zurück
    """
    try:
        return flask.jsonify(queries.get_logs())
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while getting the logs"})
        return err, 400


def _check_json_extention(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() == "json"


def _check_mp3_extention(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() == "mp3"


def _check_image_extention(filename):
    return "." in filename and (
            filename.rsplit(".", 1)[1].lower() == "png" or filename.rsplit(".", 1)[1].lower() == "jpeg" or
            filename.rsplit(".", 1)[1].lower() == "jpg")
