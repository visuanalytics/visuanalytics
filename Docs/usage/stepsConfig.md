# Steps Config 

Die JSON-Datei zu einem Job hat folgende Abschnitte:
```JSON
{
"id": 1,
"name": "name_des_videos",
"api": {},
"transform": [],
"storing": [],
"images": {},
"thumbnail": {},
"audio": {},
"sequence": {},
"run_config": [],
"presets": {}
}
```
Diese Abschnitte werden im folgenden näher beschrieben. Abgesehen von id und name gibt es mehrere Typen, aus denen bei 
den einzelnen ABschnitten ausgewählt werden kann, je nachdem wie das Video am ENde aussehen soll und wie die Daten 
verarbeitet und visualisiert werden sollen.

Doch zunächst werden grundlegende Funktionen dargestellt, die man bei der Zusammenstellung der JSON-Datei beachten muss.

## Datenzugriffe

### JSON-Ausgabe-Datei
Die JSON-Ausgabe-Datei enthält die ggf. modifizierte API-Antwort und die Konfigurationsparameter. D.h. sie stellt alle für 
die Video-Generierung benötigten und relevanten Daten bereit. Sie hat die folgenden zwei Abschnitte:

**_req**: 
In der JSON-Datei stehen die Daten aus der API-Antwort unter dem Abschnitt _req.

**_conf**: 
In der JSON-Datei stehen die Konfigurationsdaten, die bei der Job-Erstellung festgelegt und ausgewählt wurden unter dem Abschnitt _conf.

Die JSON-Ausgabe-Datei enthält die ggf. modifizierte API-Antwort und die Konfigurationsparameter. D.h. sie stellt alle für 
die Video-Generierung benötigten und relevanten Daten bereit.

### JSON-StepsConfig-Datei
In der JSON-StepsConfig-Datei wird angegeben wie die Daten, die aus der API-Antwort entnommen werden, verarbeitet werden sollen. 
Die Daten aus der API und die Konfigurationen, welche bei der Job-Erstellung festgelegt wurden, werden in einer JSON-Ausgabe-Datei gespeichert.
Um auf die Daten der API zugreifen und diese modifizieren zu können, werden in der JSON-StepsConfig-Datei "transform"-Typen verwendet.
Des Weiteren können auch Daten mit "images"-Typen visualisiert werden. 

Um auf die Daten der JSON-Ausgabe-Datei zuzugreifen und diese modifizieren zu können, gibt es verschiedene Methoden, 
je nachdem welche Datentypen, die jeweils benötigten Daten besitzen. 

Die verschiedenen Datenzugriffe werden im Folgenden aufgeführt und erläutert.


### Pfade

Es gibt einen Ordner "resources" in dem alle Bilder, Audiodateien, die API-Antworten im JSON-Format und weitere Dateien 
abgelegt werden können. Dieser Ordner ist der default-Ordner. Man muss also nur den Pfad innerhalb dieses Ordners abgeben. 
Es genügt also der relative Pfad, da im Hintergrund der Ordner festgelegt wurde. 

**Beispiel**:
```JSON
{
"path": "football/Matchday.png"
}
```

### string
Um auf einen string in der JSON-Ausgabe-Datei zuzugreifen, verwendet man folgende Syntax. 

Beispiel:
```JSON
{
"text": "{_req|text}",
"stopwords": "{_conf|stopwords}"
}
```

### boolean
Um auf einen boolean-Wert in der JSON-Ausgabe-Datei zuzugreifen, verwendet man folgende Syntax. 
Beispiel:
```JSON
{
"collocations": "_conf|collocations",
"color_func": "_conf|color_func"
}
```
### number
Um auf einen Zahlenwert (int, double, float) in der JSON-Ausgabe-Datei zuzugreifen, verwendet man folgende Syntax. 
Beispiel:
```JSON
{
"width": "_conf|width_wordcloud",
"height": "_conf|height_wordcloud"
}
```

### dict
Um auf ein Dictionary (dict) in der JSON-Ausgabe-Datei zuzugreifen, verwendet man folgende Syntax. 
Beispiel:
```JSON
{
"dict": "_conf|value"
}
```

### list
Um auf ein Array/eine Liste (list) in der JSON-Ausgabe-Datei zuzugreifen, verwendet man folgende Syntax. 
Beispiel:
```JSON
{
"list": "_conf|value"
}
```

### Typen

In der JSON-StepsConfig-Datei gibt es die Typen zu Anfang dieser Seite genannten Abschnitte. 

### Key/New Key
Um Daten in der JSON-Ausgabe-Datei zu verändern, verwendet kann die key/new_key-Syntax.
Man hat einen Text, den man verändern und neu abspeichern möchte. Dieser Text ist in der JSON-Ausgabe-Datei unter dem 
Key "text1" abgespeichert. Den modifizierten Text kann man nun wieder unter "text1" abspeichern, indem man keinen neuen Key mit "new_key" angibt. 
Dann ist der default-Speicherplatz an der Stelle "text1". Der alte Wert (in diesem Fall ein Text) wird also überschrieben.
Um die Daten zu ergänzen anstatt sie zu Überschreiben, wird der "new_key" verwendet, z.B. mit dem Wert "text_modifiziert".

**Beispiel**:
```JSON
{
    "type": "append",
    "key": "_loop|text1",
    "new_key": "_req|text_transformed"
}
```
## Api


Die im folgenden aufgeführten Typen dienen zur Anfrage von Daten, welche an API-Schnittstellen gesendet werden. Diese
werden Request genannt. Die Antwort der API wird Response genannt und besteht aus einer JSON-Datei mit den angeforderten
Daten der API. Die Responses können auch .csv-Dateien sein.

### request

Führt eine **https**-Request durch.

**Beispiel** 

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

### request_multiple

<!-- TODO Description-->

Führt mehrere **https**-Requests durch. Die Request bleibt gleich bis auf einen Wert der sich ändert.
Z.B. werden die Wetterdaten mehrerer einzelner Städte angefragt.

**Beispiel** 

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

### request_multiple_custom

Führt mehrere **https**-Requests (zu Deutsch: Anfrage) durch. Man kann jeden anderen Request-Typen verwenden, der

**Beispiel** 

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

### input

<!--TODO-->

### request_memory

<!--TODO-->

## Transform

`transform`-Typen sind Funktionen zum Bearbeiten der Daten der API-Antwort zu verarbeiten. 
Die Daten können verändert oder entfernt werden, neue Daten können hinzugefügt werden.

### transform

Führt alle angegebenen `transform`-Typen für alle Werte eines Arrays oder eines Dictionaries aus. 
Dem `transform` wird entweder ein `transform_array` oder ein `transform_dict` vorangestellt. 

**Beispiel** 

```JSON
{
   "type": "transform_dict",
   "dict_key": "_req",
   "transform": [
      {
       "type": "select",
       "relevant_keys": [
           "data"
       ]
      },
      {
       "type": "select_range",
       "array_key": "_loop|data",
       "range_start": 0,
       "range_end": 5
      }
   ]
} 
```

Im Beispiel werden für das Dictionary (siehe `transform_dict`) mit dem Key `_req` (in der JSON-Ausgabedatei) die 
`transform`-Typen `select` und `select_range` durchgeführt. Es wird mit einer Schleife durch alle Werte der Ebene unter 
`dict_key` gelaufen und die `transform`-Typen werden auf diese Daten angewandt.

### transform_array

