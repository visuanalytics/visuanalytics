import datetime
import calendar
import locale

# module date_to_weekday (mit import date_to_weekday in das spätere Python-Skript importieren, um es verwenden zu können
# die Datei muss dann im selben Ordner sein wie das Python-Skript, indem es ausgeführt werden soll

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
        valid_date = "2020-05-15"
        days = date_to_weekday(valid_date)
        print("Heute ist", days[0]) # dayofweek_today
        print("Morgen ist", days[1]) # dayofweek_1
        print("Übermorgen ist", days[2]) # dayofweek_2
        print("Überübermorgen ist", days[3]) # dayofweek_3
    """
    locale.setlocale(locale.LC_ALL, 'deu_deu')  # am Ende werden die Wochentage auf Deutsch ausgegeben
    try:
        date = datetime.datetime.strptime(valid_date, '%Y-%m-%d').date()
        dayofweek_today=calendar.day_name[date.weekday()]   # date.weekday() sind Werte von 0 bis 6 für die Wochentage
        if(date.weekday() == 6):
            dayofweek_1 = calendar.day_name[date.weekday() + 1 - 7]
            dayofweek_2 = calendar.day_name[date.weekday() + 2 - 7]
            dayofweek_3 = calendar.day_name[date.weekday() + 3 - 7]
        if(date.weekday() == 5):
            dayofweek_1 = calendar.day_name[date.weekday() + 1]
            dayofweek_2 = calendar.day_name[date.weekday() + 2 - 7]
            dayofweek_3 = calendar.day_name[date.weekday() + 3 - 7]
        if(date.weekday() == 4):
            dayofweek_1 = calendar.day_name[date.weekday() + 1]
            dayofweek_2 = calendar.day_name[date.weekday() + 2]
            dayofweek_3 = calendar.day_name[date.weekday() + 3 - 7]
        if(date.weekday() <= 3):
            dayofweek_1 = calendar.day_name[date.weekday() + 1]
            dayofweek_2 = calendar.day_name[date.weekday() + 2]
            dayofweek_3 = calendar.day_name[date.weekday() + 3]
        days = [dayofweek_today, dayofweek_1, dayofweek_2, dayofweek_3]
    except:
        print("Fehlermeldung: Kein Datum hinterlegt.")
    return days