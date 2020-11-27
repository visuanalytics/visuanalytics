# Python datenstruckturen

# OrdnerStrucktur

- control
- api
  - api_types.py
- transform
  - transform_types.py
- processing
  - image
    - image_types.py
  - audio
    - parts
      - parts_types.py
- sequence
- util

# Api

### Funktionen

#### Ein Request

```PYTHON
api_request(values)
```

##### Parameter

_url_:

"url für den request"

_values_:

```PYTHON
{
  "api_key_name": "name",
  "url": "url"
}
```

#### Mehrere Requests

```PYTHON
api_request_multiple(values)
```

##### Parameter

_url_:

"url für den request"

_values_:

```PYTHON
{
  "api_key_name": "name",
  "steps_value": ["Hallo", "Test", "Hallo2"],
  # url muss mit .format(_loop=value) verwendet werden; value = wert des requests aus steps_value
  "url": "url"
}
```

## Typen

Um an die funktionen für den Typen zu kommen sollte es in einer datei `api_types` ein dictonary mit folgender Strucktur geben:

```
API_TYPES = {
  "request": api_request,
  "request_multiple": api_request_multiple,
  ...
}
```

# transform

## Funktionen

Die Bennenung der funktionen sollt: `transform_type_name()` entsprechen, wobei `type_name` natürlich durch den namen des Types ersezt wird.

## Typen

Um an die funktionen für den Typen zu kommen sollte es in einer datei `transform_types` ein dictonary mit folgender Strucktur geben:

```PYTHON
TRANSFORM_TYPES = {
  "name": function,
  ...
}
```

# images

## Funktionen

Funktions Strucktur (oberfunktionen, können fals benötigt noch sub funktionen enthalten):

```PYTHON
# Wertet Typen aus und ruft richtige Funktion auf
generate_image(name, values)

# Können (vtl. solten) verschiedene Module(Dateien) sein
generate_image_pillow(name, values)
generate_image_wordcloud(name, values)
...
```

### Parameter

_name_:

"Name des bildes"

_values_:

```PYTHON
{
  "type": "pillow"
  "path": "pfad",
  "overlay": [
    {
      "type": "type",
      "pos_x": 10,
      "pos_y": 2,
      "color": "#08638",
      "font_size": 5,
      "font": "dosis",
      "text": "hallo"
    },
    {
      ...
    }
  ]
}
```

# audio

## Funktionen

Funktions Strucktur (oberfunktionen, können falls benötigt noch sub funktionen enthalten):

```PYTHON
generate_audio(name, values, options)

audio_parts(parts)
```

### Parameter

_Name_:

name des Audio blocks

_values_:

```PYTHON
{
  "parts": [
    {
      ""
    }
  ]
}
```

_options_:

```PYTHON
{
  "lang": "de",
  "format": "mp3"
}
```

## Typen

Um an die funktionen für den Typen zu kommen sollte es in einer datei `audio_types` ein dictonary mit folgender Strucktur geben:

```PYTHON
AUDIO_PARTS_TYPES = {
  "text": audio_parts_text,
  ...
}
```

# sequence

# presets

Presets können im ersten schritt mit:

```PYTHON
# Change preset to actual input
# e = Step Config dict; f = presets
e.update(f.get(e.pop("preset", None), {}))
```

ersetzt werden

# Json Steps Config

- \$name -> einsetzen einer Job Config
- %0 -> einsetzen eines wertes aus einem werte array

## API

_type_:

Die des Api requests

_mögliche werte:_

- `"request"`: einfacher request
- `"request_multi"`: mehre requests

_api_key_name_:

- Key für die Position des Api keys

_values_:

# config

config beim vormat String mit anhängen:

```PYTHON
"test {hallo}".format(**{"hallo": 1})
```

## Diconary hilfs funktionen

foreach schleife mit key und value:

```PYTHON
for k, v in dict.items():
  pass
```

Beispeil für die generation eines Bildes:

```PYTHON
for k, v in dict.items():
  dict[k] = generate_image(k, v)
```

Multidimensionales dictonary mit key list (arrays innerhalb sind auch kein problem):

```PYTHON
from functools  import reduce
import operator

reduce(operator.getitem, ["0", "test"], d)
```
