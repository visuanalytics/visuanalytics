import math
import re
import subprocess


def get_audio_length(path_of_wav_file):
    """Von einer .wav Audio-Datei Länge herausfinden

    Die Methode bekommt den Pfad zu der .wav Audio-Datei als Argument übergeben. Ffmpeg wird als Subprozess gestartet,
    die Audiodatei übergeben und mit Hilfe einer Regular Expression die Länge der Audiodatei herausgefiltert.
    Dazu werden die Stunden- und Minutenangaben in Sekunden umgeformt und die angegebenen Sekunden mit zwei Kommastellen
    auf eine ganze Zahl aufgerundet. Die Gesamtzahl der Sekunden wird zurückgegeben.

    Wird benötigt um die Länge des generierten Videos auf die Länge der generierten Audiodatei anzupassen.
    Quelle: https://stackoverflow.com/questions/7833807/get-wav-file-length-or-duration

    :param path_of_wav_file
    :return: seconds_altogether

    Example:
        path_of_wav_file = "/Organisation/Recherche/pico2wave/gtts_Test/test.wav"
        length_of_audio = get_audio_length(path_of_wav_file)
        print(length_of_audio)
    """
    process = subprocess.Popen(['ffmpeg', '-i', path_of_wav_file], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    stdout, stderr = process.communicate()
    matches = re.search(r"Duration:\s{1}(?P<hours>\d+?):(?P<minutes>\d+?):(?P<seconds>\d+\.\d+?),", stdout.decode(),
                        re.DOTALL).groupdict()

    hours = float(matches['hours'])
    minutes = float(matches['minutes'])
    seconds = float(matches['seconds'])

    minutes_to_seconds = minutes * 60
    hours_to_seconds = hours * 60 * 60
    seconds_rounded_up = math.ceil(seconds)

    seconds_altogether = hours_to_seconds + minutes_to_seconds + seconds_rounded_up

    return seconds_altogether
