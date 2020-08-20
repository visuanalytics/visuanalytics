# FFMPEG
Wir können das Tool FFMPEG einsetzen, um Bilder zu einem Video mit Audio zusammenzufügen.

Vorgehensweise:
FFMPEG kann aus einer Textdatei entnehmen, welche Bilder mit welcher Dauer in das Video eingefügt werden sollen. Dazu schreibt man:
~~~
file 'Bilder/img001.jpg'
duration 3 // 3 = 3 sekunden
~~~

Nun kann mittels des Konsolenbefehls
~~~
ffmpeg -y -f concat -i input.txt -i Audio/sprachbeispiel.wav -s 1920x1080 output.mp4
~~~

die Input-Datei (mit Python erstellte Textdatei) ausgelesen werden und zusammen mit der angegebenen .wav-Audiodatei ein .mp4-Video erstellt werden.
