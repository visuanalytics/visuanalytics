import os
import sqlite3

from flask import current_app


def connect():
    con = sqlite3.connect(
        current_app.config['DATABASE'],
        detect_types=sqlite3.PARSE_DECLTYPES,
    )
    con.row_factory = sqlite3.Row
    return con


def init_db(app):
    # if db file not exsists create one
    if not os.path.exists(app.config["DATABASE"]):
        print("init DB")

        # create dir
        os.makedirs(os.path.dirname(app.config["DATABASE"]), exist_ok=True)

        # create database
        db = sqlite3.connect(
            app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )

        with app.open_resource('db/schema.sql') as f:
            print("F")
            db.executescript(f.read().decode('utf8'))

        db.close()
