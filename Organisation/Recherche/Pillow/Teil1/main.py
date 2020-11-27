from wand.drawing import Drawing
from wand.image import Image

with Drawing() as draw:
    with Image(filename='bild.png') as image:
        draw.font_size = 80
        draw.text(int(image.width / 1.71), int(image.height / 1.174), "544")
        draw(image)
        image.save(filename='bild2.jpg')
