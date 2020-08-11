# VisuAnalytics [![Tests](https://github.com/SWTP-SS20-Kammer-2/Data-Analytics/workflows/Automated%20Testing/badge.svg)](https://github.com/SWTP-SS20-Kammer-2/Data-Analytics/actions?query=workflow%3A%22Automated+Testing%22)

## Einleitung

Im Rahmen der Veranstaltung [**Softwaretechnik-Praktikum**](https://www.thm.de/organizer/index.php?option=com_organizer&view=subject_item&id=13) im Sommersemester 2020 wurde dieses Projekt zum Thema **Data Analytics** durchgeführt. 

Die Veranstaltung gehört zum Curriculum der Bachelorstudiengänge Informatik und Ingenieur-Informatik an der [Technischen Hochschule Mittelhessen](https://www.thm.de).

Die Aufgabe war es, Informationen über verschiedene Schnittstellen zu erfassen, diese automatisiert zu verarbeiten und daraus ein Video zu generieren, welches die Informationen in Bild und Ton präsentiert. 

Aktuell gibt es vier mögliche Videos, welche automatisiert erstellt werden können:

- **Deutschlandweiter Wetterbericht**
- **Ortsbezogener Wetterbericht**
- **Bundesliga-Ergebnisse**
- **Twitter-Wordcloud**

Neue Schnittstellen sollen schnell zu ergänzen sein, sodass weitere Videos mit anderen Themen erstellt werden können. 

Zudem wurde ein Frontend entwickelt mit welchem es möglich ist Videos in Auftrag zu geben und dass diese zu festgelegten Zeitpunkten automatisch generiert werden. Dies ist auch durch ein Wordpress-Plugin möglich.

Die Software soll nach der Fertigstellung auf der Website [https://biebertal.mach-mit.tv/](https://biebertal.mach-mit.tv/) eingesetzt werden. Biertal.Mach-Mit.TV ist ein Kooperationsprojekt der Gemeinde Biebertal und dem Fachbereich MNI der [Technischen Hochschule Mittelhessen](https://www.thm.de).


## Programm starten

### Konfiguration

#### config.json

Die Konfigurationsdatei für das Programm hat folgendes Format:

```json
{
  "api_keys": {
    "weatherbit": "APIKey"
  },
  "steps_base_config": {
    "testing": false,
    "h264_nvenc": false
  },
  "testing": false,
  "audio": {}
}
```

`api_keys`:

Die API-Keys für die verwendeten APIs:

- `weatherbit`: API-Key für [weatherbit.io](https://www.weatherbit.io)

`steps_base_config`:

Die Konfiguration, die für jeden Job gelten soll (die Konfigurationen in [jobs.json](#jobs.json) sind höherwertig).

- `testing`:

  Wenn `testing` aktiviert ist, werden keine API-Abfragen gemacht.
  Zur Generierung des Videos werden in dem Fall Beispieldaten verwendet.

- `h264_nvenc`:

  Wenn `h264_nvenc` aktiviert ist, wird diese Option bei `FFmpeg` verwendet. Diese aktiviert die Hardware-Beschleunigung bei Nvidia-Grafikkarten.
  Damit dies funktioniert, müssen diverse Sachen beachtet werden (weitere Informationen unter [Mit Docker](#Mit-Docker) sowie [Ohne Docker](#Ohne-Docker)).

`testing`:

Wenn `testing` aktiviert ist, wird die _logging Ausgabe_ auf das "Info"-Level gesetzt, wodurch mehr Informationen in den Log eingetragen werden.

`audio`:

Hier kann die Konfiguration für die Audio-Generierung angegeben werden. Eine Erklärung hierfür befindet sich [hier](Docs/usage/audio-apis.md).

#### jobs.json

Diese Datei legt fest, zu welchen Zeitpunkten die verschiedenen Videos generiert werden sollen:

```JSON
{
  "jobs": [
    {
      "name": "Wetter in Biebertal",
      "id": 0,
      "steps": "weather_single",
      "schedule": {
        "time": "12:00",
        "daily": true
      },
      "config": {
        "city_name": "Biebertal",
        "p_code": "35444"
      }
    }
  ]
}
```

`name`: Name des Jobs

`id`: ID des Jobs (sollte einzigartig sein)

`steps`: Thema, für welches ein Video generiert werden soll

Aktuelle Optionen:

- `"weather_germany"`: Deutschlandweiter Wetterbericht
- `"weather_single"`: Ortsbezogener Wetterbericht
- `"football"`: Spieltag-Bericht für die Fußball-Bundesliga

`schedule`: Hier kann der Zeitplan für die Videogenerierung festgelegt werden.

Hierzu gibt es vier mögliche Einträge:

- `time`:

  Uhrzeit der Ausführung. Die Uhrzeit muss im Format `"%H:%M"` angegeben werden.

  Beispiel: `10:00`

  > Die Uhrzeit muss immer angegeben werden.

- `daily`:

  Wenn dieser Wert 'true' ist, wird der Job jeden Tag ausgeführt.

- `date`:

  Ist ein Datum angegeben, so wird der Job nur ein mal an diesem Datum ausgeführt. Das Datum muss in dem Format '%y-%m-%d' angegeben werden.

  Beispiel: '2020-06-09'

- `weekdays`:

  Enthält die Wochentage, an welchen der Job ausgeführt werden soll. Die Wochentage werden als Array von Zahlen angegeben, wobei `0 ~ Montag`, `1 ~ Dienstag` usw.

  Beispiel: `[0, 5, 6]` => Der Job wird Montags, Samstags und Sontags ausgeführt.

> Achtung: Die Optionen `daily`, `date` und `weekdays` schließen sich gegenseitig aus. Es muss also genau eine Option ausgewählt werden.

`config`: Hier können die Konfigurationen für die Jobs festgelegt werden.

Mögliche Konfigurationen für die verschiedenen Themen:

_Deutschlandweiter Wetterbericht (steps: `"weather_germany"`)_:

- alle Einstellungen, die auch in der [config.json](#config.json) unter `steps_base_config` zur Verfügung stehen

_Ortsbezogener Wetterbericht (steps: `"weather_single"`)_:

- alle Einstellungen, die auch in der [config.json](#config.json) unter `steps_base_config` zur Verfügung stehen
- `city_name`: Name des Ortes
- `p_code`: Postleitzahl des Ortes

> Da es vorkommen kann, dass durch `city_name` kein für die Wettervorhersage verfügbarer bzw. eindeutig identifizierbarer Ort
> spezifiziert wird, ist die zusätzliche Angabe einer Postleitzahl (`p_code`) ratsam.
> Der angegebene `city_name` wird dann innerhalb des Videos verwendet.

> Aktuell lassen sich nur Wettervorhersagen für Städte in Deutschland generieren.

_Spieltag-Bericht für die Fußball-Bundesliga (steps: `"football"`)_:

- alle Einstellungen, die auch in der [config.json](#config.json) unter `steps_base_config` zur Verfügung stehen
- `liga-name`: Spielklasse (1 ~ 1. Liga, 2 ~ 2. Liga, 3 ~ 3. Liga)

### Mit Docker

_Benötigte Software_:

- Docker

_Docker-Container erstellen:_

```shell
docker build -t visuanalytics src/visuanalytics
```

_Docker-Container starten:_

> Die Pfade hinter `source=` müssen durch Pfade zu den Dateien, die in [Konfiguration](#Konfiguration) beschrieben werden,
> bzw. durch den Pfad zum Output-Ordner ersetzt werden.

_Linux:_

```shell
docker run -t \
	--mount type=bind,source=/home/user/out,target=/out \
	--mount type=bind,source=/home/user/config.json,target=/config.json \
	--mount type=bind,source=/home/user/jobs.json,target=/jobs.json \
	visuanalytics
```

_Windows:_

```shell
docker run -t ^
	--mount type=bind,source=C:\Users\user\out,target=/out  ^
	--mount type=bind,source=C:\Users\user\config.json,target=/config.json ^
	--mount type=bind,source=C:\Users\user\jobs.json,target=/jobs.json ^
	visuanalytics
```

> Wenn die Hardware-Beschleunigung bei einer Nvidia-Grafikkarte verwendet werden soll, muss beim Starten die Option `--runtime="nvidia"` angeben werden.
> Dafür müssen vorher allerdings diverse Konfigurationen / Installationen vorgenommen werden.
> Eine Anleitung dafür befindet sich [hier](https://marmelab.com/blog/2018/03/21/using-nvidia-gpu-within-docker-container.html).
> Dies ist nicht die offizielle Dokumentation, für uns war diese allerdings hilfreicher.
> Die offizielle Dokumentation von Docker zu dem Thema befindet sich [hier](https://docs.docker.com/config/containers/resource_constraints/#access-an-nvidia-gpu).

### Ohne Docker

_Benötigte Software_:

- python >=3.6
- pip
- FFmpeg

_In den src-Ordner wechseln_: `cd src`

_Pakete installieren_:

- `pip install -r visuanalytics/requiraments.txt`

- Konfigurations-Dateien anlegen / anpassen (diese werden [hier](#Configuration) beschrieben):
  - die Datei `config.json` muss sich in dem Ordner `visuanalytics/insance` befinden.
  - die Datei `jobs.json` befindet sich im Ordner `visuanalytics/resources`. Diese kann angepasst werden.

_Programm starten_: `python -m visuanalytics`

> Unter Linux kann es sein, dass `pip3` und `python3` verwendet werden müssen.

> Um die Option `h264_nvenc` (siehe [config.json](#config.json)) zu verwenden, müssen diverse Einstellungen vorgenommen werden.
> Eine gute Anleitung befindet sich [hier](https://developer.nvidia.com/ffmpeg).

## Dokumentation Generieren

Für die Dokumentation wird das python-Paket [Sphinx](https://www.sphinx-doc.org) verwendet.

### Installation

1. dev-dependencies installieren: `pip install -r src/visuanalytics/requirements-dev.txt`

> Unter Linux kann es sein, dass `pip3` und `python3` verwendet werden müssen.

### HTML Generieren

1. in den Doku-Ordner wechseln: `cd Docs`
2. Dokumentation generieren:

- _Linux:_ `./build.sh`
- _Windows:_ `build.bat`

Die Dokumentation befindet sich dann im Ordner `_build/html`.
