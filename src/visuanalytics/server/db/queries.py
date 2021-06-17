import json
import os
import shutil

import humps
import copy
from base64 import b64encode

from visuanalytics.server.db import db
from visuanalytics.util.config_manager import get_private, set_private
from visuanalytics.util.resources import IMAGES_LOCATION as IL, AUDIO_LOCATION as AL, MEMORY_LOCATION as ML, open_resource

from visuanalytics.util.infoprovider_utils import generate_step_transform

INFOPROVIDER_LOCATION = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../resources/infoprovider"))
VIDEOJOB_LOCATION = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../resources/steps"))
DATASOURCE_LOCATION = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../resources/datasources"))
STEPS_LOCATION = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../resources/steps"))
IMAGE_LOCATION = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../resources", IL))
AUDIO_LOCATION = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../resources", AL))
MEMORY_LOCATION = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../resources", ML))


def get_last_infoprovider_id():
    con = db.open_con_f()
    last_id = 0
    count = con.execute("SELECT COUNT(*) FROM infoprovider").fetchone()["COUNT(*)"]
    if count != 0:
        last_id = con.execute("SELECT seq FROM sqlite_sequence WHERE name='infoprovider'").fetchone()["seq"]
    return last_id


def get_infoprovider_list():
    """
    Methode für das Laden aller Infoprovider.

    :return: Liste von Namen und ID's aller Infoprovider.
    """
    con = db.open_con_f()
    res = con.execute("SELECT infoprovider_id, infoprovider_name FROM infoprovider")
    return [{"infoprovider_id": row["infoprovider_id"], "infoprovider_name": row["infoprovider_name"]} for row in res]


def update_url_pattern(pattern):
    """
    Falls die URL, die für eine Request übergeben wird, schon eine Query enthält, wird diese aufgelöst,
    damit die Paramter dem Request-Objekt als Dictionary übergeben werden können

    :param pattern: URL mit Query (http...?...)
    :type pattern: str
    :return: Die Basis-URL ohne Query-Teil und Paramter als Dictionary
    """
    params = {}
    pattern = pattern.split("?")
    url = pattern[0]
    if len(pattern) > 1:
        param_list = pattern[1].split("&")
        for param in param_list:
            values = param.split("=")
            params.update({
                values[0]: values[1]
            })

    return url, params


