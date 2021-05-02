"""
Enthält die API-Endpunkte.
"""

import flask
import logging

from flask import (Blueprint, request, send_file)
from werkzeug.utils import secure_filename
from os import path

from visuanalytics.server.db import db, queries

logger = logging.getLogger()

api = Blueprint('api', __name__)


@api.teardown_app_request
def close_db_con(exception):
    db.close_con_f()


@api.route("/checkapi", methods=["POST"])
def checkapi():
    """
    Endpunkt '/checkapi'.

    Übermitteltes JSON enthält die API-Daten in dem Format:
    {   'url': '<url + query>',
        'api_key': '<api-key falls einer gegeben ist>',
        'has_key': <true falls ein api-key gegeben ist>
    }

    Die Response enthält alle Keys die bei der gegenen API abgefragt werden können
    """
    api = request.json
    try:
        if "url" not in api:
            err = flask.jsonify({"err_msg": "Missing URL"})
            return err, 400
        if "has_key" not in api:
            err = flask.jsonify({"err_msg": "Missing Field 'has_key'"})
            return err, 400
        if api["has_key"] is True and "api_key" not in api:
            err = flask.jsonify({"err_msg": "Missing API-Key"})
            return err, 400

        # Todo API-Abfragen
        keys = None # Methode zum Umschreiben der API-Keys aufrufen
        if keys is not None:
            return flask.jsonify({"api_keys": keys, "status": 0})

        return flask.jsonify({"status": 1, "api_keys": {}})
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while checking a new api"})
        return err, 400


@api.route("/infoprovider", methods=["POST"])
def add_infoprovider():
    """
    Endpunkt '/infoprovider'.

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

        queries.insert_infoprovider(infoprovider)
        return "", 204
    except Exception:
        logger.exception("An error occurred: ")
        err = flask.jsonify({"err_msg": "An error occurred while adding an infoprovider"})
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
