# Steps Config <!-- omit in toc -->

- [Daten Zugriffe](#daten-zugriffe)
  - [Pfade](#pfade)
  - [Key/New Key](#keynew-key)
- [Api](#api)
  - [request](#request)
  - [request Multiple](#request-multiple)
  - [request Multiple Custom](#request-multiple-custom)
- [Transform](#transform)
  - [Transform Array](#transform-array)
  - [Transform Dict](#transform-dict)
  - [Calculate](#calculate)
    - [mean](#mean)
    - [max](#max)
    - [min](#min)
    - [round](#round)
    - [mode](#mode)
    - [_bi_calculate](#_bi_calculate)
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
  - [Option](#option)
  - [Compare](#compare)
  - [Random Text](#random-text)
  - [Convert](#convert)
- [Images](#images)
- [Audios](#audios)
- [Seqence](#seqence)
- [Run Config](#run-config)
- [Presets](#presets)
  
<!-- TODO Description-->

# Daten Zugriffe

<!--TODO-->

## Pfade

<!--TODO-->

## Key/New Key

<!--TODO-->

# Api

<!-- TODO Description-->

## request

Führt einen **Https** request durch.

```JSON
{
    "type": "request",
    "api_key_name": "apiKeyName",
    "url_pattern": "url"
}
```

**`url_pattern`**:

Die zu Verwendende `url`.

> Format Strings Werden unterschtützt.

**`api_key_name`** _(Optional)_:

Der Name des Api Keys. Dieser **Name** muss mit einem **Key** in der Configurations Datei übereinstimmen.

- _Fehler_:

  - `ApiKeyError` -> Name in Config nicht gefunden.

- _Special Variablen_:

  - `api_key` -> Beinhaltet den Api Key hinter `api_key_name`

<!--TODO-->

## request Multiple

<!-- TODO Description-->

```JSON
{
    "type": "request_multiple",
    "api_key_name": "weatherbit",
    "steps_value": [
      "value1",
      "value2"
    ],
    "url_pattern": "url",
    "use_loop_as_key": true
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

## request Multiple Custom

<!--TODO-->

# Transform

<!-- TODO Description-->

## Transform Array

<!-- TODO Description-->

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

```JSON

```

<!--TODO-->

## Calculate

<!-- TODO Description-->
calculate stellt Methoden für Berechnungen zur Verfügung.

### mean
<!-- TODO Description-->
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
```JSON

```
`keys`:
<!--TODO-->
`new_keys`:
<!--TODO-->

<!--TODO-->
### _bi_calculate
<!-- TODO Description-->

Wird aufgerufen von den untenstehenden Methoden zum Multiplizieren, Dividieren, Subtrahieren und Addieren von mehreren
Werten z.B. aus einem Array oder von nur einem Wert oder einem Array und einem Wert.
```JSON

```

<!--TODO-->
### multiply
<!-- TODO Description-->
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

```JSON
{
  "type": "select",
  "relevant_keys": []
}
```

`relevant_keys`:

<!--TODO-->

## Delete

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

```JSON

```

<!--TODO-->

## Date Format

<!-- TODO Description-->
date_format wandelt das Format von Datumsangaben um. Unter keys sind die Keys angegeben unter denen als Werte Datumsangaben
stehen. Unter new_keys werden die Keys angegeben zu denen der Wochentag als Value gespeichert wird. Unter given_format 
wird angegeben in welchem Format das Datum in den Daten vorliegt, damit das Format in das Format umgewandelt werden kann, 
welches in format angegeben ist. 

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

```JSON

```
`keys`:
<!--TODO-->
`to`:
<!--TODO-->
`new_keys`:
<!--TODO-->

# Images

In diesem Part der JSON werden Bilder spezifiziert, welche dann später in Sequence  
verwendet werden können 
Bilder lassen sich in der JSOn wie folgt darstellen:

```JSON
{
  "images": {
    "test1": {
      "type": "pillow",
    },
    "test2": {
      "type": "pillow",
    }
  }
}
```
**`type`**:  
Von welchem Typ die Bilder sind zb. Wordcloud oder Pillow (bisher gibt es nur Pillow)   
**`"test1"`, `"test2":`**   
sind die internen Bildnamen der erstellten Bilder


## Pillow

Pillow ist eine Image Library für Python.
In unserem projekt nutzen wir grundlegend 3 Funktionen:
Ein Bild öffnen um es zu bearbeiten.
Ein Bild in ein Bild einfügen.
Text in ein Bild einfügen.

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

## image

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
**`type`** :  
Overlay typ der verwendet werden soll (Hier image)  
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
## image_array

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
**`type`** :  
Overlay typ der verwendet werden soll (Hier image_array)   
**`pos_x`** :  
X Koordinaten der zu setztenden Bilder  (muss eine Liste sein)  
(obere linke Ecke des Bildes)  
**`pos_y`** :  
X Koordinaten der zu setztenden Bilder  (muss eine Liste sein)  
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

## text

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
**`type`** :  
Overlay typ der verwendet werden soll (Hier text)  
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

## text_array

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
**`type`** :  
Overlay typ der verwendet werden soll (Hier text_array)  
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


# Audios

<!--TODO-->

# Sequence

<!--TODO-->

```JSON
{
 "sequence": {
    "type": "successively"
  }
}
```

## successively

<!--TODO-->

```JSON
{
  "type": "successively"
}
```
**`type`**:
<!--TODO-->

## custom

<!--TODO-->

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
        "time_diff": 4
      }
    ]
}
```
**`image`**:
<!--TODO-->
**`time_diff`**_(Optional)_:
<!--TODO-->
**`audio_l`**_(Optional)_:
<!--TODO-->


# Run Config

<!--TODO-->

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
