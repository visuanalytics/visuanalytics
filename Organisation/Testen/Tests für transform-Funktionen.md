# Tests für transform-Funktionen
**Python-Testdatei**

Data-Analytics\src\visuanalytics\analytics\transform\test_transform.py

**Beispiel-JSON**

Data-Analytics\src\visuanalytics\resources\steps\example.json

**transform.py**

Data-Analytics\src\visuanalytics\analytics\transform\transform.py

#### transform-Funktionen

- [x] transform_array

- [ ] select

- [ ] select_range

- [ ] append

- [x] add_symbol

- [x] replace

- [x] alias

- [x] date_format

- [x] timestamp

- [x] date_weekday

- [x] date_now

- [ ] loop

- [x] wind_direction

- [x] choose_random
- [x] calculate 

​    

## "transform_array": transform_array

-> funktioniert offensichtlich, da die Funktionen ab **add_symbol** funktionieren

## "select": transform_select
-> not implemented yet

## "select_range": transform_select_range
-> not implemented yet

## "append": transform_append
-> not implemented yet

## "add_symbol": transform_add_symbol

```json
    {
      "type": "add_symbol",
      "keys": [
        "_loop|max_temp"
      ],
      "new_keys": [
        "_loop|str_max_temp"
      ],
      "pattern": "{_key} Grad"
    }
```

Beispiel:

```python
data = {"_req": [{"max_temp": 25}, {"max_temp": 27}, {"max_temp": 24}, {"max_temp": 26}, {"max_temp": 23}, {"max_temp": 28}]
```

-> funktioniert 

```json
   {
      "type": "add_symbol",
      "keys": [
        "_loop|max_temp",
        "_loop|min_temp"
      ],
      "new_keys": [
        "_loop|str_max_temp",
        "_loop|str_min_temp"
      ],
      "pattern": "{_key} Grad"
    }
```

Beispiel:

```python
data = {"_req": [{"max_temp": 25, "min_temp": 13}, {"max_temp": 27, "min_temp": 14}]}
```


-> funktioniert

**Kombination von replace und add_symbol**      

```json
"transform": [
  {
    "type": "replace",
    "keys": [
      "_loop|max_temp",
      "_loop|min_temp"
    ],
    "new_keys": [
      "_loop|str_max_temp",
      "_loop|str_min_temp"
    ],
    "old_value": ".",
    "new_value": ",",
    "count": 1
  },
  {
    "type": "add_symbol",
    "keys": [
      "_loop|str_max_temp",
      "_loop|str_min_temp"
    ],
    "pattern": "{_key} Grad"
  }
]
```

Beispiel: 

```python
data = {"_req": [{"max_temp": 25.4, "min_temp": 13.1}, {"max_temp": 27.5, "min_temp": 14.7}]}
```

-> funktioniert 

## "replace": transform_replace

-> funktioniert: siehe transform_add_symbol

## "alias": transform_alias
```json
"transform": [
  {
    "type": "transform_array",
    "array_key": "_req",
    "transform": [
      {
        "type": "alias",
        "keys": [
          "_loop|hallo",
          "_loop|test"
        ],
        "new_keys": [
          "_loop|abc",
          "_loop|def"
        ]
      }
    ]
  }
]
```

Beispiel:

```python
data = {
    "_req": [{"hallo": "524", "test": "25"}, {"hallo": "524", "test": "25"}]}
```

Ergebnis:

```
Data after Transform: {'_conf': {}, '_req': [{'abc': '524', 'def': '25'}, {'abc': '524', 'def': '25'}]}
```



## "date_format": transform_date_format

```json
{
  "type": "date_format",
  "keys": [
    "_loop|valid_date"
  ],
  "new_keys": [
    "_loop|str_valid_date"
  ],
  "given_format": "%Y-%m-%dT%H:%M:%SZ",
  "format": "%Y-%m-%d"
}
```

```json
{
  "type": "date_format",
  "keys": [
    "_loop|valid_date"
  ],
  "new_keys": [
    "_loop|str_valid_date"
  ],
  "format": "%Y-%m-%dT%H:%M:%SZ",
  "given_format": "%Y-%m-%d"
}
```

Beispiel 1:

```python
data = {"_req": [{"valid_date": "2019-05-31T18:50:44Z"}, {"valid_date": "2010-05-31T18:50:44Z"},
                 {"valid_date": "1997-05-21T18:50:44Z"}, {"valid_date": "2020-05-30T18:50:44Z"}]}
```

Beispiel 2:

```python
data = {"_req": [{"valid_date": "2020-05-25"}, {"valid_date": "1550-05-25"}]}
```

# "timestamp": transform_timestamp

https://docs.python.org/3/library/datetime.html

%d Tag

%m Monat

%Y Jahr

%H 24 Stunden 

%M Minuten

%S Sekunden

