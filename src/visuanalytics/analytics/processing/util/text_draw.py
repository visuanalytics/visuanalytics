from PIL import ImageFont

from visuanalytics.analytics.util import resources


def draw_text(draw, position, content, font_size=70, font_colour="white", font_path="weather/Dosis-Bold.ttf"):
    ttype = ImageFont.truetype(resources.get_resource_path(font_path), font_size)
    w, h = ttype.getsize(content)
    draw.text(((position[0] - (w / 2)), position[1]), content,
              font=ImageFont.truetype(resources.get_resource_path(font_path), font_size),
              fill=font_colour)


def draw_text_fix(draw, position, content, font_size=70, font_colour="white", font_path="weather/Dosis-Bold.ttf"):
    draw.text(position, content,
              font=ImageFont.truetype(resources.get_resource_path(font_path), font_size),
              fill=font_colour)
