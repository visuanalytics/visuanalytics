"""Klasse dient dazu um aus gegebenen Daten von der Weather API Bilder oder Videos zu generieren.
"""
import os

from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont

LOCATIONS_DREITAGE = [("Gießen", (160, 534), (785, 534), (1410, 534)), ("Hamburg", (255, 300), (875, 300), (1492, 300)),
                      ("Dresden", (360, 447), (980, 447), (1604, 447)),
                      ("München", (272, 670), (890, 670), (1510, 670))]
"""Liste aus String, Tupel(int, int)x3: X und Y Koordinaten der Positionen der Icons in der 3 Tages Vorhersage sortiert nach den verschiedenen Orten/Regionen.
"""
LOCATIONS_MORGEN = [("Garmisch-Partenkirchen", (898, 900)), ("München", (1080, 822)),
                    ("Nürnberg", (930, 720)), ("Mainz", (675, 610)),
                    ("Gießen", (843, 540)), ("Dresden", (1106, 482)),
                    ("Hannover", (1006, 370)), ("Bremen", (755, 333)),
                    ("Kiel", (986, 218)), ("Berlin", (1147, 270)), ]
"""Liste aus String, Tupel(int, int): X und Y Koordinaten der Positionen der Icons in der Vorhersage für morgen sortiert nach den verschiedenen Orten/Regionen.
"""
LOCATIONS_TEMP_MIN_DREITAGE = [(160, 950), (790, 950), (1400, 950)]
"""Liste aus Tupeln: X und Y Koordinaten der Min Temperaturen in der 3 Tages Vorhersage.
"""
LOCATIONS_TEMP_MAX_DREITAGE = [(450, 950), (1070, 950), (1700, 950)]
"""Liste aus Tupeln: X und Y Koordinaten der Max Temperaturen in der 3 Tages Vorhersage.
"""


def generate_eins_drei_video(bild_heute_art, bild_heute_temp, bild_dreitage, audio_heute_art,
                             audio_heute_temp, audio_dreitage, audiol_heute_art, audiol_heute_temp,
                             audio3_dreitage):
    """Methode wird genutzt um das gesamte Video (1+3) zu erstellen
            Args:
                bild_heute_art (String): Dateinamen des Bildes für die Vorhersage für morgen (Icons)
                bild_heute_temp (String): Dateinamen des Bildes für die Vorhersage für morgen (Temperatur)
                bild_dreitage (String): Dateinamen des Bildes für die Vorhersage für die nächsten 3 Tage
                audio_heute_art (String): Dateinamen des Audios für die Vorhersage für morgen (Icons)
                audio_heute_temp (String): Dateinamen des Audios für die Vorhersage für morgen (Temperatur)
                audio_dreitage (String): Dateinamen des Audios für die Vorhersage für die nächsten 3 Tage
                audiol_heute_art (Int): Audiolänge des Audios für die Vorhersage für morgen (Icons)
                audiol_heute_temp (Int): Audiolänge des Audios für die Vorhersage für morgen (Temperatur)
                audio3_dreitage (Int): Audiolänge des Audios für die Vorhersage für die nächsten 3 Tage
           Returns:
              String : Den Dateinamen des erstellten Bildes
       """

    file = open("input.txt", "w")
    file.write("file '" + audio_heute_art + "'\n")
    file.write("file '" + audio_heute_temp + "'\n")
    file.write("file '" + audio_dreitage + "'\n")
    file.close()

    shell_cmd = "ffmpeg -f concat -i input.txt -c copy output.wav"
    os.chdir("/home/jannik/Data-Analytics/src/visuanalytics/app")
    os.system(shell_cmd)

    file = open("input.txt", "w")
    file.write("file '" + bild_heute_art + "'\n")
    file.write("duration " + audiol_heute_art + "\n")
    file.write("file '" + bild_heute_temp + "'\n")
    file.write("duration " + audiol_heute_temp + "\n")
    file.write("file '" + bild_dreitage + "'\n")
    file.write("duration " + audio3_dreitage + "\n")
    file.close()

    shell_cmd = "ffmpeg -y -f concat -i input.txt -i output.wav -s 1920x1080 output.mp4"
    os.chdir("/home/jannik/Data-Analytics/src/visuanalytics/app")
    os.system(shell_cmd)

    return "output.mp4"


