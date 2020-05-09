import datetime
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
    locale.setlocale(locale.LC_ALL, 'deu_deu')  # am Ende werden die Wochentage auf Deutsch ausgegeben
    days = []
    try:
        date = datetime.datetime.strptime(valid_date, '%Y-%m-%d').date()
        for i in range(0, 4):
            days.append(calendar.day_name[(date + datetime.timedelta(days=i)).weekday()])
    except:
        print("Fehlermeldung: Kein Datum hinterlegt.")
    return days