Führt alle angegebenen `transform`-Typen für alle Werte eines Arrays aus. 

**Beispiel** 

```JSON
{
  "type": "transform_array",
  "array_key": "key",
  "transform": []
}
```

**`array_key`**:

str - Keys zu einem Array, welches durchlaufen werden soll und auf dessen Werte die `transform`-Typen angewandt werden sollen.

**`transform`**:

`transform`-Typen, die für alle Werte des - unter `array_key` angegebenen - Arrays ausgeführt werden sollen.

### transform_dict

Führt alle angegebenen `transform`-Typen für alle Werte eines Dictionaries aus. 

**Beispiel** 

```JSON
{
  "type": "transform_dict",
  "dict_key": "key",
  "transform": []
}
```

**`dict_key`**:

str - Keys zu einem Dictionary, welches durchlaufen werden soll und auf dessen Werte die `transform`-Typen angewandt werden sollen.

**`transform`**:

`transform`-Typen, die für alle Werte des - unter `dict_key` angegebenen - Dictionaries ausgeführt werden sollen.

### calculate

calculate beinhaltet Actionen (actions), die Funktionen für mathematische Berechnungen zur Verfügung stellen.
Für alle calculate-Actions gilt:

**`keys`** :

Die Werte, die durchlaufen und transformiert werden sollen. 

**`new_keys`**_optional_:

optional - Die tranformierten Werte werden unter diesem Key neu gespeichert. 
Ist `new_keys` nicht vorhanden, werden die Werte in `keys` mit den transformierten Werten überschrieben.

#### mean

Berechnet den Mittelwert von Werten, die in einem Array stehen. 

**Beispiel** 

```JSON
{
    "type": "calculate",
    "action": "mean",
    "keys": [
       "_loop|max_temp"
    ],
    "new_keys": [
       "_loop|temp_avg"
    ]
}
```

**`decimal`**_optional_: 

int - Nachkommastelle, auf die der Durchschnittswert gerundet werden soll.

Default: 0. (keine Nachkommastelle)

#### max

Findet den Maximalwert von Werten, die in einem Array stehen.

**Beispiel** 

```JSON
{
    "type": "calculate",
    "action": "max",
    "keys": [
       "_loop|max_temp"
    ],
    "new_keys": [
       "_loop|temp_max"
    ],
    "save_idx_to": [
       "_loop|temp_highest_max_city"
    ]
}
```

**`save_idx_to`**_optional_:

int - Der Index vom Durchlaufen der Schleife (_loop) wird als Zahlenwert unter dem genannten `save_idx_to`-Key gespeichert.
Dient z.B. dazu auf eine vorherige Ebene in der JSON-Struktur zugreifen zu können. 

#### min

Findet den Minimalwert von Werten, die in einem Array stehen.

**Beispiel** 

```JSON
{
    "type": "calculate",
    "action": "min",
    "keys": [
       "_loop|min_temp"
    ],
    "new_keys": [
       "_loop|temp_min"
    ],
    "save_idx_to": [
       "_loop|temp_min_city",
       "_loop|temp_lowest_max_city"
    ]
}
```

**`save_idx_to`**_optional_:

int - Der Index vom Durchlaufen der Schleife (`_loop`) wird als Zahlenwert unter dem genannten `save_idx_to`-Key gespeichert.
Dient z.B. dazu auf eine vorherige Ebene in der JSON-Struktur zugreifen zu können. 


#### round

Rundet gegebene Werte auf eine gewünschte Nachkommastelle.

**Beispiel** 

```JSON
{
    "type": "calculate",
    "action": "round",
    "keys": [
        "_loop|temp_avg",
        "_loop|max_temp",
        "_loop|min_temp"
     ],
     "decimal": 3
}
```

**`decimal`**_optional_: 

int - Nachkommastelle, auf die der Durchschnittswert gerundet werden soll.

Default: 0. (keine Nachkommastelle)


#### mode

Bestimmt den am häufigsten in einem Array vorkommenden Wert.

**Beispiel** 

```JSON
{
    "type": "calculate",
    "action": "mode",
    "keys": [
        "_loop|code"
    ],
     "new_keys": [
        "_loop|new_code"
    ]
}
```

#### Grundrechenarten

Die Aktionen `multiply`, `divide`, `subtract` und `add` sind gleich aufgebaut. Daher haben die Keys auch die gleiche Bedeutung.
Als Standard ist der Wert zu `keys` immer auf der linken Seite der Gleichung. Alternativ: `keys_right`.

**`keys_right`**_optional_: 

Datenzugriff auf Daten/Werte, die auf der rechten Seite der Gleichung stehen sollen. Wichtig: bei `divide` und `subtract`.

**`value_right`**_optional_: 

Wert, der immer auf der rechten Seite der Gleichung stehen soll. Wichtig: bei `divide` und `subtract`.

**`value_left`**_optional_: 

Wert, der immer auf der linken Seite der Gleichung stehen soll. Wichtig: bei `divide` und `subtract`.

**`decimal`**_optional_: 

int - Nachkommastelle, auf die das Ergebnis gerundet werden soll. 

Default: 0. (keine Nachkommastelle)


##### multiply

Multipliziert gegebene Werte mit Werten, die in `multiply_by` stehen. Es kann optional auf die gewünschte Nachkommastelle,
die unter `decimal` angegeben wird, gerundet werden.

**Beispiel** 

```JSON
{
    "type": "calculate",
    "keys": [
        "_loop|number1"
    ],
    "action": "multiply",
    "value_right": 3.6,
    "decimal": 2
}
```

##### divide

Dividiert gegebene Werte durch Werte, die in `divide_by` stehen. Es kann optional auf die gewünschte Nachkommastelle,
die unter `decimal` angegeben wird, gerundet werden.

**Beispiel** 

```JSON
{
    "type": "calculate",
     "keys": [
         "_loop|number1"
     ],
     "action": "divide",
     "value_right": 3.6,
     "decimal": 2
}
```

##### subtract

Die jeweiligen Werte, die in `subtract` stehen, werden von den Werten, die in key stehen, subtrahiert. Es kann optional 
auf die gewünschte Nachkommastelle, die unter `decimal` angegeben wird, gerundet werden.

**Beispiel** 

```JSON
{
    "type": "calculate",
    "keys_right": [
        "_loop|number1"
    ],
    "action": "subtract",
    "value_left": 3.6,
    "decimal": 2
}
```

##### add

Die jeweiligen Werte, die in `add` stehen, werden zu den Werten, die in key stehen, hinzuaddiert. Es kann optional auf 
die gewünschte Nachkommastelle, die unter `decimal` angegeben wird, gerundet werden.

**Beispiel** 

```JSON
{
    "type": "calculate",
    "keys": [
        "_loop|number1"
    ],
    "action": "add",
    "value_right": 3.6,
    "decimal": 2
}
```

### select

`select` entfernt alle Keys, die nicht in `"relevant_keys"` stehen aus dem Dictionary bzw. der JSON-Ausgabe-Datei.

Mit `select` kann man sich also die Key/Value-Paare aus der API-Antwort herausziehen, die für das zu erstellende Video 
relevant sind. 

**Beispiel** 

```JSON
{
  "type": "select",
  "array_key": "data",
  "relevant_keys": [
      "key1",
      "key2"
  ]
}
```

**`array_key`**:

str - Angabe, in welcher Ebene in der JSON-Ausgabe-Datei, die `relevant_keys` zu finden sind.

