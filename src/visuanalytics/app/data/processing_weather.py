"""Module zum verarbeiten der Daten von der Wetter Api"""


def get_weather_icon(data, location, date_in_future):
    """Simple Methode um aus dem Data von der Api, einem Ort und einer Zeitangabe das dazugehöroge Icon zu bekommen
               Args:
                  data(Liste) : Preprocessed Data von der Api
                  location (String) : Den Ort der abgefragt werden soll(muss in data vorhanden sein)
                  date_in_future (int) : Tag an dem abgefragt werden soll 0 = morgen, 1 = übermorgen
               Returns:
                  String : Den passenden Iconnamen zu den gegebenen Parametern
           """
    return data['cities'][location][date_in_future]['icon']


def get_weather_temp(data, location, date_in_future):
    """Simple Methode um aus dem Data von der Api, einem Ort und einer Zeitangabe die dazugehörige Temperatur zu bekommen
               Args:
                  data(Liste): Preprocessed Data von der Api
                  location (String) : Den Ort der abgefragt werden soll(muss in data vorhanden sein)
                  date_in_future (int) : Tag an dem abgefragt werden soll 0 = morgen, 1 = übermorgen
               Returns:
                  String : Die passende Temperatur zu den gegebenen Parametern
           """
    temp = round(data['cities'][location][date_in_future]['temp'])
    return f"{temp}\u00B0"



def get_max_temp(data, date_in_future):
    """Simple Methode um aus dem Data von der Api und einer Zeitangabe die maximal Temperatur für Deutschland zu bekommen
               Args:
                  data(Liste): Preprocessed Data von der Api
                  date_in_future (int) : Tag an dem abgefragt werden soll 0 = morgen, 1 = übermorgen
               Returns:
                  String : Die maximal Temperatur zu den gegebenen Parametern
           """

    max_temp = round(data['summaries'][date_in_future]['temp_max'])
    return f"{max_temp}\u00B0"


def get_min_temp(data, date_in_future):
    """Simple Methode um aus dem Data von der Api und einer Zeitangabe die manimal Temperatur für Deutschland zu bekommen
               Args:
                  data(Liste): Preprocessed Data von der Api
                  date_in_future (int) : Tag an dem abgefragt werden soll 0 = morgen, 1 = übermorgen
               Returns:
                  String : Die manimal Temperatur zu den gegebenen Parametern
           """

    min_temp = round(data['summaries'][date_in_future]['temp_min'])
    return f"{min_temp}\u00B0"
