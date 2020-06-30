from visuanalytics.server.db import db
import os
import json

STEPS_LOCATION = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../resources/steps"))


def get_topic_names():
    con = db.open_con()
    res = con.execute("SELECT steps_name FROM steps")
    return [row["steps_name"] for row in res]


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
    con = db.open_con()
    res = con.execute("""
    SELECT DISTINCT 
    job_id, job_name, daily, weekly, on_date, date, time, steps_name,
    group_concat(weekday) AS weekdays,
    group_concat(DISTINCT key || ":"  || value) AS params
    FROM job 
    INNER JOIN steps USING (steps_id)
    LEFT JOIN job_config USING (job_id)
    INNER JOIN schedule USING (schedule_id) 
    LEFT JOIN schedule_weekday USING (schedule_id) 
    GROUP BY (job_id);
    """)

    return [row_to_job(row) for row in res]


def row_to_job(row):
    params_string = str(row["params"])
    key_values = [kv.split(":") for kv in params_string.split(",")] if params_string != "None" else []
    params = [{"name": kv[0], "selected": kv[1], "possibleValues": []} for kv in
              key_values]  # TODO (David): possibleValues
    weekdays = str(row["weekdays"]).split(",")
    return {
        "jobId": row["Job_id"],
        "jobName": row["job_name"],
        "topicName": row["steps_name"],
        "params": params,
        "schedule": {
            "daily": row["daily"],
            "weekly": row["weekly"],
            "onDate": row["on_date"],
            "date": row["date"],
            "time": row["time"],
            "weekdays": weekdays
        }
    }
