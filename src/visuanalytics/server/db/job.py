from datetime import datetime

from visuanalytics.server.db import db


def get_job_schedules():
    """ Gibt alle angelegten jobs mitsamt ihren Zeitplänen zurück.

    """
    with db.open_con() as con:
        res = con.execute("""
        SELECT DISTINCT job_id, type, date, time, group_concat(DISTINCT weekday) AS weekdays
        FROM job 
        INNER JOIN schedule USING(schedule_id) 
        LEFT JOIN schedule_weekday USING(schedule_id)
        GROUP BY(job_id)
        """).fetchall()

        return res


def get_job_run_info(job_id):
    """Gibt den Namen eines Jobs, dessen Parameter sowie den Namen der zugehörigen steps-Json-Datei zurück.

    :param job_id: id des Jobs
    """
    with db.open_con() as con:
        res = con.execute("""
        SELECT job_name, json_file_name, key, value
        FROM job 
        INNER JOIN steps USING(steps_id) 
        LEFT JOIN job_config USING(job_id) 
        WHERE job_id=?
        """, [job_id]).fetchall()

        job_name = res[0]["job_name"]
        steps_name = res[0]["json_file_name"]
        config = {row["key"]: row["value"] for row in res}

        return job_name, steps_name, config


def insert_log(job_id: int, state: int, start_date: datetime):
    with db.open_con() as con:
        con.execute("INSERT INTO job_logs(job_id, state, start_date) values (?, ?, ?)", [job_id, state, start_date])
        id = con.execute("SELECT last_insert_rowid() as id").fetchone()
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
