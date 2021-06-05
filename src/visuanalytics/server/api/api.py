"""
Enthält die API-Endpunkte.
"""

import flask
import logging

from flask import (Blueprint, request, send_file)
from werkzeug.utils import secure_filename
from os import path

from visuanalytics.server.db import db, queries

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
    last_id = queries.get_last_infoprovider_id()
    infoprovider = {
        "infoprovider_name": "Test" + str(last_id),
        "api": {
            "type": "request",
            "api_key_name": "wetter",
            "url_pattern": "http://api.openweathermap.org/data/2.5/weather",
            "params": {
                "q": "berlin",
                "appid": "{_api_key}"
            }
        },
        "transform": [
            {
                "type": "select",
                "relevant_keys": [
                    "_req|api|main|temp",
                    "_req|api|main|feels_like",
                    "_req|api|main|temp_min",
                    "_req|api|main|temp_max"
                ]
            },
            {
                "type": "transform_dict",
                "dict_key": "_req|api|main",
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
        "schedule": {
            "type": "weekly",
            "time": "13:30",
            "weekdays": [0, 5]
        },
        "formulas": [
            {
                "name": "A",
                "formula": "( _req|api|main|temp * 7 ) / 24"
            }
        ],
        "images": {
            "test": {
                "type": "diagram",
                "diagram_config": {
                    "type": "line",
                    "name": "test",
                    "y": "{test}",
                    "grid": {
                        "linestyle": "--"
                    }
                }
            }
        }
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


@api.route("/checkapi", methods=["POST"])
def checkapi():
    """
    Endpunkt `/checkapi`.

    Übermitteltes JSON enthält die API-Daten in dem Format:
    {   'url': '<url + query>',
        'api_key': '<api-key falls einer gegeben ist>',
        'has_key': <true falls ein api-key gegeben ist>
    }

    Die Response enthält alle Keys die bei der gegenen API abgefragt werden können
    """
    api_info = request.json
    try:
        if "api" not in api_info:
            err = flask.jsonify({"err_msg": "Missing field 'api'"})
            return err, 400

        if "api_key_name" not in api_info["api"]:
            err = flask.jsonify({"err_msg": "Missing API-Key"})
            return err, 400

        if "url_pattern" not in api_info["api"]:
            err = flask.jsonify({"err_msg": "Missing URL"})
            return err, 400

        if "method" not in api_info:
            err = flask.jsonify({"err_msg": "Missing Field 'method'"})
            return err, 400

        if "response_type" not in api_info:
            err = flask.jsonify({"err_msg": "Missing field 'response_type'"})
            return err, 400

        header, parameter = _generate_request_dicts(api_info["api"], api_info["method"])
        req_data = {
            "method": api_info["api"].get("method", "get"),
            "url": api_info["api"]["url_pattern"],
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

        if "api" not in infoprovider:
            err = flask.jsonify({"err_msg": "Missing Field 'api'"})
            return err, 400

        if "transform" not in infoprovider:
            err = flask.jsonify({"err_msg": "Missing Field 'transform'"})
            return err, 400

        if "storing" not in infoprovider:
            err = flask.jsonify({"err_msg": "Missing Field 'storing'"})
            return err, 400

        if "schedule" not in infoprovider:
            err = flask.jsonify({"err_msg": "Missing Field 'schedule'"})
            return err, 400

        if "formulas" not in infoprovider:
            err = flask.jsonify({"err_msg": "Missing Field 'formulas'"})
            return err, 400

        if "images" not in infoprovider:
            err = flask.jsonify({"err_msg": "Missing field 'images'"})
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

        if "api" not in updated_data:
            err = flask.jsonify({"err_msg": "Missing Field 'api'"})
            return err, 400

        if "transform" not in updated_data:
            err = flask.jsonify({"err_msg": "Missing Field 'transform'"})
            return err, 400

        if "storing" not in updated_data:
            err = flask.jsonify({"err_msg": "Missing Field 'storing'"})
            return err, 400

        if "schedule" not in updated_data:
            err = flask.jsonify({"err_msg": "Missing Field 'schedule'"})
            return err, 400

        if "formulas" not in updated_data:
            err = flask.jsonify({"err_msg": "Missing Field 'formulas'"})
            return err, 400

        if "images" not in updated_data:
            err = flask.jsonify({"err_msg": "Missing field 'images'"})
            return err, 400

        return flask.jsonify(queries.update_infoprovider(infoprovider_id, updated_data))
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while updating an infoprovider"})
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

        # return send_file(file_path, "application/json", True)
        return flask.jsonify(infoprovider_json)
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while loading an Infoprovider"})
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
    scene = request.json
    try:

        return "Not Implemented", 400
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while adding a scene"})
        return err, 400


@api.route("/scene/all", methods=["GET"])
def get_all_scenes():
    try:

        return "Not Implemented", 400
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occuured while loading information about all scenes"})
        return err, 400


@api.route("/scene/<id>", methods=["GET"])
def get_scene(scene_id):
    try:

        return "Not Implemented", 400
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": f"An error occurred while loading a scene"})
        return err, 400


@api.route("/scene/<id>", methods=["PUT"])
def update_scene(scene_id):
    updated_data = request.json
    try:

        return "Not Inplemented", 400
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": f"An error occurred while updating the scene with the ID {scene_id}"})
        return err, 400


@api.route("/scene/<id>", methods=["DELETE"])
def delete_scene(scene_id):
    try:

        return "Not Implemented", 400
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": f"An error occurred while deleting the scene with the ID {scene_id}"})
        return err, 400


@api.route("/image", methods=["POST"])
def add_image():
    try:

        return "Not Implemented", 400
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while adding an image"})
        return err, 400


@api.route("/image/all", methods=["GET"])
def get_all_images():
    try:

        return "Not Implemented", 400
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while loading information about all images"})
        return err, 400


@api.route("/image/<id>", methods=["DELETE"])
def delete_image(image_id):
    try:

        return "Not Implemented", 400
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


def _generate_request_dicts(api_info, method):
    header = {}
    parameter = {}
    if method == "BearerToken":
        header.update({"Authorization": "Bearer " + api_info["api_key_name"]})
    elif method == "noAuth":
        return header, parameter
    else:
        api_key_name = api_info["api_key_name"].split("||")
        key1 = api_key_name[0]
        key2 = api_key_name[1]

        if method == "BasicAuth":
            header.update({"Authorization": "Basic " + b64encode(key1.encode("utf-8") + b":" + key2.encode("utf-8"))
                          .decode("utf-8")})
        elif method == "KeyInHeader":
            header.update({key1: key2})
        elif method == "KeyInQuery":
            parameter.update({key1: key2})

    return header, parameter


def _generate_request_dicts(api_info, method):
    header = {}
    parameter = {}
    # Prüft ob und wie sich das Backend bei der API authetifizieren soll und setzt die entsprechenden Parameter
    if method == "BearerToken":
        header.update({"Authorization": "Bearer " + api_info["api_key_name"]})
    elif method == "noAuth":
        return header, parameter
    else:
        api_key_name = api_info["api_key_name"].split("||")
        key1 = api_key_name[0]
        key2 = api_key_name[1]

        if method == "BasicAuth":
            header.update({"Authorization": "Basic " + b64encode(key1.encode("utf-8") + b":" + key2.encode("utf-8"))
                          .decode("utf-8")})
        elif method == "KeyInHeader":
            header.update({key1: key2})
        elif method == "KeyInQuery":
            parameter.update({key1: key2})

    return header, parameter


def _check_json_extention(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() == "json"


def _check_mp3_extention(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() == "mp3"


def _check_image_extention(filename):
    return "." in filename and (
            filename.rsplit(".", 1)[1].lower() == "png" or filename.rsplit(".", 1)[1].lower() == "jpeg" or
            filename.rsplit(".", 1)[1].lower() == "jpg")