**`relevant_keys`**: 

str-Array - Namen der Keys, dessen Key/Value-Paare aus der API-Antwort übernommen werden und in die JSON-Ausgabe-Datei 
eingefügt werden sollen.


### delete

Entfernt Key/Value-Paare aus der JSON-Ausgabe-Datei.

**Beispiel** 

```JSON
{
  "type": "delete",
  "keys": [
      "key1",
      "key2"
  ]
}
```

**`keys`**: 

str-Array - Namen der Keys, dessen Key/Value-Paare aus der JSON-Ausgabe-Datei entfernt werden sollen.


### select_range

Entfernt alle Werte aus `array_key`, die nicht innerhalb der von `range_start` und `range_end` liegen.

**Beispiel** 

```JSON
{
          "type": "select_range",
          "array_key": "_loop|data",
          "range_start": 0,
          "range_end": 5
}
```

**`array_key`**:

str - Angabe, aus welcher Ebene in der JSON-Ausgabe-Datei, die Daten ausgewählt werden sollen.

**`range_start`**_optional_:

int - Startwert für die Schleife durch die Daten.

Default: 0. 

**`range_end`**:

int - Endwert für die Schleife durch die Daten.


### append

Speichert den Wert, der unter `key` steht, in einem Array.

**Beispiel** 

```JSON
{
  "type": "append",
  "key": "key",
  "new_key": "new_key",
  "append_type": "list"
}
```

**`key`**:

Name des Keys zum Wert, der in ein neues Array gespeichert werden soll. 

**`new_key`**_optional_:

Name des Arrays unter dem die neuen Werte (Wert unter `key`) gespeichert werden sollen.

**`append_type`**_optional_:

"list" oder "string" - Datentyp der Werte, die in einem Array gespeichert werden sollen.

Default: "list".

**`delimiter`**_optional_:

str - Zeichen mit dem die Werte - im Falle des Datentyps String - voneinander getrennt werden sollen.

Default: " " (Leerzeichen).

### add_symbol

`add_symbol` setzt ein Zeichen, ein Wort, einen Satzteil oder ganze Sätze hinter oder vor den Wert von dem Key, welcher
unter `keys` steht. Man kann damit auch einen Wert vom alten Key unter `keys` in einen neuen Key unter `new_keys` kopieren.
Unter `{_key}` wird dann der Wert zum Key aus `keys` eingefügt.

**Beispiel** 

```JSON
{
  "type": "add_symbol",
  "keys": [
    "key"
  ],
  "new_keys": [
    "new_key"
  ],
  "pattern": "{_key} test"
}
```

**`pattern`**:

str - String mit `{_key}` und/oder auch nur einem Satz/Wort/Zeichen o.Ä. der/das eingefügt werden soll unter `new_keys`.

**Beispiel**

```JSON
{
  "type": "add_symbol",
  "keys": [
      "max_temp"
  ],
  "new_keys": [
      "max_temp_text"
  ],
  "pattern": "Heute werden Temperaturen von {_key}° Celsius erreicht."
}
```

`{_key}` wird durch eine Temperatur ersetzt, die unter dem Key `max_temp` in `keys` steht und der neue Satz wird unter 
dem Key `max_temp_text` in `new_keys` gespeichert. 


### replace
Ersetzt ein Zeichen, Symbol, Wort, einen Satz oder eine ganzen Text in einem String.

`replace` ersetzt einen String, der in `old_value` angegeben ist, mit einem String, der in `new_value` angegeben ist.
Der Wert, der unter `keys` gespeichert ist, wird verändert und in einem neuen Key (angegeben unter `new_keys`) gespeichert.
count gibt an, wie oft in dem Value der old_value gegen den new_value ersetzt werden soll.

**Beispiel** 

```JSON
{
  "type": "replace",
  "keys": [
      "key"
  ],
  "new_keys": [
      "new_key"
  ],
  "old_value": ".",
  "new_value": ",",
  "count": 1
}
```

**`old_value`**:

str - Zeichen, Symbol, Wort, einen Satz oder eine ganzen Text, der ersetzt werden soll.

**`new_value`**:

str - Zeichen, Symbol, Wort, einen Satz oder eine ganzen Text, der den `old_value` ersetzen soll.

**`count`**_optional_:

int - Gibt an, wie oft der `old_value` in dem Wert mit dem `new_value` ersetzt werden soll.

Default: -1. 


### translate_key

Setzt den Wert eines Keys zu einem neuen Key als Wert für die JSON. Dieser neue Wert steht in einem Dictionary. 

**Beispiel** 

```JSON
{
          "type": "translate_key",
          "keys": [
            "_loop|weather|code"
          ],
          "new_keys": [
            "_loop|weather|str_code_short"
          ],
          "dict": {
            "key1": "Gewitter",
            "key2": "Sonne",
            "key3": "Regen"
          }
}
```

**`dict`**:

dict - Ein Dictionary mit bekannten Keys, welche unter `keys` stehen und den Werten, die anstelle dieser Keys neu abgespeichert werden sollen.


### alias

Erstzt einen Key durch einen neuen Key (Änderung des Key-Namens).

**Beispiel** 

```JSON
{
  "type": "alias",
  "keys": [
      "key"
   ],
  "new_keys": [
      "new_key"
  ]
}
```

### regex

regex - regular expression (zu Deutsch: regulärer Ausdruck)
Führt re.sub für die angegebenen Werte aus. Der String unter `regex` darf keinen Backslash (\) enthalten, da JSON keine Regex.

**Beispiel** 

```JSON
{
  "type": "regex",
  "keys": [
      "keys"  
  ],
  "regex": "[.]+",
  "replace_by": ","
}
```
Dieses Beispiel sucht alle . und ersetzt diese mit einem ,
Durch das + soll mindestens ein . ersetzt werden.

**Beispiel (mehrere Zeichen)** 

```JSON
{
  "type": "regex",
  "keys": [
      "keys"  
  ],
  "regex": "[al]",
  "replace_by": "XX"
}
```
In diesem Beispiel werden in einem String die Buchstaben a und l gesucht und jedes a und jedes l wird mit jeweils einem XX ersetzt.

**Beispiel (or)** 

```JSON
{
  "type": "regex",
  "keys": [
      "keys"  
  ],
  "regex": "ll|ss",
  "replace_by": "xx"
}
```

In diesem Beispiel werden in einem String ll oder ss gesucht und durch xx ersetzt.

**Beispiel (ends with a specific character)** 

```JSON
{
  "type": "regex",
  "keys": [
      "keys"  
  ],
  "regex": "o$",
  "replace_by": "END"
}
```

In diesem Beispiel wird das Ende eines Strings betrachtet. Endet das Wort mit einem o so wird das o durch END ersetzt.


**Beispiel (start with a specific character)** 

```JSON
{
  "type": "regex",
  "keys": [
      "keys"  
  ],
  "regex": "^H|T",
  "replace_by": "START"
}
```

In diesem Beispiel wird der Anfang eines Strings betrachtet. Beginnt das Wort mit dem Buchstaben H oder T, so wird 
dieser Buchstabe jeweils durch START ersetzt.

**Beispiel (character set)** 

```JSON
{
  "type": "regex",
  "keys": [
      "keys"  
  ],
  "regex": "[0-9]",
  "replace_by": " "
}
```

In diesem Beispiel wird jede Zahl in einem String durch ein Leerzeichen ersetzt.

