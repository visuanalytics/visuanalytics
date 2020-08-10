import json
import os

import humps

from visuanalytics.server.db import db

STEPS_LOCATION = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../resources/steps"))


def get_topic_names():
    con = db.open_con_f()
    res = con.execute("SELECT steps_id, steps_name, json_file_name FROM steps")
    return [{"topicId": row["steps_id"], "topicName": row["steps_name"],
             "topicInfo": _get_topic_steps(row["json_file_name"]).get("info", "")} for row in res]


def _get_topic_steps(json_file_name: str):
    path_to_json = os.path.join(STEPS_LOCATION, json_file_name) + ".json"
    with open(path_to_json, encoding="utf-8") as fh:
        return json.loads(fh.read())


def get_params(topic_id):
    con = db.open_con_f()
    res = con.execute("SELECT json_file_name FROM steps WHERE steps_id = ?", [topic_id]).fetchone()
    if res is None:
        return None

    steps_json = _get_topic_steps(res["json_file_name"])
    run_config = steps_json["run_config"]
    return humps.camelize(_to_param_list(run_config))


def get_job_list():
    con = db.open_con_f()
    res = con.execute("""
    SELECT DISTINCT 
    job_id, job_name, schedule.type, strftime('%Y-%m-%d', date) as date, time, steps_id, steps_name, json_file_name, job_config.type,
    group_concat(DISTINCT weekday) AS weekdays,
    group_concat(DISTINCT key || ":"  || value || ":" || job_config.type) AS params
    FROM job 
    INNER JOIN steps USING (steps_id)
    LEFT JOIN job_config USING (job_id)
    INNER JOIN schedule USING (schedule_id) 
    LEFT JOIN schedule_weekday USING (schedule_id) 
    GROUP BY (job_id);
    """)
    return [_row_to_job(row) for row in res]


def insert_job(job):
    con = db.open_con_f()
    schedule_id = _insert_schedule(con, job["schedule"])
    job_id = con.execute("INSERT INTO job(job_name, steps_id, schedule_id) VALUES(?, ?, ?)",
                         [job["jobName"], job["topicId"], schedule_id]).lastrowid
    _insert_param_values(con, job_id, job["values"])
    con.commit()


def delete_job(job_id):
    con = db.open_con_f()
    job = con.execute("SELECT schedule_id FROM job where job_id=?", [job_id]).fetchone()
    schedule_id = job["schedule_id"]
    con.execute("DELETE FROM schedule WHERE schedule_id=?", [schedule_id])
    con.execute("DELETE FROM schedule_weekday WHERE schedule_id=?", [schedule_id])
    con.execute("DELETE FROM job_config WHERE job_id=?", [job_id])
    con.execute("DELETE FROM job WHERE job_id=?", [job_id])
    con.commit()


def update_job(job_id, updated_data):
    con = db.open_con_f()
    for key, value in updated_data.items():
        if key == "jobName":
            con.execute("UPDATE job SET job_name=? WHERE job_id =?", [value, job_id])
        if key == "schedule":
            schedule_id = con.execute("SELECT schedule_id FROM job where job_id=?", [job_id]).fetchone()["schedule_id"]
            con.execute("DELETE FROM schedule_weekday WHERE schedule_id=?", [schedule_id])
            con.execute("DELETE FROM schedule WHERE schedule_id=?", [schedule_id])
            new_schedule_id = _insert_schedule(con, value)
            con.execute("UPDATE job SET schedule_id=? WHERE job_id=?", [new_schedule_id, job_id])
        if key == "values":
            # TODO (David): Nur wenn die übergebenen Parameter zum Job passen, DB-Anfrage ausführen
            con.execute("DELETE FROM job_config WHERE job_id=?", [job_id])
            _insert_param_values(con, job_id, value)
    con.commit()


def get_logs():
    con = db.open_con_f()
    logs = con.execute(
        "SELECT "
        "job_id, job_name, state, error_msg, error_traceback, duration, start_time "
        "from job_logs INNER JOIN job USING (job_id) "
        "ORDER BY job_logs_id DESC").fetchall()
    return [{
        "jobId": log["job_id"],
        "jobName": log["job_name"],
        "state": log["state"],
        "errorMsg": log["error_msg"],
        "errorTraceback": log["error_traceback"],
        "duration": log["duration"],
        "startTime": log["start_time"]
        }
        for log in logs]


def _row_to_job(row):
    values = _get_values((row["params"]))
    steps_params = _get_topic_steps(row["json_file_name"])["run_config"]
    params = humps.camelize(_to_param_list(steps_params))
    weekdays = str(row["weekdays"]).split(",") if row["weekdays"] is not None else []
    return {
        "jobId": row["job_id"],
        "jobName": row["job_name"],
        "topicName": row["steps_name"],
        "topicId": row["steps_id"],
        "params": params,
        "values": values,
        "schedule": {
            "type": humps.camelize(row["type"]),
            "date": row["date"],
            "time": row["time"],
            "weekdays": [int(w) for w in weekdays]
        }
    }


def _insert_param_values(con, job_id, values):
    id_key_values = [
        (job_id,
         k,
         _to_untyped_value(v["value"], humps.decamelize(v["type"])),
         humps.decamelize(v["type"]))
        for (k, v) in values.items()]
    con.executemany("INSERT INTO job_config(job_id, key, value, type) VALUES(?, ?, ?, ?)", id_key_values)


def _get_values(param_string):
    if param_string is None:
        return []
    kvts = [kvt.split(":") for kvt in param_string.split(",")]
    values = {kvt[0]: to_typed_value(kvt[1], kvt[2]) for kvt in kvts}
    return values


def _to_untyped_value(v, t):
    if t in ["string", "enum"]:
        return v
    if t in ["multi_string"]:
        return ";".join(v)
    if t in ["multi_number"]:
        return ";".join([str(n) for n in v])
    if t in ["boolean", "sub_params", "number"]:
        return str(v)


def to_typed_value(v, t):
    if t in ["string", "enum"]:
        return v
    if t in ["number"]:
        if "." in v:
            return float(v)
        return int(v)
    if t in ["multi_string"]:
        return v.split(";")
    if t in ["multi_number"]:
        return [float(n) if "." in n else int(n) for n in v.split(";")]
    if t in ["boolean", "sub_params"]:
        return v == "True"


def _insert_schedule(con, schedule):
    schedule_id = con.execute("INSERT INTO schedule(type, date, time) VALUES(?, ?, ?)",
                              [humps.decamelize(schedule["type"]),
                               schedule["date"] if schedule["type"] == "onDate" else None,
                               schedule["time"]]).lastrowid
    if schedule["type"] == "weekly":
        id_weekdays = [(schedule_id, d) for d in schedule["weekdays"]]
        con.executemany("INSERT INTO schedule_weekday(schedule_id, weekday) VALUES(?, ?)", id_weekdays)
    return schedule_id


def _to_param_list(run_config):
    return [{**{"name": key},
             **({**value, "type": humps.camelize(value["type"])}
                if value["type"] != "sub_params"
                else {**value, "type": "subParams", "sub_params": _to_param_list(value["sub_params"])})}
            for key, value in run_config.items()]
