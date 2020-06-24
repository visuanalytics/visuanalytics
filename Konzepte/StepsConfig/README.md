# Steps Config

<!-- TODO TOC -->
<!-- TODO Description-->

# Api

<!-- TODO Description-->

## Types

### request

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

### request Multiple

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

### request Multiple Custom

<!--TODO-->

# Transform

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