**`regex`**

str - Beinhaltet den regulären Ausdruck. Oben sind einige Beispiele genannt. 
Der String unter regex darf keine Backslashes (\) enthalten.

**`replace_by`**

str - Zeichen mit denen der reguläre Ausdruck im String ersetzt werden soll.

### Uhrzeit und Datum

Im folgenden werden einige transform-Typen für Uhrzeit- und Datumsformate näher erläutert. 
Für alle diese Typen gilt:

**`keys`**:

str-Array - Keys unter denen die Uhrzeit bzw. die Daten als Werte stehen. 

**`new_keys`**:

str-Array - Keys unter denen die umgeformte Uhrzeit bzw. die Daten als Werte stehen sollen.

**`format`**:

str - Das Format, in das die Uhrzeit bzw. das Datum umgewandelt werden soll.

**`given_format`**:

str - Das Format, in dem die Uhrzeit bzw. das Datum angegeben sind.

**`zeropaded_off`**:

bool - `True`: Entfernt die 0 am Anfang einer Zahl. `False` (default): Die 0 am Anfang einer Zahl bleibt stehen. Könnte zu Fehlaussprache bei der Umwandlung von Text zu Sprache führen.
`zeropaded_off` ist True, wenn z.B. aus 05. Mai 2020 -> 5. Mai 2020 werden soll.

**Beispiele für Formate**:

Für die Implementierung der Typen wurde die Python-Bibliothek **datetime** verwendet. 
Beispiele für die Darstellung von Datum und Uhrzeit finden Sie unter: https://docs.python.org/3/library/datetime.html

Einige gängige Formate sind:

|        Format        |       Beispiel       |
|------------------------|--------------------------|
|%Y-%m-%dT%H:%M:%S|2020-05-15T23:56:05|
|%H:%M:%S|23:56:05|
|%Y-%m-%d|2020-05-15|
|%d.%m.%Y|15.05.2020|
|On the %dth of %b %Y|On the 15th of May 2020|

#### date_format

`date_format` ändert das vorliegende Format des Datums und der Uhrzeit, welches unter `given_format` angegeben wird, in 
ein gewünschtes anderes Format, welches unter `format` angegeben wird.

**Beispiel** 

```JSON
{
  "type": "date_format",
  "keys": [
      "key"
  ],
  "new_keys": [
      "new_key"
  ],
  "given_format": "%Y-%m-%dT%H:%M:%S",
  "format": "%Y-%m-%d"
}
```

#### timestamp

`timestamp` wandelt Datumsangaben, welche im UNIX-Timestamp-Format angegeben sind, in das unter `format` angegebene Format
um. Unter `keys` sind die Keys angegeben unter denen als Werte Datumsangaben im UNIX-Timestamp-Format stehen. Unter
`new_keys` werden die Keys angegeben zu denen das Datum mit dem gewünschten Format als Wert gespeichert werden soll.


**Beispiel** 

```JSON
{
  "type": "timestamp",
  "keys": [
      "key"
  ],
  "new_keys": [
      "new_key"
  ],
  "format": "%H Uhr %M",
  "zeropaded_off": true
}
```

Achtung: Kein `given_format`-Key. Da das `given_format` ein Zeitstempel ist.

#### date_weekday

`date_weekday` wandelt das angegebene Datum, im unter `"given_format"` angegebenen Format, in den jeweiligen Wochentag zum Datum um.

**Beispiel** 

```JSON
{
  "type": "date_weekday",
  "keys": [
      "key"
   ],
  "new_keys": [
      "new_key"
  ],
  "given_format": "%Y-%m-%d"
}
```

Achtung: Kein `format`-Key. Da das `format` ein String mit dem Wochentag ist.

#### date_now

`date_now` gibt das heutige (aktuelle) Datum in dem Format aus, welches als Wert unter dem Key `format` angegeben ist.

**Beispiel** 

```JSON
{
  "type": "date_now",
  "new_key": "new_key",
  "format": "%Y-%m-%d"
}
```

Achtung: Kein `given_format`-Key und kein `keys`-Key, da der Typ sich die aktuelle Uhrzeit vom Betriebssystem holt. 
Diese haben immer dasselbe Format.

### wind_direction

`wind_direction` ist eine Funktion, die ausschließlich zum Umwandeln der Windrichtung aus der Weatherbit-API verwendet wird.
Die englischen Wörter werden auf Deutsch übersetzt.

**Beispiel** 

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

**`dict`**:

dict - Enthält die Übersetzungen der Wörter von Englisch zu Deutsch.

**`delimiter`**:

str - Trennzeichen. Z.B. "south-southwest", zuerst wird south übersetzt und dann southwest.


### loop

Durchläuft das angegebene Array und führt für jedes Element die angegebenen `transform`-Typen aus. Es muss nicht immer das
gesamte Array durchlaufen werden, will man nur bestimmte Werte verarbeiten, so kann man in `loop` festlegen, welche 
Werte des Arrays verarbeitet werden sollen und diese werden entweder direkt angegeben mit `values` oder man gibt einen 
Bereich an mit `range_start` und `range_stop` (siehe Beispiele).

**Beispiel (values)** 

```JSON
{
  "type": "loop",
  "values": [1, 2, 3],
  "transform": []
}
```

**`values`**:

int-Array - Bestimmte Werte, welche in der Schleife durchlaufen werden sollen. 

**`transform`**:

`transform`-Typen, die für alle Werte des Arrays ausgeführt werden sollen.

**Beispiel (range)** 

```JSON
{
  "type": "loop",
  "range_start": 0,
  "range_stop": 10,
  "transform": []
}
```

**`range_start`**:

int - Beginn des Bereichs, welcher in der Schleife durchlaufen werden soll. 

Default: 0.

**`range_stop`**:

int - Ende des Bereichs, welcher in der Schleife durchlaufen werden soll. 

**`transform`**:

`transform`-Typen, die für alle Werte des Arrays ausgeführt werden sollen.


### add_data

`add_data` fügt den Daten ein neues Key/Value-Paar hinzu. Der gewünschte Wert wird unter `pattern` eingetragen und an die Stelle
`new_key` kommt der Key-Name, unter dem der neue Wert gespeichert werden soll.

**Beispiel** 

```JSON
{
  "type": "add_data",
  "new_key": "new_data",
  "pattern": "new values"
}
```

**`new_key`**:

str - Name des Keys unter dem der neue Wert gespeichert werden soll. 

**`pattern`**:

str - Neuer Wert, der abgespeichert werden soll. 


### copy

Der Wert aus einem Key wird kopiert und als ein Wert eines neuen Keys gesetzt.

**Beispiel** 

```JSON
{
          "type": "copy",
          "keys": [
            "_loop|TeamInfoId"
          ],
          "new_keys": [
            "_temp|TeamInfos"
          ]
        }
```

`new_keys` ist hier nicht optional. Der neue Key wird benötigt, da sonst der alte Key mit den Daten überschrieben wird, 
die er sowieso enthält. Zum Beispiel können Werte so an einem anderen Ort gespeichert oder der Key kann umbenannt werden.

Alternativ kann der Typ `replace` ohne `{_key}` im `pattern` verwendet werden.
Der Typ `alias` kann zum Umbenennen des Key-Names verwendet werden.


### option

Führt die aufgeführten `transform`-Typen aus, je nachdem ob ein bestimmter Wert `true` oder `false` ist.

