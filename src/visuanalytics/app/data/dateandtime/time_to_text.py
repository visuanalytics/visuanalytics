from datetime import datetime
import re

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
