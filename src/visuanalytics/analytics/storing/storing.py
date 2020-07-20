"""
Modul schreibt Dicts in JSON Files
"""

import json

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.util.step_errors import raise_step_error, StoringError
from visuanalytics.util import resources


@raise_step_error(StoringError)
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
                try:
                    with resources.open_specific_memory_resource(data.get_data("_conf|job_name", values),
                                                                 value["name"]) as fp:
                        old_data = json.loads(fp.read())
                    if old_data == data.get_data(value["key"], values):
                        continue
                except (FileNotFoundError, IndexError):
                    pass
            with open(resources.new_memory_resource_path(data.get_data("_conf|job_name", values), value["name"]),
                      'w') as fp:
                json.dump(data.get_data(value["key"], data.data), fp)