Wenn der Wert, der in `check` steht `true` ist, werden die `transform`-Typen ausgeführt,
die unter `on_true` stehen.

Wenn der Wert, der in `check` steht `false` ist, werden die `transform`-Typen ausgeführt,
die unter `on_false` stehen.

```JSON
 {
          "type": "option",
          "check": "_loop|MatchIsFinished",
          "on_true": [],
          "on_false": []
        }
```

**`check`**:

bool - Der Wert, der auf true bzw. false getestet werden soll. 

**`on_true`**:

`transform`-Typen, die für alle Werte des Arrays/Dictionaries ausgeführt werden sollen, wenn der Wert unter `check` `true` ist.

**`on_false`**:

`transform`-Typen, die für alle Werte des Arrays/Dictionaries ausgeführt werden sollen, wenn der Wert unter `check` `false` ist.


### compare

Führt die aufgeführten `transform`-Typen aus, je nachdem ob zwei Werte gleich sind oder der eine größer oder kleiner als der andere ist.

Folgende Vergleiche werden durchgeführt:

`value_left` = `value_right` (für `on_equal` und `on_not_equal`) 
`value_left` > `value_right` (für `on_higher`)
`value_left` < `value_right` (für `on_lower`)

**Beispiel** 

```JSON
 {
    "type": "compare",
    "value_left": "_loop|MatchResults|PointsTeam1",
    "value_right": "_loop|MatchResults|PointsTeam2",
    "on_equal": [],
    "on_higher": [],
    "on_lower": []
}  
```

**Beispiel** 

```JSON
 {
    "type": "compare",
    "value_left": "_loop|MatchResults|PointsTeam1",
    "value_right": "_loop|MatchResults|PointsTeam2",
    "on_equal": [],
    "on_not_equal": []
}  
```

**`value_left`**:

Wert der auf der linken Seite beim Vergleich steht.

**`value_right`**:

Wert der auf der rechten Seite beim Vergleich steht.

**Vergleichsmöglichkeiten:**

Eine der folgenden Möglichkeiten sollte angegeben werden, sonst passiert generell keine Umwandlung der Daten.

**`on_equal`**_optional_:

`transform`-Typen, die für alle Werte des Arrays/Dictionaries ausgeführt werden sollen, wenn der Wert unter 
`value_left` gleich dem Wert unter `value_right` ist.

**`on_not_equal`**_optional_:

`transform`-Typen, die für alle Werte des Arrays/Dictionaries ausgeführt werden sollen, wenn der Wert unter 
`value_left` nicht gleich dem Wert unter `value_right` ist.

Optional: Zum Beispiel, wenn es egal ist, ob `value_left` größer oder kleiner ist als `value_right`.

**`on_higher`**_optional_:

`transform`-Typen, die für alle Werte des Arrays/Dictionaries ausgeführt werden sollen, wenn der Wert unter 
`value_left` größer als der Wert unter `value_right` ist.

Optional: Zum Beispiel, wenn es egal ist, ob `value_left` größer oder kleiner ist als `value_right`, dann kann `on_not_equal` verwendet werden.

**`on_lower`**_optional_:

`transform`-Typen, die für alle Werte des Arrays/Dictionaries ausgeführt werden sollen, wenn der Wert unter 
`value_left` kleiner als der Wert unter `value_right` ist.

Optional: Zum Beispiel, wenn es egal ist, ob `value_left` größer oder kleiner ist als `value_right`, dann kann `on_not_equal` verwendet werden.

### random_value

Wählt zufällig einen Wert aus einem Array oder einem Dictionary mit verschiedenen Werten aus.

**Beispiel** 
```JSON
{
     "type": "random_value",
     "keys": [
        "_req|Text"
     ],
     "array": [
        "Text 1 ",
        "Text 2 ",
        "Text 3 ",
        "Text 4 "
     ],
     "new_keys": [
        "_req|Text_finally"
     ]
}
```
**`array`**

array - Das Array enthält verschiedene Werte aus denen zufällig ein Wert ausgewählt werden soll.

**Beispiel** 
```JSON
{
     "type": "random_value",
     "keys": [
         "_loop|Text|201"
     ],
     "dict": {
        "200": [
           "kommt es zu Gewittern mit leichtem Regen",
           "ist mit Gewitter und leichtem Regen zu rechnen"
        ],
        "201": [
           "kommt es zu Gewittern mit Regen",
           "ist mit Gewitter und Regen zu rechnen"
        ],
        "202": [
           "kommt es zu Gewittern mit starkem Regen",
           "ist mit Gewitter und starkem Regen zu rechnen"
        ]
     }
}
```

**`dict`**

dict - Das Dictionary enthält mögliche Keys mit verschiedenen Werten aus denen zufällig ein Wert ausgewählt werden soll. 
In diesem Beispiel erhält man einen Zahlencode und je nachdem welcher Zahlencode verwendet werden soll, wird aus dem dazugehörigen Werte-Array ein Wert ausgewählt.

In diesem Beispiel muss der gewünschten Key des Dictionaries angegeben werden, damit aus dessen Werte-Array ein Wert ausgewählt werden kann.


### convert

<!--TODO-->

**Beispiel** 

```JSON
{
  "type": "convert",
  "keys": [
      "key"
  ],
  "to": "",
  "new_keys": [
      "new_key" 
  ]
}
```

**`keys`**:

<!--TODO-->

**`to`**:

<!--TODO-->

**`new_keys`**:

<!--TODO-->

### sort

`sort` sortiert die Einträge eines Arrays, Arrays bestehend aus Tupeln oder Dictionaries nach der Größe der jeweiligen Zahlen.
Es kann auch alphabetisch sortiert werden, wenn die Einträge keine Zahlen sind.

```JSON
{
  "type": "sort",
  "keys": [
     "key"
  ],
  "new_keys": [
     "new_key"  
  ],
  "reverse": true
}
```

**`reverse`**

bool - True: Die Liste soll absteigend sortiert werden (größte Zahl als Erstes). False: Die Liste soll aufsteigend 
sortiert werden (kleinste Zahl als Erstes).

Default: False.

### most_common

`most_common` betrachtet ein Array oder einen String und zählt die Häufigkeit der jeweils darin vorkommenden Wörter.

Beispiel: "Der Hund sucht die Katze und die Katze sucht die Maus."

der: 1, Hund: 1, sucht: 2, die: 3, Katze: 2, und: 1, Maus: 1

**Beispiel** 

```JSON
{
  "type": "most_common",
  "keys": [
    "_req|text_all"
  ],
  "new_keys": [
    "_req|text_all_counter"
  ]
}
```

### sub_lists

`sub_lists` geht durchläuft eine Liste und sucht sich bestimmte Teile dieser Liste heraus, um daraus kleinere Listen zu erhalten.

Beispiel: Hund, Katze, Maus, Garage, Hoftor, Tür, Fenster

Daraus wollen wir zwei Listen machen: Die ersten 3 Einträge sollen in die erste Liste und die anderen 4 Einträge in eine zweite Liste.

**Beispiel** 

```JSON
{
  "type": "sub_lists",
  "array_key": "_req|text_all_counter",
  "sub_lists": [
    {
      "new_key": "_req|Tiere",
      "range_start": 0,
      "range_end": 2
    },
    {
      "new_key": "_req|Haus",
      "range_start": 3,
      "range_end": 6
    }
  ]
}
```

**`array_key`**:

str - Enthält den Key zum Array, von dem die Unterlisten erstellt werden sollen.