def insert_infoprovider(infoprovider):
    """
    Methode für das einfügen eines neuen Infoproviders.

    :param infoprovider: Ein Dictionary welches den Namen des Infoproviders, den Schedule sowie die Steps 'api', 'transform' und 'storing' enthält.
    :return: Gibt einen boolschen Wert zurück welcher den Status.
    """
    con = db.open_con_f()
    infoprovider_name = infoprovider["infoprovider_name"]
    datasources = infoprovider["datasources"]
    diagrams = infoprovider["diagrams"]

    # Api obj vorbereiten
    api_step = {
        "type": "request_multiple_custom",
        "use_loop_as_key": True,
        "steps_value": [],
        "requests": []
    }
    for datasource in datasources:
        api_key_name = f"{infoprovider['infoprovider_name']}_{datasource['datasource_name']}_APIKEY" if datasource["api"]["method"] != "noAuth" and datasource["api"]["method"] != "BasicAuth" else None

        header, parameter = generate_request_dicts(datasource["api"]["api_info"], datasource["api"]["method"], api_key_name=api_key_name)

        url, params = update_url_pattern(datasource["api"]["api_info"]["url_pattern"])
        parameter.update(params)

        req_data = {
            "type": datasource["api"]["api_info"]["type"],
            "method": datasource["api"]["api_info"].get("method", "GET"),
            "url_pattern": url,
            "headers": header,
            "params": parameter,
            "response_type": datasource["api"]["response_type"]
        }
        if api_key_name:
            req_data.update({"api_key_name": api_key_name})

        api_step["steps_value"].append(datasource["datasource_name"])
        api_step["requests"].append(req_data)

    # Transform obj vorbereiten
    transform_step = []
    for datasource in datasources:
        transform_step += _generate_transform(remove_toplevel_key(datasource["formulas"]), remove_toplevel_key(datasource["transform"]))

    # Json für das Speicher vorbereiten
    infoprovider_json = {
        "name": infoprovider_name,
        "api": api_step,
        "transform": transform_step,
        "images": diagrams,
        "run_config": {},
        "datasources": infoprovider["datasources"],
        "diagrams_original": infoprovider["diagrams_original"],
        "arrays_used_in_diagrams": infoprovider["arrays_used_in_diagrams"]
    }

    # Nachschauen ob ein Infoprovider mit gleichem Namen bereits vorhanden ist
    count = con.execute("SELECT COUNT(*) FROM infoprovider WHERE infoprovider_name=?", [infoprovider_name]).fetchone()["COUNT(*)"]
    if count > 0:
        return False

    # Infoprovider-Json in den Ordner "/infoproviders" speichern
    with open_resource(_get_infoprovider_path(infoprovider_name.replace(" ", "-")), "wt") as f:
        json.dump(infoprovider_json, f)

    infoprovider_id = con.execute("INSERT INTO infoprovider (infoprovider_name) VALUES (?)",
                                  [infoprovider_name]).lastrowid

    for datasource in datasources:
        datasource_name = datasource["datasource_name"]

        api_key_name = f"{infoprovider['infoprovider_name']}_{datasource['datasource_name']}_APIKEY" if datasource["api"]["method"] != "noAuth" and datasource["api"]["method"] != "BasicAuth" else None

        header, parameter = generate_request_dicts(datasource["api"]["api_info"], datasource["api"]["method"], api_key_name=api_key_name)

        url, params = update_url_pattern(datasource["api"]["api_info"]["url_pattern"])
        parameter.update(params)

        req_data = {
            "type": datasource["api"]["api_info"]["type"],
            "method": datasource["api"]["api_info"].get("method", "GET"),
            "url_pattern": url,
            "headers": header,
            "params": parameter,
            "response_type": datasource["api"]["response_type"]
        }
        if api_key_name:
            req_data.update({"api_key_name": api_key_name})

        datasource_api_step = {
            "type": "request_multiple_custom",
            "use_loop_as_key": True,
            "steps_value": [datasource_name],
            "requests": [req_data]
        }

        # Datasource obj vorbereiten
        datasource_json = {
            "name": datasource_name,
            "api": datasource_api_step,
            "transform": _generate_transform(remove_toplevel_key(datasource["formulas"]), remove_toplevel_key(datasource["transform"])),
            "storing": remove_toplevel_key(datasource["storing"]) if datasource["api"]["api_info"]["type"] != "request_memory" else [],
            "run_config": {}
        }

        # Datasource-Json in den Ordner "/datasources" speichern
        with open_resource(_get_datasource_path(infoprovider_name.replace(" ", "-") + "_" + datasource_name.replace(" ", "-")), "wt") as f:
            json.dump(datasource_json, f)

        if datasource["api"]["api_info"]["type"] != "request_memory":
            # Schedule für Datasource abspeichern
            schedule_historisation = datasource["schedule"]
            schedule_historisation_id = _insert_historisation_schedule(con, schedule_historisation)

            # Datenquelle in Datenbank speichern
            con.execute("INSERT INTO datasource (datasource_name, schedule_historisation_id, infoprovider_id)"
                        " VALUES (?, ?, ?)",
                        [datasource_name, schedule_historisation_id, infoprovider_id])
        else:
            con.execute("INSERT INTO datasource (datasource_name, infoprovider_id) VALUES (?, ?)",
                        [datasource_name, infoprovider_id])

    con.commit()

    return True


def insert_video_job(video, update=False, job_id=None):
    """
    Methode für das einfügen und aktualisieren eines Videojobs.
    Falls ein bestehender Videojob aktualisiert werden soll, muss die job_id angegeben werden.

    :param video: Ein Dictionary, welches die Konfiguration eines Videojobs enthält.
    :type video: dict
    :param update: Wahrheitswert, der aussagt, ob ein bestehender Videojob aktualisiert werden soll.
    :type update: bool
    :param job_id: ID des schon bestehenden Videojobs.
    :type job_id: int
    :return: Gibt einen boolschen Wert zurück (Status), oder eine Fehlermeldung (bei Aktualisierungen).
    """
    video_name = video["name"]
    for infoprovider_name in video["infoprovider_names"]:
        with open_resource(_get_infoprovider_path(infoprovider_name.replace(" ", "-")), "r") as f:
            infoprovider = json.load(f)
        # print("loaded infoprovider:", infoprovider)

        api_config = video.get("api", None)
        if api_config:
            video["api"]["steps_value"] += infoprovider["api"]["steps_value"]
            video["api"]["requests"] += infoprovider["api"]["requests"]
        else:
            video["api"] = infoprovider["api"]
        # print("video with requests:", video)

        transform_config = video.get("transform", None)
        if transform_config:
            video["transform"] += infoprovider["transform"]
        else:
            video.update({
                "transform": infoprovider["transform"]
            })
        # print("video with transform:", video)

        #video["images"].update(infoprovider["images"])
        diagram_config = video.get("diagrams", None)
        if diagram_config:
            video["diagrams"] += infoprovider["images"]
        else:
            video.update({
                "diagrams": infoprovider["images"]
            })
        # print("video with diagrams:", video)

    video["storing"] = []
    video["run_config"] = {}
    video["presets"] = {}
    video["info"] = ""
    schedule = video.get("schedule", None)
    delete_schedule = video.get("deleteSchedule", {
        "type": "keepCount",
        "keepCount": 2
    })
    if not schedule:
        return False if not update else {"err_msg": "could not read schedule from JSON"}
    # print("complete video configuration:", video)
    with open_resource(_get_videojob_path(video_name.replace(" ", "-")), "wt") as f:
        json.dump(video, f)

    if not update:
        topic_id = add_topic_get_id(video_name, video_name.replace(" ", "-"))
        job = {
            "jobName": video_name,
            "schedule": schedule,
            "deleteSchedule": delete_schedule,
            "topicValues": [
                {
                    "topicId": topic_id
                }
            ]
        }
        insert_job(job, config=False)
    else:
        topic_id = list(filter(lambda x: x["topicName"] == video_name, get_topic_names()))[0]["topicId"]
        job = {
            "jobName": video_name,
            "schedule": schedule,
            "deleteSchedule": delete_schedule,
            "topicValues": [
                {
                    "topicId": topic_id
                }
            ]
        }
        update_job(job_id, job, config=False)
    return True if not update else None


