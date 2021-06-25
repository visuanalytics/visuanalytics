"""
Modul, welches Dictionaries in JSON-Dateien schreibt.
"""

import copy
import json

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.util.step_errors import raise_step_error, StoringError, StepKeyError
from visuanalytics.analytics.util.step_pattern import data_remove_pattern
from visuanalytics.analytics.util.video_delete import delete_memory_files
from visuanalytics.util import resources


@raise_step_error(StoringError)
def storing(values: dict, data: StepData):
    """Schreibt die API-Daten nach Ausführung der `transform`-Typen in eine JSON-Datei.

    Als Dateiname wird der Jobname sowie das heutige Datum verwendet.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    if values.get("storing", None):
        for value in values["storing"]:
            new_data = _remove_keys(value, data, data.get_data(value["key"], values))
            name = data.format(value["name"])
            if value.get("safe_only_on_change", True):
                try:
                    with resources.open_specific_memory_resource(data.get_config("job_name"),
                                                                 name, False) as fp:
                        old_data = json.loads(fp.read())
                    if old_data == new_data:
                        continue
                except (FileNotFoundError, IndexError):
                    pass
            file_name = resources.new_memory_resource_path(data.get_config("job_name"), name)
            with open(file_name, 'w') as fp:
                json.dump(new_data, fp)
            delete_memory_files(data.get_config("job_name"),
                                value["name"], data.get_data(value.get("count", 10), values, int))


def _remove_keys(value, data: StepData, export_data):
    if value.get("exclude", None) is not None:
        export_data = copy.deepcopy(export_data)
        for key in value["exclude"]:
            key = data.format(key)
            try:
                data_remove_pattern(key, export_data)
            except StepKeyError:
                pass
    return export_data
