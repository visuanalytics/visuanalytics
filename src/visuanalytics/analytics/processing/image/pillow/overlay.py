from PIL import Image

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.processing.image.pillow.draw import DRAW_TYPES
from visuanalytics.analytics.util import resources
from visuanalytics.analytics.util.step_errors import ImageError
from visuanalytics.analytics.util.type_utils import register_type_func

OVERLAY_TYPES = {}


def register_overlay(func):
    return register_type_func(OVERLAY_TYPES, ImageError, func)


@register_overlay
def text(overlay: dict, source_img, draw, presets: dict, step_data: StepData):
    content = step_data.format(overlay["pattern"])
    DRAW_TYPES[overlay["anchor_point"]](draw, (
        step_data.format(overlay["pos_x"]), step_data.format(overlay["pos_y"])), content,
                                        step_data.format(presets[overlay["preset"]]["font_size"]),
                                        step_data.format(presets[overlay["preset"]]["color"]),
                                        step_data.format(presets[overlay["preset"]]["font"]))


@register_overlay
def text_array(overlay: dict, source_img, draw, presets: dict, step_data: StepData):
    for idx, i in enumerate(overlay["pos_x"]):
        if isinstance(overlay["preset"], list):
            preset = overlay["preset"][idx]
        else:
            preset = overlay["preset"]
        if isinstance(overlay["pattern"], list):
            pattern = overlay["pattern"][idx]
        else:
            pattern = overlay["pattern"]
        new_overlay = {
            "description": overlay["description"],
            "anchor_point": overlay["anchor_point"],
            "pos_x": overlay["pos_x"][idx],
            "pos_y": overlay["pos_y"][idx],
            "pattern": pattern,
            "preset": preset}
        text(new_overlay, source_img, draw, presets, step_data)


@register_overlay
def option(values: dict, source_img, draw, presets: dict, step_data: StepData):
    chosen_text = "on_false"
    if step_data.format(values["check"]):
        chosen_text = "on_true"
    for overlay in values[chosen_text]:
        OVERLAY_TYPES[overlay["type"]](overlay, source_img, draw, presets, step_data)


@register_overlay
def image(overlay: dict, source_img, draw, presets: dict, step_data: StepData):
    path = step_data.format(overlay["pattern"])
    icon = Image.open(
        resources.get_resource_path(path)).convert("RGBA")
    if step_data.format(overlay.get("colour", "RGBA")) != "RGBA":
        icon = icon.convert(step_data.format(overlay["colour"]))
    if overlay.get("size_x", None) is not None and overlay.get("size_y", None) is not None:
        icon = icon.resize([step_data.format(overlay["size_x"]),
                            step_data.format(overlay["size_y"])], Image.LANCZOS)
    if overlay.get("transparency", False):
        source_img.alpha_composite(icon, (step_data.format(overlay["pos_x"]),
                                          step_data.format(overlay["pos_y"])))
    else:
        source_img.paste(icon, (step_data.format(overlay["pos_x"]),
                                step_data.format(overlay["pos_y"])), icon)


@register_overlay
def image_array(overlay: dict, source_img, draw, presets: dict, step_data: StepData):
    for idx, i in enumerate(overlay["pos_x"]):
        if isinstance(overlay["colour"], list):
            colour = overlay["colour"][idx]
        else:
            colour = overlay["colour"]
        if isinstance(overlay["pattern"], list):
            pattern = overlay["pattern"][idx]
        else:
            pattern = overlay["pattern"]
        new_overlay = {
            "description": overlay["description"],
            "size_x": overlay.get("size_x", None),
            "size_y": overlay.get("size_y", None),
            "pos_x": overlay["pos_x"][idx],
            "pos_y": overlay["pos_y"][idx],
            "transparency": overlay.get("transparency", False),
            "pattern": pattern,
            "colour": colour}
        image(new_overlay, source_img, draw, presets, step_data)
