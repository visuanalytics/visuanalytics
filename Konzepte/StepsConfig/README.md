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
  - [Transform Compare Arrays](#transform-compare-arrays)
  - [Calculate](#calculate)
    - [mean](#mean)
    - [max](#max)
    - [min](#min)
    - [round](#round)
    - [mode](#mode)
    - [ms_to_kmh](#ms_to_kmh)
    - [subtract](#subtract)
    - [add](#add)
  - [Select](#select)
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
  - [Find Equal](#find-equal)
  - [Loop](#loop)
  - [Add Data](#add-data)
  - [Result](#result)
  - [Copy](#copy)
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

<!--TODO-->
### max
<!-- TODO Description-->
```JSON

```

<!--TODO-->
### min
<!-- TODO Description-->
```JSON

```

<!--TODO-->
### round
<!-- TODO Description-->
```JSON

```

<!--TODO-->
### mode
<!-- TODO Description-->
```JSON

```

<!--TODO-->
### ms_to_kmh
<!-- TODO Description-->
```JSON

```

<!--TODO-->
### subtract
<!-- TODO Description-->
```JSON

```

<!--TODO-->
### add
<!-- TODO Description-->


```JSON

```

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

<!--TODO-->

## Select Range

<!-- TODO Description-->

```JSON
{
  "type": "select_range",
  "sub_key": "key",
  "range_start": 0,
  "range_end": 7
}
```

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

<!--TODO-->

## Translate Key

<!-- TODO Description-->

```JSON

```

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


<!--TODO-->

## Choose Random

<!-- TODO Description-->

```JSON

```

<!--TODO-->

## Find Equal

<!-- TODO Description-->

```JSON

```

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

```JSON
{
  "type": "loop",
  "range_start": 0,
  "range_stop": 10,
  "transform": []
}
```

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


<!--TODO-->

## Result

<!-- TODO Description-->

```JSON

```

<!--TODO-->

## Copy

<!-- TODO Description-->
Der Value aus einem Key wird kopiert und als ein Value eines anderen Keys gesetzt. 
```JSON

```

<!--TODO-->

# Images

<!--TODO-->

# Audios

<!--TODO-->

# Seqence

<!--TODO-->

# Run Config

<!--TODO-->

# Presets

<!--TODO-->
