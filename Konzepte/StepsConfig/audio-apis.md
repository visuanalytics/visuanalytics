# Audio Configuration

Die audio einstellungen können in der Datei `instance/config.json` Angegeben werden.

## Default

Stellt man in `instance/config.json` nichts ein wird das Python module `gtts` verwendet. Aber auch dort kann man noch ein paar einstellungen vornehmen:

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

Sprache die Verwendet Wird.

`format`: 

Output Format der Audio datei.

## Custom

Verwendet man den `Configurations` type custom kann man folgendes einstellen:

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

Hier können **Requests** angegeben werden die vor der Generation aller Audios ausgeführt werden sollen. Diese Werden also nur **einmal** pro Viedeo Generierung aufgerufen. Der Syntax für die definition der Requests befindet sich im abschnitt [Requests](#Requests).

> Dies Kann nützlich sein um z.B. eine Acces Token zu bekommen.

`generate`:

Hier können **Requests** angegeben werden die zur generierung der Texte verwendet werden. Diese werde pro Video Generierung **mehrfach** ausgeführt. Der Syntax für die definition der Requests befindet sich im abschnitt [Requests](#Requests).

`post_generate` (Optional):

Hier können noch einige einstellungen angegeben werden, die Nach der generierung Verwendet werden:

- `file_extension`: 
  
  Gibt die File extension der Audio datei an.
    
  Diese angabe ist nur Notwendig wenn der Response body json daten enthält, 
  kann aber immer angegeben Werden. Wurde die `file_extension` nicht angegeben und es handelt sich um `audio`-daten, wird der Datentype automatisch anhand des `content-type` im Header bestimmt.

- `json_key`:
 
  Key des audio Strings.
    
  Wird nur Benötigt wenn der Response body json daten enthält. Dieser Key sollte zu dem String der die Audio daten enthält zeigen. Dieser wird dann mit `base64` decodiert und mit der angegebenen `file_extension` gespeichert und verwendet.


# Keys

Um auf die Daten(Configurations dateien, den Text, vorherige Requests)  zugreifen zu Können gibt es eine Syntax:

- Die einzelen `keys` zu den Werten werden durch einem `|` (Pipe) Symbol Getrennt. (also z.B.: `_audio|text`)
- Zwichen einem Normalen Json `Objekt` (In Python `dictionary`) und einem Array gibt es im Syntax keine Unterschide man kann dise also gleich verwenden (also z.B.: `_audio|0|test`)
- will man in einem Value String (in `config.json`) einen Wert aus einem Key einsetzen, muss man diesen key in `{}` Schreiben.

## Spezial Variablen

`Spezial Variablen die Überall möglich sind`: 

- unter `_conf` befinden sich alle Konfigurationen die in der `jobs.json` als config angegeben werden.
- bei den requests gibt es noch die variable `_api_key` (Erklärung siehe [Api Requests](#api-requests))


`Spezial Variablen die nur unter generate möglich sind`:

- unter `_audio|pre` befindet sich die Antworten der dort definierten requests.
- unter `_audio|text` befindet sich der zu generierende Text.


# API Requests

Es gibt zwei Verschidene Request Typen die Verwendet werden können:

## request

Führt einen **Https** request durch.

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

Die zu Verwendende `url`.

> Format Strings Werden unterschtützt.

**`api_key_name`** _(Optional)_:

Der Name des Api Keys. Dieser **Name** muss mit einem **Key** in der Configurations Datei übereinstimmen.

- _Fehler_:

  - `ApiKeyError` -> Name in Config nicht gefunden.

- _Special Variablen_:

  - `api_key` -> Beinhaltet den Api Key hinter `api_key_name`

**`method`** _(Optional)_:

Die zu Verwendende Http/Https **Methode**. 

- _Standart_: `get`

**`headers`** _(Optional)_:

Der zu Verwendenden Request **header**.

**`body`** _(Optional)_:

Der zu Verwendende Request Body. Dieser kann entweder ein Json Objekt oder ein string sein (Für definition des Typen siehe `body_type`).

**`body_type`** _(Optional)_:

Der Datentype des Bodys.

- _mögliche Werte_:
  - `json` (Standart)
  - `Other`

**`body_encoding`** _(Optional)_:

Die Encodierung mit der, der wert in `body_type` encodiert werden soll (z.B.: `utf-8`).

**`response_format`**:

Der Datentype des Response Bodys.

- _mögliche Werte`_:
  - `json` (Standart)
  - `text`
  - `Other`

> Fals man bei `generate` eine Audio Datei zurückbekommt muss man diesen Wert auf `Other` setzen.

## request Multiple Custom

Führt mehrere Requests nach einander durch.

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

Hier können mehrere [requests](#request) angegeben werden. Diese Werden dann nacheinander ausgeführt. Die Responses werden in einem Array an der jeweiligen position gespeichert. Diese Können dann später z.B. so verwendet werden: `_audio|pre|0`.

> Bei den Requests die in `generate` ausgeführt werden, werden die daten entwas anderst gespeichert. Dort wird ein Json Objekt (In Python `Dictionoray`) mit zwei Keys Gespeichert. Einmal `headers` dieses Fehlt enthält alle response Headers und noch `content` welches die Response Body enthält.

**`audio_key`** _(Bei Prepare Optional)_:

Gibt an Welcher der Requests die Audio datei enthält.

> Man gibt nur den Index des Requests aus `requests` an.

# Beispiel

## Verwendung des Azure (Microsoft) TTS Services

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

> `api_key` muss durch den Eigentlichen API Key ersetzt werden
