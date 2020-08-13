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
        SELECT job_id, job_name, schedule.type, time, date,
        GROUP_CONCAT(DISTINCT weekday) AS weekdays,
        COUNT(distinct position_id) AS topic_count,
        GROUP_CONCAT(DISTINCT steps.steps_id || ":" || steps_name || ":" || json_file_name || ":" || position) AS topic_positions,
        GROUP_CONCAT(DISTINCT position || ":" || key || ":" || value || ":" || job_config.type) AS param_values
        FROM job 
        INNER JOIN schedule USING (schedule_id)
        LEFT JOIN schedule_weekday USING (schedule_id)
        INNER JOIN job_topic_position USING (job_id) 
        LEFT JOIN job_config USING (position_id) 
        INNER JOIN steps USING (steps_id)
        GROUP BY (job_id)
    """)
    return [_row_to_job(row) for row in res]


#   SELECT DISTINCT
#   job_id, job_name, schedule.type, strftime('%Y-%m-%d', date) as date, time, steps_id, steps_name, json_file_name, job_config.type,
#   group_concat(DISTINCT weekday) AS weekdays,
#   group_concat(DISTINCT key || ":"  || value || ":" || job_config.type) AS params
#   FROM job
#  INNER JOIN steps USING (steps_id)
# LEFT JOIN job_config USING (job_id)
#   INNER JOIN schedule USING (schedule_id)
#  LEFT JOIN schedule_weekday USING (schedule_id)
# GROUP BY (job_id);


def insert_job(job):
    con = db.open_con_f()
    schedule_id = _insert_schedule(con, job["schedule"])
    job_id = con.execute("INSERT INTO job(job_name, schedule_id) VALUES(?, ?)",
                         [job["jobName"], schedule_id]).lastrowid
    _insert_param_values(con, job_id, job["topics"])
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


def _row_to_job(row):
    job_id = row["job_id"]
    job_name = row["job_name"]
    weekdays = str(row["weekdays"]).split(",") if row["weekdays"] is not None else []
    param_values = row["param_values"]
    schedule = {
        "type": humps.camelize(row["type"]),
        "date": row["date"],
        "time": row["time"],
        "weekdays": weekdays
    }
    topics = [{}] * (int(row["topic_count"]))
    for tp_s in row["topic_positions"].split(","):
        tp = tp_s.split(":")
        topic_id = tp[0]
        topic_name = tp[1]
        json_file_name = tp[2]
        position = int(tp[3])
        run_config = _get_topic_steps(json_file_name)["run_config"]
        params = humps.camelize(_to_param_list(run_config))
        topics[position] = {
            "topicId": topic_id,
            "topicName": topic_name,
            "params": params,
            "values": {}
        }
    if param_values is not None:
        for vals_s in param_values.split(","):
            vals = vals_s.split(":")
            position = int(vals[0])
            name = vals[1]
            u_val = vals[2]
            type = vals[3]
            t_val = to_typed_value(u_val, type)
            topics[position]["values"] = {
                **topics[position]["values"],
                name: t_val
            }

    return {
        "jobId": job_id,
        "jobName": job_name,
        "schedule": schedule,
        "topics": topics
    }


def _insert_param_values(con, job_id, topic_values):
    for pos, t in enumerate(topic_values):
        position_id = con.execute("INSERT INTO job_topic_position(job_id, steps_id, position) VALUES (?, ?, ?)",
                                  [job_id, t["topicId"], pos]).lastrowid
        jtkvt = [(position_id,
                  k,
                  _to_untyped_value(v["value"], humps.decamelize(v["type"])),
                  humps.decamelize(v["type"]))
                 for k, v in t["values"].items()]
        con.executemany("INSERT INTO job_config(position_id, key, value, type) VALUES(?, ?, ?, ?)", jtkvt)


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