**`sub_lists`**:

Pro Unterliste wird eine new_key/range_start/range_end-Struktur hinzugefügt.

**`range_start`**_optional_:

int - Listeneintrag ab dem die Unterliste generiert werden soll.

Default: 0.

**`range_end`**:

int - Listeneintrag bis zu dem die Unterliste generiert werden soll.

### to_dict

`to_dict` wandelt die gegebenen Werte in ein Dictionary um.

**Beispiel** 

```JSON
{
  "type": "to_dict",
  "keys": [
      "key"
  ],  
  "new_keys": [
      "new_key" 
  ]
}
```

### join

`join` nimmt alle Einträge eines Dictionaries, Arrays oder eines Tupels und verbindet sie mit einem Delimiter 
(Trennzeichen, z.B. Komma, Punkt oder Leereichen) zu einem String.

```json
{
  "type": "join",
  "keys": [
    "_conf|hashtags"
  ],
  "new_keys": [
    "_req|text_hashtags"
  ],
  "delimiter": ", "
}
```

**`delimiter`**:

str - Trennzeichen zum Trennen der einzelnen Einträge in einem String. Z.B. . , ; : - + 

### length

`length` gibt die Anzahl der Elemente eines Arrays/einer Liste aus, falls der Wert ein Array ist.
Ist der Wert ein String, so wird die Anzahl der Zeichen des Strings ausgegeben.

```json
{
  "type": "length",
  "keys": [
    "_conf|hashtags"
  ],
  "new_keys": [
    "_req|hashtags_len"
  ]
}
```


### remove_from_list

Es werden bestimmte Wörter von einer Liste bzw. aus einem Array entfernt.

Bei der Erstellung einer Wordcloud werden diese Wörter Stopwords genannt. Somit kann z.B. vom Ersteller der Videos 
gewährleistet werden, dass gewisse Beleidigungen oder "böse Wörter" nicht angezeigt werden können.
Die Funktion wurde für die Vermeidung von Wörtern in der Wordcloud eingebaut, da man keinen Einfluss darauf hat, was
manche Menschen auf Twitter posten.

Es ist egal, wie die Wörter vom Ersteller der Videos angegeben wurden, sie werden auch entfernt, wenn die Groß- und
Kleinschreibung anders verwendet wurde. Bei Vertippen und Rechtschreibfehlern werden die Wörter nicht als Stopwords
erkannt und sie können in der Wordcloud auftauchen.

Bei der Erstellung der JSON können zusätzlich im Resources-Ordner unter stopwords/stopwords.txt solche Wörter hinterlegt
werden, sodass sie nicht bei der Joberstellung im Frontend jedes Mal neu eingegeben werden müssten. Dort können zusätzlich
jede immer Wörter eingegeben werden, die neben den Wörtern in der Textdatei entfernt werden sollen.

**Beispiel**

```JSON
{
      "type": "remove_from_list",
      "keys": [
        "_req|text_all"
      ],
      "to_remove": "_conf|stopwords",
      "use_stopwords": true,
      "ignore_case": true
}
```

**`to_remove`**:

Array - Eine Liste mit Wörtern, die aus einem String oder einer anderen Liste entfernt werden sollen.

**`use_stopwords`**:

bool - Sollen die Stopwords, die in der Datei stopwords/stopwords.txt stehen aus dem String oder der Liste entfernt werden?

`true`: Stopwords aus der Datei stopwords/stopwords.txt entfernen.

`false`: Stopword aus der Datei stopwords/stopwords.txt nicht entfernen.

Default: `false`.

**`ignore_case`**:

bool - Sollen die Wörter die entfernt werden, auch dann entfernt werden, wenns sie eine andere Groß- bzw. Kleinschreibung besitzen?

`true`: Ja, auch entfernen, wenn sie eine andere Groß- bzw. Kleinschreibung besitzen.

`false`: Nein, die Wörter nur entfernen, wenn sie genau so geschrieben werden, wie sie in `to_remove` bzw. im Frontend und in der Textdatei geschrieben wurden.

Default: `false`.

### lower_case

Jedes Wort in dem Array wird komplett in Kleinbuchstaben geschrieben.

**Beispiel**

```JSON
{
  "type": "lower_case",
  "keys": [
    "_conf|array"
  ],
  "new_keys": [
    "_req|array_lower_case"
  ]
}
```

### upper_case

Jedes Wort in dem Array wird komplett in Großbuchstaben geschrieben.

**Beispiel**

```JSON
{
  "type": "upper_case",
  "keys": [
    "_conf|array"
  ],
  "new_keys": [
    "_req|array_upper_case"
  ]
}
```

### capitalize

Der erste Buchstabe jedes Worts in dem Array wird groß geschrieben.

**Beispiel**

```JSON
{
  "type": "capitalize",
  "keys": [
    "_conf|array"
  ],
  "new_keys": [
    "_req|array_capitalized"
  ]
}
```

### normalize_words

Wörter, welche öfter in einem Array vorkommen, jedoch unterschiedlich in ihrer Klein- bzw. Großschreibung sind, sollen
für die Zählung der Häufigkeit und der Darstellung in der Wordcloud vereinheitlicht werden.

Ein Array wird durchlaufen und jedes Wort, welches beim zweiten Vorkommen anders geschrieben wurde als das Wort beim
ersten Vorkommen, wird dann so geschrieben wie das Wort als es das erste Mal vorgekommen ist.

**Beispiel**

**Vorher**: Bundesliga, VfL, sport, bundesliga, BundesLIGA, BUNDESLIGA, Sport, vfl

**Nachher**: Bundesliga, VfL, sport, Bundesliga, Bundesliga, Bundesliga, sport, VfL


**Beispiel**

```JSON
{
  "type": "normalize_words",
  "keys": [
    "_conf|array"
  ],
  "new_keys": [
    "_req|array_normalized"
  ]
}
```


## Storing

Mit Hilfe von Storing können ganze Dictionarys oder auch einzelne Werte in Dateien gespeichert werden
und in einem späterem Durchlauf des Programms wieder eingelesen werden

```JSON
{
  "storing": [
    {
      "name": "table",
      "key": "_req|Tabelle",
      "exclude": [
        "Text",
        "Rank_diff"
      ]
    },
    {
      "name": "spieltag",
      "key": "_req|Spieltag"
    }
  ]
}

```

**`name`**:  
str - Frei zu wähender Name des zu Exportierenden Dicts oder values (dieser Name wird später wieder zum importieren benötigt)

**`key`**:  
str - Angabe des Keys welcher exportiert werden soll

**`exclude`** _(Optional)_:  
list - Angabe von Keys welche beim exportieren nicht mit exportiert werden soll
(Macht logischerweiße nur sein wenn man in `key` ein Dict angegeben hat und keinen einzelnen value)

## Images

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

### pillow

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

### Overlay

Es gibt 6 verschiedene Overlay-Arten:


#### option

Werted den boolean Wert aus der in `check` angegeben wurde, 
und führt jenachdem dann die angegebenen Overlays in `on_true` oder `on_false` aus

```JSON

{
     "description": "TeamErgebnisse",
     "type": "option",
     "check": "_req|Spiele|0|MatchIsFinished",
     "on_true": [
           
     ],
     "on_false": [

     ]
}
```

**`description`** _(Optional)_:  
Lediglich ein Name des overlays, wird im programm nicht verwendet, dient nur zur Orientierung in der JSON

