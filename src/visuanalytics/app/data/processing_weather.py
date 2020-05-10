def get_weather_icon(data, location, date_in_future):
    return "".join([data['cities'][location][date_in_future]['icon']])


"""Simple Methode um aus dem Data von der Api, einem Ort und einer Zeitangabe das dazugehöroge Icon zu bekommen
           Args:
              data(Liste) : Preprocessed Data von der Api
              location (String) : Den Ort der abgefragt werden soll(muss in data vorhanden sein)
              date_in_future (int) : Tag an dem abgefragt werden soll 0 = morgen, 1 = übermorgen
           Returns:
              String : Den passenden Iconnamen zu den gegebenen Parametern
       """


def get_weather_temp(data, location, date_in_future):
    return str(int(float("".join(map(str, [data['cities'][location][date_in_future]['temp']]))))) + "°"


"""Simple Methode um aus dem Data von der Api, einem Ort und einer Zeitangabe die dazugehörige Temperatur zu bekommen
           Args:
              data(Liste): Preprocessed Data von der Api
              location (String) : Den Ort der abgefragt werden soll(muss in data vorhanden sein)
              date_in_future (int) : Tag an dem abgefragt werden soll 0 = morgen, 1 = übermorgen
           Returns:
              String : Die passende Temperatur zu den gegebenen Parametern
       """


def get_max_temp(data, date_in_future):
    return str(int(float("".join(map(str, [data['summaries'][date_in_future]['temp_max']]))))) + "°"


"""Simple Methode um aus dem Data von der Api und einer Zeitangabe die maximal Temperatur für Deutschland zu bekommen
           Args:
              data(Liste): Preprocessed Data von der Api
              date_in_future (int) : Tag an dem abgefragt werden soll 0 = morgen, 1 = übermorgen
           Returns:
              String : Die maximal Temperatur zu den gegebenen Parametern
       """


def get_min_temp(data, date_in_future):
    return str(int(float("".join(map(str, [data['summaries'][date_in_future]['temp_min']]))))) + "°"


"""Simple Methode um aus dem Data von der Api und einer Zeitangabe die manimal Temperatur für Deutschland zu bekommen
           Args:
              data(Liste): Preprocessed Data von der Api
              date_in_future (int) : Tag an dem abgefragt werden soll 0 = morgen, 1 = übermorgen
           Returns:
              String : Die manimal Temperatur zu den gegebenen Parametern
       """
