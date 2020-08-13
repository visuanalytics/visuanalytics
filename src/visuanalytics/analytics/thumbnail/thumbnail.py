import os
import shutil

from PIL import Image

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.processing.image.visualization import IMAGE_TYPES
from visuanalytics.analytics.util.step_errors import raise_step_error, ThumbnailError
from visuanalytics.analytics.util.type_utils import register_type_func, get_type_func
from visuanalytics.util import resources

THUMBNAIL_TYPES = {}
"""Ein Dictionary bestehende aus allen Thumbnail Typ Methoden."""


def register_thumbnail(func):
    """
    Fügt eine Typ-Funktion dem Dictionary THUMBNAIL_TYPES hinzu.

    :param func: Eine Funktion
    :return: Die übergebene Funktion
    """
    return register_type_func(THUMBNAIL_TYPES, ThumbnailError, func)


@raise_step_error(ThumbnailError)
def thumbnail(values: dict, step_data: StepData):
    if step_data.get_config("thumbnail", False) is False:
        return

    thumbnail = values["thumbnail"]

    seq_func = get_type_func(values["thumbnail"], THUMBNAIL_TYPES)
    seq_func(values, step_data)

    if "size_x" in thumbnail and "size_y" in thumbnail:
        size_x = step_data.format(thumbnail["size_x"])
        size_y = step_data.format(thumbnail["size_y"])

        source_img = Image.open(values["thumbnail"])
        source_img = source_img.resize([size_x, size_y], Image.LANCZOS)
        source_img.save(values["thumbnail"])


@register_thumbnail
def new(values: dict, step_data: StepData):
    image_func = get_type_func(values["thumbnail"]["image"], IMAGE_TYPES)
    src_file = image_func(values["thumbnail"]["image"], step_data, values["images"])
    _copy_and_rename(src_file, values, step_data)


@register_thumbnail
def created(values: dict, step_data: StepData):
    src_file = values["images"][values["thumbnail"]["name"]]
    _copy_and_rename(src_file, values, step_data)


def _copy_and_rename(src_file: str, values: dict, step_data: StepData):
    out_path = resources.path_from_root(step_data.get_config("output_path"))

    values["thumbnail"] = resources.get_out_path(values["out_time"], step_data.get_config("output_path"),
                                                 step_data.get_config("job_name"), format=".png", thumbnail=True)
    shutil.copy(src_file, out_path)
    os.rename(os.path.join(out_path, os.path.basename(src_file)), values["thumbnail"])