```json
{
  "type": "timestamp",
  "keys": [
    "_loop|sunset_ts",
    "_loop|sunrise_ts"
  ],
  "new_keys": [
    "_loop|str_sunset_ts",
    "_loop|str_sunrise_ts"
  ],
  "format": "%H Uhr %M"
}
```

Beispiel:

```python
data = {
    "_req": [{"sunset_ts": 1590261659, "sunrise_ts": 1590204804}, {"sunset_ts": 1590521077, "sunrise_ts": 1590463819}]}
```

-> funktioniert

## "date_weekday": transform_date_weekday

```json
{
  "type": "date_weekday",
  "keys": [
    "_loop|valid_date"
  ],
  "new_keys": [
    "_loop|str_valid_date"
  ],
  "given_format": "%Y-%m-%d"
}
```

```json
    {
      "type": "date_weekday",
      "keys": [
        "_loop|valid_date"
      ],
      "new_keys": [
        "_loop|str_valid_date"
      ],
      "given_format": "%Y-%m-%dT%H:%M:%SZ"
    }
```
-> funktioniert 

Beispiel 1: 

```python
data = {"_req": [{"valid_date": "2019-05-31T18:50:44Z"}, {"valid_date": "2010-05-31T18:50:44Z"},
                 {"valid_date": "1997-05-21T18:50:44Z"}, {"valid_date": "2020-05-30T18:50:44Z"}]}
```

Beispiel 2:

```python
data = {"_req": [{"valid_date": "2020-05-25"}, {"valid_date": "1550-05-25"}]}
```

## "date_now": transform_date_now

```json
"transform": [
  {
    "type": "date_now",
    "new_key": "date_today",
    "format": "Heute ist der %d.%m.%Y"
  }
],
```

Beispiel (da der Testfall data benötigt):

```python
data = {"_req": [{"valid_date": "2020-05-25"}, {"valid_date": "1550-05-25"}]}
```

Ergebnis:

```
Data after Transform: {'_conf': {}, '_req': [{'valid_date': '2020-05-25'}, {'valid_date': '1550-05-25'}], 'date_today': 'Heute ist der 11.06.2020'}
```



```json
"transform": [
  {
    "type": "date_now",
    "new_key": "date_today",
    "format": "%Y-%m-%dT%H:%M:%SZ"
  }
],
```

Mit demselben Beispiel wie eben:

```
Data after Transform: {'_conf': {}, '_req': [{'valid_date': '2020-05-25'}, {'valid_date': '1550-05-25'}], 'date_today': '2020-06-11T09:22:37Z'}
```



## "loop": transform_loop

-> wurde indirekt bei calculate getestet?

