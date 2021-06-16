import json
import os
import shutil
import io
import re

import humps
import copy
from base64 import b64encode, encodebytes
from PIL import Image

from visuanalytics.server.db import db
from visuanalytics.util.config_manager import get_private, set_private
from visuanalytics.util.resources import IMAGES_LOCATION as IL, AUDIO_LOCATION as AL, MEMORY_LOCATION as ML, open_resource

from visuanalytics.util.infoprovider_utils import generate_step_transform

INFOPROVIDER_LOCATION = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../resources/infoprovider"))
DATASOURCE_LOCATION = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../resources/datasources"))
SCENE_LOCATION = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../resources/scenes"))
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
    :type infoprovider: Json-Objekt.

    :return: Gibt an, ob das Hinzufügen erfolgreich war.
    """
    con = db.open_con_f()
    infoprovider_name = infoprovider["infoprovider_name"]
    datasources = infoprovider["datasources"]
    diagrams = infoprovider["diagrams"]
    diagrams_original = infoprovider["diagrams_original"]
    arrays_used_in_diagrams = infoprovider["arrays_used_in_diagrams"]
    transform_step = []

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

        api_step["steps_value"].append(datasource["datasource_name"])
        api_step["requests"].append(req_data)

        # Transform obj vorbereiten
        formulas = copy.deepcopy(datasource["formulas"])
        formula_keys = [formula["formelName"] for formula in datasource["formulas"]]
        [transform_step.append(part) for part in _generate_transform(_extend_formula_keys(formulas, datasource["datasource_name"], formula_keys), datasource["transform"])[:]]

    # Json für das Speicher vorbereiten
    infoprovider_json = {
        "name": infoprovider_name,
        "api": api_step,
        "transform": transform_step,
        "images": diagrams,
        "run_config": {},
        "datasources": datasources,
        "diagrams_original": diagrams_original,
        "arrays_used_in_diagrams": arrays_used_in_diagrams
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
        formulas = copy.deepcopy(datasource["formulas"])
        formula_keys = [formula["formelName"] for formula in datasource["formulas"]]
        transform_step = _generate_transform(_extend_formula_keys(formulas, datasource_name, formula_keys), remove_toplevel_key(datasource["transform"]))
        datasource_json = {
            "name": datasource_name,
            "api": datasource_api_step,
            "transform": transform_step,
            "storing": _generate_storing(datasource["historized_data"], datasource_name) if datasource["api"]["api_info"]["type"] != "request_memory" else [],
            "run_config": {}
        }

        # Datasource-Json in den Ordner "/datasources" speichern
        with open_resource(_get_datasource_path(infoprovider_name.replace(" ", "-") + "_" + datasource_name.replace(" ", "-")), "wt") as f:
            json.dump(datasource_json, f)

        if len(datasource_json["storing"]) > 0 and datasource["api"]["api_info"]["type"] != "request_memory":
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
    Generiert den Pfad zu der Datei eines gegebenen Infoproviders anhand seiner ID.

    :param infoprovider_id: ID des Infoproviders.
    :type infoprovider_id: Integer.

    :return: Pfad zur Json Datei des Infoproviders.
    """
    con = db.open_con_f()
    # Namen des gegebenen Infoproviders laden
    res = con.execute("SELECT infoprovider_name FROM infoprovider WHERE infoprovider_id = ?",
                      [infoprovider_id]).fetchone()
    con.commit()
    return _get_infoprovider_path(res["infoprovider_name"].replace(" ", "-")) if res is not None else None


