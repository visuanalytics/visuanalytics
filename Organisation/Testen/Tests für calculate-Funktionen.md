# Tests für calculate-Funktionen

**Python-Testdatei**

Data-Analytics\src\visuanalytics\analytics\transform\test_transform.py

**Beispiel-JSON**

Data-Analytics\src\visuanalytics\resources\steps\example.json

**calculate.py**

Data-Analytics\src\visuanalytics\analytics\transform\calculate.py

#### calculate-Funktionen

- [x] mean

- [x] max

- [x] min

- [x] round

- [x] mode

- [x] ms_to_kmh



## calculate_mean

Berechnet den Mittelwert der jeweils angegebenen Arrays.

```json
"transform": [
  {
    "type": "transform_array",
    "array_key": "_req",
    "transform": [
      {
        "type": "calculate",
        "keys": [
          "_loop|max_temp",
          "_loop|min_temp"
        ],
        "new_keys": [
          "_loop|max_temp_avg",
          "_loop|min_temp_avg"
        ],
        "action": "mean",
        "decimal": 2
      }
    ]
  }
]
```

Beispiel:

```
data = {"_req": [{"max_temp": [21, 23.4, 18, 19.9], "min_temp": [15.4, 13.7, 12, 14]},
                 {"max_temp": [21, 23.4, 18, 20.1], "min_temp": [12.4, 13, 12.2, 15]}]}
```

Ergebnis:

```
Data after Transform: {'_conf': {}, '_req': 
[{'max_temp': [21, 23.4, 18, 19.9], 'min_temp': [15.4, 13.7, 12, 14], 'max_temp_avg': 20.58, 'min_temp_avg': 13.78}, 
{'max_temp': [21, 23.4, 18, 20.1], 'min_temp': [12.4, 13, 12.2, 15], 'max_temp_avg': 20.62, 'min_temp_avg': 13.15}]}
```

Ohne "decimal":

```
"transform": [
  {
    "type": "transform_array",
    "array_key": "_req",
    "transform": [
      {
        "type": "calculate",
        "action": "round",
        "keys": [
          "_loop|wind_spd"
        ],
        "new_keys": [
          "_loop|wind_spd"
        ]
      }
    ]
  }
]
```

Ergebnis:

```
Data after Transform: {'_conf': {}, '_req': 
[{'wind_spd': 0}, {'wind_spd': 1}]}
```



## calculate_max

```
"transform": [
  {
    "type": "transform_array",
    "array_key": "_req",
    "transform": [
      {
        "type": "calculate",
        "keys": [
          "_loop|max_temp",
          "_loop|min_temp"
        ],
        "new_keys": [
          "_loop|max_temp_avg",
          "_loop|min_temp_avg"
        ],
        "action": "max"
      }
    ]
  }
]
```

Beispiel:

```
data = {"_req": [{"max_temp": [21, 23.4, 18, 19.9], "min_temp": [15.4, 13.7, 12, 14]},
                 {"max_temp": [21, 23.4, 18, 20.1], "min_temp": [12.4, 13, 12.2, 15]}]}
```

Ergebnis:

```
Data after Transform: {'_conf': {}, '_req': 
[{'max_temp': [21, 23.4, 18, 19.9], 'min_temp': [15.4, 13.7, 12, 14], 'max_temp_avg': 23.4, 'min_temp_avg': 15.4}, 
{'max_temp': [21, 23.4, 18, 20.1], 'min_temp': [12.4, 13, 12.2, 15], 'max_temp_avg': 23.4, 'min_temp_avg': 15}]}
```



## calculate_min

```
"transform": [
  {
    "type": "transform_array",
    "array_key": "_req",
    "transform": [
      {
        "type": "calculate",
        "keys": [
          "_loop|max_temp",
          "_loop|min_temp"
        ],
        "new_keys": [
          "_loop|max_temp_avg",
          "_loop|min_temp_avg"
        ],
        "action": "min"
      }
    ]
  }
]
```

Beispiel:

```
data = {"_req": [{"max_temp": [21, 23.4, 18, 19.9], 
				 "min_temp": [15.4, 13.7, 12, 14]},
           		{"max_temp": [21, 23.4, 18, 20.1], 
                 "min_temp": [12.4, 13, 12.2, 15]}]}
```

Ergebnis: 

```
Data after Transform: {'_conf': {}, '_req': 
[{'max_temp': [21, 23.4, 18, 19.9], 'min_temp': [15.4, 13.7, 12, 14], 'max_temp_avg': 18, 'min_temp_avg': 12}, 
{'max_temp': [21, 23.4, 18, 20.1], 'min_temp': [12.4, 13, 12.2, 15], 'max_temp_avg': 18, 'min_temp_avg': 12.2}]}
```



## calculate_round

```json
"transform": [
  {
    "type": "transform_array",
    "array_key": "_req",
    "transform": [
      {
        "type": "calculate",
        "action": "round",
        "keys": [
          "_loop|wind_spd"
        ],
        "new_keys": [
          "_loop|wind_spd"
        ],
        "decimal": 2
      }
    ]
  }
]
```

Beispiel:

```python
data = {"_req": [{"wind_spd": 0.4142}, {"wind_spd": 1.4587}]}
```

Ergebnis:

```
Data after Transform: {'_conf': {}, '_req': 
[{'wind_spd': 0.41}, {'wind_spd': 1.46}]}
```



## calculate_mode

```json
"transform": [
  {
    "type": "transform_array",
    "array_key": "_req",
    "transform": [
      {
        "type": "calculate",
        "keys": [
          "_loop|code",
          "_loop|icon"
        ],
        "new_keys": [
          "_loop|str_code",
          "_loop|str_icon"
        ],
        "action": "mode"
      }
    ]
  }
]
```

Beispiel:

```
data = {"_req": [{"code": [201, 801, 801, 201, 500], "icon": [501, 801, 801, 201, 500]},
                 {"code": [801, 801, 801, 201, 500], "icon": [201, 501, 801, 201, 500]}]}
```

Ergebnis:

```
Data after Transform: {'_conf': {}, '_req': 
[{'code': [201, 801, 801, 201, 500], 'icon': [501, 801, 801, 201, 500], 'str_code': 201, 'str_icon': 801}, 
{'code': [801, 801, 801, 201, 500], 'icon': [201, 501, 801, 201, 500], 'str_code': 801, 'str_icon': 201}]}
```



## calculate_ms_to_kmh

Wandelt den angegebenen Wert von m/s in km/h um und rundet auf die 2. Nachkommastelle.

```json
"transform": [
  {
    "type": "transform_array",
    "array_key": "_req",
    "transform": [
      {
        "type": "calculate",
        "keys": [
          "_loop|wind_spd"
        ],
        "new_keys": [
          "_loop|str_wind_spd"
        ],
        "action": "ms_to_kmh",
        "decimal": 2
      }
    ]
  }
]
```

Beispiel: 

```python
data = {"_req": [{"wind_spd": 0.41}, {"wind_spd": 1.45}]}
```

Ergebnis: 

```
Data after Transform: {'_conf': {}, '_req': [{'wind_spd': 8.41, 'str_wind_spd': 30.28}, {'wind_spd': 1.45, 'str_wind_spd': 5.22}]}
```

