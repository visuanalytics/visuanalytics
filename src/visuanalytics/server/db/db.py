import logging
import os
import sqlite3
import flask

logger = logging.getLogger(__name__)

# TODO(max) vtl. move to someware else
DATABASE_LOCATION = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../instance/visuanalytics.db"))


def open_con():
    if 'db' not in flask.g:
        flask.g.db = sqlite3.connect(
            DATABASE_LOCATION,
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        flask.g.db.row_factory = sqlite3.Row
    return flask.g.db


def close_con(e=None):
    db = flask.g.pop('db', None)
    if db is not None:
        db.close()


def init_db():
    # if db file not exsists create one
    if not os.path.exists(DATABASE_LOCATION):
        logger.info("Initialize Database ...")

        # create dir
        os.makedirs(os.path.dirname(DATABASE_LOCATION), exist_ok=True)

        # create database
        db = open_con()
        with open(os.path.join(os.path.abspath(__file__), 'schema.sql')) as f:
            db.executescript(f.read())

        logger.info("Database Initialisation Done!")
