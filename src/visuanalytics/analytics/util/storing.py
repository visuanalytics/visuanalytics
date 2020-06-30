"""
Modul schreibt Dicts in JSON Files
"""

import json

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.util import resources
from visuanalytics.analytics.util.step_errors import raise_step_error, TransformError


@raise_step_error(TransformError)
def storing(values: dict, data: StepData):
    """
    Schreibt Die Api Daten nach ausführung der Transform Methoden in eine JSON Datei

    als Dateiname wird der jobname sowie das heutige datum verwendet

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    if values.get("storing", None):
        for value in values["storing"]:
            if value.get("safe_on_change", False):
                with resources.open_specific_memory_resource(data.format("{_conf|job_name}"), value["name"]) as fp:
                    old_data = json.loads(fp.read())
                if old_data == data.data["_req"][value["pattern"]]:
                    break
            with open(resources.new_memory_resource_path(data.format("{_conf|job_name}"), value["name"]), 'w') as fp:
                json.dump(data.data["_req"][value["pattern"]], fp)
