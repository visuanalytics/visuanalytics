"""
Modul welches Bilder und Audios kombiniert zu einem fertigem Video
"""

import os

from visuanalytics.analytics.util import resources


def to_forecast_germany(images, audios, audiol):
    """
    Methode zum Erstellen des Deutschland 1-5 Tages Video aus den Bildern+Audios.
    Hinweiß: Alle 3 Listen müssen in der selben Reihenfolge sein und alle Listen
    müssen die selbe Anzahl an Elementen beeihalten.

    :param images: Eine Liste aus Strings Elementen mit den Dateinamen zu den Bildern
    :type images: list
    :param audios: Eine Liste aus String Elementen mit den Dateinamen zu den Audios
    :type audios: list
    :param audiol: Eine Liste aus Strings Elementen mit den Audiolängen der Audios
    :type audiol: list
    :return:
    :rtype: str

    """

    with resources.open_resource("weather/input.txt", "w") as file:
        for i in range(0, len(audios)):
            file.write("file '" + audios[i] + "'\n")

    shell_cmd = "ffmpeg -f concat -i input.txt -c copy output.wav"
    os.chdir(resources.get_resource_path("temp/weather"))
    os.system(shell_cmd)

    with resources.open_resource("weather/input.txt", "w") as file:
        for i in range(0, len(images)):
            file.write("file '" + images[i] + "'\n")
            file.write("duration '" + str(audiol[i]) + "'\n")

    shell_cmd = "ffmpeg -y -f concat -i input.txt -i output.wav -s 1920x1080 output.mp4"
    os.chdir(resources.get_resource_path("temp/weather"))
    os.system(shell_cmd)

    return "output.mp4"