def get_datasource_file(datasource_id):
    """
    Läd den Pfad zu der Json-Date einger gegebenen Datenquelle

    :param datasource_id: ID der Datenquelle
    :type datasource_id: Integer.

    :return: Pfad zu Json-Datei der Datenquelle
    """
    con = db.open_con_f()
    # Namen der gegebenen Datenquelle laden
    datasource_name = con.execute("SELECT datasource_name FROM datasource WHERE datasource_id=?",
                                  [datasource_id]).fetchone()["datasource_name"]
    infoprovider_name = con.execute("SELECT infoprovider_name FROM infoprovider INNER JOIN datasource USING (infoprovider_id) WHERE datasource_id=?",
                                    [datasource_id]).fetchone()["infoprovider_name"]
    con.commit()
    return _get_datasource_path(infoprovider_name.replace(" ", "-") + "_" + datasource_name.replace(" ", "-")) if datasource_name is not None else None


def get_infoprovider(infoprovider_id):
    """
    Methode für das Laden eines Infoproviders anhand seiner ID.

    :param infoprovider_id: ID des Infoproviders.
    :type infoprovider_id: Integer.

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
    :type infoprovider_id: Integer.
    :param updated_data: Dictionary welches die Keys 'infoprovider_name', 'api', 'transform', 'storing' oder 'schedule' enthalten kann. Ist ein Key nicht vorhanden so werden die entprechenden Daten auch nicht verändert.
    :type updated_data: Json-Objekt.

    :return: Enthält im Fehlerfall Informationen über den aufgetretenen Fehler.
    """
    con = db.open_con_f()
    new_transform = []

    # Testen ob neuer Infoprovider-Name bereits von einem anderen Infoprovider verwendet wird
    count = con.execute("SELECT COUNT(*) FROM infoprovider WHERE infoprovider_name=?",
                        [updated_data["infoprovider_name"]]).fetchone()["COUNT(*)"]
    old_infoprovider_name = con.execute("SELECT infoprovider_name FROM infoprovider WHERE infoprovider_id=?",
                                        [infoprovider_id]).fetchone()["infoprovider_name"]
    con.commit()
    _remove_datasources(con, infoprovider_id)

    if count > 0 and old_infoprovider_name != updated_data["infoprovider_name"]:
        return {"err_msg": f"There already exists an infoprovider with the name {updated_data['infoprovider_name']}"}

    # Infoprovider-Json laden
    old_file_path = _get_infoprovider_path(old_infoprovider_name)

    with open_resource(old_file_path, "r") as f:
        infoprovider_json = json.loads(f.read())

    if old_infoprovider_name != updated_data["infoprovider_name"]:
        os.remove(old_file_path)

    # Neuen Infoprovider-Namen setzen
    con.execute("UPDATE infoprovider SET infoprovider_name =? WHERE infoprovider_id=?",
                [updated_data["infoprovider_name"], infoprovider_id])

    # Update API-Step vorbereiten
    api_step_new = {
        "type": "request_multiple_custom",
        "use_loop_as_key": True,
        "steps_value": [],
        "requests": []
    }

    datasources = updated_data["datasources"]

    for datasource in datasources:
        header, parameter = generate_request_dicts(datasource["api"]["api_info"], datasource["api"]["method"])

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

        api_step_new["steps_value"].append(datasource["datasource_name"])
        api_step_new["requests"].append(req_data)

        # Transform obj vorbereiten
        formulas = copy.deepcopy(datasource["formulas"])
        formula_keys = [formula["formelName"] for formula in datasource["formulas"]]
        new_transform.append(
            _generate_transform(_extend_formula_keys(formulas, datasource["datasource_name"], formula_keys), datasource["transform"]))

    if new_transform is None:
        return {"err_msg": "could not generate transform-step from formulas"}

    # Inhalt des Json's updaten
    infoprovider_json.update({"name": updated_data["infoprovider_name"]})
    infoprovider_json.update({"api": api_step_new})
    infoprovider_json.update({"transform": new_transform})
    infoprovider_json.update({"images": updated_data["diagrams"]})
    infoprovider_json.update({"datasources": updated_data["datasources"]})

    # Neues Json abspeichern
    new_file_path = get_infoprovider_file(infoprovider_id)
    with open_resource(new_file_path, "w") as f:
        json.dump(infoprovider_json, f)

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
        formulas = copy.deepcopy(datasource["formulas"])
        formula_keys = [formula["formelName"] for formula in datasource["formulas"]]
        transform_step = _generate_transform(_extend_formula_keys(formulas, datasource_name, formula_keys),
                                             remove_toplevel_key(datasource["transform"]))
        datasource_json = {
            "name": datasource_name,
            "api": datasource_api_step,
            "transform": transform_step,
            "storing": _generate_storing(datasource["storing"], datasource_name) if datasource["api"]["api_info"]["type"] != "request_memory" else [],
            "run_config": {}
        }

        # Datasource-Json in den Ordner "/datasources" speichern
        with open_resource(_get_datasource_path(updated_data["infoprovider_name"].replace(" ", "-") + "_" + datasource_name.replace(" ", "-")), "wt") as f:
            json.dump(datasource_json, f)

        if len(datasource_json["storing"]) > 0 and datasource["api"]["api_info"]["type"] != "request_memory":
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
    :type infoprovider_id: Integer.

    :return: Boolschen Wert welcher angibt, ob das Löschen erfolgreich war.
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


