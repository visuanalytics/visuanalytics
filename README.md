# VisuAnalytics [![Tests](https://github.com/SWTP-SS20-Kammer-2/Data-Analytics/workflows/Automated%20Testing/badge.svg)](https://github.com/SWTP-SS20-Kammer-2/Data-Analytics/actions?query=workflow%3A%22Automated+Testing%22) [![Documentation Status](https://readthedocs.org/projects/visuanalytics/badge/?version=latest)](https://visuanalytics.readthedocs.io/de/latest/?badge=latest)

## **Release: VisuAnalytics 2.0**
Im Rahmen der Veranstaltung [**Softwaretechnik-Praktikum**](https://www.thm.de/organizer/index.php?option=com_organizer&view=subject_item&id=13) im Sommersemester 2021 wurde aufbauend auf der Software VisuAnalytics dieses Projekt zum Thema **Data Analytics** durchgeführt.

Die Veranstaltung gehört zum Curriculum der Bachelorstudiengänge der Informatik an der [Technischen Hochschule Mittelhessen](https://www.thm.de).

Ziel war dabei, die bestehende Infrastruktur des VisuAnalytics-Projekts zu nutzen und diese um ein Frontend zu erweitern, über welches die notwendigen JSON-Dateien für Datenabfragen und Videos einfach generiert werden können. Gleichzeitig wurde die Backend-Infrastruktur um neue Features erweitert, mit denen weitergehende Datenverarbeitungen möglich sind. Dabei werden statt den bisherigen vier Job-Arten nun beliebige APIs unterstützt.

Grundkonzept der Anwendung ist nun die Erstellung sogenannter Infoprovider, in welchen mehrere API-Datenquellen zusammengefasst werden können. Diese Infoprovider können dann bei der Erstellung von Szenen (Standbilder mit dynamischen Daten) über einen grafischen Editor genutzt werden, um API-Daten in die Szene einfügen zu lassen. Szenen werden dann in Form von Videojobs aneinandergereiht und um Text-To-Speech (ebenfalls mit Infoprovider-Daten) erweitert. Auf Basis der Backend-Infrastruktur von `VisuAnalytics` wird dann zu vom Nutzer festgelegten Zeitpunkten eine Generierung der konfigurierten Videos mit den aktuellsten Datenwerten der APIs vorgenommen.

### Features
Folgende Liste stellt eine grobe Übersicht über die neuen Features von `VisuAnalytics 2.0` dar:
* **Neues Frontend:** Das neue Frontend erlaubt das Erstellen der notwendigen JSON-Konfigurationen über eine einfache, interaktive Oberfläche.
* **Beliebige APIs**: `VisuAnalytics 2.0` unterstützt nun nicht nur vier Job-Arten, sondern beliebige APIs. Nach Eingabe einer API findet eine grafische Aufbereitung ihrer Daten im Frontend statt.
* **Neue Datenverarbeitungen:** Es stehen neue Datenverarbeitung zur Verfügung: Summen, Mittelwerte, Minima und Maxima von numerischen Arrays, Ersetzung von Zeichenketten in Strings sowie das Erstellen komplexer Formeln auf Basis von API-Daten.
* **Historisierung von Daten:** Die Backend-Infrastruktur erlaubt es, APIs unabhängig von Videojobs zu beliebigen Zeitpunkten anzufragen, um Daten von diesem abzufragen und in einer Datenbank zu speichern. Diese historisierten Daten können wie auch die aktuellsten Datenwerte zum Beispiel in Videos verwendet werden!
* **Erstellung von Diagrammen:** Auf Grundlage numerischer Arrays sowie historisierter Daten können Säulen-, Balken-, Torten-, Punkt/Streu- sowie Liniendiagramme erstellt werden, die dann zur Visualisierung von Daten in Videos eingebunden werden können.
* **Grafischer Szenen-Editor:** Die einzelnen Szenen, aus denen Videos zusammengesetzt werden können, in einem einfachen Drag-And-Drop Szenen-Editor erstellt werden. Dieser erlaubt das Einfügen von Formen, Texten, API-Datenwerten und Diagrammen und eine grundlegende Formatierung dieser. Weiterhin können eigene Bilder hochgeladen und als Bilder auf der Szene oder Hintergrundbild eingebunden werden.
* **Videojob-Editor:** Mehrere Szenen können in diesem Editor aneinandergereiht werden und um die Definition von Texten für die Text-To-Speech-Ausgabe erweitert werden (auch diese erlauben das Einbinden von API-Daten).

### Abwärtskompatibilität
Bei der Entwicklung von `VisuAnalytics 2.0` wurde großer Wert darauf gelegt, die Abwärtskompatibilität zum ursprünglichen VisuAnalytics-Projekt zu gewährleisten.

Eine Rückkehr zum alten Frontend ist derzeit nur durch Code-Anpassungen möglich:

**/src/frontend/src/ComponentProvider/index.tsx**:

**1)**
```
const startComponent: ComponentKey = "dashboard";
```
ändern zu
```
const startComponent: ComponentKey = "home";
```
**2)**
```
setCurrent(mainComponents[sessionStorage.getItem("currentComponent-" + uniqueId)||"dashboard"]);
```
ändern zu
```
setCurrent(mainComponents[sessionStorage.getItem("currentComponent-" + uniqueId)||"home"]);
```
**3)**
```
sessionStorage.setItem("currentComponent-" + uniqueId, keyName);
```
ändern zu
```
//sessionStorage.setItem("currentComponent-" + uniqueId, keyName);
```


