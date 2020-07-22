"""
Modul schreibt Dicts in JSON Files
"""

import json
import copy

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
            if value.get("safe_only_on_change", True):
                try:
                    with resources.open_specific_memory_resource(data.get_data("_conf|job_name", values),
                                                                 value["name"]) as fp:
                        old_data = json.loads(fp.read())
                    new_data = _remove_keys(value, data.get_data(value["key"], values))
                    if old_data == new_data:
                        continue
                except (FileNotFoundError, IndexError):
                    pass
            with open(resources.new_memory_resource_path(data.get_data("_conf|job_name", values), value["name"]),
                      'w') as fp:
                export_data = _remove_keys(value, data.get_data(value["key"], data.data))
                json.dump(export_data, fp)


def _remove_keys(value, export_data):
    if value.get("except", None) is not None:
        export_data = copy.deepcopy(export_data)
        for key in value["except"]:
            for idx, row in enumerate(export_data):
                try:
                    del export_data[idx][key]
                except KeyError:
                    pass
    return export_data