def get_videojob(job_id):
    """
    Methode, die die Konfiguration eines Videojobs zurück in das Format überführt,
    welches für das Frontend zum bearbeiten verständlich ist.

    :param job_id: ID des Videojobs, welcher zuürckgeliefert werden soll.
    :type job_id: int
    :return: JSON für das Frontend.
    """
    job_list = get_job_list()
    print("job_list", job_list)
    videojob = list(filter(lambda x: x["jobId"] == job_id, job_list))[0]
    print("videojob", videojob)

    with open(_get_videojob_path(videojob["jobName"].replace(" ", "-")), "r") as f:
        video_json = json.load(f)

    video_json.pop("api", None)
    video_json.pop("transform", None)
    video_json.pop("storing", None)
    video_json.pop("run_config", None)
    video_json.pop("presets", None)
    video_json.pop("info", None)
    #for infoprovider_name in video_json["infoprovider_names"]:
    #    with open_resource(_get_infoprovider_path(infoprovider_name.replace(" ", "-")), "r") as f:
    #        infoprovider = json.load(f)
    #
    #    for img in list(infoprovider["images"].keys()):
    #        video_json["images"].pop(img, None)
    video_json.pop("diagrams", None)

    return video_json


def show_schedule():
    """
    For Testing purposes only
    """
    con = db.open_con_f()
    res = con.execute("SELECT schedule_historisation_id, type FROM schedule_historisation")
    return [{"schedule_historisation_id": row["schedule_historisation_id"], "type": row["type"]} for row in res]


def show_weekly():
    """
    For testing purposes only
    """
    con = db.open_con_f()
    res = con.execute("SELECT * FROM schedule_historisation_weekday")
    return [{"schedule_weekday_historisation_id": row["schedule_weekday_historisation_id"], "weekday": row["weekday"], "schedule_historisation_id": row["schedule_historisation_id"]} for row in res]


def get_infoprovider_file(infoprovider_id):
    """
    Generiert den Pfad zu der Datei eines gegebenen Infoproviders.

    :param infoprovider_id: ID des Infoproviders.
    :return: Pfad zur Json Datei des Infoproviders.
    """
    con = db.open_con_f()
    # Namen des gegebenen Infoproviders laden
    res = con.execute("SELECT infoprovider_name FROM infoprovider WHERE infoprovider_id = ?",
                      [infoprovider_id]).fetchone()

    return _get_infoprovider_path(res["infoprovider_name"].replace(" ", "-")) if res is not None else None


def get_datasource_file(datasource_id):
    """
    Läd den Pfad zu der Json-Date einger gegebenen Datenquelle

    :param datasource_id: ID der Datenquelle
    :return: Pfad zu Json-Datei der Datenquelle
    """
    con = db.open_con_f()
    # Namen der gegebenen Datenquelle laden
    datasource_name = con.execute("SELECT datasource_name FROM datasource WHERE datasource_id=?",
                                  [datasource_id]).fetchone()["datasource_name"]
    infoprovider_name = con.execute("SELECT infoprovider_name FROM infoprovider INNER JOIN datasource USING (infoprovider_id) WHERE datasource_id=?",
                                    [datasource_id]).fetchone()["infoprovider_name"]

    return _get_datasource_path(infoprovider_name.replace(" ", "-") + "_" + datasource_name.replace(" ", "-")) if datasource_name is not None else None


def get_infoprovider(infoprovider_id):
    """
    Methode für das Laden eines Infoproviders anhand seiner ID.

    :param infoprovider_id: ID des Infoproviders.
    :return: Dictionary welches den Namen, den Ihnalt der Json-Datei sowie den Schedule des Infoproivders enthält.
    """
    infoprovider_json = {}

    # Laden der Json-Datei des Infoproviders
    with open_resource(get_infoprovider_file(infoprovider_id), "r") as f:
        infoprovider_json = json.loads(f.read())

    return {
        "infoprovider_name": infoprovider_json["name"],
        "datasources": infoprovider_json["datasources"],
        "diagrams": infoprovider_json["images"],
        "diagrams_original": infoprovider_json["diagrams_original"],
        "arrays_used_in_diagrams": infoprovider_json["arrays_used_in_diagrams"]
    }


