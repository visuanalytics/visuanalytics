import os

"""
So könnte die methode aussehen, die den endgültigen Wetterbericht generiert:
def to_forecast(images, audios): ...

"""


def to_forecast(bild_heute_art, bild_heute_temp, bild_dreitage, audio_heute_art,
                audio_heute_temp, audio_dreitage, audiol_heute_art, audiol_heute_temp,
                audio3_dreitage):
    """Methode wird genutzt um das gesamte Video (1+3) zu erstellen
            Args:
                bild_heute_art (String): Dateinamen des Bildes für die Vorhersage für morgen (Icons)
                bild_heute_temp (String): Dateinamen des Bildes für die Vorhersage für morgen (Temperatur)
                bild_dreitage (String): Dateinamen des Bildes für die Vorhersage für die nächsten 3 Tage
                audio_heute_art (String): Dateinamen des Audios für die Vorhersage für morgen (Icons)
                audio_heute_temp (String): Dateinamen des Audios für die Vorhersage für morgen (Temperatur)
                audio_dreitage (String): Dateinamen des Audios für die Vorhersage für die nächsten 3 Tage
                audiol_heute_art (Int): Audiolänge des Audios für die Vorhersage für morgen (Icons)
                audiol_heute_temp (Int): Audiolänge des Audios für die Vorhersage für morgen (Temperatur)
                audio3_dreitage (Int): Audiolänge des Audios für die Vorhersage für die nächsten 3 Tage
           Returns:
              String : Den Dateinamen des erstellten Bildes
       """

    with open(os.path.join(os.path.dirname(__file__), "../../resources/temp/weather", "input.txt", "w")) as file:
        file.write("file '" + audio_heute_art + "'\n")
        file.write("file '" + audio_heute_temp + "'\n")
        file.write("file '" + audio_dreitage + "'\n")

    shell_cmd = "ffmpeg -f concat -i input.txt -c copy output.wav"
    os.chdir(os.path.join(os.path.dirname(__file__), "../../resources/temp/weather"))
    os.system(shell_cmd)

    with open(os.path.join(os.path.dirname(__file__), "../../resources/temp/weather", "input.txt", "w")) as file:
        file.write("file '" + bild_heute_art + "'\n")
        file.write("duration " + audiol_heute_art + "\n")
        file.write("file '" + bild_heute_temp + "'\n")
        file.write("duration " + audiol_heute_temp + "\n")
        file.write("file '" + bild_dreitage + "'\n")
        file.write("duration " + audio3_dreitage + "\n")
    shell_cmd = "ffmpeg -y -f concat -i input.txt -i output.wav -s 1920x1080 output.mp4"
    os.chdir(os.path.join(os.path.dirname(__file__), "../../resources/temp/weather"))
    os.system(shell_cmd)

    return "output.mp4"