def insert_scene(scene):
    """
    Fügt eine Szene zu der Datenbank hinzu und legt eine entsprechende Json-Datei an.

    :param scene: Objekt welches die Szene beschreibt.
    :type scene: Json-Objekt mit den Keys 'scene_name', 'used_images', 'used_infoproviders' und 'images'.
                    'used_images' und 'used_infoproviders enthalten eine Liste von ID's der Bilder und Infoprovider.
                    'images' ist die Konfiguration des image-step's.

    :return: Enthält bei einem Fehler Informationen über diesen.
    """
    con = db.open_con_f()

    scene_name = scene["scene_name"]
    used_images = scene["used_images"]
    used_infoproviders = scene["used_infoproviders"]
    images = scene["images"]

    scene_json = {
        "scene_name": scene_name,
        "used_images": used_images,
        "used_infoproviders": used_infoproviders,
        "images": images
    }

    # Prüfen ob scene bereits vorhanden ist
    count = con.execute("SELECT COUNT(*) FROM scene WHERE scene_name=?", [scene_name]).fetchone()["COUNT(*)"]

    if count > 0:
        return "given name already in use"

    # insert into scene
    scene_id = con.execute("INSERT INTO scene (scene_name) VALUES (?)", [scene_name]).lastrowid

    # insert into scene_uses_image
    for used_image in used_images:
        # check if image exists
        count = con.execute("SELECT COUNT(*) FROM image WHERE image_id=?", [used_image]).fetchone()["COUNT(*)"]
        if count == 0:
            return f"image with id {used_image} does not exist"

        con.execute("INSERT INTO scene_uses_image (scene_id, image_id) VALUES (?, ?)", [scene_id, used_image])

    # insert into scene_uses_infoprovider
    for used_infoprovider in used_infoproviders:
        # check if infoprovider exists
        count = con.execute("SELECT COUNT(*) FROM infoprovider WHERE infoprovider_id=?", [used_infoprovider]).fetchone()["COUNT(*)"]
        if count == 0:
            return f"infoprovider with id {used_infoprovider} does not exist"

        con.execute("INSERT INTO scene_uses_infoprovider (scene_id, infoprovider_id) VALUES (?, ?)", [scene_id, used_infoprovider])

    # save <scene-name>.json
    file_path = _get_scene_path(scene_name.replace(" ", "-"))
    print("file_path", file_path)
    with open_resource(file_path, "wt") as f:
        print("writing")
        json.dump(scene, f)

    con.commit()
    return None


