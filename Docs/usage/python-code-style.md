# Python Style-Guide

Grundlegender Style-Guide für Python Source-Code-Dateien des Projekts. 

## Module

Jede `.py`-Datei ist ein Modul, z.B. `load_settings.py`

## Package

Wenn dieser Ordner von Python als Package erkannt werden soll, muss eine Datei mit dem Namen `__init__.py` darin enthalten sein. Der **Package-Name** entspricht dann dem **Ordnernamen**. Diese Datei ist normalerweise **leer** (weitere Details [hier](https://docs.python.org/3/tutorial/modules.html#packages)).

Normalerweise sollte **jeder** Ordner mit Python Source-Code ein **Package** sein.

> Kann in Pycharm mit `new package` direkt erzeugt werden.

## Namenskonvention

Grundsätzlich gilt in Python, dass Namen **klein geschreiben** werden und Wörter mit **Unterstrichen** verbunden werden, es gibt allerdings ein paar Ausnahmen. Des Weiteren sollten diese auch nicht zu lang sein.

**Namenskonventionen**:

- `module_name` (meist nur ein Wort)
- `package_name` (meist nur ein Wort)
- `ClassName`
- `method_name`
- `ExceptionName`
- `function_name`
- `GLOBAL_CONSTANT_NAME`
- `global_var_name`
- `instance_var_name`
- `function_parameter_name`
- `local_var_name`

## import 

`import`-Statements nur für **Packages** und **Module**, **nicht** für individuelle Klassen oder Funktionen benutzen.

- `import x` für Python Standard-Bibliotheken
- `from x import y` für eigene Packages und Module, wobei `x` der Package-Präfix und `y` der Module-Name ohne Prefix ist

  z.B. für das Module `myproject.data.use_api`:

```
from myproject.data import use_api
...
use_api.fetch
```

  > Bei zu langem oder bei gleichen Namen (`y`) kann auch **as** verwendet werden.

- `import y as z` für externe Packages und Module (am besten Standard-Abkürzungen verwenden (z.B.`np` für `numpy`)).

**Absolute imports verwenden:**

Ja: `from myproject.test.test_file import Test`

Nein: `from ..test.test_file import Test`

## Formatierung

Sollte durch **automatische** Formatierung von Pycharm passieren.

> Diese ist nicht immer perfekt, daher sollte man manchmal einige Sachen selbst formatieren.

Man kann Dokumente in Pycharm mit `STR` + `ALT` + `L` neu formatieren. Da man dies leicht vergessen kann, sollte man dies jedoch **automatisieren**. Dies kann man mit dem Plugin `Save Actions` machen.

### Installation von Save Actions in PyCharm

Unter File > Settings > Plugins

- Save Actions suchen und installieren
- PyCharm neustarten

### Einrichtung von Save Actions

Unter File > Settings > Save Actions

- General

  - Haken bei `Activate Save Actions on Save`
  
- Formatting Actions

  - Haken bei `Optimize imports`
  - Haken bei `Reformat File`

## Doc-Kommentare

In Python kann man mit `""" Docstring """` Kommentare zur Code-Dokumentation hinzufügen. Um im Nachhinein eine Dokumentation daraus zu generieren.
Die nachfolgenden Vorgaben basieren größtenteils auf den Regeln denen die IDE PyCharm folgt.

> Informationen, um die Dokumentation daraus zu generieren, befinden sich in der README des Repositories.

### Modul (Datei)

Jede Datei sollte mit einem Docstring beginnen, der den Inhalt und die Benutzung des Modules beschreibt:

```Python
"""Eine einzeilige Zusammenfassung des Moduls oder Programms, abgeschlossen durch einen Punkt.

Lassen Sie eine Leerzeile stehen. Der Rest dieser Dokumentzeile sollte eine
allgemeine Beschreibung des Moduls oder Programms sein.

Example:
    Ein Block für Code-Beispiele (optional).
"""
```

Die **Beispiel**-Sektion ist **optional**.

### Funktionen

Eine Funktion muss immer einen Docstring enthalten. **Ausnahme**: Funktionen, die auf die folgenden Kriterien passen:

- nicht außerhalb des Modules sichtbar
- sehr kurze Funktionen
- bei offensichtlichen Funktionen

```Python
def test(param1, param2):
    """Eine einzeilige Zusammenfassung der Funktion, abgeschlossen durch einen Punkt.

    Lassen Sie eine Leerzeile stehen. Der Rest dieser Dokumentzeile sollte eine
    allgemeine Beschreibung der Funktion sein.

    :param param1: Beschreibung.
    :type param1: str (optional)
    :param param2: Beschreibung.
        Beschreibungen über mehrere Zeilen sollten eingerückt werden.

    :return: Beschreibung.
    :rtype: str

    :raises ErrorName: Beschreibung.
    """
```

Sektionen die **nicht benötig** werden, können einfach **weggelassen** werden, wie z.B. `raises`, wenn die Funktion 
keinen Fehler hervorruft. Auch die **Argument-Typen** können **weggelassen** werden, wenn diese **schon** im **Code** 
angegeben werden. Sind **Funktionen** teil von **Klassen**, sollte der **self**-Parameter **nicht** mit angegeben werden.

### Klasse

Klassen sollten auch einen Docstring enthalten:

```Python
class SampleClass(object):
    """Eine einzeilige Zusammenfassung der Klasse, abgeschlossen durch einen Punkt.

    Lassen Sie eine Leerzeile stehen. Der Rest dieser Dokumentzeile sollte eine
    allgemeine Beschreibung der Klasse sein.

    :param attribute1: Beschreibung.
    :type attribute1: str (optional)
    :param attribute2: Beschreibung.
    :type attribute2: str (optional)
    """
```

Werden **Attribute** mit `@property` definiert, sollten diese in dessen **getter-Methode** dokumentiert werden.

### Globale Variablen

Globale Variablen können mit einem Docstring versehen werden:

```Python
module_level_variable2 = 98765
"""type: Beschreibung.

Die Beschreibung kann mehrere Zeilen lang sein.
"""
```

`@Property` Getter-Methoden sollten auch so dokumentiert werden.

### Allgemein

In den oberen Beispielen werden nicht alle Formatierungen gezeigt, die möglich sind.
In PyCharm kann man, wenn man sich in einem Docstring befindet 
durch das Drücken der Tastenkombination `str` + `enter` Vorschläge anzeigen lassen.

## Kommentare

Kommentare sollten niemals den Code selbst beschreiben, sondern nur seine Funktion.

Kompliziertere Code-Abschnitte sollten einen längeren Kommentar über dem Code haben, z.B.:

```
<code>


# Description l1
# Description l2

<code>
```

> Zur Übersichtlichkeit sollten zwei Zeilen vor und eine Zeile nach dem Kommentar freibleiben.

Für nicht offensichtliche Operationen reicht ein Kommentar am Ende, z.B.:

```
if i & (i-1) == 0: # True if i is 0 or a power of 2.`
```

_src_: [Google Style-Guide](http://google.github.io/styleguide/pyguide.html#382-modules)

### TODO Kommentare

TODO Kommentare sollten einen Author enthalten z.B.:

```Python
# TODO(Max) Beschreibung.
```

## Globale Variablen

Globale Variablen sollten vermieden werden. Mit der **Ausnahme** von **Konstanten auf Modulebene**, diese sind erlaubt und erwünscht.

## Quellen

- http://google.github.io/styleguide/pyguide.html
- https://dev.to/codemouse92/dead-simple-python-project-structure-and-imports-38c6
- https://docs.python.org/3/
