"""
Enthält die API-Endpunkte.
"""

import json

import flask
from flask import (Blueprint, request)
from visuanalytics.server.db import db, job, queries

api = Blueprint('api', __name__)


@api.teardown_app_request
def close_db_con(exception):
    db.close_con()


@api.route("/topics", methods=["GET"])
def topics():
    """
    Endpunkt `/topics`.

    Die Response enthält die Liste der zur Videogenerierung verfügbaren Themen.
    """
    return flask.jsonify(queries.get_topic_names())


@api.route("/params", methods=["GET"])
def params():
    """
    Endpunkt `/params`.

    GET-Parameter: "topic".
    Die Response enthält die Parameterinformationen für das übergebene Thema.
    """
    topic_id = request.args.get("topic")
    params = queries.get_params(topic_id)
    if (params == None):
        return "Unknown topic", 400
    return flask.jsonify(params)


@api.route("/jobs", methods=["GET"])
def jobs():
    """
    Endpunkt `/jobs`.

    Die Response enthält die in der Datenbank angelegten Jobs.
    """
    return flask.jsonify(queries.get_job_list())


@api.route("/add", methods=["POST"])
def add():
    """
    Endpunkt `/add`.

    Der Request-Body enthält die Informationen für den neuen Job im JSON-Format.
    """
    job_data = request.json
    return "add"
    # TODO: add data base entry for the new job


@api.route("/edit/<id>", methods=["PUT"])
def edit(id):
    """
    Endpunkt `/edit`.

    Aktualisert den Job-Datenbank-Eintrag mit der übergebenen id.
    Der Request-Body enthält die Informationen, mit denen der Job aktualisert werden soll.

    :param id: URL-Parameter <id>
    :type id: str
    """
    updated_job_data = request.json
    return "edit"
    # TODO: update data base entry with the given job id


@api.route("/remove/<id>", methods=["DELETE"])
def remove(id):
    """
    Endpunkt `/remove`.

    Löscht den Job-Datenbank-Eintrag mit der übergebenen id.

    :param id: URL-Parameter <id>
    :type id: str
    """
    return "remove"
    # TODO: remove job from data base
