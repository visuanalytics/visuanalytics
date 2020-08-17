from datetime import datetime

from visuanalytics.server.db import db
from visuanalytics.server.db import queries

# This variable is initialized with the value from the config file, 
# so a change here has no effect. 
LOG_LIMIT = 100


def get_job_schedules():
    """ Gibt alle angelegten jobs mitsamt ihren Zeitplänen zurück.

    """
    with db.open_con() as con:
        res = con.execute("""
        SELECT DISTINCT job_id, type, date, time, group_concat(DISTINCT weekday) AS weekdays
        FROM job 
        LEFT JOIN schedule_weekday USING(job_id)
        GROUP BY(job_id)
        """).fetchall()

        return res


def get_job_run_info(job_id):
    """Gibt den Namen eines Jobs, dessen Parameter sowie den Namen der zugehörigen steps-Json-Datei zurück.

    :param job_id: id des Jobs
    """
    with db.open_con() as con:
        res = con.execute("""
        SELECT job_name, json_file_name, key, value, job_config.type, position
        FROM job 
        INNER JOIN job_topic_position USING(job_id)
        LEFT JOIN job_config USING(position_id) 
        INNER JOIN steps USING(steps_id)
        WHERE job_id=?
        ORDER BY(position)
        """, [job_id]).fetchall()
        
        job_name = res[0]["job_name"]
        steps_name = res[0]["json_file_name"]
        config = {}
        if len(res) > 0:
            topic_count = int(res[len(res) - 1]["position"] + 1)
            attach = [{"config": {}, "steps": ""}] * (topic_count - 1)
            for row in res:
                key = row["key"]
                type = row["type"]
                value = queries.to_typed_value(row["value"], type)
                sub_steps_name = row["json_file_name"]
                position = int(row["position"]) - 1
                if position < 0:
                    if key is not None:
                        config = {**config, key: value}
                else:
                    attach_config = {**attach[position]["config"]}
                    if key is not None:
                        attach_config = {**attach_config, key: value}
                    attach[position] = {**attach[position], "config": attach_config, "steps": sub_steps_name}
        if len(attach) > 0:
            config = {**config, "attach": attach}
        return job_name, steps_name, config


def insert_log(job_id: int, state: int, start_time: datetime):
    with db.open_con() as con:
        con.execute("INSERT INTO job_logs(job_id, state, start_time) values (?, ?, ?)", [job_id, state, start_time])
        id = con.execute("SELECT last_insert_rowid() as id").fetchone()
        con.commit()

        # Only keep LOG_LIMMIT logs 
        con.execute(
            "DELETE FROM job_logs WHERE job_logs_id NOT IN (SELECT job_logs_id FROM job_logs ORDER BY job_logs_id DESC limit ?)",
            [LOG_LIMIT])
        con.commit()

        return id["id"]


def update_log_error(id: int, state: int, error_msg: str, error_traceback):
    with db.open_con() as con:
        con.execute("UPDATE job_logs SET state = (?), error_msg = ?, error_traceback = ? where job_logs_id = (?)",
                    [state, error_msg, error_traceback, id])
        con.commit()


def update_log_finish(id: int, state: int, duration: int):
    with db.open_con() as con:
        con.execute("UPDATE job_logs SET state = ?, duration = ?  where job_logs_id = ?", [state, duration, id])
        con.commit()