def update_infoprovider(infoprovider_id, updated_data):
    """
    Methode mit der die Daten eines Infoproviders verändert werden können.

    :param infoprovider_id: ID des Infoproviders.
    :param updated_data: Dictionary welches die Keys 'infoprovider_name', 'api', 'transform', 'storing' oder 'schedule' enthalten kann. Ist ein Key nicht vorhanden so werden die entprechenden Daten auch nicht verändert.
    """
    con = db.open_con_f()

    # Testen ob neuer Infoprovider-Name bereits von einem anderen Infoprovider verwendet wird
    count = con.execute("SELECT COUNT(*) FROM infoprovider WHERE infoprovider_name=?",
                        [updated_data["infoprovider_name"]]).fetchone()["COUNT(*)"]
    old_infoprovider_name = con.execute("SELECT infoprovider_name FROM infoprovider WHERE infoprovider_id=?",
                                        [infoprovider_id]).fetchone()

    if count > 0 and old_infoprovider_name["infoprovider_name"] != updated_data["infoprovider_name"]:
        return {"err_msg": f"There already exists an infoprovider with the name {updated_data['infoprovider_name']}"}

    # Neuen Infoprovider-Namen setzen
    con.execute("UPDATE infoprovider SET infoprovider_name =? WHERE infoprovider_id=?",
                [updated_data["infoprovider_name"], infoprovider_id])

    # Infoprovider-Json laden
    file_path = get_infoprovider_file(infoprovider_id)

    with open_resource(file_path, "r") as f:
        infoprovider_json = json.loads(f.read())

    # Update API-Step vorbereiten
    api_step_new = {
        "type": "request_multiple_custom",
        "use_loop_as_key": True,
        "steps_value": [],
        "requests": []
    }

    datasources = updated_data["datasources"]

    for datasource in datasources:
        api_key_name = f"{updated_data['infoprovider_name']}_{datasource['datasource_name']}_APIKEY" if datasource["api"]["method"] != "noAuth" and datasource["api"]["method"] != "BasicAuth" else None

        header, parameter = generate_request_dicts(datasource["api"]["api_info"], datasource["api"]["method"], api_key_name=api_key_name)

        url, params = update_url_pattern(datasource["api"]["api_info"]["url_pattern"])
        parameter.update(params)

        req_data = {
            "type": datasource["api"]["api_info"]["type"],
            "method": datasource["api"]["api_info"].get("method", "GET"),
            "url_pattern": url,
            "headers": header,
            "params": parameter,
            "response_type": datasource["api"]["response_type"]
        }
        if api_key_name:
            req_data.update({"api_key_name": api_key_name})

        api_step_new["steps_value"].append(datasource["datasource_name"])
        api_step_new["requests"].append(req_data)

    # Update Transform-Step vorbereiten
    new_transform = []
    for datasource in datasources:
        new_transform += _generate_transform(remove_toplevel_key(datasource["formulas"]), remove_toplevel_key(datasource["transform"]))

    if new_transform is None:
        return {"err_msg": "could not generate transform-step from formulas"}

    # Inhalt des Json's updaten
    infoprovider_json.update({"name": updated_data["infoprovider_name"]})
    infoprovider_json.update({"api": api_step_new})
    infoprovider_json.update({"transform": new_transform})
    infoprovider_json.update({"images": updated_data["diagrams"]})
    infoprovider_json.update({"datasources": updated_data["datasources"]})

    # Neues Json abspeichern
    with open_resource(file_path, "w") as f:
        json.dump(infoprovider_json, f)

    _remove_datasources(con, infoprovider_id)

    for datasource in updated_data["datasources"]:
        datasource_name = datasource["datasource_name"]

        api_key_name = f"{updated_data['infoprovider_name']}_{datasource['datasource_name']}_APIKEY" if datasource["api"]["method"] != "noAuth" and datasource["api"]["method"] != "BasicAuth" else None

        header, parameter = generate_request_dicts(datasource["api"]["api_info"], datasource["api"]["method"], api_key_name=api_key_name)

        url, params = update_url_pattern(datasource["api"]["api_info"]["url_pattern"])
        parameter.update(params)

        req_data = {
            "type": datasource["api"]["api_info"]["type"],
            "method": datasource["api"]["api_info"].get("method", "GET"),
            "url_pattern": url,
            "headers": header,
            "params": parameter,
            "response_type": datasource["api"]["response_type"]
        }
        if api_key_name:
            req_data.update({"api_key_name": api_key_name})

        datasource_api_step = {
            "type": "request_multiple_custom",
            "use_loop_as_key": True,
            "steps_value": [datasource_name],
            "requests": [req_data]
        }

        # Datasource obj vorbereiten
        datasource_json = {
            "name": datasource_name,
            "api": datasource_api_step,
            "transform": _generate_transform(remove_toplevel_key(datasource["formulas"]), remove_toplevel_key(datasource["transform"])),
            "storing": remove_toplevel_key(datasource["storing"]) if datasource["api"]["api_info"]["type"] != "request_memory" else [],
            "run_config": {}
        }

        # Datasource-Json in den Ordner "/datasources" speichern
        with open_resource(_get_datasource_path(updated_data["infoprovider_name"].replace(" ", "-") + "_" + datasource_name.replace(" ", "-")), "wt") as f:
            json.dump(datasource_json, f)

        if datasource["api"]["api_info"]["type"] != "request_memory":
            # Schedule für Datasource abspeichern
            schedule_historisation = datasource["schedule"]
            schedule_historisation_id = _insert_historisation_schedule(con, schedule_historisation)

            # Datenquelle in Datenbank speichern
            con.execute("INSERT INTO datasource (datasource_name, schedule_historisation_id, infoprovider_id)"
                        " VALUES (?, ?, ?)",
                        [datasource_name, schedule_historisation_id, infoprovider_id])
        else:
            con.execute("INSERT INTO datasource (datasource_name, infoprovider_id) VALUES (?, ?)",
                        [datasource_name, infoprovider_id])

    con.commit()
    return None


