import shutil
import os

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.processing.image.visualization import IMAGE_TYPES
from visuanalytics.analytics.util.type_utils import register_type_func, get_type_func
from visuanalytics.analytics.util.step_errors import raise_step_error, ThumbnailError
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
    seq_func = get_type_func(values["thumbnail"], THUMBNAIL_TYPES)

    return seq_func(values, step_data)


@register_thumbnail
def new(values: dict, step_data: StepData):
    image_func = get_type_func(values["thumbnail"]["image"], IMAGE_TYPES)
    src_file = image_func(values["thumbnail"]["image"], values["images"], values["presets"], step_data)
    _copy_and_rename(src_file, values, step_data)


@register_thumbnail
def created(values: dict, step_data: StepData):
    src_file = values["images"][values["thumbnail"]["name"]]
    _copy_and_rename(src_file, values, step_data)


def _copy_and_rename(src_file: str, values: dict, step_data: StepData):
    shutil.copy(src_file, step_data.get_config("output_path"))
    os.rename(os.path.join(step_data.get_config("output_path"), os.path.basename(src_file)),
              resources.get_out_path(values["out_time"], step_data.get_config("output_path"),
                                     step_data.get_config("job_name"), format=".png", thumbnail=True))
