"""
Modul das die Klasse :class:`StepData` beinhaltet.
"""
import numbers

from visuanalytics.analytics.util.step_errors import APIKeyError
from visuanalytics.analytics.util.step_pattern import StepPatternFormatter, data_insert_pattern, data_get_pattern, \
    data_remove_pattern
from visuanalytics.util import config_manager


class StepData(object):
    """
    Datenklasse zur Speicherung und Manipulation der Daten eines Jobs.

    Die Daten werden in einem Dictionary gespeichert, der Zugriff darauf erfolgt mit Strings, die Keys
    enthalten, welche durch ein `|` Symbol getrennt sind. Um diese umzuwandeln, werden die Funktionen
    aus dem Modul :py:mod:`step_pattern` verwendet.
    """

    def __init__(self, run_config, pipeline_id):
        super().__init__()
        self.__data = {"_conf": run_config, "_pipe_id": pipeline_id}
        self.__formatter = StepPatternFormatter()

    @staticmethod
    def get_api_key(api_key_name):
        """
        Funktion um einen API Key aus der Konfigurationsdatei zu laden.

        Verwendet hierzu das Module :py:mod:`config_manager`
        
        :param api_key_name: Name des Config-Eintrages für den Api key.
        :return: Api key.
        :raises: FileNotFoundError, KeyError
        """

        api_key = config_manager.get_private()["api_keys"].get(api_key_name, None)

        if api_key is None:
            raise APIKeyError(api_key_name)

        return api_key

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
        Zum durchlaufen eines Arrays.

        Setzt bei jedem Durchlauf die variablen `_loop` und `_idx`.
        `_loop` entspricht dem aktuellen Wert und `_idx` dem aktuellen Index.

        :param loop_root: Array das durchlaufen werden soll.
        :param values: Werte aus der JSON-Datei
        :return: Iterator über das Array, welcher Seiteneffekte besitzt, mit (idx, value).
        :rtype: map
        """
        return map(lambda value: self.save_loop(value[0], value[1], values), enumerate(loop_root))

    def loop_dict(self, loop_root: dict, values: dict):
        """
        Zum durchlaufen eines Dictionaries.

        Setzt bei jedem Durchlauf die variablen `_loop` und `_idx`.
        `_loop` entspricht dem aktuellen wert und `_idx` dem Aktuelle dict key.

        :param loop_root: dict das durchlaufen werden soll.
        :param values: Werte aus der JSON-Datei
        :return: Iterator über das Dictionary, welcher Seiteneffekte besitzt, mit (idx, value).
        :rtype: map
        """
        return map(lambda value: self.save_loop(value[0], value[1], values), loop_root.items())

    def loop_key(self, keys: list, values: dict):
        """
        Zum durchlaufen eines key Arrays.

        Setzt bei jedem Durchlauf die variable `_key`.
        `_key` entspricht dem aktuellen Wert des Arrays.

        :param keys: Array mit keys (Strings)
        :param values: Werte aus der JSON-Datei
        :return: Iterator über das Dictionary, welcher Seiteneffekte besitzt, mit (idx, key).
        :rtype: map
        """
        return map(lambda value: (value[0], self.save_loop_key(value[1], values)), enumerate(keys))

    def get_config(self, key, default_value=None):
        """
        Configuration des Jobs
        """
        return self.__data["_conf"].get(key, default_value)

    @property
    def data(self):
        """
        Daten des Jobs.
        """
        return self.__data

    def init_data(self, data: dict, key: str = "_req"):
        """
        Initialisiert die Daten.
        
        Die übergebenen daten werden unter dem übergebenen `key` gespeichert.
        Ist zur Verwendung im Schritt `API` gedacht.

        :param data: Daten die geschpeichert werden sollen.
        :param key: Key unter dem die Daten geschpeichert werden sollen. Standart: `_req`.
        """
        self.__data[key] = data

    def clear_data(self):
        """
        Löscht alle Daten mit Ausnahme von `_conf` und `_pipe_id`.
        """
        # Save Config and Pipe id
        _conf = self.__data["_conf"]
        _pipe_id = self.__data["_pipe_id"]

        self.__data.clear()

        # Restore Config and Pipe id
        self.__data["_conf"] = _conf
        self.__data["_pipe_id"] = _pipe_id

    def get_data_num(self, key, values: dict):
        """
        Macht das gleiche wie :func:`get_data` mit der Ausnahme, dass
        falls der übergebene key eine Zahl ist, diese direkt zurückgegeben wird.

        :param key: fad zu den Daten in self.data,
            besteht aus den keys zu den Daten, getrennt mit | (Pipe) Symbolen, oder eine Zahl.
        :param values: Werte aus der JSON-Datei.
        :return: Daten hinter `key_string` oder die Übergebene Zahl.
        :raises: StepKeyError
        """
        if isinstance(key, numbers.Number):
            return key

        return self.get_data(key, values)

    def get_data_bool(self, key, values: dict):
        """
        Macht das gleiche wie :func:`get_data` mit der Ausnahme, dass
        falls der übergebene key ein Boolean ist, diese direkt zurückgegeben wird.

        :param key: fad zu den Daten in self.data,
            besteht aus den keys zu den Daten, getrennt mit | (Pipe) Symbolen, oder einem Boolean.
        :param values: Werte aus der JSON-Datei.
        :return: Daten hinter `key_string` oder der übergebene Boolean.
        :raises: StepKeyError
        """
        if isinstance(key, bool):
            return key

        return self.get_data(key, values)

    def get_data_array(self, key, values: dict):
        """
        Macht das gleiche wie :func:`get_data` mit der Ausnahme, dass
        falls der übergebene key eine Liste ist, diese direkt zurückgegeben wird.

        :param key: fad zu den Daten in self.data,
            besteht aus den keys zu den Daten, getrennt mit | (Pipe) Symbolen, oder einer Liste.
        :param values: Werte aus der JSON-Datei.
        :return: Daten hinter `key_string` oder die übergebene Liste.
        :raises: StepKeyError
        """
        if isinstance(key, list):
            return key

        return self.get_data(key, values)

    def get_data(self, key_string: str, values: dict):
        """
        Gibt die daten zurück, die hinter `key_string` stehen.

        :param key_string: Pfad zu den Daten in self.data,
            besteht aus den keys zu den Daten, getrennt mit | (Pipe) Symbolen.
        :param values: Werte aus der JSON-Datei.
        :return: Daten hinter `key_string`.
        :raises: StepKeyError
        """
        data = {**self.__data, **values.get("_loop_states", {})}
        key_string = self.__formatter.format(key_string, data)

        return data_get_pattern(key_string, data)

    def format_api(self, value_string: str, api_key_name, values: dict):
        """
        Funktioniert genauso wie :func:`format`, mit der Erweiterung, dass zusätzlich die variable `_api_key` verfügbar ist.

        Um den API Key zu bekommen wir :func:`StepData.get_api_key` verwendet.

        :param value_string: Zu formatierender String
        :param api_key_name: Name des Config-Eintrages für den Api key.
        :param values: Werte aus der JSON-Datei.
        :return: Formattierter `value_string`.
        :raises: StepKeyError
        """
        if api_key_name is not None:
            api_key_name = self.format(api_key_name, values)
            data = {**self.__data, **values.get("_loop_states", {}), "_api_key": self.get_api_key(api_key_name)}
        else:
            data = {**self.__data, **values.get("_loop_states", {})}

        return self.__formatter.format(value_string, data)

    def format_array(self, json: dict, api_key_name, values: dict, result: dict):
        if json is None:
            return
        for entry in json:
            out = ""
            params = self.format_api(entry["array"], api_key_name, values).split(entry.get("delimiter", ","))
            for idx, param in enumerate(params):
                if idx != 0:
                    out += entry.get("new_delimiter", "")
                out += entry.get("before_each", "") + param
            result[entry["name"]] = out

    def format_json(self, json: dict, api_key_name, values: dict):
        """
        Wendet :func:`format_api` auf alle Elemente eines Dictionaries an.

        :param json: Dictionary das formatiert werden soll.
        :param api_key_name: Name des Config-Eintrages für den Api key.
        :param values: Werte aus der JSON-Datei.
        :return: Formatiertes input Dictionary
        """
        if json is None:
            return json

        for key in json:
            json[key] = self.format_api(json[key], api_key_name, values)

        return json

    def format(self, value_string, values=None):
        """
        Ersetzt in einem String alle Werte in `{}` durch den Wert, den man aus :func:`get_data` bekommt.

        Hierzu wird die Klasse :class:`StepPatternFormatter` zur Umwandlung verwendet.
        Ist der `value_string` ein nummerischer Wert, wird dieser einfach wieder zurückgegeben.

        :param value_string: Zu formatierender String
        :param values: Werte aus der JSON-Datei.
        :return: Formattierter `value_string`.
        :raises: StepKeyError
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
        Speichert Daten unter `key_string`.

        Verwendet :func:`data_insert_pattern` um Daten einzufügen.

        :param key_string: Pfad zu den Daten in self.data,
            besteht aus den Keys zu den Daten, getrennt mit | (Pipe) Symbolen.
        :param value: Wert der eingefügt werden soll.
        :param values: Werte aus der JSON-Datei.
        :raises: StepKeyError
        """
        key_string = self.__prepare_data_manipulation(key_string, values)

        data_insert_pattern(key_string, self.__data, value)

        self.__clean_up_data_manipulation()

    def remove_data(self, key_string: str, values: dict):
        """
        Entfernt Daten unter `key_string`.

        Verwendet :func:`data_remove_pattern` um Daten zu entfernen.

        :param key_string: Pfad zu den Daten in self.data,
            besteht aus den keys zu den Daten, getrennt mit | (Pipe) Symbolen.
        :param values: Werte aus der JSON-Datei.
        :raises: StepKeyError
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
