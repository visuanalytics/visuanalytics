import logging
import time
from datetime import date

from visuanalytics.analytics.apis.api import fetch
from visuanalytics.analytics.util.type_utils import get_type_func, register_type_func
from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.util.step_errors import PreconditionError, raise_step_error, PreconditionNotFulfilledError

Precondition_TYPES = {}

logger = logging.getLogger(__name__)


@raise_step_error(PreconditionError)
def register_precondition(func):
    """Registriert die übergebene Funktion und versieht sie mit einem `"try/except"`-Block.
    Fügt eine Typ-Funktion dem Dictionary Precondition_TYPES hinzu.

    :param func: die zu registrierende Funktion
    :return: Funktion mit try/except-Block
    """
    return register_type_func(Precondition_TYPES, PreconditionError, func)


@raise_step_error(PreconditionError)
def precondition(values: dict, step_data: StepData):
    if values.get("precondition", None):
        if step_data.get_config("testing", False) is False:
            api_func = get_type_func(values["precondition"], Precondition_TYPES)

            api_func(values, step_data)


@register_precondition
def date_today(values: dict, step_data: StepData):
    """
    Stellt eine API Anfrage und prüft dannach ob der vorliegende Key dem heutigem Datum entspricht,
    sollte das Datum mit dem heutigem übereinstimmen so läuft das programm weiter,
    wenn nicht dann wird der Thread für die angegebene Zeit schlafen gelegt bis es erneut geprüft wird.
    Nach einer Anzahl an Versuchen welche alle erfolglos waren wird der Thread mit einem PreconditionNotFulfilledError Error abgebrochen

    :param values: Werte aus der JSON-Datei
    :param step_data: Daten aus der API
    :raise PreconditionNotFulfilledError: Wirft eine Exception wenn die Vorbedingung nach mehreren durchläufen immernoch nicht erfolgreich war
    """
    condition = True
    today = date.today()
    counter = 0
    sleep_time = values["precondition"]["sleep_time"]
    while condition:
        fetch(values["precondition"]["request"], step_data, "_pre")
        compare = step_data.get_data(values["precondition"]["key"])
        compare2 = today.strftime("%d.%m.%Y")
        if compare[:values["precondition"]["key_split"]] == compare2:
            condition = False
        else:
            counter += 1
            logger.info(f"Precondition is not fulfills, waiting {sleep_time} seconds before trying again")
            time.sleep(values["precondition"]["sleep_time"])
        if counter >= values["precondition"]["exit"]:
            raise PreconditionNotFulfilledError(counter)
