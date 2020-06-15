"""
Dieses Modul enthält die Funktionalität zum Beziehen der History-Daten von der Zeit-API.
"""
import datetime as dt
import json
from datetime import datetime

import requests
from dateutil.relativedelta import relativedelta

from visuanalytics.analytics.util import resources, config_manager


def get_forecasts(times=None):
    """
       Bezieht die Zeit Anfragen (Standard 4 Anfragen) und bündelt sie in einer Liste.

       Jede JSON-Antwort wird mittels json.loads() in ein dictionary konvertiert und in einer Liste gespeichert.

        :param times : Eine Liste bestehend aus Integers für die die Anfrage erstellt wird, ein Wert von 1 bedeutet das Zeitintervall von vor einem Jahr + 7 Tage
        :type times : list

        :returns: Eine Liste von Dictionaries, welche je eine JSON-Response der API repräsentieren.
        :rtype: dict

        :raises:
           ValueError: Wenn der Response-Code eine andere Nummer als 200 enthält. Dies kann vor allem bei einem fehlenden
           oder ungültigen API-Key vorkommen.
           socket.gaierror: Wenn keine Verbindung zum Internet besteht.
       """
    if times is None:
        times = [1, 2, 5, 10]
    json_data = []
    headers = {'X-Authorization': config_manager.get_private()["api_keys"]["zeit"]}
    for k in times:
        date = datetime.now() - relativedelta(years=k)
        date2 = date + dt.timedelta(days=7)
        date = date.strftime('%Y-%m-%d')
        date2 = date2.strftime('%Y-%m-%d')
        response = requests.get(_forecast_request(date, date2), headers=headers)
        if response.status_code != 200:
            raise ValueError("Response-Code: " + str(response.status_code))
        json_data.append(json.loads(response.content))
    return json_data


def _forecast_request(time_start, time_end):
    return "http://api.zeit.de/content?q=" + time_start + "T00:00:00Z TO " + time_end + "T23:59:59.999Z]&facet_field=keyword"


def get_example():
    """
       Bezieht die Zeit Response aus der Beispieldatei und bündelt sie in eine Liste.

       :return: Eine Liste von Dictionaries, welche je eine JSON-Response der API repräsentieren ( aus der json Datein gelesen)
       :rtype: dict

    """
    with resources.open_resource("exampledata/history.json", "r") as json_file:
        return json.load(json_file)
