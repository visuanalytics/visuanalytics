"""
Modul das die Klasse :class:`StepData` beinhaltet.
"""
import numbers

from visuanalytics.analytics.util import config_manager
from visuanalytics.analytics.util.step_pattern import StepPatternFormatter, data_insert_pattern, data_get_pattern, \
    data_remove_pattern


class StepData(object):
    """
    Datenklasse zur speicherung und manipulation der Daten eins Jobs.

    Die daten werden in einem Dictionary gespeichert, der zugriff darauf erfolgt mit Strings die keys,
    enthalten die durch ein `|` Symbol getrennt sind. Um diese umzuwandelt werden die Funktionen
    aus dem module :py:mod:`step_pattern` verwendet.
    """

    def __init__(self, run_config, pipeline_id):
        super().__init__()
        self.__data = {"_conf": run_config, "_pipe_id": pipeline_id}
        self.__formatter = StepPatternFormatter()

    @staticmethod
    def get_api_key(api_key_name):
        """
        Funktion um einen API Key aus der Configurations datei zu laden.

        Verwendet hierzu das Module :py:mod:`config_manager`
        
        :param api_key_name: Name des Config eintrages für den Api key.
        :return: Api key.
        :raises: FileNotFoundError, KeyError
        """

        return config_manager.get_private()["api_keys"][api_key_name]

    @staticmethod
    def save_loop(idx, current, values: dict):
        values["_loop_states"] = {**values.get("_loop_states", {}), **{"_idx": idx, "_loop": current}}
        return idx, current

    def save_loop_key(self, key, values: dict, ):
        values["_loop_states"] = {**values.get("_loop_states", {}),
                                  **{"_key": self.get_data(key, values)}}
        return key

    def loop_array(self, loop_root: list, values: dict):
        """
        Zum durchlaufen eines arrays.

        Setzt bei jedem Durchlauf die variablen `_loop` und `_idx`.
        `_loop` entspricht dem aktuellen wert und `_idx` dem aktuellen Index.

        :param loop_root: array das durchlaufen werden soll.
        :param values: Werte aus der JSON-Datei
        :return: Iterator über das array welcher seiteneffekte besitzt, mit (idx, value).
        :rtype: map
        """
        return map(lambda value: self.__save_loop(value[0], value[1], values), enumerate(loop_root))

    def loop_dict(self, loop_root: dict, values: dict):
        """
        Zum durchlaufen eines Dictionaries.

        Setzt bei jedem Durchlauf die variablen `_loop` und `_idx`.
        `_loop` entspricht dem aktuellen wert und `_idx` dem Aktuelle dict key.

        :param loop_root: dict das durchlaufen werden soll.
        :param values: Werte aus der JSON-Datei
        :return: Iterator über das Dictionary welcher seiteneffekte besitzt, mit (idx, value).
        :rtype: map
        """
        return map(lambda value: self.__save_loop(value[0], value[1], values), loop_root.items())

    def loop_key(self, keys: list, values: dict):
        """
        Zum durchlaufen eines key arrays.

        Setzt bei jedem Durchlauf die variable `_key`.
        `_key` entspricht dem aktuellen wert des arrays.

        :param keys: array mit keys (Strings)
        :param values: Werte aus der JSON-Datei
        :return: Iterator über das Dictionary welcher seiteneffekte besitzt, mit (idx, key).
        :rtype: map
        """
        return map(lambda value: (value[0], self.__save_loop_key(value[1], values)), enumerate(keys))

    @property
    def data(self):
        """
        Daten des Jobs.
        """
        return self.__data

    def init_data(self, data: dict):
        """
        Inizalisiert die daten.
        
        Die übergebenen daten werden unter `_req` gespeichert.
        Ist zur verwendung im Schritt `API` gedacht.
        
        :param data: Daten die geschpeichert werden sollen.
        """
        self.__data["_req"] = data

    def clear_data(self):
        """
        Löscht alle Daten mit ausnahme von `_conf` und `_pipe_id`.
        """
        # Save Config and Pipe id
        _conf = self.__data["_conf"]
        _pipe_id = self.__data["_pipe_id"]

        self.__data.clear()

        # Restore Config and Pipe id
        self.__data["_conf"] = _conf
        self.__data["_pipe_id"] = _pipe_id

    def get_data(self, key_string: str, values: dict):
        """
        Gibt die daten zurück die hinter `key_string` stehen.

        :param key_string: Pfad zu den daten in self.data,
            besteht aus den keys zu den daten getrennt mit | (Pipe) Symbolen.
        :param values: Werte aus der JSON-Datei.
        :return: daten hinter `key_string`.
        :raises: KeyError
        """
        data = {**self.__data, **values.get("_loop_states", {})}
        key_string = self.__formatter.format(key_string, data)

        return data_get_pattern(key_string, data)

    def format_api(self, value_string: str, api_key_name, values: dict):
        """
        Funktioniert genauso wie :func:`format` mit der erweiterung das zusätzlich die variable `_api_key` verfügbar ist.

        Um den API Key zu bekommen wir :func:`StepData.get_api_key` verwendet.

        :param value_string: Zu Formattierender String
        :param api_key_name: Name des Config eintrages für den Api key.
        :param values: Werte aus der JSON-Datei.
        :return: Formattierter `value_string`.
        :raises: KeyError
        """
        if api_key_name is not None:
            api_key_name = self.format(api_key_name, values)
            data = {**self.__data, **values.get("_loop_states", {}), "_api_key": self.get_api_key(api_key_name)}
        else:
            data = {**self.__data, **values.get("_loop_states", {})}

        return self.__formatter.format(value_string, data)

    def format_json(self, json: dict, api_key_name: str, values: dict):
        """
        Wendet :func:`format_api` auf alle element eines Dictionaries an.

        :param json: Dictionary das Formatiert werden soll.
        :param api_key_name: Name des Config eintrages für den Api key.
        :param values: Werte aus der JSON-Datei.
        :return: Formatiertes input Dictionary
        """
        api_key_name = self.format(api_key_name, values)
        data = {**self.__data, **values.get("_loop_states", {}), "_api_key": self.get_api_key(api_key_name)}
        for key in json:
            json[key] = self.__formatter.format(json[key], data)

        return json

    def format(self, value_string, values=None):
        """
        Ersetzt in einem String alle werte in `{}` durch den wert den man aus :func:`get_data` bekommt.

        Hierzu wird die Klasse :class:`StepPatternFormatter` zur umwandlung verwendet.
        Ist der `value_string` ein Nummericher Wert wird dieser einfach wieder zurückgegeben.

        :param value_string: Zu Formattierender String
        :param values: Werte aus der JSON-Datei.
        :return: Formattierter `value_string`.
        :raises: KeyError
        """
        # if value_string is int just return value
        if isinstance(value_string, numbers.Number):
            return value_string

        if values is None:
            values = {}

        data = {**self.__data, **values.get("_loop_states", {})}
        return self.__formatter.format(value_string, data)

    def insert_data(self, key_string: str, value, values: dict):
        """
        Speichert daten unter `key_string`.

        Verwendet :func:`data_insert_pattern` um daten einzufügen.

        :param key_string: Pfad zu den daten in self.data,
            besteht aus den keys zu den daten getrennt mit | (Pipe) Symbolen.
        :param value: Wert der eingefügt werden soll.
        :param values: Werte aus der JSON-Datei.
        :raises: KeyError
        """
        key_string = self.__prepare_data_manipulation(key_string, values)

        data_insert_pattern(key_string, self.__data, value)

        self.__clean_up_data_manipulation()

    def remove_data(self, key_string: str, values: dict):
        """
        Entfernt daten unter `key_string`.

        Verwendet :func:`data_remove_pattern` um daten zu entfernen.

        :param key_string: Pfad zu den daten in self.data,
            besteht aus den keys zu den daten getrennt mit | (Pipe) Symbolen.
        :param values: Werte aus der JSON-Datei.
        :raises: KeyError
        """
        key_string = self.__prepare_data_manipulation(key_string, values)

        data_remove_pattern(key_string, self.__data)

        self.__clean_up_data_manipulation()

    def __prepare_data_manipulation(self, key_string: str, values: dict):
        # Save loop values current into data to Access them
        self.__data = {**self.__data, **values.get("_loop_states", {})}
        return self.format(key_string, values)

    def __clean_up_data_manipulation(self):
        # Remove temporary Used loop data
        # TODO(Max) vtl. solve better
        self.__data.pop("_loop", None)
        self.__data.pop("_key", None)
        self.__data.pop("_idx", None)
