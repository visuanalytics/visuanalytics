# Steps Config <!-- omit in toc -->

- [Daten Zugriffe](#daten-zugriffe)
  - [Pfade](#pfade)
  - [Typen](#typen)
  - [Key/New Key](#keynew-key)
- [Api](#api)
  - [request](#request)
  - [request_multiple](#request_multiple)
  - [request_multiple_custom](#request_multiple_custom)
  - [input](#input)
  - [request_memory](#request_memory)
- [Transform](#transform)
  - [Transform Array](#transform-array)
  - [Transform Dict](#transform-dict)
  - [Transform Compare Arrays](#transform-compare-arrays)
  - [Calculate](#calculate)
    - [mean](#mean)
    - [max](#max)
    - [min](#min)
    - [round](#round)
    - [mode](#mode)
    - [\_bi_calculate](#_bi_calculate)
    - [multiply](#multiply)
    - [divide](#divide)
    - [subtract](#subtract)
    - [add](#add)
  - [Select](#select)
  - [Delete](#delete)
  - [Select Range](#select-range)
  - [Append](#append)
  - [Add Symbol](#add-symbol)
  - [Replace](#replace)
  - [Translate Key](#translate-key)
  - [Alias](#alias)
  - [Regex](#regex)
  - [Date Format](#date-format)
  - [Timestamp](#timestamp)
  - [Date Weekday](#date-weekday)
  - [Date Now](#date-now)
  - [Wind Direction](#wind-direction)
  - [Choose Random](#choose-random)
  - [Loop](#loop)
  - [Add Data](#add-data)
  - [Copy](#copy)
  - [option](#option)
  - [compare](#compare)
  - [Random Text](#random-text)
  - [Convert](#convert)
- [Images](#images)
  - [pillow](#pillow)
  - [Overlay](#overlay)
    - [image](#image)
    - [image_array](#image_array)
    - [text](#text)
    - [text_array](#text_array)
  - [wordcloud](#wordcloud)
- [Audios](#audios)
  - [text](#text-1)
  - [compare](#compare-1)
  - [option](#option-1)
  - [random_text](#random_text)
- [Sequence](#sequence)
  - [successively](#successively)
  - [custom](#custom)
- [Run Config](#run-config)
- [Presets](#presets)

<!-- TODO Description-->

# Daten Zugriffe

<!--TODO-->

## Pfade

<!--TODO-->

## Typen

In der JSON-Konfigurationsdatei

## Key/New Key

<!--TODO-->

# Api

<!-- TODO Description-->

Die im folgenden aufgeführten Typen dienen zur Anfrage von Daten, welche an API-Schnittstellen gesendet werden. Diese
werden Request genannt. Die Antwort der API wird Response genannt und besteht aus einer JSON-Datei mit den angeforderten
Daten der API. Die Responses können auch .csv-Dateien sein.

## request

Führt eine **https**-Request durch.

##### Beispiel <!-- omit in toc -->

```JSON
{
    "type": "request",
    "api_key_name": "apiKeyName",
    "url_pattern": "url",
    "params": {
      "key1": "value1",
      "key2": "value2"
    },
    "headers": {
      "Authorization": "Bearer {_api_key}"
    }
}
```

**`url_pattern`**:

Die zu verwendende `URL`, um die API-Request zu senden.

> Formatted Strings werden unterstützt.

**`api_key_name`** _(Optional)_:

Der Name des Api-Keys. Dieser **Name** muss mit einem **Key** in der Konfigurationsdatei übereinstimmen.

- _Fehler_:

  - `ApiKeyError` -> Name in Config nicht gefunden.

- _Special Variablen_:

  - `api_key` -> Beinhaltet den Api-Key hinter `api_key_name`.

<!--TODO-->

## request_multiple

<!-- TODO Description-->

Führt mehrere **https**-Requests durch. Die Request bleibt gleich bis auf einen Wert der sich ändert.
Z.B. werden die Wetterdaten mehrerer einzelner Städte angefragt.

##### Beispiel <!-- omit in toc -->

```JSON
{
    "type": "request_multiple",
    "api_key_name": "weatherbit",
    "steps_value": [
      "value1",
      "value2"
    ],
    "url_pattern": "url",
    "use_loop_as_key": true,
    "params": {
      "values": "{_loop}",
      "key": "{_api_key}",
      "country": "DE"
    }
}
```

**`url_pattern`**:

<!--TODO-->

**`steps_value`**:

<!--TODO-->

**`api_key_name`** _(Optional)_:

<!--TODO-->

**`use_loop_as_key`** _(Optional)_:

<!--TODO-->

## request_multiple_custom

<!--TODO-->

Führt mehrere **https**-Requests (zu Deutsch: Anfrage) durch. Man kann jeden anderen Request-Typen verwenden, der

##### Beispiel <!-- omit in toc -->

```JSON
{
"type": "request_multiple_custom",
    "use_loop_as_key": true,
    "steps_value": [
      "value1",
      "value2",
      "value3"
    ],
    "requests": [
      {
        "type": "request",
        "url_pattern": "url1"
      },
      {
        "type": "request",
        "url_pattern": "url2"
      },
      {
        "type": "request_memory",
        "name": "value3_name",
        "use_last": 1,
        "alternative": {
          "type": "request",
          "url_pattern": "url3"
        }
      }
    ]
}
```

## input

<!--TODO-->

## request_memory

<!--TODO-->

# Transform

<!-- TODO Description-->

## Transform Array

<!-- TODO Description-->

##### Beispiel <!-- omit in toc -->

```JSON
{
  "type": "transform_array",
  "array_key": "key",
  "transform": []
}
```

<!--TODO-->

## Transform Dict

<!-- TODO Description-->

##### Beispiel <!-- omit in toc -->

```JSON
{
  "type": "transform_array",
  "dict_key": "key",
  "transform": []
}
```

<!--TODO-->

## Transform Compare Arrays

<!-- TODO Description-->

##### Beispiel <!-- omit in toc -->

```JSON

```

<!--TODO-->

## Calculate

<!-- TODO Description-->

calculate stellt Methoden für Berechnungen zur Verfügung.

### mean

<!-- TODO Description-->

##### Beispiel <!-- omit in toc -->

```JSON

```

`keys`:

<!--TODO-->

`decimal`:

<!--TODO-->

`new_keys`:

<!--TODO-->

<!--TODO-->

### max

<!-- TODO Description-->

##### Beispiel <!-- omit in toc -->

```JSON

```

`keys`:

<!--TODO-->

`new_keys`:

<!--TODO-->

`save_idx_to`:

<!--TODO-->

<!--TODO-->

### min

<!-- TODO Description-->

##### Beispiel <!-- omit in toc -->

```JSON

```

`keys`:

<!--TODO-->

`new_keys`:

<!--TODO-->

`save_idx_to`:

<!--TODO-->

<!--TODO-->

### round

<!-- TODO Description-->

##### Beispiel <!-- omit in toc -->

```JSON

```

`keys`:

<!--TODO-->

`decimal`:

<!--TODO-->

`new_keys`:

<!--TODO-->

<!--TODO-->

### mode

<!-- TODO Description-->

##### Beispiel <!-- omit in toc -->

```JSON

```

`keys`:

<!--TODO-->

`new_keys`:

<!--TODO-->

<!--TODO-->

### \_bi_calculate

<!-- TODO Description-->

Wird aufgerufen von den untenstehenden Methoden zum Multiplizieren, Dividieren, Subtrahieren und Addieren von mehreren
Werten z.B. aus einem Array oder von nur einem Wert oder einem Array und einem Wert.

##### Beispiel <!-- omit in toc -->

```JSON

```

<!--TODO-->

### multiply

<!-- TODO Description-->

##### Beispiel <!-- omit in toc -->

```JSON

```

`keys_right`:

<!--TODO-->

`value_right`:

<!--TODO-->

`value_left`:

<!--TODO-->

`decimal`:

<!--TODO-->

<!--TODO-->

### divide

<!-- TODO Description-->

##### Beispiel <!-- omit in toc -->

```JSON

```

`keys_right`:

<!--TODO-->

`value_right`:

<!--TODO-->

`value_left`:

<!--TODO-->

`decimal`:

<!--TODO-->

<!--TODO-->

### subtract

<!-- TODO Description-->

##### Beispiel <!-- omit in toc -->

```JSON

```

`keys_right`:

<!--TODO-->

`value_right`:

<!--TODO-->

`value_left`:

<!--TODO-->

`decimal`:

<!--TODO-->

<!--TODO-->

### add

<!-- TODO Description-->

##### Beispiel <!-- omit in toc -->

```JSON

```

`keys_right`:

<!--TODO-->

`value_right`:

<!--TODO-->

`value_left`:

<!--TODO-->

`decimal`:

<!--TODO-->

<!--TODO-->

## Select

<!-- TODO Description-->

Mit select kann man sich die Keys aus der API-Antwort heraussuchen, die für das zu erstellende Video relevant sind.
Die Keys stehen in relevant_keys.

##### Beispiel <!-- omit in toc -->

```JSON
{
  "type": "select",
  "relevant_keys": []
}
```

`relevant_keys`:

<!--TODO-->

## Delete

##### Beispiel <!-- omit in toc -->

```JSON
{
  "type": "delete",
  "keys": []
}
```

`keys`:

<!--TODO-->

## Select Range

<!-- TODO Description-->

##### Beispiel <!-- omit in toc -->

```JSON
{
          "type": "select_range",
          "array_key": "_loop|data",
          "range_start": 0,
          "range_end": 5
}
```

`array_key`:

<!--TODO-->

`range_start`:

<!--TODO-->

`range_end`:

<!--TODO-->

<!--TODO-->

## Append

<!-- TODO Description-->

##### Beispiel <!-- omit in toc -->

```JSON
{
  "type": "append",
  "key": "key",
  "new_key": "new_key"
}
```

`key`:

<!--TODO-->

`new_key`:

<!--TODO-->

<!--TODO-->

## Add Symbol

<!-- TODO Description-->

add_symbol setzt ein Zeichen, ein Wort, einen Satzteil oder ganze Sätze hinter oder vor den Value von dem Key, welcher
unter key steht. Man kann damit auch einen Value vom alten Key unter keys in einen neuen Key unter new_keys kopieren.

##### Beispiel <!-- omit in toc -->

```JSON
{
  "type": "add_symbol",
  "keys": ["key"],
  "new_keys": ["new_key"],
  "pattern": "{_key} test"
}
```

`keys`:

<!--TODO-->

`new_keys`:

<!--TODO-->

`pattern`:

<!--TODO-->

<!--TODO-->

## Replace

<!-- TODO Description-->

replace ersetzt einen String, der in old_value angegeben ist mit einem String, der in new_value angegeben ist.
Der Value, der unter keys gespeichert ist, wird verändert und in einem neuen Key (angegeben unter new_keys) gespeichert.
count gibt an, wie oft in dem Value der old_value gegen den new_value ersetzt werden soll.

Es können einzelne Zeichen oder auch ganze Satzteile oder Sätze ersetzt werden.

##### Beispiel <!-- omit in toc -->

```JSON
{
  "type": "replace",
  "keys": ["key"],
  "new_keys": ["new_key"],
  "old_value": ".",
  "new_value": ",",
  "count": 1
}
```

`keys`:

<!--TODO-->

`new_keys`:

<!--TODO-->

`old_value`:

<!--TODO-->

`new_value`:

<!--TODO-->

`count`:

<!--TODO-->

<!--TODO-->

## Translate Key

<!-- TODO Description-->

##### Beispiel <!-- omit in toc -->

```JSON

```

`keys`:

<!--TODO-->

`dict`:

<!--TODO-->

`new_keys`:

<!--TODO-->

<!--TODO-->

## Alias

<!-- TODO Description-->

##### Beispiel <!-- omit in toc -->

```JSON
{
  "type": "alias",
  "keys": ["key"],
  "new_keys": ["new_key"]
}
```

`keys`:

<!--TODO-->

`new_keys`:

<!--TODO-->

<!--TODO-->

## Regex

<!-- TODO Description-->

##### Beispiel <!-- omit in toc -->

```JSON

```

<!--TODO-->

## Date Format

<!-- TODO Description-->

date_format wandelt das Format von Datumsangaben um. Unter keys sind die Keys angegeben unter denen als Werte Datumsangaben
stehen. Unter new_keys werden die Keys angegeben zu denen der Wochentag als Value gespeichert wird. Unter given_format
wird angegeben in welchem Format das Datum in den Daten vorliegt, damit das Format in das Format umgewandelt werden kann,
welches in format angegeben ist.

##### Beispiel <!-- omit in toc -->

```JSON
{
  "type": "date_format",
  "keys": ["key"],
  "new_keys": ["new_key"],
  "given_format": "%Y-%m-%dT%H:%M:%S",
  "format": "%Y-%m-%d"
}
```

`keys`:

<!--TODO-->

`new_keys`:

<!--TODO-->

`given_format`:

<!--TODO-->

`format`:

<!--TODO-->

`zeropaded_off`:

<!--TODO-->

<!--TODO-->

## Timestamp

<!-- TODO Description-->

timestamp wandelt Datumsangaben, welche im UNIX-Timestamp-Format angegeben sind, in das unter format spezifizierte Format
um. Unter keys sind die Keys angegeben unter denen als Werte Datumsangaben im UNIX-Timestamo-Format stehen. Unter
new_keys werden die Keys angegeben zu denen das Datum mit dem gewünschten Format als Value gespeichert wird.
zeropaded_off ist true, wenn z.B. aus 05. Mai 2020 -> 5. Mai 2020 werden soll.

##### Beispiel <!-- omit in toc -->

```JSON
{
  "type": "timestamp",
  "keys": ["key"],
  "new_keys": ["new_key"],
  "format": "%H Uhr %M",
  "zeropaded_off": true
}
```

`keys`:

<!--TODO-->

`new_keys`:

<!--TODO-->

`format`:

<!--TODO-->

`zeropaded_off`:

<!--TODO-->

<!--TODO-->

## Date Weekday

<!-- TODO Description-->

date_weekday wandelt Datumsangaben in Wochentage um. Unter keys sind die Keys angegeben unter denen als Werte Datumsangaben
stehen. Unter new_keys werden die Keys angegeben zu denen der Wochentag als Value gespeichert wird. Unter given_format
wird angegeben in welchem Format das Datum in den Daten vorliegt, damit daraus der Wochentag bestimmt werden kann.

##### Beispiel <!-- omit in toc -->

```JSON
{
  "type": "date_weekday",
  "keys": ["key"],
  "new_keys": ["new_key"],
  "given_format": "%Y-%m-%d"
}
```

`keys`:

<!--TODO-->

`new_keys`:

<!--TODO-->

`given_format`:

<!--TODO-->

<!--TODO-->

## Date Now

<!-- TODO Description-->

date_now gibt das heutige (aktuelle) Datum in dem Format aus, welches als Value unter dem Key format angegeben ist.
Weitere Formate sind möglich (siehe dazu Python Doku zu DateTime).

##### Beispiel <!-- omit in toc -->

```JSON
{
  "type": "date_now",
  "new_key": "new_key",
  "format": "%Y-%m-%d"
}
```

`new_key`:

<!--TODO-->

`format`:

<!--TODO-->

`zeropaded_off`:

<!--TODO-->

<!--TODO-->

## Wind Direction

<!-- TODO Description-->

wind_direction ist eine Funktion, die zum Umwandeln der Windrichtung aus der Weatherbit-API verwendet wird.

##### Beispiel <!-- omit in toc -->

```JSON
{
          "type": "wind_direction",
          "key": "_loop|wind_cdir_full",
          "new_key": "_loop|str_wind_cdir_full",
          "dict": {
            "west": {
              "0": "West",
              "1": "Westen"
            },
            "southwest": {
              "0": "Südwest",
              "1": "Südwesten"
            },
            "northwest": {
              "0": "Nordwest",
              "1": "Nordwesten"
            },
            "south": {
              "0": "Süd",
              "1": "Süden"
            },
            "east": {
              "0": "Ost",
              "1": "Osten"
            },
            "southeast": {
              "0": "Südost",
              "1": "Südosten"
            },
            "northeast": {
              "0": "Nordost",
              "1": "Nordosten"
            },
            "north": {
              "0": "Nord",
              "1": "Norden"
            }
          },
          "delimiter": "-"
        }
```

`key`:

<!--TODO-->

`new_key`:

<!--TODO-->

`dict`:

<!--TODO-->

`delimiter`:

<!--TODO-->

<!--TODO-->

## Choose Random

<!-- TODO Description-->

##### Beispiel <!-- omit in toc -->

```JSON

```

`keys`:

<!--TODO-->

`dict`:

<!--TODO-->

`new_keys`:

<!--TODO-->

<!--TODO-->

## Loop

<!-- TODO Description-->

##### Beispiel <!-- omit in toc -->

```JSON
{
  "type": "loop",
  "values": [1, 2, 3],
  "transform": []
}
```

`values`:

<!--TODO-->

`transform`:

<!--TODO-->

##### Beispiel <!-- omit in toc -->

```JSON
{
  "type": "loop",
  "range_start": 0,
  "range_stop": 10,
  "transform": []
}
```

`range_start`:

<!--TODO-->

`range_stop`:

<!--TODO-->

`transform`:

<!--TODO-->

<!--TODO-->

## Add Data

<!-- TODO Description-->

add_data fügt den Daten ein neues Key-Value-Paar hinzu. Der Value wird unter pattern eingetragen und an die Stelle
new_key kommt der Key, unter dem der Value gespeichert werden soll.

##### Beispiel <!-- omit in toc -->

```JSON
{
  "type": "add_data",
  "new_key": "key",
  "pattern": "data"
}
```

`new_key`:

<!--TODO-->

`patter`n:

<!--TODO-->

<!--TODO-->

## Copy

<!-- TODO Description-->

Der Value aus einem Key wird kopiert und als ein Value eines anderen Keys gesetzt.

##### Beispiel <!-- omit in toc -->

```JSON

```

`keys`:

<!--TODO-->

`new_keys`:

<!--TODO-->

<!--TODO-->

## option

<!-- TODO Description-->

```JSON

```

`check`:

<!--TODO-->

`on_true`:

<!--TODO-->

`on_false`:

<!--TODO-->

<!--TODO-->

## compare

<!-- TODO Description-->

##### Beispiel <!-- omit in toc -->

```JSON

```

`value_left`:

<!--TODO-->

`value_right`:

<!--TODO-->

`on_equal`:

<!--TODO-->

`on_higher`:

<!--TODO-->

`on_lower`:

<!--TODO-->

<!--TODO-->

## Random Text

<!-- TODO Description-->

##### Beispiel <!-- omit in toc -->

```JSON

```

`keys`:

<!--TODO-->

`pattern`:

<!--TODO-->

`new_keys`:

<!--TODO-->

## Convert

<!-- TODO Description-->

##### Beispiel <!-- omit in toc -->

```JSON

```

`keys`:

<!--TODO-->

`to`:

<!--TODO-->

`new_keys`:

<!--TODO-->

# Images

Der Abschnitt `images` beinhaltet die Konfigurationen, für die Erstellung der einzelnen Bilder, die am Ende im Abschnitt
`sequence` mit den generierten Audiodateien zu einem Video zusammengeschnitten werden.
Die verschiedenen Typen können mehrere Male hintereinander mit ihren Parametern angegeben werden, je nachdem wie viele
Bilder generiert werden soll. Jedes Bild erhält noch einen Key als Bildnamen:

```JSON
{
    "images": {
        "name_des_bildes": {}
    }
}
```

## pillow

Pillow ist eine Image Library für Python.
In unserem projekt nutzen wir grundlegend 3 Funktionen:
Ein Bild öffnen um es zu bearbeiten.
Ein Bild in ein Bild einfügen.
Text in ein Bild einfügen.

Mithilfe des Image-Typen `pillow` können verschiedene `overlay`- oder `draw`-Typen aufgerufen, die aus den angegebenen
Parametern Bilddateien generieren.

In diesem Part der JSON werden Bilder spezifiziert, welche dann später in Sequence  
verwendet werden können
Bilder lassen sich in der JSOn wie folgt darstellen:

```JSON
{
  "images": {
    "test1": {
      "type": "pillow"
    },
    "test2": {
      "type": "pillow"
    }
  }
}
```

**`"test1"`, `"test2":`**  
sind die internen Bildnamen der erstellten Bilder

```JSON

{
  "test1": {
    "type": "pillow",
    "path": "test.png",
    "overlay": []
  },
  "test2": {
    "type": "pillow",
    "already_created": true,
    "path": "test1",
    "overlay": []
  }
}
```

**`path`**:  
Der Pfad zum Bild welches geöffnet werden soll,
hier kann auch ein Bild verwendet werden was vorher bereits erstellt wurde,  
dazu muss lediglich der interne Bildname angegeben werden

**`already_created`** _(Optional)_:  
Sollte man ein zuvor erstelltes Bild wieder weiter bearbeiten wollen so muss dies true sein

**`overlay`**  
Eine Liste mit Overlays welche alle auf das Bild angewendet werden

## Overlay

Es gibt 4 verschiedene Overlay Arten:

### image

Typ Image setzt ein Bild in das vorher definierte source image

```JSON

 {
  "description": "icon",
  "type": "image",
  "pos_x": 246,
  "pos_y": 280,
  "size_x": 350,
  "size_y": 350,
  "colour": "RGBA",
  "pattern": "123.png"
 }
```

**`description`** _(Optional)_:  
Lediglich ein Name des overlays, wird im programm nicht verwendet, dient nur zur Orientierung in der JSON

**`pos_x`** :  
X Koordinate des zu setztenden Bildes (obere linke Ecke des Bildes)

**`pos_y`** :  
Y Koordinate des zu setztenden Bildes (obere linke Ecke des Bildes)

**`size_x`** _(Optional)_:  
X Größe des zu setzende Bildes  
(wird nichts angeben wird das zu setzende Bild nicht skalliert)

**`size_y`** _(Optional)_:  
Y Größe des zu setzende Bildes  
(wird nichts angeben wird das zu setzende Bild nicht skalliert)

**`colour`**:  
Farbe in welche das Bild konvertiert werden soll  
(RGBA = bunt, L = schwarz-weiß)

**`pattern`**:  
Pfad des zu setzenden Bildes (kann sich auch auf Daten aus der API beziehen)

### image_array

Typ Image-Array setzt mehrere Bilder in das vorher definierte source image

```JSON

{
  "description": "icon",
  "type": "image_array",
  "pos_x": [860, 1040],
  "pos_y": [865, 787],
  "size_x": 160,
   "size_y": 160,
   "colour": "L",
   "pattern": [
      "{_req|test}.png",
      "{_req|test}.png"
   ]
}
```

**`description`** _(Optional)_:  
Lediglich ein Name des overlays, wird im programm nicht verwendet, dient nur zur Orientierung in der JSON

**`pos_x`** :  
X Koordinaten der zu setztenden Bilder (muss eine Liste sein)  
(obere linke Ecke des Bildes)

**`pos_y`** :  
X Koordinaten der zu setztenden Bilder (muss eine Liste sein)  
(obere linke Ecke des Bildes)

**`size_x`** _(Optional)_:  
X Größe der zu setzenden Bilder (muss ein String sein)  
(wird nichts angeben werden die Bilder nicht skaliert)

**`size_y`** _(Optional)_:  
Y Größe der zu setzenden Bilder (muss ein String sein)  
(wird nichts angeben werden die Bilder nicht skaliert)

**`colour`**:  
Farbe in welche die Bilder konvertiert werden sollen.
Kann ein String sein, dann wird die Farbe für alle verwendet oder eine Liste,
dann wird jeder Eintrag einer Koordinate zu geordnet
(Liste muss dann lgischerweiße identisch lang sein wie pos_x)  
(RGBA = bunt, L = schwarz-weiß)

**`pattern`**:  
Pfad der zu setzenden Bilder
Kann ebenfalls wieder Liste oder String sein  
(kann sich auch auf Daten aus der API beziehen)

### text

Typ Text setzt Text in das vorher definierte source image

```JSON

{
   "description": "week_day",
   "type": "text",
   "anchor_point": "center",
   "pos_x": 305,
   "pos_y": 48,
   "preset": "weather_white_2",
   "pattern": "{_req|test_data}"
}
```

**`description`** _(Optional)_:  
Lediglich ein Name des overlays, wird im programm nicht verwendet, dient nur zur Orientierung in der JSON

**`anchor_point`**:  
Legt fest ob der Text zentriert oder linksbündig dargestellt werden soll

**`pos_x`** :  
X Koordinate des zu setztenden Textes

**`pos_y`** :  
Y Koordinate des zu setztenden Textes

**`preset`**:  
Preset welches verwendet werden soll (Schriftart,-Größe,-Farbe)  
Presets sind weiter unten in der JSON spezifiziert

**`pattern`**:  
Text der geschrieben werden soll (kann sich auch auf Daten aus der API beziehen)

### text_array

Typ Text-Array setzt mehrere Texte in das vorher definierte source image

```JSON

{
 "description": "min_temp",
 "type": "text_array",
 "anchor_point": "center",
 "pos_x": [794, 1608],
 "pos_y": [480, 480],
 "preset": [
    "weather_white_5",
    "weather_brown_5"
 ],
 "pattern": [
    "{_req|data|0|sym_min_temp}",
    "{_req|data|1|sym_min_temp}"
 ]
}
```

**`description`** _(Optional)_:  
Lediglich ein Name des overlays, wird im programm nicht verwendet, dient nur zur Orientierung in der JSON

**`anchor_point`**:  
Legt fest ob der Text zentriert oder linksbündig dargestellt werden soll

**`pos_x`** :  
X Koordinate der zu setztenden Texte

**`pos_y`** :  
Y Koordinate der zu setztenden Texte

**`preset`**:  
Preset welches verwendet werden soll (Schriftart,-Größe,-Farbe)  
Dies kann wieder eine Liste oder ein String sein  
Presets sind weiter unten in der JSON spezifiziert

**`pattern`**:  
Texte die geschrieben werden sollen, auch hier wieder Liste sowie String möglich  
(kann sich auch auf Daten aus der API beziehen)

## wordcloud

Mithilfe des Image-Typen `wordcloud` wird eine Funktion aufgerufen, die aus den angegebenen Parametern
eine .png-Datei mit einer Wordcloud generiert. Alle default-Werte, die zur Erstellung einer Wordcloud benötigt werden sind:

```PYTHON
WORDCLOUD_DEFAULT_PARAMETER = {
    "background_color": "white",
    "width": 400,
    "height": 200,
    "collocations": True,
    "max_font_size": None,
    "max_words": 200,
    "contour_width": 0,
    "contour_color": "white",
    "font_path": None,
    "prefer_horizontal": 0.90,
    "scale": 1,
    "min_font_size": 4,
    "font_step": 1,
    "mode": "RGB",
    "relative_scaling": 0.5,
    "color_func": None,
    "regexp": None,
    "colormap": "viridis",
    "normalize_plurals": True,
    "stopwords": None
}
```

Diese Parameter können in der JSON-Datei optional angegeben werden, wird kein anderer Wert angegeben, wird
der jeweilige default-Wert verwendet.

`background_color`: color value - z.B. `white`, `black`, `red` etc. Wenn der Hintergrund transparent sein soll,
muss hier `None` angegeben werden und bei `mode` `RGBA`

`width`: int - Breite der Wordcloud in Pixeln

`height`: int - Höhe der Wordcloud in Pixeln

`collocations`: bool - <!--TODO-->

`max_font_size`: int - Schriftgröße des Wortes, welches am häufigsten im angegebenen Text vorkommt

`max_words`: int - Maximale Anzahl an Wörtern, die in der Wordcloud dargestellt werden

`contour_width`: int - Breite der Kontur/Umrandung der Maske bzw. der Form der Wordcloud

`contour_color`: color value - Farbe der Kontur/Umrandung

`font_path`: str - Pfad zur Schriftart

`prefer_horizontal`: float - <!--TODO-->

`scale`: float/int - <!--TODO-->

`min_font_size`: int - Schriftgröße des Wortes, welches am seltensten im angegebenen Text vorkommt

`font_step`: int - Änderung der Schriftgröße bei den Wörtern, je häufiger ein Wort vorkommt, desto größer ist es dargestellt

`mode`: `RGB`. Wenn der Hintergrund transparent sein soll, muss `RGBA` angegeben werden und bei `background_color` `None`

`relative_scaling`: float - <!--TODO-->

`color_func`: callable - Interne Funktion zur Darstellung eines Farbverlaufs mittel hsl-Darstellung. Überschreibt `colormap`, wenn color_func nicht `None` ist.

`regexp`: None, <!--TODO-->

`colormap`: colormap (callable) von matplotlib - viridis, magma, inferno, plasma

`normalize_plurals`: bool - <!--TODO-->

`stopwords`: set of str - Wörter, die zwar im Text vorkommen, aber nicht in der Wordclud dargestellt werden sollen

##### Beispiel <!-- omit in toc -->

```JSON
{
    "type": "wordcloud",
    "text": "_req|text",
    "stopwords": "_conf|stopwords",
    "parameter": {
        "mask": {
            "x": 1000,
            "y": 1000,
            "figure": "_conf|shape"
        },
        "background_color": "white",
        "width": 1920,
        "height": 1080,
        "collocations": false,
        "max_font_size": 400,
        "max_words": 2000,
        "contour_width": 3,
        "contour_color": "white",
        "color_func": "_conf|color_func_words",
        "colormap": "_conf|colormap_words"
    }
}
```

# Audios

Der Abschnitt `audios` beinhaltet die Texte, die in eine Audio-Datei umgewandelt werden. Die Texte werden im gewünschten
`parts`-Typ generiert. Die Audiodateien werden am Ende im Abschnitt `sequence` mit den generierten Bilddateien zu einem
Video zusammengeschnitten. Die verschiedenen `parts`-Typen können mehrere Male hintereinander mit ihren Parametern
angegeben werden, je nachdem wie viele Audiodateien generiert werden soll. Jede Audiodatei erhält noch einen Key als Dateinamen:

```JSON
{
  "audio": {
      "audios": {
          "name_der_audio": {
            "parts":  []
          }
      }
  }
}
```

## text

Dieser `parts`-Typ wandelt den gegebenen String in eine Audiodatei um.

##### Beispiel <!-- omit in toc -->

```JSON
{
    "parts": [
        {
            "type": "text",
            "pattern": "Am heutigen {value1} {value2} in {value3}. "
        },
        {
           "type": "text",
           "pattern": "Das Wetter ist super. "
        }
    ]
}
```

`pattern`: str - Der Text, der in Sprache umgewandelt werden soll. Einfacher String oder auch ein formatted string möglich.

## compare

Dieser `parts`-Typ wählt aus je nachdem, ob ein bestimmter Wert größer, kleiner oder gleich einem anderen Wert ist, einen
String mithilfe eines weiteren `parts`-Typen aus, der dann in eine Audiodatei umgewandelt wird.

##### Beispiel <!-- omit in toc -->

```JSON
{
    "parts": [
        {
            "type": "option",
            "check": "value",
            "on_equal": [
               {
                  "type": "text",
                  "pattern": "Die gefühlten Temperaturen liegen zwischen {value1} und {value2} Grad. "
               }
            ],
            "on_higher": [
                {
                    "type": "random_text",
                    "pattern": [
                        "Text 1 ",
                        "Text 2 ",
                        "Text 3 "
                    ]
                }
            ],
            "on_lower": [
               {
                  "type": "text",
                  "pattern": "Die Regenwahrscheinlichkeit ist gering. "
               }
            ]
        }
    ]
}
```

`value_left`: str, int - Der Wert, der beim Vergleich auf der linken Seite steht.

`value_right`: str, int - Der Wert, der beim Vergleich auf der rechten Seite steht.

`on_equal`: callable - Optional, wenn `on_not_equal` oder `on_higher` und `on_lower` angegeben ist. Wenn `value_left` und `value_right` gleich sind, wird der angegebene `parts`-Typ aufgerufen.

`on_not_equal`: callable - Optional, wenn `on_equal` angegeben ist. Wenn `value_left` und `value_right` nicht gleich sind, wird der angegebene `parts`-Typ aufgerufen.

`on_higher`: callable - Optional. Wenn `value_left` größer ist als `value_right`, wird der angegebene `parts`-Typ aufgerufen.

`on_lower`: callable - Optional. Wenn `value_left` kleiner ist als `value_right`, wird der angegebene `parts`-Typ aufgerufen.

## option

Dieser `parts`-Typ wählt aus je nachdem, ob ein bestimmter Wert `true` oder `false` ist, einen String mithilfe eines weiteren
`parts`-Typen aus, der dann in eine Audiodatei umgewandelt wird.

##### Beispiel <!-- omit in toc -->

```JSON
{
    "parts": [
        {
            "type": "option",
            "check": "value",
            "on_true": [
               {
                  "type": "text",
                  "pattern": "Die gefühlten Temperaturen liegen zwischen {value1} und {value2} Grad. "
               }
            ],
            "on_false": [
                {
                    "type": "random_text",
                    "pattern": [
                        "Text 1 ",
                        "Text 2 ",
                        "Text 3 "
                    ]
                }
            ]
        }
    ]
}
```

`check`: str, int - Der Wert, der auf true oder false geprüft werden soll.

`on_true`: callable - optional, wenn `on_false` angegeben ist. Wenn `check` true ist, wird der angegebene `parts`-Typ aufgerufen.

`on_false`: callable - optional, wenn `on_true` angegeben ist. Wenn `check` false ist, wird der angegebene `parts`-Typ aufgerufen.

## random_text

Dieser `parts`-Typ wählt aus mehreren gegebenen Strings einen aus, der dann in eine Audiodatei umgewandelt wird.

##### Beispiel <!-- omit in toc -->

```JSON
{
    "type": "random_text",
    "pattern": [
        "Text 1 ",
        "Text 2 ",
        "Text 3 "
    ]
}
```

`pattern`: array of str - Mehrere Texte als Strings. Es wird zufällig einer dieser Texte ausgewählt und in
Sprache umgewandelt. Einfacher String oder auch ein formatted string möglich.

# Sequence

Im Sequence Teil der JSON kan angegeben werden wie das Video auszusehen hat

```JSON
{
 "sequence": {
    "type": "successively"
  }
}
```

## successively

Successively ist der denkbar einfachste Typ der Video Erzeugung, es werden einfach alle Bilder
und alle Audio in der selben Reihenfolge aneinander gehängt wie sie in der JSOn vorher
definiert wurden. Jedes Bild wird so lange gezeigt wie die dazu geordnete Audio datei ist.
Dies setzt natürlich vorraus dass es eine identische Anzahl an Bildern sowie Audios gibt

```JSON
{
  "type": "successively"
}
```

## custom

Custom ist ein etwas schwierigere sequeunce Typ, diese setzt nicht vorraus das es die selbe
Anzahl an Bilder sowie Audios gibt. Das heißt mann kann bestimmte Bilder doppelt oder auch gar nicht verwenden  
Custom funktioniert wie folgt:  
Die audios werden in der Reihenfolge aneinander gehängt wie in "audio_l" vorgegeben,  
Die Bilder werden ebenfalls in der Reihenfolge wie in "imnage" angeben aneinander gehängt.  
jedes Bild wird solange gezeigt wie "time_diff" + Länge des Audios "audio_l".
Sollte kein Audio angegeben werden wird dies als + 0 betrachtet.
Das heißt alle time_diff Werte aufaddiert müssen 0 ergeben,
ansosten passt die gesamte audio Länge nicht auf alle Bilder

```JSON

{
   "type": "custom",
   "pattern": [
      {
        "image": "test2",
        "time_diff": 10
      },
      {
        "image": "test1",
        "time_diff": -3,
        "audio_l": "a1"
      },
      {
        "image": "test5",
        "time_diff": -7
      }
    ]
}
```

**`image`**:  
Name des internen Bildes

**`time_diff`**_(Optional)_:  
Zeit welches dieses Bild länger oder kürzer als die Audio datei angezeigt werden soll

**`audio_l`**_(Optional)_:  
Name der internen Audio Datei

# Run Config

Der Abschnitt `run_config` beinhaltet die Konfigurationen, die der Nutzer in der Job-Erstellung am Anfang auswählen kann.

Bei einem ortsbezogenen Wetterbericht würde dies wie folgt aussehen:

##### Beispiel <!-- omit in toc -->

```JSON
{
"run_config": [
    {
      "name": "city_name",
      "display_name": "Ort",
      "possible_values": [],
      "default_value": "Biebertal"
    },
    {
      "name": "p_code",
      "display_name": "Postleitzahl",
      "possible_values": [],
      "default_value": "35444"
    },
    {
      "name": "speech_rain",
      "display_name": "Regenwahrscheinlichkeit",
      "possible_values": [
        {
          "value": true,
          "display_value": "wird vorgelesen"
        },
        {
          "value": false,
          "display_value": "wird nicht vorgelesen"
        }
      ],
      "default_value": true
    }
  ]
}
```

Man kann noch weitere Einstellungen vornehmen, wie z.B. Optionen, was die Stimme genau vorlesen soll und was nicht. Dies
kann mithilfe der transform-Typen option und compare erreicht werden. Man gibt mögliche Werte (`possible_values`) an
und einen default-Wert `default_value`. Wird bei der Job-Erstellung keine Auswahl zwischen den möglichen Werten
vorgenommen, wird automatisch der `default_value` verwendet. Bei der Job-Erstellung erscheinen die möglichen Werte
als `display_value`.

# Presets

Presets werden verwendet um Texte in dem Style wie sie im preset angegeben wurden auf die Bilder zu schreiben

```JSON
{
 "presets": {
    "test_preset_1": {
      "colour": "black",
      "font_size": 74,
      "font": "fonts/Dosis-Bold.ttf"
    },
    "test_preset_2": {
      "colour": "white",
      "font_size": 35,
      "font": "fonts/Dosis-Bold.ttf"
    }
  }
}
```

**`colour`**:  
Farbe des Textes, kann ein name sein aber auch eine Hexzahl

**`font_size`**:  
Größe des Textes

**`font`**:  
Pfad relativ vom ressource Ordner zu der Font Datei

**`"test_preset_1"`, `"test_preset_2":`**  
sind die internen Namen der presets, sodass man sie in Images mit dem Name der hier angegeben wurde verwenden kann.
