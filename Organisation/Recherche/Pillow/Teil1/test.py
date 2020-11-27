from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
from PIL import ImageFilter
from PIL import ImageEnhance


source_img = Image.open("../Images/germanmap1920.png")
second_img = Image.open("../Images/heiter2.png")


img1 = Image.new("RGBA", source_img.size, (0, 0, 0, 0))

width, height = source_img.size
size = [70, 70]
second_img = second_img.resize(size)
source_img.paste(second_img, (800, 500), second_img)
draw = ImageDraw.Draw(source_img)
draw.text((int(width / 1.71), int(height / 2.074)), "78446",
          font=ImageFont.truetype("Pilsen_Plakat.ttf", 60))
Image.composite(img1, source_img, img1).save("main2.png")

with Image.open('main2.png') as im:
    px = im.load()
    print(px[4, 50])
    px[4,50] = (0,0,0)
    print(px[4, 50])

    im1 = im.filter(ImageFilter.EDGE_ENHANCE_MORE)
    Image.composite(img1, im1, img1).save("main3.png")
    enhancer = ImageEnhance.Contrast(im)
    enhancer.enhance(5).save("main5.png")

    border = (800, 500, 900, 800)  # left, up, right, bottom
    cropped_img = im.crop(border)
    Image.composite(img1, cropped_img, img1).save("main6.png")
