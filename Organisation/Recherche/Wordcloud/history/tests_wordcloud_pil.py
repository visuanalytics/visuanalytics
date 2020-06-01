import numpy as np
import PIL
from PIL import Image
# Quelle: https://stackoverflow.com/questions/30227466/combine-several-images-horizontally-with-python
# Kombinieren von 4 Zahlen
year = str(19)
list_im = ['mask_0.jpg', 'mask_1.jpg', 'mask_2.jpg', 'mask_3.jpg', 'mask_4.jpg', 'mask_5.jpg', 'mask_6.jpg',
           'mask_7.jpg', 'mask_8.jpg', 'mask_9.jpg']
list_use = []
len_year = len(year)
print(len_year)
for i in range(len_year):
    if int(year[i]) == 0:
        print("0")
        list_use.append(list_im[0])
    elif int(year[i]) == 1:
        print("1")
        list_use.append(list_im[1])
    elif int(year[i]) == 2:
        print("2")
        list_use.append(list_im[2])
    elif int(year[i]) == 3:
        print("3")
        list_use.append(list_im[3])
    elif int(year[i]) == 4:
        print("4")
        list_use.append(list_im[4])
    elif int(year[i]) == 5:
        print("5")
        list_use.append(list_im[5])
    elif int(year[i]) == 6:
        print("6")
        list_use.append(list_im[6])
    elif int(year[i]) == 7:
        print("7")
        list_use.append(list_im[7])
    elif int(year[i]) == 8:
        print("8")
        list_use.append(list_im[8])
    elif int(year[i]) == 9:
        print("9")
        list_use.append(list_im[9])


imgs = [PIL.Image.open(i) for i in list_use]
# pick the image which is the smallest, and resize the others to match it (can be arbitrary image shape here)
imgs_comb = np.hstack(imgs)

# sabspeichern des Bildes
imgs_comb = PIL.Image.fromarray(imgs_comb)
imgs_comb.save('year_mask.jpg')
