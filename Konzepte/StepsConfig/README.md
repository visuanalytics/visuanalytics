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
    "use_loop_as_key": true,
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

```JSON

```

<!--TODO-->

## Select

<!-- TODO Description-->

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

```JSON
{
  "type": "add_symbole",
  "keys": ["key"],
  "new_keys": ["new_key"],
  "pattern": "{_key} test"
},
```

<!--TODO-->

## Replace

<!-- TODO Description-->

```JSON
{
  "type": "replace",
  "keys": ["key"],
  "new_keys": ["new_key"],
  "old_value": ".",
  "new_value": ",",
  "count": 1
},
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
},
```

<!--TODO-->

## Regex

<!-- TODO Description-->

```JSON

```

<!--TODO-->

## Date Format

<!-- TODO Description-->

```JSON
{
  "type": "date_format",
  "keys": ["key"],
  "new_keys": ["new_key"],
  "format": "%Y-%m-%d"
},
```

<!--TODO-->

## Timestamp

<!-- TODO Description-->

```JSON
{
  "type": "timestamp",
  "keys": ["key"],
  "new_keys": ["new_key"],
  "format": "%H Uhr %M",
  "zeropaded_off": true
},
```

<!--TODO-->

## Date Weekday

<!-- TODO Description-->

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

```JSON

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
