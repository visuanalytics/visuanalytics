# Audio Configuration

Die Audioeinstellungen können in der Datei `instance/config.json` angegeben werden.

## Default

Stellt man in `instance/config.json` nichts ein, wird das Python-module `gtts` verwendet. Aber auch dort kann man noch ein paar Einstellungen vornehmen:

`config.json`:

~~~jsonc
{
  // ... Rest der Config
  "audio": {
    "type": "default",
    "lang": "de",
    "format": "mp3"
  }
}
~~~

`lang`: 

Sprache die verwendet wird.

`format`: 

Output-Format der Audiodatei.

## Custom

Verwendet man den `Configurations` type custom, kann man folgendes einstellen:

`config.json`:

~~~jsonc
{
  // ... Rest der Config
  "audio": {
    "type": "custom",
    "prepare": {
      // ... request Einstellungen
    },
    "generate": {
      // ... request Einstellungen
    },
    "post_generate": {
      "file_extension": "mp3",
      "json_key": "audioContent"
    }
  }
}
~~~

`prepare` (Optional):

Hier können **Requests** angegeben werden, die vor der Generation aller Audios ausgeführt werden sollen. Diese werden also nur **einmal** pro Videogenerierung aufgerufen. Die Syntax für die Definition der Requests befindet sich im Abschnitt [Requests](#Requests).

```note::
  Dies kann nützlich sein um z.B. eine Acces Token zu bekommen.
```

`generate`:

Hier können **Requests** angegeben werden, die zur Generierung der Texte verwendet werden. Diese werde pro Videogenerierung **mehrfach** ausgeführt. Die Syntax für die Definition der Requests befindet sich im Abschnitt [Requests](#Requests).

`post_generate` (Optional):

Hier können noch einige Einstellungen angegeben werden, die nach der Generierung verwendet werden:

- `file_extension`: 
  
  Gibt die File extension der Audio datei an.
    
  Diese Angabe ist nur notwendig, wenn der Response-body json-Daten enthält,
  kann aber immer angegeben werden. Wurde die `file_extension` nicht angegeben und es handelt sich um `audio` Daten, wird der Datentyp automatisch anhand es `content-type` im Header bestimmt.

- `json_key`:
 
  Key des Audio-Strings.
    
  Wird nur benötigt, wenn der Response-body json-Daten enthält. Dieser Key sollte zu dem String, der die Audio daten enthält, zeigen. Dieser wird dann mit `base64` decodiert und mit der angegebenen `file_extension` gespeichert und verwendet.


### Keys

Um auf die Daten(Konfigurations Dateien, den Text, vorherige Requests)  zugreifen zu können gibt es eine Syntax:

- Die einzelen `keys` zu den Werten werden durch ein `|` (Pipe) Symbol getrennt. (also z.B.: `_audio|text`)
- Zwichen einem normalen Json `Objekt` (In Python `dictionary`) und einem Array gibt es in der Syntax keine Unterschide, man kann diese also gleich verwenden (also z.B.: `_audio|0|test`)
- will man in einem Value-String (in `config.json`) einen Wert aus einem Key einsetzen, muss man diesen Key in `{}` schreiben.

#### Spezial Variablen

`Spezial Variablen die überall möglich sind`: 

- unter `_conf` befinden sich alle Konfigurationen, die in der `jobs.json` als config angegeben werden.
- bei den Requests gibt es noch die Variable `_api_key` (Erklärung siehe [Api Requests](#api-requests))


`Spezial Variablen die nur unter generate möglich sind`:

- unter `_audio|pre` befindet sich die Antworten der dort definierten requests.
- unter `_audio|text` befindet sich der zu generierende Text.


### API Requests

Es gibt zwei verschidene Request-Typen die verwendet werden können:

#### request

Führt einen **Https** Request durch.

```JSON
{
    "type": "request",
    "api_key_name": "apiKeyName",
    "url_pattern": "url",
    "method": "post", 
    "headers": {},
    "body": {},
    "body_type": "other",
    "body_encoding": "utf-8",
    "response_format": "other"
}
```

**`url_pattern`**:

Die zu verwendende `url`.

```note::
  Format Strings werden unterstützt.
```

**`api_key_name`** _(Optional)_:

Der Name des Api-Keys. Dieser **Name** muss mit einem **Key** in der Konfigurationsdatei übereinstimmen.

- _Fehler_:

  - `ApiKeyError` -> Name in Config nicht gefunden.

- _Special Variablen_:

  - `api_key` -> Beinhaltet den Api-Key hinter `api_key_name`

**`method`** _(Optional)_:

Die zu verwendende Http/Https **Methode**. 

- _Standart_: `get`

**`headers`** _(Optional)_:

Der zu verwendenden Request **header**.

**`body`** _(Optional)_:

Der zu verwendende Request-Body. Dieser kann entweder ein Json-Objekt oder ein String sein (Für Definition des Typen siehe `body_type`).

**`body_type`** _(Optional)_:

Der Datentype des Bodys.

- _mögliche Werte_:
  - `json` (Standart)
  - `Other`

**`body_encoding`** _(Optional)_:

Die Encodierung mit welcher der Wert in `body_type` encodiert werden soll (z.B.: `utf-8`).

**`response_format`**:

Der Datentype des Response-Bodys.

- _mögliche Werte`_:
  - `json` (Standart)
  - `text`
  - `Other`

```note::
  Falls man bei `generate` eine Audiodatei zurückbekommt, muss man diesen Wert auf `Other` setzen.
```

#### request Multiple Custom

Führt mehrere Requests nacheinander durch.

~~~jsonc
{
    "type": "request_multiple_custom",
    "requests": [
      // ... Angabe der Requests
    ],
    "audio_idx": 0
  }
~~~

**`requests`**:

Hier können mehrere [requests](#request) angegeben werden. Diese werden dann nacheinander ausgeführt. Die Responses werden in einem Array an der jeweiligen Position gespeichert. Diese können dann später z.B. so verwendet werden: `_audio|pre|0`.

```note::
  Bei den Requests, die in `generate` ausgeführt werden, werden die Daten etwas anders gespeichert. Dort wird ein Json-Objekt (In Python `Dictionoray`) mit zwei Keys gespeichert. Zum einen `headers`, enthält alle response Headers und zum anderen `content`, welches die Response-Body enthält.
```

**`audio_key`** _(Bei Prepare Optional)_:

Gibt an, welcher der Requests die Audiodatei enthält.

```note::
  Man gibt nur den Index des Requests aus `requests` an.
```

### Beispiel

#### Verwendung des Azure (Microsoft) TTS Services

Config zur Verwendung des Azure TTs Service:

`config.json`:

~~~jsonc
{
  // .. Rest der Config
  "audio": {
    "type": "custom",
    "prepare": {
      "type": "request",
      "api_key_name": "azure",
      "url_pattern": "https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken",
      "method": "post",
      "headers": {
        "Ocp-Apim-Subscription-Key": "{_api_key}"
      },
      "response_format": "text"
    },
    "generate": {
      "type": "request",
      "url_pattern": "https://westus.tts.speech.microsoft.com/cognitiveservices/v1",
      "method": "post",
      "headers": {
        "Authorization": "Bearer {_audio|pre}",
        "Content-type": "application/ssml+xml; charset=utf-8",
        "X-Microsoft-OutputFormat": "audio-24khz-96kbitrate-mono-mp3",
        "User-Agent": "Mozilla/5.0"
      },
      "body": "<speak xmlns=\"http://www.w3.org/2001/10/synthesis\" xmlns:mstts=\"http://www.w3.org/2001/mstts\" xmlns:emo=\"http://www.w3.org/2009/10/emotionml\" version=\"1.0\" xml:lang=\"en-US\"><voice name=\"de-DE-Hedda\"><mstts:express-as style=\"General\"><prosody rate=\"0%\" pitch=\"0%\">{_audio|text}</prosody></mstts:express-as></voice></speak>",
      "body_type": "other",
      "body_encoding": "utf-8",
      "response_format": "other"
    }
  }
}
~~~

Des Weiteren muss noch der Api Key in der `config.json` hinzugefügt werden:

~~~jsonc
{
  "api_keys": {
    // ... Restliche API Keys
    "azure": "api_key"
  }
  // ... Restliche Config
}
~~~

```note::
  `api_key` muss durch den eigentlichen API-Key ersetzt werden
```