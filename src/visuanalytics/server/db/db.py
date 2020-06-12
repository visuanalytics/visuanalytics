import logging
import os
import sqlite3

logger = logging.getLogger(__name__)

# TODO(max) vtl. move to someware else
DATABASE_LOCATION = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../instance/visuanalytics.db"))


def connect():
    con = sqlite3.connect(
        DATABASE_LOCATION,
        detect_types=sqlite3.PARSE_DECLTYPES,
    )
    con.row_factory = sqlite3.Row
    return con


def init_db():
    # if db file not exsists create one
    if not os.path.exists(DATABASE_LOCATION):
        logger.info("Initialize Database ...")

        # create dir
        os.makedirs(os.path.dirname(DATABASE_LOCATION), exist_ok=True)

        # create database
        db = sqlite3.connect(
            DATABASE_LOCATION,
            detect_types=sqlite3.PARSE_DECLTYPES
        )

        with open(os.path.join(os.path.abspath(__file__), 'schema.sql')) as f:
            db.executescript(f.read())

        db.close()

        logger.info("Database Initialisation Done!")