**/src/frontend/src/App/index.tsx**:

**1)** Einkommentieren der Variable **theme** und
```
<MuiThemeProvider theme={newDarkBlueTheme}>
```
ändern zu
```
<MuiThemeProvider theme={theme}>
```
**2)**
```
const legacyFrontend = React.useRef<boolean>(false);
```
ändern zu
```
const legacyFrontend = React.useRef<boolean>(true);
```

**Hinweis**:
> Die Umstellung auf das alte Frontend wurde nicht umfangreich getestet. Es wird daher empfohlen, statt diesem Vorgehen das [ursprüngliche VisuAnalytics-Projekt](https://github.com/SWTP-SS20-Kammer-2/Data-Analytics) zu verwenden.

<br></br>

## Einleitung

Im Rahmen der Veranstaltung [**Softwaretechnik-Praktikum**](https://www.thm.de/organizer/index.php?option=com_organizer&view=subject_item&id=13) im Sommersemester 2020 wurde dieses Projekt zum Thema **Data Analytics** durchgeführt.

Die Veranstaltung gehört zum Curriculum der Bachelorstudiengänge der Informatik an der [Technischen Hochschule Mittelhessen](https://www.thm.de).

Die Aufgabe war es, Informationen über verschiedene Schnittstellen zu erfassen, diese automatisiert zu verarbeiten und daraus ein Video zu generieren, welches die Informationen in Bild und Ton präsentiert.

Aktuell gibt es vier mögliche Videos, welche automatisiert erstellt werden können:

- **Deutschlandweiter Wetterbericht**
- **Ortsbezogener Wetterbericht**
- **Bundesliga-Ergebnisse**
- **Twitter-Wordcloud**

Neue Schnittstellen sollen schnell zu ergänzen sein, sodass weitere Videos mit anderen Themen erstellt werden können.

Zudem wurde ein Frontend entwickelt mit welchem es möglich ist Videos in Auftrag zu geben und diese zu festgelegten Zeitpunkten automatisch zu generieren. Dies ist auch durch ein Wordpress-Plugin möglich.

Die Software soll nach der Fertigstellung auf der Website [https://biebertal.mach-mit.tv/](https://biebertal.mach-mit.tv/) eingesetzt werden. Biertal.Mach-Mit.TV ist ein Kooperationsprojekt der Gemeinde Biebertal und dem Fachbereich MNI der [Technischen Hochschule Mittelhessen](https://www.thm.de).

## Programm Verwenden

### Mit Docker

_Benötigte Software_:

- [Docker](https://www.docker.com/products/docker-desktop)

Unter Windows muss ggf. noch ein Windows Subsystem for Linux installiert werden.
Weitere Informationen [hier](https://docs.docker.com/docker-for-windows/wsl/)

_Docker-Container starten:_

Die Pfade hinter `-v` müssen durch Pfade zu den Dateien, welche in [Konfiguration](#Konfiguration) beschrieben werden

- bzw. durch den Pfad zum Output-Ordner - ersetzt werden.

_Linux:_

```shell
docker run -t \
  -v /home/user/out:/out \
  -v /home/user/config.json:/config.json \
  -p 8000:8000 \
  visuanalytics/visuanalytics
```

_Windows:_

```shell
docker run -t ^
  -v C:\Users\user\out:/out  ^
  -v C:\Users\user\config.json:/config.json ^
  -p 8000:8000 ^
  visuanalytics/visuanalytics
```

Falls man nur das Wordpress-Plugin verwenden will (siehe [hier](#wordpress-plugin-verwenden)) kann man auch
eine Docker-Container starten, der das Frontend nicht enthält. Hierfür muss man nur anstelle von  
`visuanalytics/visuanalytics`  
im obigen Befehl  
`visuanalytics/visuanalytics:latest-wordpress`
eingeben.

Der Server kann nun unter `http://localhost:8000` erreicht werden.

> Wenn man die Option `h264_nvenc` (siehe [config.json](#config.json) verwenden will, kann man beim Starten noch die Option `--runtime="nvidia"` (oder `--gpus all`) angeben. Dafür muss man vorher ein paar Konfigurationen und Installationen vornehmen. Eine Anleitung dafür finden Sie [hier](https://marmelab.com/blog/2018/03/21/using-nvidia-gpu-within-docker-container.html) (Dies ist nicht die offizielle Dokumentation, wir fanden diese aber hilfreicher. Die Dokumentation von Docker zu dem Thema befindet sich [hier](https://docs.docker.com/config/containers/resource_constraints/#access-an-nvidia-gpu>))

### Ohne Docker (Development)

_Benötigte Software_:

- [python](https://www.python.org/downloads/) >=3.6
- [pip](https://packaging.python.org/tutorials/installing-packages/#ensure-you-can-run-pip-from-the-command-line)
- [FFmpeg](https://ffmpeg.org/download.html)
- [npm](https://www.npmjs.com/get-npm)

>  Weiterhin kann es nötig sein, dass `Visual C++ 14.0` (oder höher) sowie das `Windows 10 SDK` benötigt werden, wenn die Ausführung unter Windows stattfindet. ([Buildtools für Visual Studio 2019](https://visualstudio.microsoft.com/de/downloads/#build-tools-for-visual-studio-2019))

_In den `src`-Ordner wechseln_: `cd src`

_Pakete installieren_:

- `pip install -r visuanalytics/requirements.txt`

- Konfigurations-Dateien anlegen bzw. anpassen (diese werden unter [Konfiguration](#Configuration) beschrieben):
  - Die Datei `config.json` muss sich im Ordner `visuanalytics/instance` befinden.

_In den `frontend`-Ordner wechseln_:

- `cd ./frontend`

_Frontend Dependencies installieren_:

- `npm i`
- `npm install react-scripts@3.4.1 -g`

_Programm starten_:

- Backend & Frontend starten: `npm run start:all`
- Nur Frontend starten: `npm run start`
- Nur Backend starten: `npm run start:server`
- Backend ohne npm starten: `python -m visuanalytics` (Dafür muss man sich im src-Ordner befinden)

> Um die Option `h264_nvenc` (siehe [config.json](#config.json)) zu verwenden, müssen diverse Einstellungen vorgenommen werden.
> Eine gute Anleitung finden Sie [hier](https://developer.nvidia.com/ffmpeg).

## Wordpress-Plugin verwenden

Nicht nur der Backend-Server kann das Frontend ausliefern. Das Frontend kann auch als Wordpress-Plugin verwendet werden.

Um das Wordpress-Plugin zu erstellen sind folgende Schritte nötig:

_Benötigte Software_:

- [python](https://www.python.org/downloads/) >=3.6
- [npm](https://www.npmjs.com/get-npm)

_In den `frontend`-Ordner wechseln_:

- `cd src/frontend`

_Frontend Dependencies installieren_:

- `npm i`
- `npm install react-scripts@3.4.1 -g`

_In den `wordpress`-Ordner wechseln_:

- `cd ../wordpress` (wenn man im `frontend`-Ordner ist, ansonsten `cd src/wordpress`)

_Wordpress-Plugin erstellen_:

- `python build.py`

Im `build`-Ordner befindet sich eine .zip-Datei, die sich einfach über die Wordpress-Oberfläche installieren lässt.

> Damit das Plugin vollständig funktioniert, muss das Backend laufen (siehe [hier](#mit-docker) oder [hier](#ohne-docker-development)). Um vom Plugin requests an das Backend zu senden, muss ein Reverse Proxy eingerichtet werden, dieser sollte dann alle requests die mit `/visuanalytics` anfangen an den Backendserver weiterleiten.

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
    "h264_nvenc": false,
    "thumbnail": false
  },
  "testing": false,
  "audio": {}
}
```

`api_keys`:

Die API-Keys für die verwendeten APIs:

- `weatherbit`: API-Key für [weatherbit.io](https://www.weatherbit.io)
- `twitter`: API-Key für [Twitter](https://developer.twitter.com)

`steps_base_config`(_optional_):

Die Konfiguration, die für jeden Job gelten soll (die Konfigurationen, die im Frontend angegeben werden, sind höherwertig).

- `testing`(_optional_):

  Wenn `testing` aktiviert ist, werden keine API-Abfragen gemacht.
  Zur Generierung des Videos werden in dem Fall Beispieldaten verwendet (diese sind nur für die vordefinierten Themen vorhanden).

- `h264_nvenc`(_optional_):

  Wenn `h264_nvenc` aktiviert ist, wird diese Option bei `FFmpeg` verwendet. Diese aktiviert die Hardware-Beschleunigung bei Nvidia-Grafikkarten.
  Damit dies funktioniert, müssen diverse Sachen beachtet werden (weitere Informationen unter [Mit Docker](#Mit-Docker) sowie [Ohne Docker](#Ohne-Docker)).

- `thumbnail`(_optional_):

  Wenn `thumbnail` aktiviert ist, wird zu jedem Video ein `Thumbnail` generiert.
  Der Name des Thumbnails hat das Format: `{video_name}_thumbnail.png` (wobei `{video_name}` dem Namen des Videos entspricht).

- `fix_names`(_optional_):
<!--TODO-->

- `keep_count`(_optional_):
<!--TODO-->

`testing`(_optional_):

Wenn `testing` aktiviert ist, wird die _logging Ausgabe_ auf das "Info"-Level gesetzt, wodurch mehr Informationen in den Log eingetragen werden.

`audio`(_optional_):

Hier kann die Konfiguration für die Audio-Generierung angegeben werden. Eine Erklärung dafür befindet sich [hier](Docs/usage/audio-apis.md).

`console_mode`(_optional_):

Falls man das Programm ohne Frontend verwenden will, kann man diese Option auf `true` setzen. Dann kann man die zu erstellenden Jobs in der Datei `jobs.json` angeben (diese liegt ab unter `src\visuanalytics\resources`, eine Erklärung des Formats befindet sich [hier](#jobsjson)). Diese Option funktioniert nur, wenn man das Programm **ohne Docker** ausführt.

#### jobs.json

Wenn man den `console_mode` (siehe [hier](#configjson)) aktiviert hat, kann man die Jobs in der Datei `jobs.json` wie folgt definieren:

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

`steps`: Thema, zu welchem ein Video generiert werden soll

Aktuelle Optionen:

- `"weather_germany"`: Deutschlandweiter Wetterbericht
- `"weather_single"`: Ortsbezogener Wetterbericht
- `"football"`: Spieltag- und Tabellenbericht für die Fußball-Bundesliga
- `"twitter"`: Twitter-Wordcloud

`schedule`: Hier kann der Zeitplan für die Generierung der Videos festgelegt werden.

Hierzu gibt es vier mögliche Einträge:

- `time`:

  Uhrzeit der Ausführung. Die Uhrzeit muss im Format `"%H:%M"` angegeben werden.

  Beispiel: `10:00`

> Die Uhrzeit muss immer angegeben werden.

- `daily`:

  Wenn dieser Wert `true` ist, wird der Job jeden Tag ausgeführt.

- `date`:

  Ist ein Datum angegeben, so wird der Job einmalig und nur an diesem Datum ausgeführt. Das Datum muss in dem Format `%y-%m-%d` angegeben werden.

  Beispiel: `2020-06-09`

- `weekdays`:

  Enthält die Wochentage, an welchen der Job ausgeführt werden soll. Die Wochentage werden als Array von Zahlen angegeben, wobei `0 ~ Montag`, `1 ~ Dienstag` usw.

  Beispiel: `[0, 5, 6]` => Der Job wird montags, samstags und sonntags ausgeführt.

> Die Optionen `daily`, `date` und `weekdays` schließen sich gegenseitig aus. Es muss also genau eine Option ausgewählt werden.

`config`: Hier können die Konfigurationen für die Jobs festgelegt werden.

> Alle hier beschriebenen Konfigurationen sind optional und werden notfals mit default-Werten initalisiert.

Mögliche Konfigurationen für die verschiedenen Themen:

_Deutschlandweiter Wetterbericht (steps: `"weather_germany"`)_:

- alle Einstellungen, die auch in der [config.json](#config.json) unter `steps_base_config` zur Verfügung stehen

_Ortsbezogener Wetterbericht (steps: `"weather_single"`)_:

- alle Einstellungen, die auch in der [config.json](#config.json) unter `steps_base_config` zur Verfügung stehen
- `city_name`: str - Name des Ortes
- `p_code`: str - Postleitzahl des Ortes
- `speech_app_temp_2`: bool - Ob eine Audiodatei zu den gefühlten Temperaturen bei der 2-Tage-Übersicht erstellt und im Video abgespielt werden soll
- `speech_wind_2`: bool - Ob eine Audiodatei zu Windgeschwindigkeit und -richtung bei der 2-Tage-Übersicht erstellt und im Video abgespielt werden soll
- `speech_sun_2`: bool - Ob eine Audiodatei zu Sonnenauf- und -untergang bei der 2-Tage-Übersicht erstellt und im Video abgespielt werden soll
- `speech_rh_2`: bool - Ob eine Audiodatei zur relativen Luftfeuchtigkeit bei der 2-Tage-Übersicht erstellt und im Video abgespielt werden soll
- `speech_pop_2`: bool - Ob eine Audiodatei zur Regenwahrscheinlichkeit bei der 2-Tage-Übersicht erstellt und im Video abgespielt werden soll

- `speech_app_temp_3`: bool - Ob eine Audiodatei zu den gefühlten Temperaturen bei der 3-Tage-Übersicht erstellt und im Video abgespielt werden soll
- `speech_wind_3`: bool - Ob eine Audiodatei zu Windgeschwindigkeit und -richtung bei der 3-Tage-Übersicht erstellt und im Video abgespielt werden soll
- `speech_sun_3`: bool - Ob eine Audiodatei zu Sonnenauf- und -untergang bei der 3-Tage-Übersicht erstellt und im Video abgespielt werden soll
- `speech_rh_3`: bool - Ob eine Audiodatei zur relativen Luftfeuchtigkeit bei der 3-Tage-Übersicht erstellt und im Video abgespielt werden soll
- `speech_pop_3`: bool - Ob eine Audiodatei zur Regenwahrscheinlichkeit bei der 2-Tage-Übersicht erstellt und im Video abgespielt werden soll

> Aktuell lassen sich nur Wettervorhersagen für Städte in Deutschland generieren.

_Spieltag-Bericht für die Fußball-Bundesliga (steps: `"football"`)_:

- alle Einstellungen, die auch in der [config.json](#config.json) unter `steps_base_config` zur Verfügung stehen
- `liga-name`: str - Spielklasse (`1 ~ 1. Liga`, `2 ~ 2. Liga`, `3 ~ 3. Liga`)

_Twitter Wordcloud (steps: `"twitter"`)_:

- alle Einstellungen, die auch in der [config.json](#config.json) unter `steps_base_config` zur Verfügung stehen
- `normalize_words`: bool - Ob die Wörter normalisiert werden sollen und Doppelungen bei der Zählung der Häufigkeiten zu vermeiden (Beispiel: Bundesliga, bundesliga und BUNDESLIGA (wird einzeln gezählt: je 1x)-> Bundesliga, Bundesliga, Bundesliga (insgesamt: 3x)
- `colormap_words`: str - Die Farben der Wörter in der Wordcloud
- `color_func`: bool - Ob für den Farbverlauf der Wörter in der Wordcloud ein bestimmter Farbverlauf anstelle einer Colormap verwendet werden soll
- `color_func_words`: str - Farbe des gewünschten Farbverlaufs der Wörter in der Wordcloud (nur wenn `color_func` auf `true` gesetzt wurde)
- `figure`: str - Form der Wordcloud (aktuell nur Kreis und Quadrat möglich)
- `size_wordcloud`: str - Größe der Wordcloud (verschiedene Größen möglich)

## Tests Ausführen

### Mit Docker

_Benötigte Software_:

- [Docker](https://www.docker.com/products/docker-desktop)

Unter Windows muss ggf. noch ein Windows Subsystem for Linux installiert werden.
Weitere Informationen [hier](https://docs.docker.com/docker-for-windows/wsl/)

_In den `src`-Ordner wechseln_: `cd src`

_Tests ausführen_:

- `docker-compose -f visuanalytics/docker-compose.test.yml up`

### Ohne Docker

_Benötigte Software_:

- [python](https://www.python.org/downloads/) >=3.6
- [pip](https://packaging.python.org/tutorials/installing-packages/#ensure-you-can-run-pip-from-the-command-line)

_In den `src`-Ordner wechseln_: `cd src`

_Pakete installieren_:

- `pip install -r visuanalytics/requiraments.txt`

_Tests ausführen_:

- `python python3 -m unittest discover visuanalytics`

```note::
 Unter Linux kann es sein, dass `pip3` und `python3` verwendet werden müssen.
```

## Dokumentation generieren

Für die Dokumentation wird das Python-Paket [Sphinx](https://www.sphinx-doc.org) verwendet.

### Installation

_Benötigte Software_:

- [python](https://www.python.org/downloads/) >=3.6
- [pip](https://packaging.python.org/tutorials/installing-packages/#ensure-you-can-run-pip-from-the-command-line)

1. dev-dependencies installieren: `pip install -r src/visuanalytics/requirements-dev.txt`

> Unter Linux kann es sein, dass `pip3` und `python3` verwendet werden müssen.

### HTML generieren

1. in den Dokumentationsordner wechseln: `cd Docs`
2. Dokumentation generieren: `make html`

Die Dokumentation befindet sich dann im Ordner `_build/html`. 
