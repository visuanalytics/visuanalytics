"""Nimmt alle API Requests zum Endpunt `/api/v1/test` entgegen.

Ist nur zu Testen gedacht, wird später entfernt.

"""
from flask import (Blueprint, jsonify)

bp = Blueprint('api', __name__)


@bp.route("/<id>")
def test(id):
    """Endpunkt `/test/<id>`.

    Args:
        id(string):  url parameter <id>
    """
    return jsonify(test=id)