def get_scene_file(scene_id):
    """
    Erzeugt den Pfad zu der Json-Datei einer Szene anhand ihrer ID.

    :param scene_id: ID der Szene.
    :type scene_id: Integer.

    :return: Pfad zu der Json-Datei.
    """
    con = db.open_con_f()
    res = con.execute("SELECT scene_name FROM scene WHERE scene_id=?", [scene_id]).fetchone()
    con.commit()
    return _get_scene_path(res["scene_name"]) if res is not None and not None else None


def get_scene(scene_id):
    """
    Läd die Json-Datei der Szene deren ID gegeben wird.

    :param scene_id: ID der Szene.
    :type scene_id: Integer.

    :return: Json-Objekt der Szenen Datei.
    """
    file_path = get_scene_file(scene_id)
    if file_path is None:
        return None
    with open_resource(file_path, "r") as f:
        scene_json = json.loads(f.read())
    return scene_json


def get_scene_list():
    """
    Läd Informationen über alle vorhandenen Szenen.

    :return: Ein Json-Objekt mit den Keys 'scene_id' und 'scene_name' zu jeder Szene.
    """
    con = db.open_con_f()
    res = con.execute("SELECT * FROM scene")
    con.commit()
    return [{"scene_id": row["scene_id"], "scene_name": row["scene_name"]} for row in res]


def update_scene(scene_id, updated_data):
    """
    Updated die Json-Datei und die Tabelleneinträge zu einer Szene.

    :param scene_id: ID der Szene.
    :type scene_id: Integer.
    :param updated_data: Neue Daten der Szene.
    :type updated_data: Json-Objekt.

    :return: Enthölt bei einem Fehler Informationen über diesen.
    """
    con = db.open_con_f()

    scene_name = updated_data["scene_name"]
    used_images = updated_data["used_images"]
    used_infoproviders = updated_data["used_infoproviders"]
    images = updated_data["images"]

    # Altes Json laden
    old_file_path = get_scene_file(scene_id)

    with open_resource(old_file_path, "r") as f:
        scene_json = json.loads(f.read())

    # Testen of Name bereits von anderer Szene verwendet wird
    res = con.execute("SELECT * FROM scene WHERE scene_name=?", [scene_name])
    for row in res:
        if row["scene_id"] != scene_id:
            return {"err_msg": f"There already exists a scene with the name {scene_name}"}

    # Neuen Namen setzen
    con.execute("UPDATE scene SET scene_name=? WHERE scene_id=?", [scene_name, scene_id])

    # Neue Daten in Json-Datei eintragen
    scene_json.update({"scene_name": scene_name})
    scene_json.update({"used_images": used_images})
    scene_json.update({"used_infoproviders": used_infoproviders})
    scene_json.update({"images": images})

    # Alte Einträge aus scene_uses_image entfernen
    con.execute("DELETE FROM scene_uses_image WHERE scene_id=?", [scene_id])

    # Alte Einträge aus scene_uses_infoprovider entfernen
    con.execute("DELETE FROM scene_uses_infoprovider WHERE scene_id=?", [scene_id])

    # Neue Einträge in scene_uses_image einfügen
    for used_image in used_images:
        # Testen ob Image in Tabelle vorhanden ist
        count = con.execute("SELECT COUNT(*) FROM image WHERE image_id=?", [used_image]).fetchone()["COUNT(*)"]
        if count == 0:
            return {"err_msg": f"Image with ID {used_image} does not exist"}

        # In scene_uses_image eintragen
        con.execute("INSERT INTO scene_uses_image (scene_id, image_id) VALUES (?, ?)", [scene_id, used_image])

    # Neue Einträge in scene_uses_infoprovider einfügen
    for used_infoprovider in used_infoproviders:
        # Testen ob Infoproivder in Tabelle vorhanden ist
        count = con.execute("SELECT COUNT(*) FROM infoprovider WHERE infoprovider_id=?", [used_infoprovider]).fetchone()["COUNT(*)"]
        if count == 0:
            return {"err_msg": f"Infoprovider with ID {used_infoprovider} does not exist"}

        # In scene_uses_infoprovider eintragen
        con.execute("INSERT INTO scene_uses_infoprovider (scene_id, infoprovider_id) VALUES (?, ?)", [scene_id, used_infoprovider])

    # Neues Json abspeichern
    new_file_path = _get_scene_path(scene_name)
    if new_file_path != old_file_path:
        os.remove(old_file_path)
    with open_resource(new_file_path, "w") as f:
        json.dump(scene_json, f)

    con.commit()
    return None


