# Installation

## Programm starten

### Konfiguration

#### Config.json

Die Konfigurationsdatei für das Programm hat folgendes Format:

~~~json
{
  "api_keys": {
    "weatherbit": "APIKey"
  },
  "steps_base_config": {
    "testing": false,
    "h264_nvenc": false
  },
  "testing": false
}
~~~

`api_keys`:

Die Api-Keys für die verwendeten Apis:
- `weatherbit`: Api Key für [weatherbit.io](https://www.weatherbit.io)

`steps_base_config`:

Die Konfiguration, die für jeden Job gelten soll (Die Konfigurationen in [jobs.json](#jobs.json) sind höherwertig)

- `testing`:
  
  Wenn `testing` aktiviert ist, werden keine API-Abfragen gemacht. 
  Zur Generierung des Videos werden Beispieldaten verwendet.

- `h264_nvenc`:

  Wenn `h264_nvenc` aktiviert ist, wird diese Option bei `FFmpeg` verwendet. Diese aktiviert die Hardwarebeschleunigung bei Nvidia Grafikarten. 
  Damit diese Option funktioniert, muss man ein paar Sachen beachten (Weitere Infos bei [Mit Docker](#Mit-Docker) und [Ohne Docker](#Ohne-Docker)).

`testing`:

Wenn `testing` aktiviert ist, wird die *logging Ausgabe* auf Info Level aktiviert.


#### Jobs.json

Diese Datei legt fest, zu welchem Zeitpunkt die verschiedenen Videos generiert werden sollen:

~~~JSON
{
  "jobs": [
    {
      "name": "Wetter in Biebertal",
      "id": 0,
      "steps_id": 1,
      "time": "19:41",
      "daily": true,
      "config": {
		    "city_name": "Biebertal", 
		    "p_code": "35444"
	    }
    }
  ]
}
~~~

`name`: Name des Jobs

`id`: Id des Jobs (sollte einzigartig sein)

`steps_id`:

Id des Videos, welches generiert werden soll. 
Aktuelle Optionen:
- 0: Deutschlandweiter Wetterbericht
- 1: Wetterbericht für einen Ort

*Einstellen der Zeit*:

Um den Zeitpunkt der Generierung festzulegen, gibt es vier mögliche Einträge:

- `time`:

  Uhrzeit der Ausführung. Die Uhrzeit muss im Format `"%H:%M"` angegeben werden. z.B.: `10:00`.

  > muss immer angegeben werden.

- `daily`:

  Wenn dieser Wert 'true' ist, wird der Job jeden Tag ausgeführt.

- `date`: 

  Datum an welchem der Job generiert werden soll. Ist ein Datum angegeben, so wird der Job nur einmal ausgeführt. Das Datum muss in dem Format '%y-%m-%d' angegeben werden. z.B.: '2020-06-09'

- `weekdays`:

  Angabe der Wochentage, an welchen der Job ausgeführt werden soll. Die Wochentage werden als Array von Zahlen angegeben wobei `0=Montag`, `1=Dienstag` usw. angegeben wird. z.B.: `[0, 5, 6]` (Wird Montags, Samstags und Sontags ausgeführt).

> Achtung die angabe von `daily`, `date` und `weekdays` schließen sich gegenseitig aus. Es muss also eins der Drei angegeben werden, es darf aber nicht mehr als eins angegeben werden.

`config`:

Hier kann man die Konfigurationen für die Jobs angeben.
Mögliche Konfigurationen:

*Wetterbericht Deutschland (id: 0)*:

  - Alle Einstellungen welche man auch in der [config.json](#config.json) unter `steps_base_config` einstellen kann

*Wetterbericht für einen Ort (id: 1)*:

  - Alle Einstellungen welche man auch in der [config.json](#config.json) unter `steps_base_config` einstellen kann
  - `city_name`: Name des Ortes
  - `p_code`: Postleitzahl des ortes

  > Ist nur `city_name` angegeben wird versucht diese Stadt zu finden es kann aber sein das die name nicht gefunden wird, daher ist die zusätzliche angabge einer Postleitzahl mit `p_code` Ratsam. Der angegebene `city_name` wird dann inerhalb des Videos als Stadt namen Angezeigt.

  > Aktuell sind nur Städte in Deutschland möglich diese wird man aber später noch einstellen können.

### Mit Docker

*Benötigte Software*: 
  - Docker

*Docker Container erstellen:*

~~~shell
docker build -t visuanalytics src/visuanalytics
~~~

*Docker Container Starten:*

> Die Pfade hinter `source=` müssen durch Pfade zu den Dateien (die in [Konfiguration](#Konfiguration) beschrieben werden) bzw. zu Output Ordner ersetzt werden.

*Linux:*

~~~shell
docker run -t \
	--mount type=bind,source=/home/user/out,target=/out \
	--mount type=bind,source=/home/user/config.json,target=/config.json \
	--mount type=bind,source=/home/user/jobs.json,target=/jobs.json \
	visuanalytics
~~~

*Windows:*

~~~shell
docker run -t ^
	--mount type=bind,source=C:\Users\user\out,target=/out  ^
	--mount type=bind,source=C:\Users\user\config.json,target=/config.json ^
	--mount type=bind,source=C:\Users\user\jobs.json,target=/jobs.json ^
	visuanalytics
~~~

> Wenn man die Hardwarebeschleunigung eine Nvidia Grafikarte verwenden will, kann man beim Starten noch die Option `--runtime="nvidia"` angeben. Dafür muss man vorher allerdings ein Paar Konfigurationen/Installationen vornehmen. Eine Anleitung dafür defindet sich [hier](https://marmelab.com/blog/2018/03/21/using-nvidia-gpu-within-docker-container.html) (Dies ist nicht die offizielle Doku wir fanden diese aber hilfreicher. Die Doku von Docker zu dem Thema befindet sich [hier](https://docs.docker.com/config/containers/resource_constraints/#access-an-nvidia-gpu))

### Ohne Docker

*Benötigte Software*:
  
  - Python >=3.6
  - Pip
  - FFmpeg

*In den Src Ordner Wechseln*: `cd src`

*Packete Installieren*:
  - `pip install -r visuanalytics/requiraments.txt`

- Config Dateien Anlegen/Verändern (diese werden [hier](#Configuration) beschrieben werden):
  - Die Datei `config.json` muss sich in dem Ordner `visuanalytics/insance` befinden.
  - Die Datei `jobs.json` befindet sich im Ordner `visuanalytics/resources` diese kann angepasst werden.  

*Programm Starten*: `python -m visuanalytics`

> unter Linux kann es sein das man `pip3` und `python3` verwenden muss damit die richtige Python version verwendet wird.

> um die Option `h264_nvenc` (Erklärung siehe [config.json](#config.json)) zu verwendet müssen ein paar einstellungen vorgenommen werden eine gute Anleitung defindet sich [hier](https://developer.nvidia.com/ffmpeg)

## Doku Generieren

Für die Dokumentation wird das Python Package [Sphinx](https://www.sphinx-doc.org) verwendet.

### Installation


1. Dev Dependencies installieren: `pip install -r src/visuanalytics/requirements-dev.txt`

> unter Linux kann es sein das man `pip3` verwenden muss damit die richtige Python version verwendet wird.


### HTML Generieren

1. in den Doku ordner wechseln: `cd Docs`
2. Doku Generieren:
  - *Linux:* `./build.sh`
  - *Windows:* `build.bat`

Die Dokumentation befindet sich dann in `_build/html`.
