"""Nimmt alle API Requests zum Endpunt `/api/v1/test` entgegen.

Ist nur zu Testen gedacht, wird später entfernt.
"""
from flask import (Blueprint, jsonify)

bp = Blueprint('api', __name__)


@bp.route("/<id>")
def test(id):
    """Endpunkt `/test/<id>`.

    :param id: url parameter <id>
    :type id: str
    """
    return jsonify(test=id)