def delete_scene(scene_id):
    """
    Entfernt eine Szene aus der Datenbank und löscht die zugehörige Json-Datei.

    :param scene_id: ID der Szene.
    :type scene_id: Integer.

    :return: Zeigt an ob das Löschen erfolgreich war.
    """
    con = db.open_con_f()
    # testen ob scene vorhanden ist
    res = con.execute("SELECT * FROM scene WHERE scene_id=?", [scene_id]).fetchone()

    if res is not None:
        file_path = get_scene_file(scene_id)

        # Eintrag aus scene_uses_image entfernen
        con.execute("DELETE FROM scene_uses_image WHERE scene_id=?", [scene_id])

        # Eintrag aus scene_uses_infoprovider entfernen
        con.execute("DELETE FROM scene_uses_infoprovider WHERE scene_id=?", [scene_id])

        # Json-Datei löschen
        rowcount = con.execute("DELETE FROM scene WHERE scene_id=?", [scene_id]).rowcount
        if rowcount > 0:
            os.remove(file_path)
        con.commit()
        return True
    con.commit()
    return False


def insert_image(image_name):
    """
    Adds an image to the Database.

    :param image_name: Name of the image.
    :param image_type: Type of the image. Supported options ars .png .jpeg and .jpg
    """
    con = db.open_con_f()
    count = con.execute("SELECT COUNT(*) FROM image WHERE image_name=?", [image_name]).fetchone()["COUNT(*)"]

    if count > 0:
        return False

    con.execute("INSERT INTO image (image_name)VALUES (?)", [image_name])
    con.commit()
    return True


def get_scene_image_file(image_id):
    """
    Generated the file-path of an image by its given ID.

    :param image_id: ID of the image.
    """
    con = db.open_con_f()
    res = con.execute("SELECT image_name FROM image WHERE image_id=?", [image_id]).fetchone()
    return get_scene_image_path(res["image_name"]) if res is not None else None


def get_image_list():
    """
    Loads information about all images stored in the database.

    :return: Contains ID, name and image-file for each image contained in the database.
    """
    con = db.open_con_f()
    res = con.execute("SELECT * FROM image")
    con.commit()
    images = []
    for row in res:
        """with open(get_scene_image_path(row["image_name"]), "rb") as f:
            image_file = f.read()
        images.append({
            "image_id": row["image_id"],
            "image_name": row["image_name"],
            "image_file": image_file
        })"""
        with Image.open(get_scene_image_path(row["image_name"]), mode='r') as f:
            byte_arr = f.tobytes()
            encoded_img = encodebytes(byte_arr).decode('ascii')
            images.append({
                "image_id": row["image_id"],
                "image_name": row["image_name"],
                "image_file": encoded_img
            })
    return images
    # return [{"image_id": row["image_id"], "image_name": row["image_name"], "image_file": open(get_scene_image_path(row["image_name"]), "rb")} for row in res]


def delete_scene_image(image_id):
    """
    Removes an image from the database by a given ID.

    :param image_id: ID of an image.
    """
    con = db.open_con_f()

    file_path = get_scene_image_file(image_id)

    # check if image is being used
    count = con.execute("SELECT COUNT(*) FROM scene_uses_image WHERE image_id=?", [image_id]).fetchone()["COUNT(*)"]
    if count > 0:
        return "Error"

    # remove image-file and entry in image-table
    res = con.execute("DELETE FROM image WHERE image_id=?", [image_id])
    if res.rowcount > 0:
        os.remove(file_path)
    con.commit()

    return "Successful"


