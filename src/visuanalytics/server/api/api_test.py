"""Handel the APi Route `/test`.

Api Test endpoint, will be Removed later.

"""
from flask import (Blueprint, Request)

bp = Blueprint('api', __name__)


@bp.route("/<id>")
def test(id):
    """Handle `/test/<id>`.

    Args:
        id(string):  url parameter <id>
    """
    return {"Test": id}