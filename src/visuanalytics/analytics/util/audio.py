from mutagen.mp3 import MP3


def get_audio_length(path_of_audio_file):
    """Von einer .wav Audio-Datei Länge herausfinden

    Die Methode bekommt den Pfad zu der Audio-Datei (.wav/.mp3) als Argument übergeben.

    Wird benötigt um die Länge des generierten Videos auf die Länge der generierten Audiodatei anzupassen.

    :param path_of_audio_file: Pfad zu Datei
    :type path_of_audio_file: list
    :return: seconds_altogether
    :rtype: list

    Example:
        path_of_audio_file = "/home/lisa/Dokumente/Studium/4. Semester/SWTP/Data-Analytics/Organisation/Recherche/pico2wave/gtts_Test/test.wav"
        length_of_audio = get_audio_length(path_of_audio_file)
        print(length_of_audio)
    """
    out = []
    for audio in path_of_audio_file:
        out.append(MP3(audio).info.length)
    return out
