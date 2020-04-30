import os

file = open("input.txt","w")
file.write("file 'Bilder/img001.jpg'\n")
file.write("duration 10\n")
file.write("file 'Bilder/img002.jpg'\n")
file.write("duration 3\n")
file.write("file 'Bilder/img003.jpg'\n")
file.write("duration 3\n")
file.close()

shell_cmd = "ffmpeg -y -f concat -i input.txt -i Audio/sprachbeispiel.wav -s 1920x1080 output.mp4"
os.chdir("/home/timon/Schreibtisch/THM/4.Semester/SWT-Praktikum/FFMPEG-TEST/")
os.system(shell_cmd)
