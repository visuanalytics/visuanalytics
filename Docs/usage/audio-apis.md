# Audiokonfiguration

Die Audioeinstellungen können in der Datei `instance/config.json` angegeben werden.

## Default

Stellt man in `instance/config.json` nichts ein, wird das Python-Module `gtts` verwendet. Aber auch dort kann man noch ein paar Einstellungen vornehmen:

`config.json`:

~~~jsonc
{
  // ... Rest der Konfiguration
  "audio": {
    "type": "default",
    "lang": "de",
    "format": "mp3"
  }
}
~~~

`lang`: 

Sprache, die verwendet werden soll.

`format`: 

Output-Format der Audiodatei. Z.B. mp3

## Custom

Verwendet man den Konfigurations-Typ `custom`, kann man folgendes einstellen:

_(Ein vollständiges Beispiel, wie man Microsoft Azure einbinden kann, finden Sie [hier](#beispiel))_

`config.json`:

~~~jsonc
{
  // ... Rest der Konfiguration
  "audio": {
    "type": "custom",
    "prepare": {
      // ... Request-Einstellungen
    },
    "generate": {
      // ... Request-Einstellungen
    },
    "post_generate": {
      "file_extension": "mp3",
      "json_key": "audioContent"
    }
  }
}
~~~

`prepare`_(optional)_:

Hier können **Requests** angegeben werden, die vor der Generierung aller Audiodateien ausgeführt werden sollen. Diese 
werden also nur **einmal** pro Videogenerierung aufgerufen. Die Syntax für die Definition der Requests befindet sich im 
Abschnitt [Requests](#requests).

```note::
  Dies kann nützlich sein um z.B. eine Acces-Token zu bekommen.
```

`generate`:

Hier können **Requests** angegeben werden, die zur Generierung der Texte verwendet werden. Diese werden pro 
Videogenerierung **mehrfach** ausgeführt. Die Syntax für die Definition der Requests befindet sich im Abschnitt 
[Requests](#requests).

`post_generate` _(optional)_:

Hier können noch einige Einstellungen angegeben werden, die nach der Generierung verwendet werden sollen:

- `file_extension`: 
  
  Gibt die Dateiendung der Audiodatei an.
    
  Diese Angabe ist nur notwendig, wenn der Response-Body JSON-Daten enthält, kann aber immer angegeben werden. 
  Wurde die `file_extension` nicht angegeben und es handelt sich um `audio`-Daten, wird der Datentyp automatisch anhand 
  des `content-type` im Header bestimmt.

- `json_key`:
 
  Key des Audio-Strings.
    
  Wird nur benötigt, wenn der Response-Body JSON-Daten enthält. Dieser Key sollte zu dem String zeigen, der die Audiodaten enthält.
  Dieser wird dann mit `base64` dekodiert und mit der angegebenen `file_extension` gespeichert und verwendet.


### Keys

Um auf die Daten (Konfigurationsdateien, den Text, vorherige Requests) zugreifen zu können, gibt es eine Syntax:

- Die einzelen `keys` zu den Werten werden durch ein `|` (Pipe) Symbol getrennt (also z.B.: `_audio|text`).
- Zwischen einem normalen JSON-`Objekt` (in Python `dictionary`) und einem Array gibt es in der Syntax keine Unterschiede.
    Man kann diese also gleich verwenden (z.B.: `_audio|0|test`)
- Will man in einem Value-String (in `config.json`) einen Wert aus einem Key einsetzen, muss man diesen Key in `{}` schreiben.

**Beispiel**

Will man die Stimme von Microsoft Azure verwenden, so muss zuerst ein Anfrage für das `Access-Token` getätigt werden. Dazu wird wie oben beschrieben der Request in [prepare](#custom) geschrieben.

~~~jsonc
"prepare": {
  "type": "request",
  "api_key_name": "azure",
  "url_pattern": "https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken",
  "method": "post",
  "headers": {
    "Ocp-Apim-Subscription-Key": "{_api_key}"
  },
~~~

Um im folgenden Request auf das Token zugreifen zu können, verwendet man nun `{_audio|pre}`, um an den Wert zu gelangen.

Im aktuellen Beispiel kann also im folgenden Request unter `"Authorization"` der Acces-Token verwendet werden.

~~~jsonc
"headers": {
  "Authorization": "Bearer {_audio|pre}",
  "Content-type": "application/ssml+xml; charset=utf-8",
  "X-Microsoft-OutputFormat": "audio-24khz-96kbitrate-mono-mp3",
  "User-Agent": "Mozilla/5.0"
},
~~~
#### Spezialvariablen

**Spezialvariablen, die überall möglich sind**: 

- Unter `_conf` befinden sich alle Konfigurationen, die in der `jobs.json` als `config` angegeben werden.
- Bei den Requests gibt es noch die Variable `_api_key` (Erklärung siehe [Api Requests](#api-requests))


**Spezialvariablen, die nur unter `generate` möglich sind**:

- Unter `_audio|pre` befinden sich die Antworten der dort definierten Requests.
- Unter `_audio|text` befindet sich der zu generierende Text.


### API-Requests

Es gibt zwei verschiedene Request-Typen die verwendet werden können:

#### request

Führt einen **https**-Request durch.

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

Die zu verwendende URL.

```note::
  Formatted Strings werden unterstützt.
```

**`api_key_name`** _(optional)_:

Der Name des API-Keys. Dieser **Name** muss mit einem **Key** in der Konfigurationsdatei übereinstimmen.

- _Fehler_:

  - `ApiKeyError` -> Name in Konfigurationsdatei nicht gefunden.

- _Spezialvariablen_:

  - `api_key` -> Beinhaltet den API-Key hinter `api_key_name`

**`method`** _(optional)_:

Die zu verwendende http/https-**Methode**. 

- _Standard_: `get`

**`headers`** _(optional)_:

Der zu verwendenden Request-**Header**.

**`body`** _(optional)_:

Der zu verwendende Request-Body. Dieser kann entweder ein JSON-Objekt oder ein String sein (für Definition des Typen siehe `body_type`).

**`body_type`** _(optional)_:

Der Datentyp des Bodys.

- _mögliche Werte_:
  - `json` (default)
  - `Other`

**`body_encoding`** _(optional)_:

Die Kodierung mit welcher der Wert in `body_type` kodiert werden soll (z.B.: `utf-8`).

**`response_format`**:

Der Datentyp des Response-Bodys.

- _mögliche Werte`_:
  - `json` (default)
  - `text`
  - `Other`

```note::
  Falls man bei `generate` eine Audiodatei zurückbekommt, muss man diesen Wert auf `Other` setzen.
```

#### request_multiple_custom

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

Hier können mehrere [Requests](#request) angegeben werden. Diese werden dann nacheinander ausgeführt. Die Responses 
werden in einem Array an der jeweiligen Position gespeichert. Diese können dann später z.B. so verwendet werden: `_audio|pre|0`.

```note::
  Bei den Requests, die in `generate` ausgeführt werden, werden die Daten etwas anders gespeichert. Dort wird ein JSON-Objekt (in Python `Dictionoray`) mit zwei Keys gespeichert. Zum einen `headers`, enthält alle Response-Headers, und zum anderen `content`, welches den Response-Body enthält.
```

**`audio_key`** _(bei Prepare optional)_:

Gibt an, welcher der Requests die Audiodatei enthält.

```note::
  Man gibt nur den Index des Requests aus `requests` an.
```

### Beispiel

#### Verwendung des Azure (Microsoft) TTS Services

Konfiguration zur Verwendung des Azure TTS Service:

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

Des Weiteren muss noch der API-Key in der `config.json` hinzugefügt werden:

~~~jsonc
{
  "api_keys": {
    // ... Restliche API-Keys
    "azure": "api_key"
  }
  // ... Restliche Konfiguration
}
~~~

```note::
  `api_key` muss durch den eigentlichen API-Key ersetzt werden.
```