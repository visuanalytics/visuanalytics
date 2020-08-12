# Installation

## Programm Starten

## Mit Docker

_Benötigte Software_:

- Docker

_Docker-Container erstellen:_

```shell
docker build -t visuanalytics src
```

Falls man nur das Wordpress plugin verwenden will (siehe [hier](#wordpress-plugin-verwenden)) kann man auch
eine Docker Cointainer bauen der das Frontend nicht enthällt. Hierfür muss man nur anstadt den oberen befehl diesen Verwenden:

```shell
docker build -f Dockerfile.wordpress -t visuanalytics src
```

_Docker-Container starten:_

Die Pfade hinter `-v` müssen durch Pfade zu den Dateien, die in [Konfiguration](#Konfiguration) beschrieben werden,
bzw. durch den Pfad zum Output-Ordner ersetzt werden.

_Linux:_

```shell
docker run -t \
  -v /home/user/out:/out \
  -v /home/user/config.json:/config.json \
  -p 8000:8000 \
  visuanalytics
```

_Windows:_

```shell
docker run -t ^
  -v C:\Users\user\out:/out  ^
  -v C:\Users\user\config.json:/config.json ^
  -p 8000:8000 ^
  visuanalytics
```

Der Server kann nun unter `http://locahost:8000` ereicht werden.

```note::
  Wenn man die Option `h264_nvenc` (siehe `config.json <#config.json>_) verwenden will, kann man beim Starten noch die Option `--runtime="nvidia"` (oder `--gpus all`) angeben. Dafür muss man vorher allerdings ein Paar Konfigurationen/Installationen vornehmen. Eine Anleitung dafür defindet sich `hier <https://marmelab.com/blog/2018/03/21/using-nvidia-gpu-within-docker-container.html>`_ (Dies ist nicht die offizielle Doku wir fanden diese aber hilfreicher. Die Doku von Docker zu dem Thema befindet sich `hier <https://docs.docker.com/config/containers/resource_constraints/#access-an-nvidia-gpu>`_)
```

## Ohne Docker (Development)

_Benötigte Software_:

- python >=3.6
- pip
- FFmpeg
- npm

_In den src-Ordner wechseln_: `cd src`

_Pakete installieren_:

- `pip install -r visuanalytics/requiraments.txt`

- Konfigurations-Dateien anlegen / anpassen (diese werden [hier](#Configuration) beschrieben):
  - die Datei `config.json` muss sich in dem Ordner `visuanalytics/insance` befinden.

_In den frontend-Ordner wechseln_:

- `cd ./frontend`

_Frontend Dependencies Installieren_:

- `npm i`
- `npm install react-scripts@3.4.1 -g`

_Programm starten_:

- Backend & Frontend Starten: `npm run start:all`
- Nur Frontend Starten: `npm run start`
- Nur Backend Starten: `npm run start:server`
- Backend ohne npm starten: `python -m visuanalytics` (Dafür muss man sich im src Ordner befinden)

```note::
  Um die Option `h264_nvenc` (siehe `config.json <#config.json>_) zu verwenden, müssen diverse Einstellungen vorgenommen werden.
  Eine gute Anleitung befindet sich [hier](https://developer.nvidia.com/ffmpeg).
```

## Ohne Docker (Produktion)

_TODO_

## Wordpress Plugin Verwenden

Anstatt das der Backend Server das Frontend ausliefiert kann dieses auch als Wordpress Plugin verwendet werden.

Um das Wordpress plugin zu erstellen sind Folgende Schritte nötig:

_Benötigte Software_:

- python >=3.6
- npm

_In den frontend-Ordner wechseln_:

- `cd src/frontend`

_Frontend Dependencies Installieren_:

- `npm i`
- `npm install react-scripts@3.4.1 -g`

_In den wordpress-Ordner wechseln_:

- `cd ../wordpress` (Wenn man im frotnend ordner ist, sonst `cd src/wordpress`)

_Wordpress Plugin erstellen_:

- `python build.py`

Im `build` Ordner befindet sich eine Zip datei die sich einfach über die Wordpress oberfläche instaliern lässt.

```note::
  Damit das Plugin vollständig Funktioniert muss natürlich das Backend laufen (siehe `hier <#mit-docker>`_ oder `hier <#ohne-docker>`_). Um vom Plugin requests an das Backend zu senden muss ein Reverse Proxy eingerichtet werden, dieser sollte dann alle requests die mit `/visuanalytics` an den Backend Server weiterleiten.
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

`steps_base_config`(_Optional_):

Die Konfiguration, die für jeden Job gelten soll (die Konfigurationen die im Frontend angegeben werden sind höherwertig).

- `testing`(_Optional_):

  Wenn `testing` aktiviert ist, werden keine API-Abfragen gemacht.
  Zur Generierung des Videos werden in dem Fall Beispieldaten verwendet. (diese sind natürlich nur für die Vordefinierten Themen vorhanden)

- `h264_nvenc`(_Optional_):

  Wenn `h264_nvenc` aktiviert ist, wird diese Option bei `FFmpeg` verwendet. Diese aktiviert die Hardware-Beschleunigung bei Nvidia-Grafikkarten.
  Damit dies funktioniert, müssen diverse Sachen beachtet werden (weitere Informationen unter [Mit Docker](#Mit-Docker) sowie [Ohne Docker](#Ohne-Docker)).

- `thumbnail`(_Optional_):

  Wenn `thumbnail` aktiviert ist, wird zu jedem Video ein `Thumbnail` generiert.
  Der name des thumbnails hat das format: `{video_name}_thumbnail.png` (Wobei `{video_name}` dem namen des Videos entspricht).

- `fix_names`(_Optional_):
<!--TODO-->

- `keep_count`(_Optional_):
<!--TODO-->

`testing`(_Optional_):

Wenn `testing` aktiviert ist, wird die _logging Ausgabe_ auf das "Info"-Level gesetzt, wodurch mehr Informationen in den Log eingetragen werden.

`audio`(_Optional_):

Hier kann die Konfiguration für die Audio-Generierung angegeben werden. Eine Erklärung hierfür befindet sich [hier](Docs/usage/audio-apis.md).

`console_mode`(_Optional_):

Fals man das Programm ohne Frontend verwenden will kann man dies Option auf `true` setzen. Dann Kann man die zu erstellenden Jobs in der datei `jobs.json` angeben (Diese liegt in `src\visuanalytics\resources`, eine Format erklärung befindet sich [hier](#jobsjson)). Diese Option funktioniert nur wenn man das Programm **ohne Docker** ausführt.

#### jobs.json

Wenn man den `consloe_mode` (siehe [hier](#configjson)) aktiviert hat kann man die Jobs in der datei `jobs.json` wie folgt definieren:

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
- `"twitter"`: Twitter Wordcloud

`schedule`: Hier kann der Zeitplan für die Videogenerierung festgelegt werden.

Hierzu gibt es vier mögliche Einträge:

- `time`:

  Uhrzeit der Ausführung. Die Uhrzeit muss im Format `"%H:%M"` angegeben werden.

  Beispiel: `10:00`

```warning::
  Die Uhrzeit muss immer angegeben werden.
```

- `daily`:

  Wenn dieser Wert 'true' ist, wird der Job jeden Tag ausgeführt.

- `date`:

  Ist ein Datum angegeben, so wird der Job nur ein mal an diesem Datum ausgeführt. Das Datum muss in dem Format '%y-%m-%d' angegeben werden.

  Beispiel: '2020-06-09'

- `weekdays`:

  Enthält die Wochentage, an welchen der Job ausgeführt werden soll. Die Wochentage werden als Array von Zahlen angegeben, wobei `0 ~ Montag`, `1 ~ Dienstag` usw.

  Beispiel: `[0, 5, 6]` => Der Job wird Montags, Samstags und Sontags ausgeführt.

```warning::
  Die Optionen `daily`, `date` und `weekdays` schließen sich gegenseitig aus. Es muss also genau eine Option ausgewählt werden.
```

`config`: Hier können die Konfigurationen für die Jobs festgelegt werden.

```note::
  Alle Hier beschriebenen Konfigurationen sind Optional und werden notfals mit default Werten inizalisiert.
```

Mögliche Konfigurationen für die verschiedenen Themen:

_Deutschlandweiter Wetterbericht (steps: `"weather_germany"`)_:

- alle Einstellungen, die auch in der [config.json](#config.json) unter `steps_base_config` zur Verfügung stehen

_Ortsbezogener Wetterbericht (steps: `"weather_single"`)_:

- alle Einstellungen, die auch in der [config.json](#config.json) unter `steps_base_config` zur Verfügung stehen
- `city_name`: str - Name des Ortes
- `p_code`: str - Postleitzahl des Ortes
- `speech_app_temp_2`: bool - <!--TODO-->
- `speech_wind_2`: bool - <!--TODO-->
- `speech_sun_2`: bool - <!--TODO-->
- `speech_rh_2`: bool - <!--TODO-->
- `speech_pop_2`: bool - <!--TODO-->
- `speech_app_temp_3`: bool - <!--TODO-->
- `speech_wind_3`: bool - <!--TODO-->
- `speech_sun_3`: bool - <!--TODO-->
- `speech_rh_3`: bool - <!--TODO-->
- `speech_pop_3`: bool - <!--TODO-->

```note::
  Aktuell lassen sich nur Wettervorhersagen für Städte in Deutschland generieren.
```

_Spieltag-Bericht für die Fußball-Bundesliga (steps: `"football"`)_:

- alle Einstellungen, die auch in der [config.json](#config.json) unter `steps_base_config` zur Verfügung stehen
- `liga-name`: str - Spielklasse (1 ~ 1. Liga, 2 ~ 2. Liga, 3 ~ 3. Liga)

_Twitter Wordcloud (steps: `"twitter"`)_:

- alle Einstellungen, die auch in der [config.json](#config.json) unter `steps_base_config` zur Verfügung stehen
- `normalize_words`: bool - Ob die Wörter Normaliesiert werden sollen
- `colormap_words`: str - <!--TODO-->
- `color_func`: bool - <!--TODO-->
- `color_func_words`: str - <!--TODO-->
- `figure`: str - <!--TODO-->
- `size_wordcloud`: str - <!--TODO-->

## Dokumentation Generieren

Für die Dokumentation wird das python-Paket [Sphinx](https://www.sphinx-doc.org) verwendet.

### Installation

1. dev-dependencies installieren: `pip install -r src/visuanalytics/requirements-dev.txt`

```note::
 Unter Linux kann es sein, dass `pip3` und `python3` verwendet werden müssen.
```

### HTML Generieren

1. in den Doku-Ordner wechseln: `cd Docs`
2. Dokumentation generieren:

- _Linux:_ `./build.sh`
- _Windows:_ `build.bat`

Die Dokumentation befindet sich dann im Ordner `_build/html`.
