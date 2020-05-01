# Zusammenfassung Recherche ImageMagick und Pillow

- Mit ImageMagick kann man viel machen jedoch gibt es für Python einen Library (Pillow) die 
dasselbe kann wie Imagemackig aber einfachere zu handhaben ist. (Meine persönliche Meinung), 
deshalb haben wir (ich) mich für PIL (Pillow) entschieden

- Mit PIL kann man Bildgrößen kann simpel ändern:  
`size = [70, 70]
second_img = second_img.resize(size)`

- Ebenso Text in ein Bild einfügen (mit virabler Schriftart):  
`draw.text((int(width / 1.71), int(height / 2.074)), "78446",
          font=ImageFont.truetype("Pilsen_Plakat.ttf", 60))`
          
 - Bild in Bild einfügen:   
 `source_img.paste(second_img, (800, 500), second_img)`
 
 - Einzelne Pixelfarben ändern:   
 `px[4,50] = (0,0,0)`
 
 - Kontrast ändern, Farbintensivität ändern etc, sowei Bilder in jedem beliebigen Format speichern:   
 `im1 = im.filter(ImageFilter.EDGE_ENHANCE_MORE)
    Image.composite(img1, im1, img1).save("main3.png")
    enhancer = ImageEnhance.Contrast(im)
    enhancer.enhance(5).save("main5.png")`
    
 - Bildauschnitte erzeugen:   
 `border = (800, 500, 900, 800)  # left, up, right, bottom
    cropped_img = im.crop(border)`



