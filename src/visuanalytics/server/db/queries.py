import json
import os

from visuanalytics.server.db import db

STEPS_LOCATION = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../resources/steps"))


def get_topic_names():
    con = db.open_con_f()
    res = con.execute("SELECT steps_id, steps_name FROM steps")
    return [{"topicId": row["steps_id"], "topicName": row["steps_name"]} for row in res]


def get_params(topic_id):
    con = db.open_con_f()
    res = con.execute("SELECT json_file_name FROM steps WHERE steps_id = ?", [topic_id]).fetchone()
    if res is None:
        return None
    json_file_name = res["json_file_name"]
    path_to_json = os.path.join(STEPS_LOCATION, json_file_name) + ".json"
    with open(path_to_json) as fh:
        steps_json = json.loads(fh.read())
    run_config = steps_json["run_config"]
    params = [_with_selected(_to_camel_case(p), "") for p in run_config]
    return params


def get_job_list():
    con = db.open_con_f()
    res = con.execute("""
    SELECT DISTINCT 
    job_id, job_name, daily, weekly, on_date, strftime('%Y-%m-%d', date) as date, time, steps_id, steps_name, json_file_name,
    group_concat(DISTINCT weekday) AS weekdays,
    group_concat(DISTINCT key || ":"  || value) AS params
    FROM job 
    INNER JOIN steps USING (steps_id)
    LEFT JOIN job_config USING (job_id)
    INNER JOIN schedule USING (schedule_id) 
    LEFT JOIN schedule_weekday USING (schedule_id) 
    GROUP BY (job_id);
    """)
    return [_row_to_job(row) for row in res]


def _row_to_job(row):
    params_string = str(row["params"])
    path_to_json = os.path.join(STEPS_LOCATION, row["json_file_name"]) + ".json"
    with open(path_to_json) as fh:
        steps_params = json.loads(fh.read())["run_config"]
    key_values = [kv.split(":") for kv in params_string.split(",")] if params_string != "None" else []
    params = [_with_selected(_to_camel_case(_find(steps_params, "name", kv[0])), kv[1]) for kv in key_values]
    weekdays = str(row["weekdays"]).split(",") if row["weekdays"] is not None else []
    return {
        "jobId": row["job_id"],
        "jobName": row["job_name"],
        "topicName": row["steps_name"],
        "topicId": row["steps_id"],
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


def _find(lst, key, value):
    for e in lst:
        if e[key] == value:
            return e


def _with_selected(param, selected):
    param["selected"] = selected
    return param


def _to_camel_case(param):
    possible_values = [] if param["possible_values"] == [] else [{
        "value": pv["value"],
        "displayValue": pv["display_value"]
    } for pv in param["possible_values"]]
    return {
        "name": param["name"],
        "displayName": param["display_name"],
        "possibleValues": possible_values
    }


def insert_job(job):
    con = db.open_con_f()
    schedule_id = _insert_schedule(con, job["schedule"])
    job_id = con.execute("INSERT INTO job(job_name, steps_id, schedule_id) VALUES(?, ?, ?)",
                         [job["jobName"], job["topicId"], schedule_id]).lastrowid
    _insert_params(con, job_id, job["params"])
    con.commit()


def delete_job(job_id):
    con = db.open_con_f()
    job = con.execute("SELECT schedule_id FROM job where job_id=?", [job_id]).fetchone()
    schedule_id = job["schedule_id"]
    con.execute("DELETE FROM schedule WHERE schedule_id=?", [schedule_id])
    con.execute("DELETE FROM schedule_weekday WHERE schedule_id=?", [schedule_id])
    con.execute("DELETE FROM job WHERE job_id=?", [job_id]).fetchone()
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
        if key == "params":
            # TODO (David): Nur wenn die übergebenen Parameter zum Job passen, DB-Anfrage ausführen
            con.execute("DELETE FROM job_config WHERE job_id=?", [job_id])
            _insert_params(con, job_id, value)
    con.commit()


def _insert_schedule(con, schedule):
    schedule_id = con.execute("INSERT INTO schedule(daily, weekly, on_date, date, time) VALUES(?, ?, ?, ?, ?)",
                              [schedule["daily"], schedule["weekly"], schedule["onDate"], schedule["date"],
                               schedule["time"]]).lastrowid
    if schedule["weekly"]:
        id_weekdays = [(schedule_id, d) for d in schedule["weekdays"]]
        con.executemany("INSERT INTO schedule_weekday(schedule_id, weekday) VALUES(?, ?)", id_weekdays)
    return schedule_id


def _insert_params(con, job_id, params):
    id_key_values = [(job_id, p["name"], p["selected"]) for p in params]
    con.executemany("INSERT INTO job_config(job_id, key, value) VALUES(?, ?, ?)", id_key_values)
