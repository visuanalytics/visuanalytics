from PIL import ImageFont

from visuanalytics.analytics.util import resources


def draw_text(draw, position, content, fontsize=70, fontcolour="white", path="weather/Dosis-Bold.ttf"):
    ttype = ImageFont.truetype(resources.get_resource_path(path), fontsize)
    w, h = ttype.getsize(content)
    draw.text(((position[0] - (w / 2)), position[1]), content,
              font=ImageFont.truetype(resources.get_resource_path(path), fontsize),
              fill=fontcolour)


def draw_text_fix(draw, position, content, fontsize=70, fontcolour="white", path="weather/Dosis-Bold.ttf"):
    draw.text(position, content,
              font=ImageFont.truetype(resources.get_resource_path(path), fontsize),
              fill=fontcolour)
