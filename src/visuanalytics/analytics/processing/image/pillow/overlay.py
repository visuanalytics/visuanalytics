from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.processing.image.pillow.draw import DRAW_TYPES
from PIL import Image

from visuanalytics.analytics.util import resources


def add_text(overlay: dict, source_img, draw, presets: dict, step_data: StepData):
    content = step_data.format(overlay["pattern"])
    DRAW_TYPES[overlay["anchor_point"]](draw, (
        step_data.format(overlay["pos_x"]), step_data.format(overlay["pos_y"])), content,
                                        step_data.format(presets[overlay["preset"]]["font_size"]),
                                        step_data.format(presets[overlay["preset"]]["color"]),
                                        step_data.format(presets[overlay["preset"]]["font"]))


def add_text_array(overlay: dict, source_img, draw, presets: dict, step_data: StepData):
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
        add_text(new_overlay, source_img, draw, presets, step_data)


def option(values: dict, source_img, draw, presets: dict, step_data: StepData):
    chosen_text = "on_false"
    if step_data.format(values["check"]):
        chosen_text = "on_true"
    for overlay in values[chosen_text]:
        OVERLAY_TYPES[overlay["type"]](overlay, source_img, draw, presets, step_data)


def add_image(overlay: dict, source_img, draw, presets: dict, step_data: StepData):
    path = step_data.format(overlay["pattern"])
    icon = Image.open(
        resources.get_resource_path(path)).convert("RGBA")
    if step_data.format(overlay.get("colour", "RGBA")) != "RGBA":
        icon = icon.convert(step_data.format(overlay["colour"]))
    if overlay["size_x"] is not None:
        icon = icon.resize([step_data.format(overlay["size_x"]),
                            step_data.format(overlay["size_y"])], Image.LANCZOS)
    if overlay.get("transparency", False):
        source_img.paste(icon, (step_data.format(overlay["pos_x"]),
                                step_data.format(overlay["pos_y"])), icon)
    else:
        source_img.alpha_composite(icon, (step_data.format(overlay["pos_x"]),
                                          step_data.format(overlay["pos_y"])))


def add_image_array(overlay: dict, source_img, draw, presets: dict, step_data: StepData):
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
            "size_x": overlay["size_x"],
            "size_y": overlay["size_y"],
            "pos_x": overlay["pos_x"][idx],
            "pos_y": overlay["pos_y"][idx],
            "pattern": pattern,
            "colour": colour}
        add_image(new_overlay, source_img, draw, presets, step_data)


OVERLAY_TYPES = {
    "text": add_text,
    "text_array": add_text_array,
    "option": option,
    "image": add_image,
    "image_array": add_image_array
}
