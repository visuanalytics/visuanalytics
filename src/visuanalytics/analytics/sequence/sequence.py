"""
Modul welches Bilder und Audios kombiniert zu einem fertigem Video.
"""

import os
import subprocess

from mutagen.mp3 import MP3

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.util import resources
from visuanalytics.analytics.util.step_errors import raise_step_error, SeqenceError
from visuanalytics.analytics.util.type_utils import register_type_func, get_type_func

SEQUENCE_TYPES = {}
"""Ein Dictionary bestehende aus allen Sequence Typ Methoden."""


def register_sequence(func):
    """
    Fügt eine Typ-Funktion dem Dictionary SEQUENCE_TYPES hinzu.

    :param func: Eine Funktion
    :return: Die übergebene Funktion
    """
    return register_type_func(SEQUENCE_TYPES, SeqenceError, func)


@raise_step_error(SeqenceError)
def link(values: dict, step_data: StepData):
    """
    Überprüft welcher Typ der Video generierung vorliegt und ruft die passende Typ Methode auf.

    :param values: Werte aus der JSON-Datei
    :param step_data: Daten aus der API
    :return: Den Pfad zum OutputVideo
    :rtype: str
    """
    seq_func = get_type_func(values["sequence"], SEQUENCE_TYPES)

    return seq_func(values, step_data)


@register_sequence
def successively(values: dict, step_data: StepData):
    """
    Generiert das Output Video, dazu werden dediglich alle Bilder und alle Video Datein in der
    Reihenfolge wie sie in values(also in der JSON) vorliegen aneinander gereiht.

    :param values: Werte aus der JSON-Datei
    :param step_data: Daten aus der API
    :return: Den Pfad zum OutputVideo
    :rtype: str
    """
    out_images, out_audios, out_audio_l = [], [], []
    for image in values["images"]:
        out_images.append(values["images"][image])
    for audio in values["audio"]["audios"]:
        out_audios.append(values["audio"]["audios"][audio])
        out_audio_l.append(MP3(values["audio"]["audios"][audio]).info.length)
    return _link(out_images, out_audios, out_audio_l, step_data, values)


@register_sequence
def custom(values: dict, step_data: StepData):
    """
    Generiert das Output Video, in values(also in der JSON) muss angegeben sein in welcher Reihenfolge und wie lange jedes Bild
    und die passenden Audio Datei aneinander gereiht werden sollen.

    :param values: Werte aus der JSON-Datei
    :param step_data: Daten aus der API
    :return: Den Pfad zum OutputVideo
    :rtype: str
    """
    out_images, out_audios, out_audio_l = [], [], []
    for s in values["sequence"]["pattern"]:
        out_images.append(values["images"][step_data.format(s["image"])])
        if s.get("audio_l", None) is None:
            out_audio_l.append(step_data.format(s.get("time_diff", 0)))
        else:
            out_audios.append(values["audio"]["audios"][step_data.format(s["audio_l"])])
            out_audio_l.append(step_data.format(s.get("time_diff", 0)) + MP3(
                values["audio"]["audios"][step_data.format(s["audio_l"])]).info.length)

    return _link(out_images, out_audios, out_audio_l, step_data, values)


def _link(images, audios, audio_l, step_data: StepData, values: dict):
    if step_data.get_config("h264_nvenc", False):
        os.environ['LD_LIBRARY_PATH'] = "/usr/local/cuda/lib64"

    with open(resources.get_temp_resource_path("input.txt", step_data.data["_pipe_id"]), "w") as file:
        for i in audios:
            file.write("file 'file:" + i + "'\n")
    output = resources.new_temp_resource_path(step_data.data["_pipe_id"], "mp3")
    args1 = ["ffmpeg", "-f", "concat", "-safe", "0", "-i",
             resources.get_temp_resource_path("input.txt", step_data.data["_pipe_id"]),
             "-c", "copy",
             output]
    proc1 = subprocess.run(args1, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    proc1.check_returncode()

    output2 = resources.get_out_path(step_data.get_config("output_path"), step_data.get_config("job_name"))
    args2 = ["ffmpeg", "-y"]
    for i in range(0, len(images)):
        args2.extend(("-loop", "1", "-t", str(audio_l[i]), "-i", images[i]))

    args2.extend(("-i", output, "-c:a", "copy"))

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

    if len(images) > 2:
        args2.extend(("-filter_complex", filter, "-map", "[v]", "-map", str(len(images)) + ":a"))
    else:
        args2.extend(("-pix_fmt", "yuv420p"))
    if step_data.get_config("h264_nvenc", False):
        args2.extend(("-c:v", "h264_nvenc"))

    args2.extend(("-s", "1920x1080", output2))
    proc2 = subprocess.run(args2, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    proc2.check_returncode()

    return output2


def _sum_audio_l(audio_l, index):
    sum = 0
    for i in range(0, index + 1):
        sum += audio_l[i]
    return int(sum)