def temp_method_toget_image(location, date_in_future):
    """Lediglich zu Testzwecken hier solange die Api schnittstelle noch nicht funktioniert.
      """
    if date_in_future == 1:
        return "c04"
    if date_in_future == 2:
        return "s02"
    if date_in_future == 3:
        return "d02"
    return "d03"


def temp_max(date_in_future):
    """Lediglich zu Testzwecken hier solange die Api schnittstelle noch nicht funktioniert.
    """
    return "15°"


def temp_min(date_in_future):
    """Lediglich zu Testzwecken hier solange die Api schnittstelle noch nicht funktioniert
      """
    return "10°"


def get_temp(location, date_in_future):
    """Lediglich zu Testzwecken hier solange die Api schnittstelle noch nicht funktioniert
      """
    return "10°"


def generate_drei_tages_vorhersage():
    """Methode wird genutzt um das Bild für die 3 Tages Vorherschau zu generieren.

        Returns:
           String : Den Dateinamen des erstellten Bildes
    """
    source_img = Image.open("../../resources/weather/3-Tage-Vorhersage.png")
    img1 = Image.new("RGBA", source_img.size, (0, 0, 0, 0))
    for item in LOCATIONS_DREITAGE:
        for i in range(2, 5):
            icon = Image.open("../../resources/weather/icons/" + temp_method_toget_image(item[1], i) + "d.png").convert(
                "RGBA")
            icon = icon.resize([160, 160], Image.LANCZOS)
            source_img.paste(icon, item[i], icon)

    draw = ImageDraw.Draw(source_img)

    for item in LOCATIONS_TEMP_MAX_DREITAGE:
        i = 1
        draw.text(item, temp_max(++i),
                  font=ImageFont.truetype("./../resources/weather/FreeSansBold.ttf", 60))

    for item in LOCATIONS_TEMP_MIN_DREITAGE:
        i = 1
        draw.text(item, temp_min(++i),
                  font=ImageFont.truetype("./../resources/weather/FreeSansBold.ttf", 60))

    Image.composite(img1, source_img, img1).save("../../../../bin/weather/main.png")
    return "main.png"


def generate_vorhersage_morgen_icons():
    """Methode wird genutzt um das Bild für die Vorhersage für morgen zu generieren(Iconbild).

            Returns:
               String : Den Dateinamen des erstellten Bildes
        """
    source_img = Image.open("../../resources/weather/Wetter-morgen.png")
    img1 = Image.new("RGBA", source_img.size, (0, 0, 0, 0))
    for item in LOCATIONS_MORGEN:
        icon = Image.open("../../resources/weather/icons/" + temp_method_toget_image(item[0], 1) + "d.png").convert(
            "RGBA")
        icon = icon.resize([150, 150], Image.LANCZOS)
        source_img.paste(icon, (item[1][0] - 40, item[1][1] - 35), icon)
    Image.composite(img1, source_img, img1).save("../../../../bin/weather/main2.png")
    return "main2.png"


def generate_vorhersage_morgen_temperatur():
    """methode wird genutzt um das Bild für die Vorhersage für morgen zu generieren(Temperaturbild).

            Returns:
               String : Den Dateinamen des erstellten Bildes
        """

    source_img = Image.open("../../resources/weather/Wetter-morgen.png")
    img1 = Image.new("RGBA", source_img.size)
    draw = ImageDraw.Draw(source_img)
    for item in LOCATIONS_MORGEN:
        kachel = Image.open("../../resources/weather/kachel.png")
        source_img.paste(kachel, item[1], kachel)

        # todo(Jannik) fix alpha problem

        draw.text((item[1][0] + 10, item[1][1]), get_temp(item[0], 1),
                  font=ImageFont.truetype("../../resources/weather/FreeSansBold.ttf", 53))

    Image.composite(img1, source_img, img1).save("../../../../bin/weather/main3.png")
    return "main3.png"
