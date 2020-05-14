import sys
from datetime import datetime

import datetime as dt
import re
import calendar
import locale


def date_to_weekday(valid_date):
    """Wandelt das Datum von der API in den Wochentag um.

    Nimmt den Wert von valid_date aus der Weatherbit-API und gibt am Ende den Wochentag des
    abgerufenen Datums und der drei darauffolgenden Tage aus.
    Wird benötigt für die Darstellung auf der Wetterkarte und für die Texte, die für die
    Audiodatei generiert werden.
    Quelle: https://databraineo.com/ki-training-resources/python/wochentag-datum-calendar/

    Args:
        valid_date (date): Datum mit dem Format YYYY-MM-DD.

    Returns:
        List: days
            mit vier Einträgen:
            days[0] -> dayofweek_today (heute)
            days[1] -> dayofweek_1 (morgen)
            days[2] -> dayofweek_2 (übermorgen)
            days[3] -> dayofweek_3 (überübermorgen)
    Example:
        valid_date = "2020-05-09"
        days = date_to_weekday(valid_date)
        print("Heute ist", days[0]) # dayofweek_today
        print("Morgen ist", days[1]) # dayofweek_1
        print("Übermorgen ist", days[2]) # dayofweek_2
        print("Überübermorgen ist", days[3]) # dayofweek_3
    """
    if sys.platform == 'win32':
        locale.setlocale(locale.LC_ALL, 'deu_deu')
    else:
        locale.setlocale(locale.LC_ALL, 'de_DE.UTF-8')
    days = []
    try:
        date = datetime.strptime(valid_date, '%Y-%m-%d').date()
        for i in range(0, 4):
            days.append(calendar.day_name[(date + dt.timedelta(days=i)).weekday()])
    except:
        print("Fehlermeldung: Kein Datum hinterlegt.")
    return days


def time_change_format(timestamp):
    """Aus timestamp-Format Datum, Uhrzeit und Uhrzeit für einen Text generieren.

    Alle Zeiten der Weatherbit-API sind in UNix Timestamp UTC angegeben. Mit diesem Modul
    können sie in das Datum des Formats YYYY-MM-DD und die Uhrzeit des Formats HH:MM:SS
    umgeschrieben werden. Das Datum kann so z.B. auch in das Module date_to_weekday
    eingefügt werden. Ansonsten ist es noch wichtig, dass die Uhrzeit so umgewandelt werden
    kann, dass sie, wenn sie als Text vorgelesen wird, sich flüssig anhört. Es ist 5 Uhr 15.
    Beispiel: Es ist 5 Uhr 15.

    :param timestamp:
    :return: date, time, time_text

    Example:
        timestamp = 1588823718
        date, time, time_text = time_change_format(timestamp)
        print(date)
        print(time)
        print(time_text)
    """
    date = datetime.fromtimestamp(timestamp).date()
    time = datetime.fromtimestamp(timestamp).strftime("%H:%M:%S")
    hour = datetime.fromtimestamp(timestamp).strftime("%H")
    minute = datetime.fromtimestamp(timestamp).strftime("%M")

    # Entfernen einer möglichen Null, z.B. bei 05 Uhr -> 5 Uhr

    hour_re = re.sub("^0", "", hour)
    minute_re = re.sub("^0", "", minute)
    time_text = hour_re + " Uhr " + minute_re
    return date, time, time_text
