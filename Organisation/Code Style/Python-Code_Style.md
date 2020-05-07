# Python Style Guide

Grundlegender Style Guide für Python source code Dateien.

<!--TODO vtl ordnerstrucktur-->

## Module

Jede `.py` datei ist ein Module

z.B. `load_settings.py`

## Package

Wenn dieser Ordner von Python als Package erkant werden soll musser eine datei namens `__init__.py` enthalten, der **Packge name** entspricht dann dem **Ordner namen**. Diese Datei ist normalerweiße **leer** (weitere Details [hier](https://docs.python.org/3/tutorial/modules.html#packages)).

Normalerweiße sollte **jeder** Ordner mit Python source code eine Package sein

> Kann in Pycharm mit new Package direkt erzeugt werden

## Namenskonvention

Grundsätzlich gilt in Python das Namen **kleingeschreiben** werden und Wörter mit **unterstrichen** Verbunden werden, es gibt allerdings ein paar ausnahmen. Desweiteren sollten diese auch nicht zu lang geraten

**Namenskonventionen**:

- `module_name` (meist nur ein wort)
- `package_name` (meist nur ein wort)
- `ClassName`
- `method_name`
- `ExceptionName`
- `function_name`
- `GLOBAL_CONSTANT_NAME`
- `global_var_name`
- `instance_var_name`
- `function_parameter_name`
- `local_var_name`

## Imports

`import` statments nur für **Packete** und **Module**, **nicht** für individuelle Klassen oder Funktionen benutzen.

- `import x` für Python Standart Bibliotheken
- `from x import y` für eigene Packete und Module, wobei `x` der Packet prefix und `y` der Module Name ohne Prefix ist

  z.B. für das Module myproject.data.use_api`:

  ```Python
  from myproject.data import use_api
  ...
  use_api.fetch
  ```

  > Bei zu langem oder gleichen Namen (`y`) kann auch **as** verwendet werden

- `import y as z` für externe Packete und Module (am Besten Standart Abkürzungen Verwenden (z.B.`np` für `numpy`))

**Absolute Imports Verwenden:**

Ja: `from myproject.test.test_file import Test`

Nein: `from ..test.test_file import Test`

## Formatierung

Sollte durch **automatische** formatierung von Pycharm Passieren.

> Diese ist nicht immer Perfekt daher sollte man manchmal einige Sachen selbst formatieren

Man kann Dokumente in Pycharm mit `STR` `ALT` `L` neu Formatieren. Da man dies leicht vergessen kann sollte man dies allerdings **Automatisieren**, dies kann man mit dem Plugin `Save Actons` machen.

### Instalation von Save Actions

unter File > Settings > Plugins

- Save Actions suchen und instalieren
- Pycharm Neustarten

### Einrichtung von Save Actions

unter File > Settings > Save Actions

- Generall

  - Haken bei Activate Save Actions on Save

- Formatting Actions

  - Haken bei Optimize imports
  - Haken bei Reformat File

## Doc Kommentare

In Python kann man mit `""" Docstring """` Kommentare zur Code Dokumentation hinzufügen. Um im Nachhinein eine Documentation daraus zu generieren. Die nachfolgenden definitionen basieren Teilweiße auf dem Vorgaben aus dem [Google Styleguid für Python](http://google.github.io/styleguide/pyguide.html)

<!--todo Doku Tool hinschreiben und auf anleitung/autmatisation verweißen -->

### Modul (Datei)

Jede Datei sollte mit einem docstring starten der den Inhalt und die benutzung des Modules beschreibt:

```Python
"""Eine einzeilige Zusammenfassung des Moduls oder Programms, abgeschlossen durch einen Punkt.

Lassen Sie eine Leerzeile stehen.  Der Rest dieser Dokumentzeile sollte eine
allgemeine Beschreibung des Moduls oder Programms.

Example:
    Ein block für code Beispiele (optional)
"""
```

Die **Beispiel** Sektion ist **Optional**.

Weitere Infomationen sind bei dem [Google Styleguid](http://google.github.io/styleguide/pyguide.html#382-modules) zufinden.

### Funktionen

Eine Funktion muss immer einen Dockstring enthalten mit der **Ausnahmen** von Funktionen die auf die Folgenden Kriterien passen:

- nicht Ausßerhalb des Modules sichtbar
- Sehr Kurze Funktionen
- Bei Offensichtlich Funktionen

```Python
def fetch_bigtable_rows(big_table, keys, other_silly_variable=None):
    """Eine einzeilige Zusammenfassung der Funktion, abgeschlossen durch einen Punkt.

    Lassen Sie eine Leerzeile stehen.  Der Rest dieser Dokumentzeile sollte eine
    allgemeine Beschreibung der Funktion sein.

    Args:
        param1 (varType): Beschribung.
        param2 (varType): Beschribung.
            Beschreibungen Über mehrere Zeilen sollten eingerückt werden.

    Returns:
        varType: Beschribung

    Raises:
        ErrorName: Beschribung.
    """
```

Sektionen die **Nicht benötig** werden Können einfach **weggelassen** werden. wie Z.B `Raises` wenn die Funktion Keinen Fehler Produziert, auch die **Argumenten Typen** können **weggelassen** werden wenn diese **schon** im **Code** angegeben werden. Sind **Funktionen** teil von **Klassen** sollte der **self** Parameter **nicht** mit angegeben werden.

> Weitere Infomationen sind bei dem [Google Styleguid](http://google.github.io/styleguide/pyguide.html#383-functions-and-methods) zufinden.

### Klasse

Klassen sollten auch einen Docstring enthalten:

```Python
class SampleClass(object):
    """Eine einzeilige Zusammenfassung der Klasse, abgeschlossen durch einen Punkt.

    Lassen Sie eine Leerzeile stehen.  Der Rest dieser Dokumentzeile sollte eine
    allgemeine Beschreibung der Klasse sein.

    Attributes:
        attribute1 (type): Beschreibung.
        attribute2 (type): Beschreibung.
    """
```

Werden **Attribute** mit `@property` definiert sollten diese in dessen **getter Methode** Dokumentiert werden.

> Weitere Infomationen sind bei dem [Google Styleguid](http://google.github.io/styleguide/pyguide.html#384-classess) zufinden.

### Globale Variablen

Globale Variablen können mit einem Dockstring versehen werden:

```Python
module_level_variable2 = 98765
"""type: Beschreibung.

Die Beschreibung kann mehrere Zeilen Lang sein
"""
```

`@Property` Getter methoden sollten auch so Dokumentiert werden.

## Kommentare

Kommentare sollten niemals den Code selbst Beschreiben sondern nur seine Funktion.

Kompliziertere Code Abschnitte sollten einen Längeren Kommentar über dem Code z.B.:

```python
code


# Description l1
# Description l2

code
```

> Zur Übersichtlichkeit sollten zwei Zeilen vor und eine Zeile nach dem Kommentar freibleiben

Für nicht Offensichtliche Operationen reicht ein Kommentar am ende z.B.:

```Python
if i & (i-1) == 0: # True if i is 0 or a power of 2.`
```

_src_: [Google Styleguid](http://google.github.io/styleguide/pyguide.html#382-modules)

### TODO Kommentare

Todo Kommentare sollten einen Author enthalten z.B.:

```Python
# TODO(Max) Beschreibung.
```

## Globale Variablen

Globale Variablen sollten Vermiden Werden. Mit der **Ausnahme** von **Konstanten auf Modulebene** diese sind erlaubt und erwüncht.

## Quellen

- http://google.github.io/styleguide/pyguide.html
- https://dev.to/codemouse92/dead-simple-python-project-structure-and-imports-38c6
- https://docs.python.org/3/
