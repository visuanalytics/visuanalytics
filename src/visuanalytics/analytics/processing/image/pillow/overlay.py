from visuanalytics.analytics.processing.image.pillow.draw import draw_text, draw_text_fix
from PIL import Image

from visuanalytics.analytics.util import resources

DRAW_TYPES = {
    "center": draw_text,
    "left": draw_text_fix
}


def add_text(overlay, source_img, draw, presets):
    content = "overlay[pattern]"  # todo (jannik)
    DRAW_TYPES[overlay["anchestor_point"]](draw, (overlay["x"], overlay["y"]), content,
                                           presets[overlay["preset"]["font_size"]],
                                           presets[overlay["preset"]["font_colour"]],
                                           presets[overlay["preset"]["font_path"]])


def add_text_array(overlay, source_img, draw, presets):
    for idx in enumerate(overlay["pos_x"]):
        if isinstance(overlay["preset"], list):
            preset = overlay["preset"][idx]
        else:
            preset = overlay["preset"]
        if isinstance(overlay["pattern"], list):
            pattern = overlay["preset"][idx]
        else:
            pattern = overlay["preset"]
        new_overlay = {
            "description": overlay["description"],
            "anchor_point": overlay["anchor_point"],
            "pos_x": overlay["pos_x"][idx],
            "pos_y": overlay["pos_y"][idx],
            "pattern": pattern,
            "preset": preset}
        add_text(new_overlay, source_img, draw, presets)


def add_image(overlay, source_img, draw, presets):
    path = "overlay[pattern]"  # todo (jannik)
    icon = Image.open(
        resources.get_resource_path(path)).convert(overlay["colour"])
    if overlay["size_x"] is not None:
        icon = icon.resize([overlay["size_x"], overlay["size_y"]], Image.LANCZOS)
    source_img.paste(icon, (overlay["pos_x"]["pos_y"]), icon)


def add_image_array(overlay, source_img, draw, presets):
    for idx in enumerate(overlay["pos_x"]):
        if isinstance(overlay["colour"], list):
            colour = overlay["colour"][idx]
        else:
            colour = overlay["colour"]
        if isinstance(overlay["pattern"], list):
            pattern = overlay["preset"][idx]
        else:
            pattern = overlay["preset"]
        new_overlay = {
            "description": overlay["description"],
            "size_x": overlay["size_x"],
            "size_y": overlay["size_y"],
            "pos_x": overlay["pos_x"][idx],
            "pos_y": overlay["pos_y"][idx],
            "pattern": pattern,
            "colour": colour}
        add_image(new_overlay, source_img, draw, presets)
