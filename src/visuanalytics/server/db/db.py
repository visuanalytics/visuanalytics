import logging
import os
import sqlite3

import flask

logger = logging.getLogger(__name__)

# TODO(max) vtl. move to someware else
DATABASE_LOCATION = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../instance/visuanalytics.db"))


def open_con():
    """ Öffnet DB-Verbindung außerhalb von Flask-Kontext.

    Dieese Methode wird u.a. für den DB-Scheduler benötigt, welcher unabhängig vom Flask-Server ausgeführt wird,
    """
    con = sqlite3.connect(
        DATABASE_LOCATION,
        detect_types=sqlite3.PARSE_DECLTYPES,
    )
    con.row_factory = sqlite3.Row
    return con


def open_con_f():
    """ Öffnet DB-Verbindung innerhalb von Flask-Kontext.

    Diese Methode wird in den Endpunkt-Handler-Methoden verwendet.
    """
    if 'db' not in flask.g:
        flask.g.db = sqlite3.connect(
            DATABASE_LOCATION,
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        flask.g.db.row_factory = sqlite3.Row
    return flask.g.db


def close_con_f(e=None):
    """ Schließt DB-Verbindung innerhalb von Flask-Kontext.
    """
    db = flask.g.pop('db', None)
    if db is not None:
        db.close()


def init_topics(topics: list):
    """ Initialisiert Die Datenbank mit dem Möglichen Themen.

    :param topics: Liste mit allen Themen
    """
    with open_con() as con:
        for topic in topics:
            con.execute("INSERT INTO steps (steps_name,json_file_name)VALUES (?, ?)",
                        [topic["name"], topic["file_name"]])
        con.commit()


def init_db():
    """ Initialisiert DB außerhalb von Flask-Kontext.

    Nur, wenn noch keine Datenbank im "instance"-Ordner angelegt ist, wird eine neue erstellt.
    """
    if not os.path.exists(DATABASE_LOCATION):
        logger.info("Initialize Database ...")

        os.makedirs(os.path.dirname(DATABASE_LOCATION), exist_ok=True)

        with open_con() as con:
            with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'schema.sql')) as f:
                con.executescript(f.read())
            con.commit()

        logger.info("Database Initialisation Done!")
