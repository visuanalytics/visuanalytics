from datetime import time, date

from visuanalytics.server.db import db


def create_job(steps_id: int):
    """Erstelt einen Job in der Datenbank

    :param steps_id: id der vom job auszuführenden Schritte.
    :type steps_id: int
    """
    with db.connect() as con:
        con.execute("insert into job(steps) values (?)", [steps_id])
        con.commit()


def create_schedule(job_id: int, exec_time: time, exec_date: date = None, weekday: int = None, daily: bool = None):
    """Erstellt einen zeitplan für einen job.

    Es können mehrere zeitpläne für einen job exsistieren, diese werden dann alle unabhänig voneinander ausgeführt.
    Die zeit muss immer angegeben werden, die werte date und weekday, und daily schließen sich gegenseitig aus, einer muss allerdings vorhanden sein.

    :param job_id: id es zugehörigen jobs.
    :param exec_time: zeit andem der Job ausgeführt werden soll.
    :param exec_date: Datum an dem der job ausgeführt werden soll. Wird ein Datum angegeben wird der job nur einmalig ausgeführt. (optional)
    :param weekday: Wochentag an dem der job ausgeführt werden soll. (optional)
    :param daily: wenn True wird der job jeden tag ausgeführt. (optional)
    """
    # TODO(max) check if just on from date, weekday or daily
    # TODO(max) check if exsits an just create entry to jbo_schedule

    with db.connect() as con:
        con.execute("insert into schedule(date, time, weekday, daily) values (?, ?, ?, ?)", (
            None if exec_date is None else exec_date.strftime("%Y-%m-%d"),
            exec_time.strftime("%H:%M"),
            weekday, daily))
        schedule_id = con.execute("SELECT last_insert_rowid()").fetchone()
        con.execute("insert into job_schedule(job_id, schedule_id) values (?, ?)", [job_id, schedule_id[0]])

        con.commit()


def create_steps(name: str):
    """Erstellt eine abfolge von schritten."""
    with db.connect() as con:
        con.execute("insert into steps(name) values (?)", [name])
        con.commit()


def get_schedule(job_id: int):
    """Gibt alle Zeitpläne für einen job zurück.
    :param job_id: id des Jobs.
    :type job_id: int.
    :return: alle Zeitpläne
    :rtype: row[]
    """
    with db.connect() as con:
        return con.execute(
            "select date, time, weekday, daily from schedule as s, job_schedule as js where js.job_id == ? "
            "and s.id == js.schedule_id",
            [job_id]).fetchall()


def get_steps(job_id: int):
    """gibt schritte für einen job zurück.

    :param job_id: id des Jobs.
    :type job_id: int.
    :return: die id der zum Job gehörigen Schritten.
    :rtype: row
    """
    with db.connect() as con:
        return con.execute("select name from job as j, steps as s where j.id = ?and j.steps == s.id",
                           [job_id]).fetchone()
