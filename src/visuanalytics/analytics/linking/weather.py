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

    file = open(resources.get_resource_path("temp/weather/input.txt"), "w")
    for i in audios:
        file.write("file 'file:" + i + "'\n")
    file.close()

    output = resources.get_new_ressource_path(format=".wav")
    shell_cmd = "ffmpeg -f concat -safe 0 -i input.txt -c copy " + output
    os.chdir(resources.get_resource_path("temp/weather"))
    os.system(shell_cmd)

    file = open(resources.get_resource_path("temp/weather/input.txt"), "w")
    for i in range(0, len(images)):
        file.write("file 'file:" + images[i] + "'\n")
        file.write("duration " + (str(int(audiol[i]))) + "\n")
    file.close()

    output2 = resources.get_new_ressource_path(location="weather/output/", format=".mp4")
    shell_cmd = "ffmpeg -y -f concat -safe 0 -i input.txt -i " + output + " -s 1920x1080 " + output2
    os.chdir(resources.get_resource_path("temp/weather"))
    os.system(shell_cmd)

    resources.delete_resource(output)
    resources.delete_resource("temp/weather/input.txt")

    return output2
