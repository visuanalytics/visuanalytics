from visuanalytics.server.db import db
import os
import json

STEPS_LOCATION = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../resources/steps"))


def get_topic_names():
    topic_names = []
    con = db.open_con()
    res = con.execute("SELECT NAME FROM steps")
    for row in res:
        topic_names.append(row["name"])
    return topic_names


def get_params(topic_id):
    con = db.open_con()
    res = con.execute("SELECT json_file_name FROM steps WHERE id = ?", topic_id).fetchone()
    if (res == None):
        return None
    json_file_name = res["json_file_name"]
    path_to_json = os.path.join(STEPS_LOCATION, json_file_name)
    steps_json = json.loads(open(path_to_json).read())
    return steps_json.params


def get_job_list():
    job_list = []
    con = db.open_con()
    res = con.execute("SELECT * FROM jobs JOIN job_schedule JOIN schedule")
    for row in res:
        job = {}
        schedule = {}
        schedule[""]
        job["job_id"] = row["id"]
