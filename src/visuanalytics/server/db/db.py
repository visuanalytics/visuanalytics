import logging
import os
import sqlite3

import flask

from visuanalytics.util import resources

logger = logging.getLogger(__name__)

DATABASE_LOCATION = ""


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


def init_db(topics: list, db_path: str):
    """ Initialisiert DB außerhalb von Flask-Kontext.

    Nur, wenn noch keine Datenbank im "instance"-Ordner angelegt ist, wird eine neue erstellt.
    :param topics: Liste mit allen Themen
    """
    global DATABASE_LOCATION
    DATABASE_LOCATION = resources.path_from_root(db_path)

    if not os.path.exists(DATABASE_LOCATION):
        logger.info("Initialize Database ...")

        os.makedirs(os.path.dirname(DATABASE_LOCATION), exist_ok=True)

        with open_con() as con:
            with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'schema.sql')) as f:
                con.executescript(f.read())
            con.commit()

        _init_topics(topics)

        logger.info("Database Initialisation Done!")


def _init_topics(topics: list):
    logger.info("Initialize Topics ...")

    with open_con() as con:
        for topic in topics:
            con.execute("INSERT INTO steps (steps_name,json_file_name)VALUES (?, ?)",
                        [topic["name"], topic["file_name"]])
        con.commit()
