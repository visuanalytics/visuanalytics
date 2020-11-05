# Installation

## Programm starten

### Mit Docker

_Benötigte Software_:

- [Docker](https://www.docker.com/products/docker-desktop)

Unter Windows muss ggf. noch ein Windows Subsystem for Linux installiert werden. 
Weitere Informationen [hier](https://docs.docker.com/docker-for-windows/wsl/).

_Docker-Container starten:_

Die Pfade hinter `-v` müssen durch Pfade zu den Dateien, welche in [Konfiguration](#konfiguration) beschrieben werden
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

```note::
  Wenn man die Option `h264_nvenc` (siehe `config.json <#config-json>`_) verwenden will, kann man beim Starten noch die Option`--runtime="nvidia"`(oder`--gpus all`) angeben. Dafür muss man vorher ein paar Konfigurationen und Installationen vornehmen. Eine Anleitung dafür finden Sie `hier <https://marmelab.com/blog/2018/03/21/using-nvidia-gpu-within-docker-container.html>`_ (Dies ist nicht die offizielle Dokumentation. Die Dokumentation von Docker zu dem Thema befindet sich `hier <https://docs.docker.com/config/containers/resource_constraints/#access-an-nvidia-gpu>`_).
````

### Ohne Docker (Development)

_Benötigte Software_:

- [python](https://www.python.org/downloads/) >=3.6
- [pip](https://packaging.python.org/tutorials/installing-packages/#ensure-you-can-run-pip-from-the-command-line)
- [FFmpeg](https://ffmpeg.org/download.html)
- [npm](https://www.npmjs.com/get-npm)

_In den `src`-Ordner wechseln_: `cd src`

_Pakete installieren_:

- `pip install -r visuanalytics/requirements.txt`

- Konfigurationsdateien anlegen bzw. anpassen (diese werden unter [Konfiguration](#konfiguration) beschrieben):
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
- Backend ohne npm starten: `python -m visuanalytics` (dafür muss man sich im src-Ordner befinden)

```note::
  Um die Option `h264_nvenc` (siehe `config.json <#config-json>`_) zu verwenden, müssen diverse Einstellungen vorgenommen werden.
  Eine Anleitung finden Sie `hier <https://developer.nvidia.com/ffmpeg>`_.
````

## Wordpress-Plugin verwenden

Nicht nur der Backend-Server kann das Frontend ausliefern. Das Frontend kann auch als Wordpress-Plugin verwendet werden.

Um das Wordpress-Plugin zu erstellen, sind folgende Schritte nötig:

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

```warning::
  Damit das Plugin vollständig funktioniert, muss das Backend laufen (siehe `hier <#mit-docker>`_ oder `hier <#ohne-docker-development>`_). 
  Um vom Plugin Requests an das Backend zu senden, muss ein Reverse Proxy eingerichtet werden. Dieser sollte dann alle Requests,
  die mit `/visuanalytics` anfangen an den Backend-Server weiterleiten.
```

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

Die Konfiguration, die für jeden Job gelten soll. (Die Konfigurationen, die im Frontend angegeben werden, sind höherwertig.)

- `testing`(_optional_):

  Wenn `testing` aktiviert ist, werden keine API-Abfragen gemacht.
  Zur Generierung des Videos werden in dem Fall Beispieldaten verwendet. (Diese sind nur für die vordefinierten Themen vorhanden.)

- `h264_nvenc`(_optional_):

  Wenn `h264_nvenc` aktiviert ist, wird diese Option bei FFmpeg verwendet. Diese aktiviert die Hardware-Beschleunigung bei Nvidia-Grafikkarten.
  Damit dies funktioniert, müssen diverse Sachen beachtet werden (weitere Informationen unter [Mit Docker](#mit-Docker) sowie [Ohne Docker](#ohne-docker-development)).

- `thumbnail`(_optional_):

  Wenn `thumbnail` aktiviert ist, wird zu jedem Video ein Thumbnail generiert.
  Der Name des Thumbnails hat das Format: `{video_name}_thumbnail.png` (wobei `{video_name}` dem Namen des Videos entspricht).

- `fix_names`(_optional_):

  `fix_names` kann dazu verwendet werden, um den Output-Videos feste Namen zu geben. Hierzu kann man entweder `names` verwenden (hier gibt man dann einfach eine Liste mit Namen an)  
  oder man verwendet `count`. Bei `count` werden die Videos durchnumeriert, d.h. das neueste Video bekommt _1.
  Sollte man z.B. `count=3` wählen, so liegen im out-Ordner immer die 3 neuesten Videos. Das neueste Video hat den Bezeichner _1 und das älteste Video _3.
  Sobald ein neues Video generiert wird, wird das Video mit _3 gelöscht und das _2-Video in _3 umbenannt etc.  
  Die einzige Ausnahme ist, wenn `count = 1` gesetzt wurde. In diesem Fall wird kein _1 verwendet, sondern bei jeder neuen Videogenerierung heißt das Video gleich dem Jobnamen.

- `keep_count`(_optional_):

   kee`p_count` gibt an wie viele Videos maximal im out-Ordner von einem Task vorhanden sein sollen. Sobald es zu viele gibt, wird das älteste Video gelöscht.



`testing`(_optional_):

Wenn `testing` aktiviert ist, wird die _logging Ausgabe_ auf das "Info"-Level gesetzt, wodurch mehr Informationen in den Log eingetragen werden.

`audio`(_optional_):

Hier kann die Konfiguration für die Audiogenerierung angegeben werden. Eine Erklärung dafür befindet sich [hier](#audio-apis.md).

`console_mode`(_optional_):

Falls man das Programm ohne Frontend verwenden will, kann man diese Option auf `true` setzen. Dann kann man die zu erstellenden Jobs in der Datei `jobs.json` angeben (diese liegt ab unter `src\visuanalytics\resources`, eine Erklärung des Formats befindet sich [hier](#jobs-json)). Diese Option funktioniert nur, wenn man das Programm **ohne Docker** ausführt.

#### jobs.json

Wenn man den `console_mode` (siehe [hier](#config-json)) aktiviert hat, kann man die Jobs in der Datei `jobs.json` wie folgt definieren:

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
- `"football"`: Spieltag- und Tabellenbericht für die 1. und 2. Fußball-Bundesliga
- `"twitter"`: Twitter-Wordcloud

`schedule`: Hier kann der Zeitplan für die Generierung der Videos festgelegt werden.

Hierzu gibt es vier mögliche Einträge:

- `time`:

  Uhrzeit der Ausführung. Die Uhrzeit muss im Format `"%H:%M"` angegeben werden.

  Beispiel: `10:00`

```warning::
  Die Uhrzeit muss immer angegeben werden.
```

- `daily`:

  Wenn dieser Wert `true` ist, wird der Job jeden Tag ausgeführt.

- `date`:

  Ist ein Datum angegeben, so wird der Job einmalig und nur an diesem Datum ausgeführt. Das Datum muss im Format `%y-%m-%d` (YYYY-MM-DD) angegeben werden.

  Beispiel: `2020-06-09`

- `weekdays`:

  Enthält die Wochentage, an welchen der Job ausgeführt werden soll. Die Wochentage werden als Array von Zahlen angegeben, wobei `0 ~ Montag`, `1 ~ Dienstag` usw.

  Beispiel: `[0, 5, 6]` => Der Job wird montags, samstags und sonntags ausgeführt.

```warning::
  Die Optionen `daily`, `date` und `weekdays` schließen sich gegenseitig aus. Es muss also genau eine Option ausgewählt werden.
```

`config`: Hier können die Konfigurationen für die Jobs festgelegt werden.

```note::
  Alle hier beschriebenen Konfigurationen sind optional und werden notfalls mit default-Werten initialisiert.
```

Mögliche Konfigurationen für die verschiedenen Themen:

_Deutschlandweiter Wetterbericht (steps: `"weather_germany"`)_:

- Alle Einstellungen, die auch in der [config.json](#config-json) unter `steps_base_config` zur Verfügung stehen.

_Ortsbezogener Wetterbericht (steps: `"weather_single"`)_:

- Alle Einstellungen, die auch in der [config.json](#config-json) unter `steps_base_config` zur Verfügung stehen
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

```note::
  Aktuell lassen sich nur Wettervorhersagen für Städte in Deutschland generieren.
```

_Spieltag-Bericht für die 1. und 2. Fußball-Bundesliga (steps: `"football"`)_:

- Alle Einstellungen, die auch in der [config.json](#config-json) unter `steps_base_config` zur Verfügung stehen
- `liga-name`: str - Spielklasse (`1 ~ 1. Liga`, `2 ~ 2. Liga`, `3 ~ 3. Liga`)

_Twitter Wordcloud (steps: `"twitter"`)_:

- Alle Einstellungen, die auch in der [config.json](#config-json) unter `steps_base_config` zur Verfügung stehen
- `normalize_words`: [bool](#boolean) - Ob die Wörter normalisiert werden sollen und Doppelungen bei der Zählung der Häufigkeiten zu vermeiden (Beispiel: Bundesliga, bundesliga und BUNDESLIGA (wird einzeln gezählt: je 1x)-> Bundesliga, Bundesliga, Bundesliga (insgesamt: 3x)
- `colormap_words`: [str](#string) - Die Farben der Wörter in der Wordcloud
- `color_func`: [bool](#boolean) - Ob für den Farbverlauf der Wörter in der Wordcloud ein bestimmter Farbverlauf anstelle einer Colormap verwendet werden soll
- `color_func_words`: [str](#string) - Farbe des gewünschten Farbverlaufs der Wörter in der Wordcloud (nur wenn `color_func` auf `true` gesetzt wurde)
- `figure`: [str](#string) - Form der Wordcloud (aktuell nur Kreis und Quadrat möglich)
- `size_wordcloud`: [str](#string) - Größe der Wordcloud (verschiedene Größen möglich)

## Tests ausführen

### Mit Docker

_Benötigte Software_:

- [Docker](https://www.docker.com/products/docker-desktop)

Unter Windows muss ggf. noch ein Windows Subsystem for Linux installiert werden. 
Weitere Informationen [hier](https://docs.docker.com/docker-for-windows/wsl/).

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

```note::
 Unter Linux kann es sein, dass `pip3` und `python3` verwendet werden müssen.
```

### HTML generieren

1. in den Dokumentationsordner wechseln: `cd Docs`
2. Dokumentation generieren: `make html`

Die Dokumentation befindet sich dann im Ordner `_build/html`.
