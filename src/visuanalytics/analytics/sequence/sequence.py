"""
Modul, welches Bilder und Audios zu einem Video kombiniert.
"""
import numbers
import os
import subprocess
import uuid

from mutagen.mp3 import MP3

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.sequence.util.attach_utils import init_pipeline, extend_out_config
from visuanalytics.analytics.util.step_errors import raise_step_error, SequenceError, FFmpegError
from visuanalytics.analytics.util.type_utils import register_type_func, get_type_func
from visuanalytics.util import resources
from visuanalytics.util.resources import get_relative_temp_resource_path

SEQUENCE_TYPES = {}
"""Ein Dictionary bestehend aus allen Sequence-Typ-Methoden."""


def register_sequence(func):
    """Registriert die übergebene Funktion und versieht sie mit einem `"try/except"`-Block.
    Fügt eine Typ-Funktion dem Dictionary SEQUENCE_TYPES hinzu.

    :param func: die zu registrierende Funktion
    :return: Funktion mit try/except-Block
    """
    return register_type_func(SEQUENCE_TYPES, SequenceError, func)


@raise_step_error(SequenceError)
def link(values: dict, step_data: StepData):
    """Überprüft, welcher Typ der Video-Generierung vorliegt und ruft die passende Typ-Methode auf.

    :param values: Werte aus der JSON-Datei
    :param step_data: Daten aus der API
    :return: Pfad zum Output-Video
    :rtype: str
    """
    out_images, out_audios, out_audio_l = [], [], []
    attach_mode = step_data.get_config("attach_mode", "")

    seq_func = get_type_func(values["sequence"], SEQUENCE_TYPES)
    seq_func(values, step_data, out_images, out_audios, out_audio_l)

    if step_data.get_config("attach", None) is not None and not attach_mode:
        if not step_data.get_config("separate_rendering", False):
            for item in step_data.get_config("attach", None):
                pipeline = init_pipeline(step_data, step_data.data["_pipe_id"], item["steps"],
                                         config=item.get("config", {}),
                                         no_tmp_dir=True)
                pipeline.start()

                # Add images and audios from the pipeline
                extend_out_config(pipeline.config["sequence"], out_images, out_audios, out_audio_l)

            _generate(out_images, out_audios, out_audio_l, step_data, values)
        else:
            # Save and manipulate out path (to save video to tmp dir)
            out_path = step_data.get_config("output_path")
            step_data.data["_conf"]["output_path"] = get_relative_temp_resource_path("", step_data.data["_pipe_id"])

            _generate(out_images, out_audios, out_audio_l, step_data, values)

            # Resote out_path
            step_data.data["_conf"]["output_path"] = out_path

            sequence_out = [values["sequence"]]

            for idx, item in enumerate(step_data.get_config("attach", None)):
                pipeline = init_pipeline(step_data, uuid.uuid4().hex, item["steps"], idx, item.get("config", {}))
                pipeline.start()

                sequence_out.append(pipeline.config["sequence"])

            _combine(sequence_out, step_data, values)

    else:
        if attach_mode == "combined":
            values["sequence"] = {
                "out_images": out_images,
                "out_audios": out_audios,
                "out_audio_l": out_audio_l
            }
        else:
            _generate(out_images, out_audios, out_audio_l, step_data, values)


@register_sequence
def successively(values: dict, step_data: StepData, out_images, out_audios, out_audio_l):
    """Generierung des Output-Videos aus allen Bild- und Audiodateien.

    Generiert das Output-Video. Dazu werden alle Bild- und alle Audiodateien - in der
    Reihenfolge wie sie in values (in der JSON) vorliegen - aneinandergereiht.

    :param values: Werte aus der JSON-Datei
    :param step_data: Daten aus der API
    :return: Pfad zum Output-Video
    :rtype: str
    """
    for image in values["images"]:
        out_images.append(values["images"][image])
    for audio in values["audio"]["audios"]:
        out_audios.append(values["audio"]["audios"][audio])
        out_audio_l.append(MP3(values["audio"]["audios"][audio]).info.length)