**`check`**  
Der Wert anhand dem entschieden wird ob `on_true` oder `on_false` ausgeführt wird

**`on_true`**  
Eine Liste aus neuen Overlay Typen welche angewendet werden wenn der Wert True ergab

**`on_false`**  
Eine Liste aus neuen Overlay Typen welche angewendet werden wenn der Wert False ergab

#### compare

Vergleicht die beiden Werte in `value_left` und `value_right`, 
und führt jenachdem dann die angegebenen Overlays in `on_equals` oder `on_not_equals` aus
oder sofern `on_not_equals` nicht angegeben wurde wird `on_higher` und `on_lower` verwendet

```JSON

{
     "description": "TeamErgebnisse",
     "type": "compare",
     "value_left": "_req|Test1",
     "value_right": "_req|Test2",
     "on_equals": [
           
     ],
     "on_higher": [

     ],
     "on_lower": [

     ]
}
```

**`description`** _(Optional)_:  
Lediglich ein Name des overlays, wird im programm nicht verwendet, dient nur zur Orientierung in der JSON

**`value_left`**  
Der Erste Wert der verglichen werden soll

**`value_right`**  
Der Zweite Wert der verglichen werden soll

**`on_equals`**  
Eine Liste aus neuen Overlay Typen welche angewendet werden wenn die beiden Werte identisch sind

**`on_not_equals`**  _(Optional)_  
Eine Liste aus neuen Overlay Typen welche angewendet werden wenn die beiden Werte nicht identisch sind

**`on_higher`**  _(Optional)_  
Sollte `on_not_equals` nicht angegeben worden sein so wird `on_lower` und `on_higher` verwendet.
Dies ist ebenso eine Liste aus neuen Overlay Typen welche angewendet werden wenn der zweite wert größer wie der erste ist.

**`on_lower`**  _(Optional)_  
Sollte `on_not_equals` nicht angegeben worden sein so wird `on_lower` und `on_higher` verwendet.
Dies ist ebenso eine Liste aus neuen Overlay Typen welche angewendet werden wenn der zweite Wert kleiner wie der erste ist.

#### image

Der Typ Image setzt ein Bild in das zuvor definierte source image

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

**`pos_x`** _(Optional)_:  
X Koordinate des zu setztenden Bildes (obere linke Ecke des Bildes)

**`pos_y`** _(Optional)_:  
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

######## Bild mittig vor Hintergrund platzieren

Um ein Bild mittig vor dem Hintergrund zu platzieren, sollten die Felder `pos_x` und `pos_y` nicht mit Werten 
versehen werden. Die Position wird automatisch berechnet unter Berücksichtigung der Größe des Hintergrundbildes und 
des einzufügenden Bildes. 

Um das Bild anders zu platzieren, müssen die Felder `pos_x` und `pos_y` mit Werten versehen werden.

#### image_array

Der Typ `image_array` setzt mehrere Bilder in das zuvor definierte source image.

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

#### text

Der Typ `text` setzt einen Text in das zuvor definierte source image.

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

**`pattern`**:  
Text der geschrieben werden soll (kann sich auch auf Daten aus der API beziehen)

**`preset`**:  
Preset welches verwendet werden soll (Schriftart,-Größe,-Farbe)  
Presets sind weiter unten in der JSON spezifiziert

**Sollte man kein neues preset angeben wollen so kann man anstelle des `preset` auch folgendes zusätzlich angeben:**

**`colour`**:  
str/hex - Farbe des Textes, kann ein Name sein aber auch eine Hexzahl.

**`font_size`**:  
int - Größe des Textes

**`font`**:  
str - Name des relativen Pfads vom resource-Ordner zu der Font-Datei.


#### text_array

Der Typ `text_array` setzt mehrere Texte in das zuvor definierte source image.

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

**`pattern`**:  
Texte die geschrieben werden sollen, auch hier wieder Liste sowie String möglich  
(kann sich auch auf Daten aus der API beziehen)

**`preset`**:  
Preset welches verwendet werden soll (Schriftart,-Größe,-Farbe)  
Dies kann wieder eine Liste oder ein String sein  
Presets sind weiter unten in der JSON spezifiziert


**Sollte man kein neues preset angeben wollen so kann man anstelle des `preset` auch folgendes zusätzlich angeben:**

**`colour`**:  
str/hex - Farbe des Textes, kann ein Name sein aber auch eine Hexzahl.

**`font_size`**:  
int - Größe des Textes

**`font`**:  
str - Name des relativen Pfads vom resource-Ordner zu der Font-Datei.