## "wind_direction": transform_wind_direction
```json
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

Beispiel: 

```python
data = {"_req": [{"wind_cdir_full": "south"}, {"wind_cdir_full": "west-southwest"}]}
```

-> funktioniert 

## "choose_random": transform_choose_random
```json
{
  "type": "transform_array",
  "array_key": "_req",
  "transform": [
    {
      "type": "choose_random",
      "keys": [
        "_loop|code"
      ],
      "new_keys": [
        "_loop|str_code"
      ],
      "dict": {
        "200": {
          "0": "kommt es zu Gewittern mit leichtem Regen",
          "1": "ist mit Gewitter und leichtem Regen zu rechnen",
          "2": "Gewitter"
        },
        "201": {
          "0": "kommt es zu Gewittern mit Regen",
          "1": "ist mit Gewitter und Regen zu rechnen",
          "2": "Gewitter"
        },
        "202": {
          "0": "kommt es zu Gewittern mit starkem Regen",
          "1": "ist mit Gewitter und starkem Regen zu rechnen",
          "2": "Gewitter"
        },
        "230": {
          "0": "kommt es zu Gewittern mit leichtem Nieselregen",
          "1": "ist mit Gewitter und leichtem Nieselregen zu rechnen",
          "2": "Gewitter"
        },
        "231": {
          "0": "kommt es zu Gewittern mit Nieselregen",
          "1": "ist mit Gewitter und Nieselregen zu rechnen",
          "2": "Gewitter"
        },
        "232": {
          "0": "kommt es zu Gewittern mit starkem Nieselregen",
          "1": "ist mit Gewitter und starkem Nieselregen zu rechnen",
          "2": "Gewitter"
        },
        "233": {
          "0": "kommt es zu Gewittern mit Hagel",
          "1": "ist mit Gewitter und Hagel zu rechnen",
          "2": "Gewitter"
        },
        "300": {
          "0": "kommt es zu leichtem Nieselregen",
          "1": "ist mit leichtem Nieselregen zu rechnen",
          "2": "regnerisch"
        },
        "301": {
          "0": "kommt es zu Nieselregen",
          "1": "ist mit Nieselregen zu rechnen",
          "2": "Nieselregen"
        },
        "302": {
          "0": "kommt es zu starkem Nieselregen",
          "1": "ist mit starkem Nieselregen zu rechnen",
          "2": "regnerisch"
        },
        "500": {
          "0": "kommt es zu leichtem Regen",
          "1": "ist es leicht regnerisch",
          "2": "Regen"
        },
        "501": {
          "0": "kommt es zu mäßigem Regen",
          "1": "ist es regnerisch",
          "2": "Regen"
        },
        "502": {
          "0": "kommt es zu starkem Regen",
          "1": "ist es stark regnerisch",
          "2": "Regen"
        },
        "511": {
          "0": "kommt es zu Eisregen",
          "1": "ist mit Eisregen zu rechnen",
          "2": "Eisregen"
        },
        "520": {
          "0": "kommt es zu leichtem Regenschauer",
          "1": "ist mit leichten Regenschauern zu rechnen",
          "2": "Regenschauer"
        },
        "521": {
          "0": "kommt es zu Regenschauer",
          "1": "ist mit Regenschauern zu rechnen",
          "2": "Regenschauer"
        },
        "522": {
          "0": "kommt es zu starkem Regenschauer",
          "1": "ist mit starken Regenschauern zu rechnen",
          "2": "Regenschauer"
        },
        "600": {
          "0": "kommt es zu leichtem Schneefall",
          "1": "ist mit leichtem Schneefall zu rechnen",
          "2": "Schnee"
        },
        "601": {
          "0": "kommt es zu Schnee",
          "1": "ist mit Schnee zu rechnen",
          "2": "Schnee"
        },
        "602": {
          "0": "kommt es zu starkem Schneefall",
          "1": "ist mit starkem Schneefall zu rechnen",
          "2": "Schnee"
        },
        "610": {
          "0": "kommt es zu einem Mix aus Schnee und Regen",
          "1": "ist mit einem Mix aus Schnee und Regen zu rechnen",
          "2": "Schnee"
        },
        "611": {
          "0": "kommt es zu Schneeregen",
          "1": "ist mit Schneeregen zu rechnen",
          "2": "Schneeregen"
        },
        "612": {
          "0": "kommt es zu starkem Schneeregen",
          "1": "ist mit starkem Schneeregen zu rechnen",
          "2": "Schneeregen"
        },
        "621": {
          "0": "kommt es zu Schneeschauer",
          "1": "ist mit Schneeschauern zu rechnen",
          "2": "Schneeschauer"
        },
        "622": {
          "0": "kommt es zu starkem Schneeschauer",
          "1": "ist mit starken Schneeschauern zu rechnen",
          "2": "Schneeschauer"
        },
        "623": {
          "0": "kommt es zu Windböen",
          "1": "ist mit Windböen zu rechnen",
          "2": "windig"
        },
        "700": {
          "0": "kommt es zu Nebel",
          "1": "ist mit Nebel zu rechnen",
          "2": "nebelig"
        },
        "711": {
          "0": "kommt es zu Nebel",
          "1": "ist mit Nebel zu rechnen",
          "2": "nebelig"
        },
        "721": {
          "0": "kommt es zu Dunst",
          "1": "ist mit Nebel zu rechnen",
          "2": "nebelig"
        },
        "731": {
          "0": "kommt es zu Staub in der Luft",
          "1": "ist mit Staub in der Luft zu rechnen",
          "2": "staubig"
        },
        "741": {
          "0": "kommt es zu Nebel",
          "1": "ist mit Nebel zu rechnen",
          "2": "nebelig"
        },
        "751": {
          "0": "kommt es zu Eisnebel",
          "1": "ist mit Eisnebel zu rechnen",
          "2": "Eisnebel"
        },
        "800": {
          "0": "ist der Himmel klar",
          "1": "wird es heiter mit klarem Himmel",
          "2": "heiter"
        },
        "801": {
          "0": "sind nur wenige Wolken am Himmel",
          "1": "ist es leicht bewölkt",
          "2": "leicht bewölkt"
        },
        "802": {
          "0": "sind vereinzelte Wolken am Himmel",
          "1": "ist es vereinzelt bewölkt",
          "2": "leicht bewölkt"
        },
        "803": {
          "0": "ist es bewölkt, vereinzelt kommt die Sonne durch",
          "1": "ist es bewölkt, vereinzelt kommt die Sonne durch",
          "2": "leicht bewölkt"
        },
        "804": {
          "0": "kommt es zu bedecktem Himmel",
          "1": "ist es bewölkt",
          "2": "bewölkt"
        },
        "900": {
          "0": "kommt es zu unbekanntem Niederschlag",
          "1": "ist mit unbekanntem Niederschlag zu rechnen",
          "2": "unbekannt"
        }
      },
      "choice": [
        "0",
        "1"
      ]
    }
```
Beispiel: 

```python
data = {"_req": [{"code": 201}, {"code": 801}]}
```

-> funktioniert

## calculate

Eigenes Module, siehe **Tests für calculate-Funktionen.md**