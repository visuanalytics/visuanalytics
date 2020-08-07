from visuanalytics.server.db import db
from visuanalytics.server.db import queries


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
        SELECT job_name, json_file_name, key, value, type
        FROM job 
        INNER JOIN steps USING(steps_id) 
        LEFT JOIN job_config USING(job_id) 
        WHERE job_id=?
        """, [job_id]).fetchall()

        job_name = res[0]["job_name"]
        steps_name = res[0]["json_file_name"]
        config = {row["key"]: queries.to_typed_value(row["value"], row["type"]) for row in res}

        return job_name, steps_name, config
