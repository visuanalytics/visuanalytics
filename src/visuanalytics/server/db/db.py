import os
import sqlite3

# TODO(max) vtl. move to someware else
DATABASE_LOCATION = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../instance/visuanalytics.db"))


def connect():
    con = sqlite3.connect(
        DATABASE_LOCATION,
        detect_types=sqlite3.PARSE_DECLTYPES,
    )
    con.row_factory = sqlite3.Row
    return con


def init_db(app):
    # if db file not exsists create one
    if not os.path.exists(DATABASE_LOCATION):
        print("init DB")

        # create dir
        os.makedirs(os.path.dirname(DATABASE_LOCATION), exist_ok=True)

        # create database
        db = sqlite3.connect(
            DATABASE_LOCATION,
            detect_types=sqlite3.PARSE_DECLTYPES
        )

        with app.open_resource('db/schema.sql') as f:
            db.executescript(f.read().decode('utf8'))

        db.close()
