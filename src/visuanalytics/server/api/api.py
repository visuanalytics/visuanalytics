"""
Enthält die API-Endpunkte.
"""

import json
import traceback

import flask
from flask import (Blueprint, request)
from visuanalytics.server.db import db, job, queries

api = Blueprint('api', __name__)


# TODO (David): Besseres Error-Handling


@api.teardown_app_request
def close_db_con(exception):
    db.close_con()


@api.route("/topics", methods=["GET"])
def topics():
    """
    Endpunkt `/topics`.

    Die Response enthält die Liste der zur Videogenerierung verfügbaren Themen.
    """
    try:
        return flask.jsonify(queries.get_topic_names())
    except Exception:
        traceback.print_exc()  # For debugging, should be removed later
        return "An error occured while retrieving the list of topics", 400


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
            return "Unknown topic", 400
        return flask.jsonify(params)
    except Exception:
        traceback.print_exc()  # For debugging, should be removed later
        return "An error occured while retrieving the parameters for Topic ID: " + topic_id, 400


@api.route("/jobs", methods=["GET"])
def jobs():
    """
    Endpunkt `/jobs`.

    Die Response enthält die in der Datenbank angelegten Jobs.
    """
    try:
        return flask.jsonify(queries.get_job_list())
    except Exception:
        traceback.print_exc()  # For debugging, should be removed later
        return "An error occured while retrieving the list of jobs", 400


@api.route("/add", methods=["POST"])
def add():
    """
    Endpunkt `/add`.

    Der Request-Body enthält die Informationen für den neuen Job im JSON-Format.
    """
    job = request.json
    try:
        queries.insert_job(job)
        return "Job added"
    except Exception:
        traceback.print_exc()  # For debugging, should be removed later
        return "An error occured while adding the job", 400


@api.route("/edit/<job_id>", methods=["PUT"])
def edit(job_id):
    """
    Endpunkt `/edit`.

    Aktualisert den Job-Datenbank-Eintrag mit der übergebenen id.
    Der Request-Body enthält die Informationen, mit denen der Job aktualisert werden soll.

    :param id: URL-Parameter <id>
    :type id: str
    """
    updated_job_data = request.json
    try:
        queries.update_job(job_id, updated_job_data)
        return "Job updated"
    except Exception:
        traceback.print_exc()  # For debugging, should be removed later
        return "An error occured while updating job information", 400


@api.route("/remove/<job_id>", methods=["DELETE"])
def remove(job_id):
    """
    Endpunkt `/remove`.

    Löscht den Job-Datenbank-Eintrag mit der übergebenen id.

    :param id: URL-Parameter <id>
    :type id: str
    """
    try:
        queries.delete_job(job_id)
        return "Job removed"
    except Exception:
        traceback.print_exc()  # For debugging, should be removed later
        return "An error occured while deleting the job", 400