### wordcloud

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
    "stopwords": None,
    "repeat": False
}
```

Diese Parameter können in der JSON-Datei optional angegeben werden, wird kein anderer Wert angegeben, wird
der jeweilige default-Wert verwendet.

**`background_color`**: color value - z.B. `white`, `black`, `red` etc. Wenn der Hintergrund transparent sein soll,
muss hier `None` angegeben werden und bei `mode` `RGBA`

**`width`**: 
int - Breite der Wordcloud in Pixeln

**`height`**: 
int - Höhe der Wordcloud in Pixeln

**`collocations`**: 
bool - <!--TODO-->

**`max_font_size`**: 
int - Schriftgröße des Wortes, welches am häufigsten im angegebenen Text vorkommt

**`max_words`**: 
int - Maximale Anzahl an Wörtern, die in der Wordcloud dargestellt werden

**`contour_width`**: 
int - Breite der Kontur/Umrandung der Maske bzw. der Form der Wordcloud

**`contour_color`**: 
color value - Farbe der Kontur/Umrandung

**`font_path`**: 
str - Relativer Pfad zur Schriftart (Default: Dosis-Medium.ttf)

**`prefer_horizontal`**: 
float - <!--TODO-->

**`scale`**: 
float/int - <!--TODO-->

**`min_font_size`**: 
int - Schriftgröße des Wortes, welches am seltensten im angegebenen Text vorkommt

**`font_step`**: 
int - Änderung der Schriftgröße bei den Wörtern, je häufiger ein Wort vorkommt, desto größer ist es dargestellt

**`mode`**: 
`RGB`. Wenn der Hintergrund transparent sein soll, muss `RGBA` angegeben werden und bei `background_color` `None`

**`relative_scaling`**: 
float - <!--TODO-->

**`color_func`**: 
callable - Interne Funktion zur Darstellung eines Farbverlaufs mittel hsl-Darstellung. Überschreibt `colormap`, wenn color_func nicht `None` ist.

**`regexp`**: 
None, <!--TODO-->

**`colormap`**: 
colormap (callable) von matplotlib - viridis, magma, inferno, plasma

**`normalize_plurals`**: 
bool - <!--TODO-->

**`stopwords`**: 
set of str - Wörter, die zwar im Text vorkommen, aber nicht in der Wordclud dargestellt werden sollen

**`repeat`**:
bool - Ob ein Wort wiederholt werden sollen. Wird benötigt bei einer Wordcloud mit nur einem einzigen Wort im Textstring.

**Beispiel** 

```JSON
{
    "type": "wordcloud",
    "text": "{_req|text}",
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

#### Wordcloud mit nur einem Wort
Zum Generieren einer Wordcloud, die nur ein Wort enthält, muss `repeat` auf `True` gesetzt werden. Der Textstring `text`
soll nur das Wort enthalten, welches wiederholt werden soll.

#### Wordcloud transparent
Möchte man eine Wordcloud mit transparentem Hintergrund, so hat man mehrere Möglichkeiten.
Will meine eine Wordcloud der Form `square` so kann man in der JSON folgendes angeben:
"mode": "RGBA",
"background_color": None

**Alternativ für `square` und `circle` möglich**:

Erstellen einer Wordcloud mit weißem Hintergrund.
"mode": "RGB" (default),
"background_color": "white" (default)

Im Image-Overlay:
"color": "RGBA",
"color_transparency": "FFFFFF"

Da ersteres nur in der JSON und nicht bei der Joberstellung angegeben kann, wird die Alternative für `square` 
und `circle`empfohlen.
<!--TODO-->

#### Text oder Dictionary hinterlegen
Um eine Wordcloud zu erstellen kann man zwei verschiedene Datenstrukturen angeben, mit denen diese erstellt werden kann.

**Option 1: `text`**

Der Key `text` wird angegeben und dahinter muss ein Verweis auf einen String stehen.

```JSON
{
"text": "{_req|text}"
}
```

**Option 2: `dict`**

Der Key `dict` wird angegeben und dahinter muss ein Verweis auf ein Dictionary stehen.

```JSON
{
"dict": "_req|dict"
}
```


#### Stopwords

Stopwords sind Wörter, die in der Wordcloud nicht vorkommen sollen. Man kann sie bei der Joberstellung angeben. 

## Thumbnail

In Thumbnails werden bisher erstellte Bilder oder aber auch neue Bilder angegben welche dann,
sofern in der config angegeben neben dem Video zusätzlich erstellt

```JSON
{
  "thumbnail": {
    "type": "new"
  }
}

```

### created

```JSON
{
 "type": "created",
 "name": "wordcloud_all"   
}

```

**`name`**:  
str - Angabe des Internen Namen des bereits erstellten Bildes


### new

```JSON
{
  "type": "new",
  "image": {
     "type": "pillow",
     "path": "football/FootballThumbnail.png",
     "overlay": [
     ]
  } 
}

```

**`image`**:  
dict - Hier wird ein Bild spezifiziert wie unter `images` erläutert

## Audios

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

### text

Dieser `parts`-Typ wandelt den gegebenen String in eine Audiodatei um.

**Beispiel** 

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

**`pattern`**:  
str - Der Text, der in Sprache umgewandelt werden soll. Einfacher String oder auch ein formatted string möglich.

### compare

Dieser `parts`-Typ wählt aus je nachdem, ob ein bestimmter Wert größer, kleiner oder gleich einem anderen Wert ist, einen
String mithilfe eines weiteren `parts`-Typen aus, der dann in eine Audiodatei umgewandelt wird.

**Beispiel** 

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

**`value_left`**:  
str, int - Der Wert, der beim Vergleich auf der linken Seite steht. 

**`value_right`**:   
str, int - Der Wert, der beim Vergleich auf der rechten Seite steht.

**`on_equal`**:   
callable - Optional, wenn `on_not_equal` oder `on_higher` und `on_lower` angegeben ist. Wenn `value_left` und `value_right` gleich sind, wird der angegebene `parts`-Typ aufgerufen.

**`on_not_equal`**:   
callable - Optional, wenn `on_equal` angegeben ist. Wenn `value_left` und `value_right` nicht gleich sind, wird der angegebene `parts`-Typ aufgerufen.

**`on_higher`**:   
callable - Optional. Wenn `value_left` größer ist als `value_right`, wird der angegebene `parts`-Typ aufgerufen.

**`on_lower`**:   
callable - Optional. Wenn `value_left` kleiner ist als `value_right`, wird der angegebene `parts`-Typ aufgerufen.

#### option

Dieser `parts`-Typ wählt aus je nachdem, ob ein bestimmter Wert `true` oder `false` ist, einen String mithilfe eines weiteren
`parts`-Typen aus, der dann in eine Audiodatei umgewandelt wird.

**Beispiel** 

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

**`check`**:   
str, int - Der Wert, der auf true oder false geprüft werden soll.

**`on_true`**:   
callable - optional, wenn `on_false` angegeben ist. Wenn `check` true ist, wird der angegebene `parts`-Typ aufgerufen.

**`on_false`**:   
callable - optional, wenn `on_true` angegeben ist. Wenn `check` false ist, wird der angegebene `parts`-Typ aufgerufen.

### random_text

Dieser `parts`-Typ wählt aus mehreren gegebenen Strings einen aus, der dann in eine Audiodatei umgewandelt wird.

**Beispiel** 

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

**`pattern`**:   
array of str - Mehrere Texte als Strings. Es wird zufällig einer dieser Texte ausgewählt und in
Sprache umgewandelt. Einfacher String oder auch ein formatted string möglich.

## Sequence

Im Sequence Teil der JSON kan angegeben werden wie das Video auszusehen hat

```JSON
{
 "sequence": {
    "type": "successively",
    "transitions": 0.1
  }
}
```

**`transitions`**:  
float - wie lange das Bildübergängsintervall ist.

### successively

Successively ist der denkbar einfachste Typ der Video Erzeugung, es werden einfach alle Bilder
und alle Audio in der selben Reihenfolge aneinander gehängt wie sie in der JSOn vorher
definiert wurden. Jedes Bild wird so lange gezeigt wie die dazu geordnete Audio datei ist.
Dies setzt natürlich vorraus dass es eine identische Anzahl an Bildern sowie Audios gibt

```JSON
{
  "type": "successively"
}
```

### custom

`custom` ist ein etwas schwierigerer sequence-Typ, dieser setzt nicht voraus, dass es dieselbe
Anzahl an Bildern und Audios gibt. Das heißt man kann bestimmte Bilder doppelt oder auch gar nicht verwenden.
`custom` funktioniert wie folgt:  
Die Audios werden in der Reihenfolge aneinander gehängt wie in `audio_l` vorgegeben.  
Die Bilder werden ebenfalls in der Reihenfolge wie in `image` angeben aneinander gehängt.  
Jedes Bild wird solange gezeigt wie `time_diff` + Länge des Audios `audio_l`.
Sollte kein Audio angegeben werden, wird dies als + 0 betrachtet.
Das heißt alle `time_diff`-Werte aufaddiert, müssen 0 ergeben,
ansonsten passt die gesamte Audiolänge nicht auf alle Bilder.

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
str - Name des internen Bildes.

**`time_diff`**_(Optional)_:  
int - Zeit (in Sekunden), welches dieses Bild länger oder kürzer als die Audiodatei angezeigt werden soll.

**`audio_l`**_(Optional)_:  
str - Name der internen Audiodatei.

## run_config

Der Abschnitt `run_config` beinhaltet die Konfigurationen, die der Nutzer in der Job-Erstellung am Anfang auswählen kann.

Bei einem ortsbezogenen Wetterbericht würde dies wie folgt aussehen:

**Beispiel** 

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

## Presets

Presets werden verwendet, um Texte in dem Style wie sie im `preset` angegeben wurden auf die Bilder zu schreiben.

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
str/hex - Farbe des Textes, kann ein Name sein aber auch eine Hexzahl.

**`font_size`**:  
int - Größe des Textes

**`font`**:  
str - Name des relativen Pfads vom resource-Ordner zu der Font-Datei.

**`"test_preset_1"`, `"test_preset_2":`**  
str - Die internen Namen der presets, sodass man sie in Images mit dem Name der hier angegeben wurde verwenden kann.
