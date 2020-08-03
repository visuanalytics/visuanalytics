"""
Modul welches Bilder und Audios kombiniert zu einem fertigem Video.
"""

import os
import subprocess

from mutagen.mp3 import MP3
from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.util.step_errors import raise_step_error, SeqenceError
from visuanalytics.analytics.util.type_utils import register_type_func, get_type_func
from visuanalytics.util import resources

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
    out_images, out_audios, out_audio_l = [], [], []
    seq_func = get_type_func(values["sequence"], SEQUENCE_TYPES)
    seq_func(values, step_data, out_images, out_audios, out_audio_l)

    if step_data.get_config("attach", None) is not None:
        if step_data.get_config("separate_rendering", False) is False:
            for item in step_data.get_config("attach", None):
                from visuanalytics.analytics.control.procedures.pipeline import Pipeline
                pipeline = Pipeline(step_data.data["_pipe_id"], item["steps"], item.get("config", {}), True)
                pipeline.start()
                if pipeline.current_step != -2:
                    seq_func = get_type_func(pipeline.config["sequence"], SEQUENCE_TYPES)
                    seq_func(pipeline.config, step_data, out_images, out_audios, out_audio_l)
        else:
            _link(out_images, out_audios, out_audio_l, step_data, values)
            sequence_out = [f"{step_data.data['_pipe_id`']}_0"]
            for idx, item in step_data.get_config("attach", None):
                from visuanalytics.analytics.control.procedures.pipeline import Pipeline
                pipeline = Pipeline(f"{step_data.data['_pipe_id`']}_{idx + 1}", item["steps"], item.get("config", {}))
                pipeline.start()
                if pipeline.current_step != -2:
                    sequence_out.append(f"{step_data.data['_pipe_id`']}_{idx + 1}")


@register_sequence
def successively(values: dict, step_data: StepData, out_images, out_audios, out_audio_l):
    """
    Generiert das Output Video, dazu werden dediglich alle Bilder und alle Video Datein in der
    Reihenfolge wie sie in values(also in der JSON) vorliegen aneinander gereiht.

    :param values: Werte aus der JSON-Datei
    :param step_data: Daten aus der API
    :return: Den Pfad zum OutputVideo
    :rtype: str
    """
    for image in values["images"]:
        out_images.append(values["images"][image])
    for audio in values["audio"]["audios"]:
        out_audios.append(values["audio"]["audios"][audio])
        out_audio_l.append(MP3(values["audio"]["audios"][audio]).info.length)


@register_sequence
def custom(values: dict, step_data: StepData, out_images, out_audios, out_audio_l):
    """
    Generiert das Output Video, in values(also in der JSON) muss angegeben sein in welcher Reihenfolge und wie lange jedes Bild
    und die passenden Audio Datei aneinander gereiht werden sollen.

    :param values: Werte aus der JSON-Datei
    :param step_data: Daten aus der API
    :return: Den Pfad zum OutputVideo
    :rtype: str
    """
    for s in values["sequence"]["pattern"]:
        out_images.append(values["images"][step_data.format(s["image"])])
        if s.get("audio_l", None) is None:
            out_audio_l.append(step_data.format(s.get("time_diff", 0)))
        else:
            out_audios.append(values["audio"]["audios"][step_data.format(s["audio_l"])])
            out_audio_l.append(step_data.format(s.get("time_diff", 0)) + MP3(
                values["audio"]["audios"][step_data.format(s["audio_l"])]).info.length)


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

    output2 = resources.get_out_path(values["out_time"], step_data.get_config("output_path"),
                                     step_data.get_config("job_name"))
    if step_data.get_config("separate_rendering", False):
        output2 += f"{output2}_0"
    args2 = ["ffmpeg", "-y"]
    for i in range(0, len(images)):
        args2.extend(("-loop", "1", "-t", str(audio_l[i]), "-i", images[i]))

    args2.extend(("-i", output, "-c:a", "copy"))

    filter = ""
    for i in range(0, len(images) - 1):
        filter += f"[{i + 1}]format=yuva444p,fade=d={values['sequence'].get('transitions', 0.8)}:t=in:alpha=1,setpts=PTS-STARTPTS+{_sum_audio_l(audio_l, i)}/TB[f{i}];"
    for j in range(0, len(images) - 1):
        if j == 0:
            filter += "[0][f0]overlay[bg1];"
        elif j == len(images) - 2:
            filter += f"[bg{j}][f{j}]overlay,format=yuv420p[v]"
        else:
            filter += f"[bg{j}][f{j}]overlay[bg{j + 1}];"

    if len(images) > 2:
        args2.extend(("-filter_complex", filter, "-map", "[v]", "-map", str(len(images)) + ":a"))
    else:
        args2.extend(("-pix_fmt", "yuv420p"))
    if step_data.get_config("h264_nvenc", False):
        args2.extend(("-c:v", "h264_nvenc"))

    args2.extend(("-s", "1920x1080", output2))
    proc2 = subprocess.run(args2, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    proc2.check_returncode()
    values["sequence"] = output2


def _combine(sequence_out: list, step_data: StepData, values: dict):
    concat = "concat:"
    for entry in sequence_out:
        concat += concat + entry
    print(concat)
    output = resources.get_out_path(values["out_time"], step_data.get_config("output_path"),
                                    step_data.get_config("job_name"))
    args = ["ffmpeg", "-i", f"\"{concat}\"", "-c", "copy", output]
    proc2 = subprocess.run(args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    proc2.check_returncode()
    values["sequence"] = output


def _sum_audio_l(audio_l, index):
    sum = 0
    for i in range(0, index + 1):
        sum += audio_l[i]
    return int(sum)
