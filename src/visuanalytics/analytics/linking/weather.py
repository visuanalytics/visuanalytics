"""
Modul welches Bilder und Audios kombiniert zu einem fertigem Video
"""

import os

from visuanalytics.analytics.util import resources


def to_forecast_germany(images, audios, audiol):
    """
    Methode zum erstellen des Deutschland 1-4 Tages Video aus den Bildern+Audios

    :param images: Eine Liste aus 3 Elementen mit den Dateinamen zu den Bildern (1 -> Iconbild | 2 -> Temperaturbild | 3-> Dreitagesbild)
    :type: list
    :param audios: Eine Liste aus 3 Elementen mit den Dateinamen zu den Audios  (1 -> Iconaudio | 2 -> Temperataudio | 3-> Dreitagesaudio)
    :type: list
    :param audiol: Eine Liste aus 3 Elementen mit den Audiolängen der Audios (1 -> Iconaudiolänge | 2 -> Temperataudiolänge | 3-> Dreitagesaudiolänge)
    :type: list
    :return:
    :rtype: str

    """

    with resources.open_resource("../../resources/temp/weather/input.txt", "w") as file:
        file.write("file '" + audios[0] + "'\n")
        file.write("file '" + audios[1] + "'\n")
        file.write("file '" + audios[2] + "'\n")

    shell_cmd = "ffmpeg -f concat -i input.txt -c copy output.wav"
    os.chdir(resources.get_resource_path("../../resources/temp/weather"))
    os.system(shell_cmd)

    with resources.open_resource("../../resources/temp/weather/input.txt", "w") as file:
        file.write("file '" + images[0] + "'\n")
        file.write("duration " + audiol[0] + "\n")
        file.write("file '" + images[1] + "'\n")
        file.write("duration " + audiol[1] + "\n")
        file.write("file '" + images[2] + "'\n")
        file.write("duration " + audiol[2] + "\n")
    shell_cmd = "ffmpeg -y -f concat -i input.txt -i output.wav -s 1920x1080 output.mp4"
    os.chdir(resources.get_resource_path("../../resources/temp/weather"))
    os.system(shell_cmd)

    return "output.mp4"