def delete_infoprovider(infoprovider_id):
    """
    Entfernt den Infoprovider mit der gegebenen ID.

    :param infoprovider_id: ID des Infoproviders.
    :return: Boolschen Wert welcher angibt ob das Löschen erfolgreich war.
    """
    con = db.open_con_f()
    # Prüfen ob der Infoproivder vorhanden ist
    res = con.execute("SELECT * FROM infoprovider WHERE infoprovider_id = ?",
                      [infoprovider_id]).fetchone()
    if res is not None:
        # Json-Datei von Datenquelle, sowie zugehörige Einträge in Datenbank löschen
        _remove_datasources(con, infoprovider_id, remove_historised=True)

        # Json-Datei von Infoprovider und zugehörige Ordner löschen
        file_path = get_infoprovider_file(infoprovider_id)
        shutil.rmtree(os.path.join(IMAGE_LOCATION, res["infoprovider_name"]), ignore_errors=True)
        os.remove(file_path)

        # Infoprovider aus Datenbank löschen
        con.execute("DELETE FROM infoprovider WHERE infoprovider_id = ?", [infoprovider_id])
        con.commit()
        return True
    con.commit()
    return False


def delete_videojob(videojob_id):
    """
    Entfernt den Videojob mit der gegebenen ID.

    :param videojob_id: ID des Videojobs.
    :return: Boolschen Wert welcher angibt ob das Löschen erfolgreich war.
    """
    job_list = get_job_list()
    topic_id = list(filter(lambda x: x["jobId"] == videojob_id, job_list))[0]["topicValues"][0]["topicId"]
    delete_topic(topic_id)
    delete_job(videojob_id)

    return True


def get_topic_names():
    con = db.open_con_f()
    res = con.execute("SELECT steps_id, steps_name, json_file_name FROM steps")
    return [{"topicId": row["steps_id"], "topicName": row["steps_name"],
             "topicInfo": _get_topic_info(row["json_file_name"])} for row in res]


def get_topic_file(topic_id):
    con = db.open_con_f()
    res = con.execute("SELECT json_file_name FROM steps WHERE steps_id = ?", [topic_id]).fetchone()

    return _get_steps_path(res["json_file_name"].replace(".json", "")) if res is not None else None


def delete_topic(topic_id):
    con = db.open_con_f()
    file_path = get_topic_file(topic_id)
    res = con.execute("DELETE FROM steps WHERE steps_id = ?", [topic_id])
    con.commit()

    if (res.rowcount > 0):
        os.remove(file_path)


def add_topic_get_id(name, file_name):
    con = db.open_con_f()
    topic_id = con.execute("INSERT INTO steps (steps_name,json_file_name)VALUES (?, ?)",
                [name, file_name]).lastrowid
    con.commit()
    return topic_id


