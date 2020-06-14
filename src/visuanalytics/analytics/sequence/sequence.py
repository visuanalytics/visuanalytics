"""
Modul welches Bilder und Audios kombiniert zu einem fertigem Video
"""

import os
import subprocess
from mutagen.mp3 import MP3

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.util import resources


def link(values: dict, h264_nvenc, out_path, step_data: StepData):
    out_images, out_audios, out_audio_l = [], [], []
    for s in values["sequence"]:
        out_images.append(values["images"][step_data.format(s["image"])])
        if s["audio_l"] is None:
            out_audio_l.append(step_data.format(s["time_diff"]))
        else:
            out_audios.append(values["audio"]["audios"][step_data.format(s["audio_l"])])
            out_audio_l.append(step_data.format(s["time_diff"]) + MP3(
                values["audio"]["audios"][step_data.format(s["audio_l"])]).info.length)
    return _link(values["id"], out_images, out_audios, out_audio_l, h264_nvenc, out_path, values["name"])


def _link(pipeline_id, images, audios, audio_l, h264_nvenc, out_path, job_name):
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
    :param audio_l: Eine Liste aus Strings Elementen mit den Audiolängen der Audios
    :type audio_l: list
    :param h264_nvenc: Nvidia Hardwarebeschleunigung aktiv oder nicht
    :type h264_nvenc: bool
    :param out_path: Path an dem das Video abgelegt werden soll
    :type out_path: str
    :param job_name: Eine Beschreibung des Jobs der gerade ausgeführt wird ( wird für den dateinamen benötigt)
    :type job_name: str
    :return: Pfad des erstellten Videos
    :rtype: str
    :raises: CalledProcessError: Wenn ein ffmpeg-Command nicht mit Return-Code 0 terminiert.
    """

    if h264_nvenc:
        os.environ['LD_LIBRARY_PATH'] = "/usr/local/cuda/lib64"

    with open(resources.get_temp_resource_path("input.txt", pipeline_id), "w") as file:
        for i in audios:
            file.write("file 'file:" + i + "'\n")
    output = resources.new_temp_resource_path(pipeline_id, "mp3")
    args1 = ["ffmpeg", "-f", "concat", "-safe", "0", "-i", resources.get_temp_resource_path("input.txt", pipeline_id),
             "-c", "copy",
             output]
    proc1 = subprocess.run(args1, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    proc1.check_returncode()

    output2 = resources.get_out_path(out_path, job_name)
    args2 = ["ffmpeg", "-y"]
    for i in range(0, len(images)):
        args2.extend(("-loop", "1", "-t", str(audio_l[i]), "-i", images[i]))

    args2.extend(("-i", output, "-c:a", "copy", "-filter_complex"))

    filter = ""
    for i in range(0, len(images) - 1):
        filter += "[" + str(i + 1) + "]format=yuva444p,fade=d=0.8:t=in:alpha=1,setpts=PTS-STARTPTS+" + str(
            _sum_audio_l(audio_l, i)) + "/TB[f" + str(
            i) + "];"
    for j in range(0, len(images) - 1):
        if j == 0:
            filter += "[0][f0]overlay[bg1];"
        elif j == len(images) - 2:
            filter += "[bg" + str(j) + "][f" + str(j) + "]overlay,format=yuv420p[v]"
        else:
            filter += "[bg" + str(j) + "][f" + str(j) + "]overlay[bg" + str(j + 1) + "];"

    args2.extend((filter, "-map", "[v]", "-map", str(len(images)) + ":a"))

    if h264_nvenc:
        args2.extend(("-c:v", "h264_nvenc"))

    args2.extend(("-shortest", "-s", "1920x1080", output2))
    proc2 = subprocess.run(args2, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    proc2.check_returncode()

    return output2


def _sum_audio_l(audio_l, index):
    sum = 0
    for i in range(0, index + 1):
        sum += audio_l[i]
    return int(sum)
