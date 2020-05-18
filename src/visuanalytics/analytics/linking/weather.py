"""
Modul welches Bilder und Audios kombiniert zu einem fertigem Video
"""

import os

from visuanalytics.analytics.util import resources


def to_forecast_germany(pipeline_id, images, audios, audiol):
    """
    Methode zum Erstellen des Deutschland 1-5 Tages Video aus den Bildern+Audios.
    Hinweiß: Alle 3 Listen müssen in der selben Reihenfolge sein und alle Listen
    müssen die selbe Anzahl an Elementen beeihalten.

    :param pipeline_id: id der Pipeline, von der die Funktion aufgerufen wurde.
    :type pipeline_id: str
    :param images: Eine Liste aus Strings Elementen mit den Dateinamen zu den Bildern
    :type images: list
    :param audios: Eine Liste aus String Elementen mit den Dateinamen zu den Audios
    :type audios: list
    :param audiol: Eine Liste aus Strings Elementen mit den Audiolängen der Audios
    :type audiol: list
    :return:
    :rtype: str

    """

    with open(resources.get_temp_resource_path("input.txt", pipeline_id), "w") as file:
        for i in audios:
            file.write("file 'file:" + i + "'\n")

    output = resources.new_temp_resource_path(pipeline_id, "wav")
    shell_cmd = "ffmpeg -f concat -safe 0 -i input.txt -c copy " + output
    os.chdir(resources.get_temp_resource_path("", pipeline_id))
    os.system(shell_cmd)

    with open(resources.get_temp_resource_path("input.txt", pipeline_id), "w") as file:
        for i in range(0, len(images)):
            file.write("file 'file:" + images[i] + "'\n")
            file.write("duration " + (str(int(audiol[i]))) + "\n")

    output2 = resources.new_temp_resource_path("weather/output/", ".mp4")
    shell_cmd = "ffmpeg -y -f concat -safe 0 -i input.txt -i " + output + " -s 1920x1080 " + output2
    os.chdir(resources.get_temp_resource_path("", pipeline_id))
    os.system(shell_cmd)

    return output2