def add_topic(name, file_name):
    con = db.open_con_f()
    con.execute("INSERT INTO steps (steps_name,json_file_name)VALUES (?, ?)",
                [name, file_name])
    con.commit()


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
        SELECT 
        job_id, job_name, 
        schedule.type AS s_type, time, STRFTIME('%Y-%m-%d', date) as date, time_interval, next_execution,
        delete_options.type AS d_type, days, hours, k_count, fix_names_count,
        GROUP_CONCAT(DISTINCT weekday) AS weekdays,
        COUNT(DISTINCT position_id) AS topic_count,
        GROUP_CONCAT(DISTINCT steps.steps_id || "::" || steps_name || "::" || json_file_name || "::" || position) AS topic_positions,
        GROUP_CONCAT(DISTINCT position || "::" || key || "::" || value || "::" || job_config.type) AS param_values
        FROM job 
        INNER JOIN schedule USING (schedule_id)
        LEFT JOIN schedule_weekday USING (schedule_id)
        INNER JOIN delete_options USING (delete_options_id)
        INNER JOIN job_topic_position USING (job_id) 
        LEFT JOIN job_config USING (position_id) 
        INNER JOIN steps USING (steps_id)
        GROUP BY (job_id)
    """)
    return [_row_to_job(row) for row in res]


def insert_job(job, config=True):
    con = db.open_con_f()
    job_name = job["jobName"]
    schedule = job["schedule"]
    delete_schedule = job["deleteSchedule"]
    topic_values = job["topicValues"]

    schedule_id = _insert_schedule(con, schedule)
    delete_options_id = _insert_delete_options(con, delete_schedule)

    job_id = con.execute(
        "INSERT INTO job(job_name, schedule_id, delete_options_id) "
        "VALUES(?, ?, ?)",
        [job_name, schedule_id, delete_options_id]).lastrowid

    _insert_param_values(con, job_id, topic_values, config=config)
    con.commit()


def delete_job(job_id):
    con = db.open_con_f()
    con.execute("PRAGMA foreign_keys = ON")
    schedule_id = con.execute("SELECT schedule_id FROM job WHERE job_id=?", [job_id]).fetchone()["schedule_id"]
    delete_options_id = con.execute("SELECT delete_options_id FROM job WHERE job_id=?", [job_id]).fetchone()[
        "delete_options_id"]
    con.execute("DELETE FROM schedule WHERE schedule_id=?", [schedule_id])
    con.execute("DELETE FROM delete_options WHERE delete_options_id=?", [delete_options_id])
    con.commit()


def update_job(job_id, updated_data, config=True):
    con = db.open_con_f()
    for key, value in updated_data.items():
        if key == "jobName":
            con.execute("UPDATE job SET job_name=? WHERE job_id=?", [value, job_id])
        if key == "schedule":
            old_schedule_id = con.execute("SELECT schedule_id FROM job WHERE job_id=?", [job_id]).fetchone()[
                "schedule_id"]
            con.execute("DELETE FROM schedule WHERE schedule_id=?", [old_schedule_id])
            con.execute("DELETE FROM schedule_weekday WHERE schedule_id=?", [old_schedule_id])
            schedule_id = _insert_schedule(con, value)
            con.execute("UPDATE job SET schedule_id=? WHERE job_id=?", [schedule_id, job_id])
        if key == "deleteSchedule":
            old_delete_options_id = \
                con.execute("SELECT delete_options_id FROM job WHERE job_id=?", [job_id]).fetchone()[
                    "delete_options_id"]
            con.execute("DELETE FROM delete_options WHERE delete_options_id=?", [old_delete_options_id])
            delete_options_id = _insert_delete_options(con, value)
            con.execute("UPDATE job SET delete_options_id=? WHERE job_id=?", [delete_options_id, job_id])
        if key == "topic_values":
            pos_id_rows = con.execute("SELECT position_id FROM job_topic_position WHERE job_id=?", [job_id])
            pos_ids = [(row["position_id"],) for row in pos_id_rows]
            con.execute("DELETE FROM job_topic_position WHERE job_id=?", [job_id])
            con.executemany("DELETE FROM job_config WHERE position_id=?", pos_ids)
            _insert_param_values(con, job_id, value, config=config)
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


def generate_request_dicts(api_info, method, api_key_name=None):
    """
    Falls die API einen Key benötigt, gibt es verschiedene Varianten, wie der Key in der Request übergeben wird (Query,
    Header, verschlüsselt etc.). Dazu wird der Key in dem entsprechenden Dict verpackt bzw. der eigentliche Key wird in
    der privaten Konfig-Datei abgelegt.

    :param api_info: Infos über die Request (Typ, URL etc.)
    :type api_info: dict
    :param method: Methode, wie der Key in der Request übergeben werden soll
    :type method: str
    :param api_key_name: Name des Keys, falls er in der privaten Konfig-Datei abgespeichert werden soll
    :type api_key_name: str
    :return: Aufbereitete Header- und Parameter-Dictionaries
    """
    header = {}
    parameter = {}
    if method != "noAuth":
        api_key_for_query = api_info["api_key_name"].split("||")[0]
        api_key = api_info["api_key_name"].split("||")[1]
    else:
        return header, parameter

    if api_key_name:
        private_config = get_private()
        private_config["api_keys"].update({api_key_name: api_key})
        set_private(private_config)

    # Prüft ob und wie sich das Backend bei der API authetifizieren soll und setzt die entsprechenden Parameter
    if method == "BearerToken":
        header.update({"Authorization": "Bearer " + ("{_api_key}" if api_key_name else api_key)})
    else:
        if method == "BasicAuth":
            header.update({"Authorization": "Basic " + b64encode(api_key_for_query.encode("utf-8") + b":" + api_key.encode("utf-8"))
                          .decode("utf-8")})
        elif method == "KeyInHeader":
            header.update({api_key_for_query: "{_api_key}" if api_key_name else api_key})
        elif method == "KeyInQuery":
            parameter.update({api_key_for_query: "{_api_key}" if api_key_name else api_key})

    return header, parameter


def remove_toplevel_key(obj):
    if type(obj) == list:
        for x in range(len(obj)):
            obj[x] = remove_toplevel_key(obj[x])
    elif type(obj) == dict:
        for key in list(obj.keys()):
            obj[key] = remove_toplevel_key(obj[key])
    elif type(obj) == str:
        obj = obj.replace("$toplevel_array$", "").replace("||", "|").replace("| ", " ")
        if obj[-1] == "|":
            obj = obj[:-1]
    return obj


def _insert_param_values(con, job_id, topic_values, config=True):
    #print("topic_value in _insert_param_values:", topic_values)
    for pos, t in enumerate(topic_values):
        position_id = con.execute("INSERT INTO job_topic_position(job_id, steps_id, position) VALUES (?, ?, ?)",
                                  [job_id, t["topicId"], pos]).lastrowid
        if config:
            jtkvt = [(position_id,
                      k,
                      _to_untyped_value(v["value"], humps.decamelize(v["type"])),
                      humps.decamelize(v["type"]))
                     for k, v in t["values"].items()]
            con.executemany("INSERT INTO job_config(position_id, key, value, type) VALUES(?, ?, ?, ?)", jtkvt)


def _generate_transform(formulas, old_transform):
    transform = []
    for method in old_transform:
        transform.append(method)
    for formula in formulas:
        transform_part = generate_step_transform(formula["formelString"], formula["formelName"], copy=formula.get("copy_key", None), array_key=formula.get("array_key", None), loop_key=formula.get("loop_key", ""), decimal=formula.get("decimal", 2))
        if transform_part is None:
            return None
        transform += transform_part
    return transform


def _remove_datasources(con, infoprovider_id, remove_historised=False):
    res = con.execute("SELECT * FROM datasource WHERE infoprovider_id=?", [infoprovider_id])
    infoprovider_name = con.execute("SELECT infoprovider_name FROM infoprovider WHERE infoprovider_id=?", [infoprovider_id]).fetchone()["infoprovider_name"]
    for row in res:
        file_path = get_datasource_file(row["datasource_id"])
        os.remove(file_path)
        if remove_historised:
            shutil.rmtree(os.path.join(MEMORY_LOCATION, infoprovider_name.replace(" ", "-") + "_" + row["datasource_name"].replace(" ", "-")), ignore_errors=True)

        _remove_historisation_schedule(con, row["datasource_id"])
        con.execute("DELETE FROM datasource WHERE datasource_id=?", [row["datasource_id"]])


def _insert_historisation_schedule(con, schedule):
    """
    Trägt gegebenen Schedule in die Tabellen schedule_historisation und schedule_historisation_weekday ein.

    :param con: Variable welche auf die Datenbank verweist.
    :param schedule: Schedule als Dictionary.
    """
    type, time, date, weekdays, time_interval = _unpack_schedule(schedule)
    schedule_id = con.execute("INSERT INTO schedule_historisation(type, time, date, time_interval) VALUES (?, ?, ?, ?)",
                              [type, time, date, time_interval]).lastrowid
    if type == "weekly":
        id_weekdays = [(schedule_id, d) for d in weekdays]
        con.executemany("INSERT INTO schedule_historisation_weekday(schedule_historisation_id, weekday) VALUES(?, ?)",
                        id_weekdays)
    return schedule_id


def _remove_historisation_schedule(con, datasource_id):
    """
    Entfernt den Schedule eines Infoproviders.

    :param con: Variable welche auf die Datenbank verweist.
    :param infoprovider_id: ID des Infoproviders.
    """
    res = con.execute("SELECT schedule_historisation_id, type FROM schedule_historisation INNER JOIN datasource USING "
                      "(schedule_historisation_id) WHERE datasource_id=?", [datasource_id]).fetchone()
    if res is None:
        return
    if res["type"] == "weekly":
        con.execute("DELETE FROM schedule_historisation_weekday WHERE schedule_historisation_id=?",
                    [res["schedule_historisation_id"]])

    con.execute("DELETE FROM schedule_historisation WHERE schedule_historisation_id=?",
                [res["schedule_historisation_id"]])


def _insert_schedule(con, schedule):
    type, time, date, weekdays, time_interval = _unpack_schedule(schedule)
    schedule_id = con.execute("INSERT INTO schedule(type, time, date, time_interval) VALUES (?, ?, ?, ?)",
                              [type, time, date, time_interval]).lastrowid
    if type == "weekly":
        id_weekdays = [(schedule_id, d) for d in weekdays]
        con.executemany("INSERT INTO schedule_weekday(schedule_id, weekday) VALUES(?, ?)", id_weekdays)
    return schedule_id


def _insert_delete_options(con, delete_schedule):
    type, days, hours, keep_count, fix_names_count = _unpack_delete_schedule(delete_schedule)
    delete_options_id = con.execute(
        "INSERT INTO delete_options(type, days, hours, k_count, fix_names_count) VALUES (?, ?, ?, ?, ?)",
        [type, days, hours, keep_count, fix_names_count]).lastrowid
    return delete_options_id


def _row_to_job(row):
    job_id = row["job_id"]
    job_name = row["job_name"]
    weekdays = str(row["weekdays"]).split(",") if row["weekdays"] is not None else []
    param_values = row["param_values"]

    s_type = row["s_type"]
    time = row["time"]
    schedule = {
        "type": humps.camelize(s_type)
    }

    if s_type == "daily":
        schedule = {**schedule, "time": time}
    if s_type == "weekly":
        schedule = {**schedule, "time": time, "weekdays": [int(d) for d in weekdays]}
    if s_type == "on_date":
        schedule = {**schedule, "time": time, "date": row["date"]}
    if s_type == "interval":
        schedule = {**schedule, "interval": row["time_interval"], "nextExecution": row["next_execution"]}

    d_type = row["d_type"]
    delete_schedule = {
        "type": humps.camelize(d_type)
    }
    if d_type == "on_day_hour":
        delete_schedule = {**delete_schedule, "removalTime": {"days": int(row["days"]), "hours": int(row["hours"])}}
    if d_type == "keep_count":
        delete_schedule = {**delete_schedule, "keepCount": int(row["k_count"])}
    if d_type == "fix_names":
        delete_schedule = {**delete_schedule, "count": int(row["fix_names_count"])}

    topic_values = [{}] * (int(row["topic_count"]))
    for tp_s in row["topic_positions"].split(","):
        tp = tp_s.split("::")
        topic_id = tp[0]
        topic_name = tp[1]
        json_file_name = tp[2]
        position = int(tp[3])
        run_config = _get_topic_steps(json_file_name)["run_config"]
        params = humps.camelize(_to_param_list(run_config))
        topic_values[position] = {
            "topicId": topic_id,
            "topicName": topic_name,
            "params": params,
            "values": {}
        }
    if param_values is not None:
        for vals_s in param_values.split(","):
            vals = vals_s.split("::")
            position = int(vals[0])
            name = vals[1]
            u_val = vals[2]
            type = vals[3]
            t_val = to_typed_value(u_val, type)
            topic_values[position]["values"] = {
                **topic_values[position]["values"],
                name: t_val
            }

    return {
        "jobId": job_id,
        "jobName": job_name,
        "schedule": schedule,
        "deleteSchedule": delete_schedule,
        "topicValues": topic_values
    }


def _get_infoprovider_path(infoprovider_name: str):
    return os.path.join(INFOPROVIDER_LOCATION, infoprovider_name) + ".json"

def _get_videojob_path(video_name: str):
    return os.path.join(VIDEOJOB_LOCATION, video_name) + ".json"


def _get_datasource_path(datasource_name: str):
    return os.path.join(DATASOURCE_LOCATION, datasource_name) + ".json"


def _get_steps_path(json_file_name: str):
    return os.path.join(STEPS_LOCATION, json_file_name) + ".json"


def _get_image_path(json_file_name: str, folder: str, image_type: str):
    if folder != '':
        os.makedirs(os.path.join(IMAGE_LOCATION, folder), exist_ok=True)
        return os.path.join(IMAGE_LOCATION, folder, json_file_name) + "." + image_type
    else:
        return os.path.join(IMAGE_LOCATION, json_file_name) + "." + image_type


def _get_audio_path(json_file_name: str):
    return os.path.join(AUDIO_LOCATION, json_file_name) + ".mp3"


def _get_topic_info(json_file_name: str):
    try:
        return _get_topic_steps(json_file_name).get("info", "")
    except Exception:
        return ""


def _get_topic_steps(json_file_name: str):
    path_to_json = _get_steps_path(json_file_name.replace(".json", ""))
    with open(path_to_json, encoding="utf-8") as fh:
        return json.loads(fh.read())


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


def _unpack_schedule(schedule):
    type = humps.decamelize(schedule["type"])
    time = schedule["time"] if type != "interval" else None
    date = schedule["date"] if type == "on_date" else None
    time_interval = schedule["timeInterval"] if type == "interval" else None
    weekdays = schedule["weekdays"] if type == "weekly" else None
    return type, time, date, weekdays, time_interval


def _unpack_delete_schedule(delete_schedule):
    delete_type = humps.decamelize(delete_schedule["type"])
    days = delete_schedule["removalTime"]["days"] if delete_type == "on_day_hour" else None
    hours = delete_schedule["removalTime"]["hours"] if delete_type == "on_day_hour" else None
    keep_count = delete_schedule["keepCount"] if delete_type == "keep_count" else None
    fix_names_count = delete_schedule["count"] if delete_type == "fix_names" else None
    return delete_type, days, hours, keep_count, fix_names_count


def _to_param_list(run_config):
    return [{**{"name": key},
             **({**value, "type": humps.camelize(value["type"])}
                if value["type"] != "sub_params"
                else {**value, "type": "subParams", "sub_params": _to_param_list(value["sub_params"])})}
            for key, value in run_config.items()]
