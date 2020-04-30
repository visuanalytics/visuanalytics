## Text-to-Speech TTS

Quelle: https://wiki.ubuntuusers.de/Sprachausgabe/  

Um geschriebenen Text in gesprochene Sprache umzuwandeln, haben wir verschiedene Programme getestet. 
Bei pico2wave war die Aussprache und Verständlichkeit am besten. Man kann damit Text bzw. .txt-Dateien in .wav Sprachdateien umwandeln.  
Zusätzlich haben wir uns Book-To-MP3 und pdf2mp3 angeschaut, um uns die Möglichkeit offen zu halten auch .pdf-Dateien umformen zu können.
Allerdings war hierbei die gesprochene Sprache nicht verständlich. 
 
Um pico2wave das benutzen zu können, muss man zuerst die Pakete libttspico-utils und sox installieren.  
Das geht mit dem Kommandozeilenbefehl:

```
sudo apt-get install libttspico-utils sox
```

<br>

**Umwandlung:** 

* direkte Eingabe von Text
    
    ```
    pico2wave --lang de-DE --wave /home/lisa/Dokumente/Studium/SWTP/test.wav "Das Wetter ist gut"
    ```
    <br>
    Erzeugt .wav Sprachdatei im Ordner SWTP mit dem Inhalt "Das Wetter ist gut".
    <br><br>
* .txt-Datei einlesen mithilfe eines Bashskripts

    * in den Ordner /usr/local/bin wechseln, dort Skript mithilfe von nano erstellen:
     
        ```
        sudo nano talk.sh
        ```
      
    * in nano eingeben:
        ```
        #!/bin/bash
        pico2wave --lang de-DE -- wave /home/lisa/Dokumente/Studium/SWTP/test.wav "$(cat ${1})"
        ``` 
      
    * Umwandlung durchführen:
    
        ```
        talk.sh textbeispiel.txt
        ```
    <br>
    Erzeugt .wav Sprachdatei im Ordner SWTP mit dem Inhalt der Textdatei textbeispiel.txt.
    <br><br>

**Einstellung:**  
    Weitere mögliche Sprachkürzel sind:
    en-US, en-GB, es-ES, fr-FR, it-IT

Zusammenfassung in Powerpoint-Präsentation der verschiedenen Sprachausgaben und Wandelprogramme von Text zu Sprache von: https://wiki.ubuntuusers.de/Sprachausgabe/