def get_topic_names():
    con = db.open_con_f()
    res = con.execute("SELECT steps_id, steps_name, json_file_name FROM steps")
    return [{"topicId": row["steps_id"], "topicName": row["steps_name"],
             "topicInfo": _get_topic_info(row["json_file_name"])} for row in res]


def get_topic_file(topic_id):
    con = db.open_con_f()
    res = con.execute("SELECT json_file_name FROM steps WHERE steps_id = ?", [topic_id]).fetchone()

    return _get_steps_path(res["json_file_name"]) if res is not None else None


def delete_topic(topic_id):
    con = db.open_con_f()
    file_path = get_topic_file(topic_id)
    res = con.execute("DELETE FROM steps WHERE steps_id = ?", [topic_id])
    con.commit()

    if (res.rowcount > 0):
        os.remove(file_path)


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
        GROUP_CONCAT(DISTINCT steps.steps_id || ":" || steps_name || ":" || json_file_name || ":" || position) AS topic_positions,
        GROUP_CONCAT(DISTINCT position || ":" || key || ":" || value || ":" || job_config.type) AS param_values
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


def insert_job(job):
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

    _insert_param_values(con, job_id, topic_values)
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


def update_job(job_id, updated_data):
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


def _extend_keys(obj, datasource_name):
    if type(obj) == list:
        for x in range(len(obj)):
            obj[x] = _extend_keys(obj[x], datasource_name)
    elif type(obj) == dict:
        for key in list(obj.keys()):
            obj[key] = _extend_keys(obj[key], datasource_name)
    elif type(obj) == str:
        obj = "_req|" + datasource_name + "|" + obj
    return obj


def _extend_formula_keys(obj, datasource_name, formula_keys):
    if type(obj) == list:
        for x in range(len(obj)):
            obj[x] = _extend_formula_keys(obj[x], datasource_name, formula_keys)
    elif type(obj) == dict:
        if "formelString" in obj:
            obj["formelString"] = _extend_formula_keys(obj["formelString"], datasource_name, formula_keys)
    elif type(obj) == str:
        parts = re.split('[\*/\() \+-]', obj)
        transformed_keys = []
        for part in parts:
            try:
                float(part)
            except Exception:
                if part != "" and part not in formula_keys and part not in transformed_keys:
                    remove_toplevel_key(part)
                    transformed_keys.append(part)
                    obj = obj.replace(part, "_req|" + datasource_name + "|" + part)
    return obj


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


def _generate_transform(formulas, old_transform):
    transform = []
    counter = 0
    for method in old_transform:
        transform.append(method)
    for formula in formulas:
        transform_part, counter = generate_step_transform(formula["formelString"], formula["formelName"], counter, copy=formula.get("copy_key", None), array_key=formula.get("array_key", None), loop_key=formula.get("loop_key", ""), decimal=formula.get("decimal", 2))
        if transform_part is None:
            return None
        transform += transform_part
    return transform


def _generate_storing(historized_data, datasource_name):
    storing = []
    historized_data = remove_toplevel_key(_extend_keys(historized_data, datasource_name))
    for key in historized_data:
        storing.append({
            "name": key,
            "key": key
        })
    return storing


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
        tp = tp_s.split(":")
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
            vals = vals_s.split(":")
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


def _get_datasource_path(datasource_name: str):
    return os.path.join(DATASOURCE_LOCATION, datasource_name) + ".json"


def _get_scene_path(scene_name: str):
    return os.path.join(SCENE_LOCATION, scene_name) + ".json"


def get_scene_image_path(json_file_name: str):
    image_info = json_file_name.rsplit(".", 1)
    return _get_image_path(image_info[0], "scene", image_info[1])


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
    path_to_json = _get_steps_path(json_file_name)
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