@register_sequence
def custom(values: dict, step_data: StepData, out_images, out_audios, out_audio_l):
    """Generierung des Output-Videos aus ausgewählten Bild- und Audiodateien.

    Generiert das Output-Video. In values (in der JSON) muss angegeben sein in welcher Reihenfolge und wie lange jedes Bild
    und die passenden Audiodatei aneinandergereiht werden sollen.

    :param values: Werte aus der JSON-Datei
    :param step_data: Daten aus der API
    :return: Pfad zum Output-Video
    :rtype: str
    """
    for s in values["sequence"]["pattern"]:
        out_images.append(values["images"][step_data.format(s["image"])])
        if s.get("audio_l", None) is None:
            out_audio_l.append(step_data.get_data(s.get("time_diff", 0), None, numbers.Number))
        else:
            out_audios.append(values["audio"]["audios"][step_data.format(s["audio_l"])])
            out_audio_l.append(step_data.get_data(s.get("time_diff", 0), None, numbers.Number) + MP3(
                values["audio"]["audios"][step_data.format(s["audio_l"])]).info.length)

    sum_sol = 0
    for entry in values["sequence"]["pattern"]:
        sum_sol += entry.get("time_diff", 0)
    temp_silent_file = resources.new_temp_resource_path(step_data.data["_pipe_id"], "ac3")
    if sum_sol > 0:
        args = ["ffmpeg", "-loglevel", "8", "-f", "lavfi", "-i", "anullsrc=channel_layout=5.1:sample_rate=48000",
                "-t", str(sum_sol), temp_silent_file]
        subprocess.run(args)
        # out_audios.append(temp_silent_file)
        # out_audio_l.append(sum_sol)


def _generate(images, audios, audio_l, step_data: StepData, values: dict):
    try:
        if step_data.get_config("h264_nvenc", False):
            os.environ['LD_LIBRARY_PATH'] = "/usr/local/cuda/lib64"

        # Concatenate audio files

        with open(resources.get_temp_resource_path("input.txt", step_data.data["_pipe_id"]), "w") as file:
            for i in audios:
                file.write("file 'file:" + i + "'\n")
        output = resources.new_temp_resource_path(step_data.data["_pipe_id"], "mp3")
        args1 = ["ffmpeg", "-f", "concat", "-safe", "0", "-i",
                 resources.get_temp_resource_path("input.txt", step_data.data["_pipe_id"]),
                 output]
        subprocess.run(args1)

        # Generate video

        output2 = resources.get_out_path(values["out_time"], step_data.get_config("output_path", ""),
                                         step_data.get_config("job_name", ""))
        if step_data.get_config("separate_rendering", False):
            output2 = resources.get_out_path(values["out_time"], step_data.get_config("output_path", ""),
                                             step_data.get_config("job_name", "") + "_0")

        args2 = ["ffmpeg", "-y"]
        for i in range(0, len(images)):
            args2.extend(("-loop", "1", "-t", str(round(audio_l[i], 2)), "-i", images[i]))

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
        subprocess.run(args2)

        values["sequence"] = output2

    except subprocess.CalledProcessError as e:
        raise FFmpegError(e.returncode, e.output.decode("utf-8")) from e


def _combine(sequence_out: list, step_data: StepData, values: dict):
    try:
        with open(resources.get_temp_resource_path("input.txt", step_data.data["_pipe_id"]), "w") as file:
            for video in sequence_out:
                file.write("file 'file:" + video + "'\n")
        output = resources.get_out_path(values["out_time"], step_data.get_config("output_path", ""),
                                        step_data.get_config("job_name", ""))
        args = ["ffmpeg", "-safe", "0", "-f", "concat", "-i",
                resources.get_temp_resource_path("input.txt", step_data.data["_pipe_id"]), "-c", "copy", output]
        subprocess.run(args)
        values["sequence"] = output
    except subprocess.CalledProcessError as e:
        raise FFmpegError(e.returncode, e.output.decode("utf-8")) from e


def _sum_audio_l(audio_l, index):
    sum = 0
    for i in range(0, index + 1):
        sum += audio_l[i]
    return int(sum)
