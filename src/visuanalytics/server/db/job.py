from datetime import datetime

from visuanalytics.server.db import db
from visuanalytics.server.db import queries

# This variable is initialized with the value from the config file,
# so a change here has no effect.
LOG_LIMIT = 100

INTERVAL = {"minute": {"minutes": 1}, "quarter": {"minutes": 15}, "half": {"minutes": 30},
            "threequarter": {"minutes": 45},
            "hour": {"hours": 1}, "quartday": {"hours": 6}, "halfday": {"hours": 12}}


def get_job_schedules():
    """ Gibt alle angelegten Jobs mitsamt ihren Zeitplänen zurück.

    """
    with db.open_con() as con:
        res = con.execute(
            """
            SELECT DISTINCT job_id, job_name, schedule.type as s_type, date, time, group_concat(DISTINCT weekday) AS weekdays, 
            time_interval, delete_options.type as d_type, days, hours
            FROM job 
            INNER JOIN schedule USING(schedule_id)
            LEFT JOIN schedule_weekday USING(schedule_id)
            INNER JOIN delete_options USING(delete_options_id)
            GROUP BY(job_id)
            """).fetchall()

        return res


def get_job_run_info(job_id):
    """Gibt den Namen eines Jobs, dessen Parameter sowie den Namen der zugehörigen JSON-Datei zurück.

    :param job_id: id des Jobs
    """
    with db.open_con() as con:
        res = con.execute("""
        SELECT job_name, json_file_name, key, value, job_config.type as type, position, delete_options.type as d_type, k_count, fix_names_count
        FROM job 
        INNER JOIN delete_options USING(delete_options_id)
        INNER JOIN job_topic_position USING(job_id)
        LEFT JOIN job_config USING(position_id) 
        INNER JOIN steps USING(steps_id)
        WHERE job_id=?
        ORDER BY(position)
        """, [job_id]).fetchall()

        job_name = res[0]["job_name"]
        steps_name = res[0]["json_file_name"]
        config = {}

        # Init Config with deletion settings
        if res[0]["d_type"] == "keep_count":
            config["keep_count"] = res[0]["k_count"]

        if res[0]["d_type"] == "fix_names":
            config["fix_names"] = {"count": res[0]["fix_names_count"]}

        # Handle Multiple Topics
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


def get_datasource_schedules():
    """ Gibt alle angelegten Datenquellen mitsamt ihren Zeitplänen zurück.

    """
    with db.open_con() as con:
        res = con.execute(
            """
            SELECT DISTINCT datasource_id, datasource_name, schedule_historisation.type as s_type, date, time, group_concat(DISTINCT weekday) AS weekdays, 
            time_interval
            FROM datasource
            INNER JOIN schedule_historisation USING(schedule_historisation_id)
            LEFT JOIN schedule_historisation_weekday USING(schedule_historisation_id)
            GROUP BY(datasource_id)
            """).fetchall()

        return res


def get_datasource_run_info(datasource_id):
    """Gibt den Namen einer Datenquelle und den Namen der zugehörigen JSON-Datei zurück.

    :param datasource_id: id des Jobs
    :type datasource_id: int
    """
    with db.open_con() as con:
        res = con.execute("SELECT datasource_name FROM datasource WHERE datasource_id=?",
                          [datasource_id]).fetchall()
        infoprovider_name = con.execute("SELECT infoprovider_name FROM infoprovider INNER JOIN datasource "
                                        "USING (infoprovider_id) WHERE datasource_id=?",
                                        [datasource_id]).fetchone()["infoprovider_name"]

        datasource_name = infoprovider_name.replace(" ", "-") + "_" + res[0]["datasource_name"].replace(" ", "-")

        return datasource_name, datasource_name, {}


def insert_log(job_id: int, state: int, start_time: datetime, pipeline_type='JOB'):
    with db.open_con() as con:
        con.execute("INSERT INTO job_logs(job_id, state, start_time, pipeline_type) values (?, ?, ?, ?)", [job_id, state, start_time, pipeline_type])
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


def get_interval(res):
    return INTERVAL.get(res["time_interval"])


def insert_next_execution_time(id: int, next_execution: str, is_job: bool = False):
    with db.open_con() as con:
        if is_job:
            schedule_id = con.execute("SELECT schedule_id FROM job WHERE job_id = ?", [id]).fetchone()["schedule_id"]
            con.execute("UPDATE schedule SET next_execution = ? WHERE schedule_id = ?", [next_execution, schedule_id])
        else:
            schedule_id = con.execute("SELECT schedule_historisation_id FROM datasource WHERE datasource_id = ?", [id]).fetchone()["schedule_historisation_id"]
            con.execute("UPDATE schedule_historisation SET next_execution = ? WHERE schedule_historisation_id = ?", [next_execution, schedule_id])
        con.commit()
