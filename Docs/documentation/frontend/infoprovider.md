# **Infoprovider**

## CreateCustomData

Die Komponente **CreateCustomData** ist für die Formelerstellung zuständig. Es soll ermöglicht werden, dass ein Nutzer seine ausgewählten Daten benutzen kann, um neue Werte für den Info-Provider zu erstellen. Dazu wird in der Komponente eine weitreichende GUI, ähnlich zu einem Taschenrechner bereitgestellt. So können Datenwerte und oder Zahlen miteinander verrechnet werden. Die so entstandenen neuen Werte lassen sich unter einem eigenen Namen in den React-State **name** abspeichern. Diese zusätzlichen Variablen können auch sofort weiterverarbeitet werden.

Die GUI besteht aus 5 wichtigen Bereichen.
* Ein *Text-Feld*, um der zu erstellenden Formel einen Namen zu geben,
* ein *Input-Feld*, in dem die erstellte Formel erscheint,
* *Eingabe-Tasten* in einem Block für ein Ziffern-Feld, Klammern, Rechenoperationen und einer "zurück"- und "löschen"-Option,
* eine Liste aus den *ausgewählten Daten* aus der **DataSelection**, die auch als Eingabe-Tasten dargestellt werden
* und eine Fußleiste, in der man wie bei den anderen Komponenten mit "zurück" und "weiter" durch die Schritte der InfoProvider-Erstellung navigieren kann und in der sich die "Speichern"-Schaltfläche befindet

Zu der Liste der ausgewählten Daten werden automatisch auch die Namen neu erstellter Formeln hinzugefügt, um diese in neuen Formeln mit zu benutzen. Ausschlaggebend dafür sind **selectedData** und **customData** aus der umschließenden Komponente. Dabei gibt es bei diesen zusätzlich die Möglichkeit die Formel über eine eigene Taste zu löschen. Wie bei einem Taschenrechner mit der zusätzlichen Option die ausgewählten Daten einzugeben, kann der Nutzer nun frei Eingaben tätigen und sich so seine Formel zusammenstellen.

### Überprüfung der Syntax
Durch die oben genannte Freiheit könnte man mit Leichtigkeit Berechnungen eingeben, die syntaktisch keinen Sinn ergeben. Also muss sichergestellt werden, dass ein Nutzer richtige Eingaben tätigt. Das geschieht in zwei Schritten.

**Eingrenzung der Eingaben:**

Wir haben uns dazu entschieden die Eingaben eines Nutzers dahingehend zu begrenzen, dass nur eine korrekte Eingabe ermöglicht wird. Es wird eine syntaktisch richtige Reihenfolge der Zeichen erzwungen. Dazu werden Tasten, die ein Zeichen repräsentieren, welches als nächstes nicht verwendet werden darf, deaktiviert.
Intern besitzt die Komponente verschiedene boolean-Werte (im Folgendem als **Flags** bezeichnet) die eine einzelne Taste oder eine Gruppe von Tasten repräsentieren, falls diese gleiches Verhalten zeigen. Wenn dieser Flag auf *true* gesetzt ist, ist die Taste deaktiviert und kann nicht betätigt werden. Es gibt folgende Flags:
* **numberFlag**: für die Ziffern-Tasten (0 - 9),
* **opFlag**: für die Tasten für Rechenoperationen (+, -, *, /, %),
* **dataFlag**: für die Tasten für die Eingabe eines Datums aus der Datenauswahl und erstellte Formeln,
* **leftParenFlag**: für"Klammer auf",
* und **rightParenFlag**: für "Klammer zu".

Jede dieser Kategorien besitzt eine eigene Handler-Methode, die die anderen und das eigene Flag neu setzt und somit die folgende Eingabe einschränkt. Zusammengefasst sind das die Folgenden:
* **handleNumberButtons()**: für Ziffern,
* **handleDataButtons()**: für Daten und erstellte Formeln,
* **handleOperatorButtons()**: für Rechenoperationen,
* **handleLeftParen()**: für "Klammer auf",
* und **handleRightParen()**: für "Klammer zu"

So können zum Beispiel Eingaben, wie 	```7 + / 8``` oder ```10 - 6BspDatum *``` verhindert werden.
Manche Flags nehmen auch direkt Einfluss auf die "Speichern"-Schaltfläche und können diese ebenfalls deaktivieren. **handleLeftParen()** und **handleRightParen()** zählen zusätzlich mit, wie oft sie aufgerufen wurden (**leftParenCount**; **rightParenCount**). Dadurch kann eine Formel nur dann abgespeichert werden, wenn die Anzahl offener Klammen gleich der Anzahl geschlossener Klammern ist.
Nachdem eine Rechenoperation benutzt wurde, muss eine Zahl oder ein Datum folgen, damit die Formel abgespeichert werden kann.

Uns ist bewusst, dass gewisse Vereinfachungen in Rechnungen, die normalerweise syntaktisch korrekt sind, bei uns nicht unterstützt werden. Beispiele dafür sind Negierungen: ```10 * -BspDatum``` oder Klammerungen, bei denen man ein Mal-Zeichen typischerweise weglässt: ```5 + 10(BspDatum)```. Sowas kann man jedoch mit Leichtigkeit umgehen, indem die Rechnungen ausgeschrieben werden. Das ist mit der GUI ohne Probleme möglich: ```10 * (0 - 1) * BspDatum```; ```5 + 10 * BspDatum```.

**Überprüfung im Backend:**

Zusätzlich wird eine Formel mit dem Betätigen der "Speichern"-Schaltfläche an das Backend übermittelt, um dort sicherheitshalber ein zweites Mal auf syntaktische Korrektheit überprüft zu werden. Gesendet wird ein JSON mit den Formel-String als Inhalt. Im Backend wird die Biblothek **ast2json** verwendet. Diese nimmt den String entgegen und versuch daraus einen abstrakten Syntax-Baum zu erstellen. Vom Backend empfangen wir dann ebenfalls ein JSON mit dem Inhalt true oder false. True bedeutet, der Syntax-Baum konnte erstellt werden. Das ist gleichbedeutend damit, dass die Formel syntaktisch **Sinn** **ergibt**. Das schließt natürlich Eingabefehler vom Nutzer, wie das Nichtbeachten von "Punkt vor Strich"-Rechnung, nicht aus. False bedeutet, dass es einen Fehler in der Syntax gibt und der Nutzer wird gebeten seine Formel zu berichtigen. Zuständig dafür ist die **useCallFetch**-Methode **sendTestData()**.
Es sei hier noch darauf hingewiesen, dass das Backend die übermittelte Formel keinesfalls schon abspeichert. Das komplette Absenden und Abspeichern einer Formel mit Input-String und Name wird im letzten Schritt der Infoprovider-Erstellung **SettingsOverview** behandelt.

### Interne Darstellung
Intern wird eine Formel als ein Objekt dargestellt, welches **formelObj** heißt. Dieses Objekt beinhaltet lediglich zwei Strings, einen für den Namen der Formel und einen für die Formel bzw. die Rechnung selbst. Die übergeordnete Komponente **CreateInfoProvider** besitzt ein Array aus diesen **formelObj**-Objekten: **customData**. So können die erstellten Formeln abgespeichert werden und bis zum Absenden an das Backend gespeichert werden.

Die Formel selbst besteht aus einer Aneinanderreihung von Objekten namens **StrArg**. Diese Aneinanderreihung wird als ein Array umgesetzt, welches **DataAsObj** heißt. Jedes mal, wenn ein entsprechender Handler von einer der oben beschriebenen Schaltflächen aufgerufen wird, wird ein neues **StrArg**-Objekt mit dem entsprechenden Zeichen erstellt und in **DataAsObj** eingefügt.
```javascript
dataAsObj.push(new StrArg());
```
Die **StrArg**s bestehen aus einer String-Repräsentation und verschiedenen boolean-Flags. **StrArg**s haben die Methode **makeStringRep()** welche die enthaltene String-Repräsentation ausgibt. Durch diese kann mit **DataAsObj** der Input-String generiert werden, welcher im Input-Feld erscheint und auch als Formel in **formelObj** abgespeichert wird. Die dafür verantwortliche Formel heißt **calculationToString()**.
```javascript
setInput(calculationToString(dataAsObj));
```
Durch die Flags kann identifiziert werden, ob es sich um *Rechenoperationen, Ziffern, Klammer auf, Klammer zu* oder *Daten* handelt. Das Einsetzten von Objekten ermöglicht ebenfalls, dass Eingaben wie eine Zahl oder ein Datum, welches selbst aus einen Name bzw. String besteht, als gleich behandelt werden.
Das und die Flags sind ausschlaggebend dafür, dass die letzte Eingabe mit "zurück" zurückgenommen werden kann.

### "Zurück" und "Löschen"

Für das optimierte Bedienen der GUI soll es dem Nutzer ermöglicht werden, seine Eingabe komplett zu löschen oder seine letzte Aktion zurückzurufen. Dazu gibt es zwei Schaltflächen in der Oberfläche: die "zurück"- und "löschen"-Taste.

Die Händler-Methode für das Löschen **fullDelete()** setzt im Grunde die ganze Eingabe zurück. Alle Objekte aus **DataAsObj** werden gelöscht. Da aus **DataAsObj** der Input-String generiert wird, ist das Input-Feld somit auch leer.
```javascript
setDataAsObj(new Array<StrArg>(0));
setInput('');
```
Die gesetzten Flags zum Deaktivieren der Tasten werden auf ihren Start-Zustand gesetzt. Somit kann der Nutzer ohne Probleme eine neue Formel anfangen.

**handleDelete()**, die Handler-Methode für das Zurückrufen der letzten Aktion, ist ein bisschen komplexer. Die grundlegende Funktion ist, dass das letzte **StrArg** aus **DataAsObj** gelöscht wird. Das ist kein Problem:
```javascript
dataAsObj.pop();
setInput(calculationToString(dataAsObj));
```
Der wichtige Teil ist, die Flags der Input-Tasten richtig neu zu setzten. In den **StrArg**s ist festgehalten, um welche Eingabe es sich handelt. So kann in dieser Handler-Methode explizit auf jede Eingabe individuell reagiert werden, damit sich das Deaktivieren der Tasten korrekt verhält.
```javascript
const handleDelete = () => {
...
    if (dataAsObj[dataAsObj.length - 1].isNumber) {
        // korrektes Setzten der Flags, falls das zu löschende Zeichen eine Ziffer ist.
        // -> letztes Element von dataAsObj
    }
...
}
```
Falls **DataAsObj** nur aus einem Objekt besteht, wird automatisch der Handler für "löschen" aufgerufen.
```javascript
if (dataAsObj.length <= 1) {
    fullDelete()
}
```

### Das Löschen einer Formel
Der Nutzer hat die Möglichkeit, eine Formel zu löschen. In der erstellten Liste der Datenwerte wird für Formeln auch eine Schaltfläche zum Löschen generiert. Betätigt man diese, wird die Formel mit **deleteCustomData()** aus **customData** entfernt und steht somit nicht mehr zur Verfügung. Die Komponente Wird neu generiert und die gelöschte Formel erscheint nicht mehr in der Auswahlliste.

### Abschließende Überprüfungen

Am Ende sei noch auf einige kleine Überprüfungen eingegangen.
* Beim Erstellen einer Formel wird überprüft, ob der ausgewählte Name bereits vergeben wurde. Dazu wird **CustomData** nach den aktuellen Input-String durchsucht und der Nutzer wird benachrichtigt, wenn er einen bereits vergebenen Namen für die neue Formel wählt.
* Leerzeichen im Namen einer Formel werden automatisch mit "_" ersetzt. Die Bibliothek **ast2json** im Backend würde ein Leerzeichen als Trennung zwischen zwei Operatoren sehen und somit eventuell Formeln nicht richtig bearbeiten.
* Falls entweder das Text-Feld für den Namen oder das Input-Feld für die Formel leer ist, wird der Benutzer beim Versuch abzuspeichern benachrichtigt.
* Falls ein Nutzer die "zurück"- oder "löschen"-Tasten benutzt, während das Input-Feld leer ist, wird er benachrichtigt, dass es nichts zum Löschen gibt.

## **HistorySelection**
In dieser Komponente wird dem Nutzer die Möglichkeit zur Verfügung gestellt, Daten auszuwählen, welche er historisieren möchte.

Dabei besitzt diese Komponente auch einen eigenen Step, da sich die Komponente in zwei Bereiche / Unterkomponenten aufteilt:
1. Wahl der zu historisierenden Daten
2. Wahl der Historisierungszeitpunkte.

Die Methode `handleDataProceed` und `handleScheduleBack` werden dabei für den Wechsel der beiden Steps verwendet.

Die Methode `getContent` lädt die anzuzeigenden Komponenten, wobei bei der Datenauswahl ein `handleSkipProceed` übergeben wird. Dieser erhält als Wert die `handleContinue`-Methode der übergeordneten Komponente und wird benötigt, falls keine Daten für die Historisierung ausgewählt werden.

### **HistoryDataSelection**
Mittels der `checkProceedMethod`-Methode wird geprüft, ob Daten für die Historisierung ausgewählt wurden. Wenn keine Daten ausgewählt wurden, so kann die Zeitauswahl der Historisierung übersprungen werden. Mit den Methoden `addToHistorySelection` und `removeFromHistorySelection` werden zu historisierende Daten in den entsprechenden State der Oberkomponente aufgenommen oder von diesem entfernt. Die beiden Methoden werden durch `checkboxHandler` aufgerufen. Diese Methode führt dabei die entsprechend benötigte Methode aus. Dabei wird zunächst geprüft, ob das übergebene Objekt bereits in `historizedData` enthalten ist oder nicht. Anhand dieser Auswertung kann dann die benötigte Methode bestimmt werden.

Die Methode `renderListItem` wird dabei durch das Rendern der Komponente aufgerufen. Dabei wird die `historizedData.map` verwendet, um für jedes Element aus dem Array ein passendes Listenelement zu generieren.


### **HistoryScheduleSelection**
Der State `currentTimeSelection` wird benötigt, um die aktuelle Uhrzeit, welche vom Nutzer durch einen Picker eingestellt wird, zu speichern. 

Mit der Methode `setScheduleTime` kann `currentTimeSelection` dann durch einen String ersetzt werden, welcher das korrekte Format einer Uhrzeit besitzt, also "hh:mm".

Mittels der Methoden `addDay` und `removeDay` werden Wochentage zum Array der ausgewählten Wochentage hinzugefügt, bzw. davon entfernt. Die Methode `toggleSelectedDay` verwendet dabei die beiden genannten Methoden, um einen Wechsel beim Klick auf einen Wochentag zu ermöglichen.

Mit den Methoden
* `changeToWeekly`
* `changeToDaily`
* und `changeToInterval`
wird zwischen den einzelnen Typen des Schedule-Objekts gewechselt. Diese werden aufgerufen, wenn der entsprechende Radio-Button ausgewählt wurde.

Mit der Methode `setInterval` wird der Value des geklickten Radio-Buttons ausgewertet und der Variable `interval` im Schedule-Objekt zugewiesen.

Die Objekte, die ein Nutzer dabei sieht, ändern sich dabei je nach Auswahl. Dafür wird die `Collapse`-Komponente von MaterialUI verwendet:

```javascript
<Collapse in={/*Condition for collapsed or non collapsed here. True means collapsed*/}>
    /*Content for Collapse here*/
</Collapse>
```

#### **WeekdaySelector**
Im `WeekdaySelector` wird die Auswahl von Wochentagen für die Historisierung ermöglicht. Dabei gibt es ein Enum `Weekday`, welches die Werte für die einzelnen Wochentage enthält. Mit der Methode `getDayIndex` kann aus solch einem Wochentag der Index gewonnen werden, d.h. der Wochentag als Zahl dargestellt werden. Die 0 beschreibt dabei den Montag, die 1 den Dienstag, usw.

Das Rendering der Komponente greift auf die Methode `renderWeekday` zu. Diese erzeugt dabei für jeden Wochentag einen Button und färbt diesen ein. Die Einfärbung ist dabei abhängig davon, ob der Wochentag in die Historisierung aufgenommen wurde oder nicht.

## **SettingsOverview**
Mit der Methode `renderListItem` kann ein einzelnes Listenelement gerendert werden. Dabei ist ein Listenelement ein Element aus den ausgewählten API-Daten (`selectedData`), aus den eigens angelegten Daten (`customData`) oder ein Element aus den zu historisierenden Daten. Die Komponente wird mit Hilfe dieser Methode so dargestellt, dass nebeneinander die Daten (ausgewählte API-Daten und eigene Daten) und die zu historisierenden Daten angezeigt werden. Sollte der Bildschirm allerdings zu klein sein, so werden die Listen untereinander gerendert. Unter den zu historisierenden Daten wird noch eine Tabelle gerendert, welche Informationen zu den gewählten Schedule-Zeitpunkten beinhaltet.

### **ScheduleTypeTable**
Diese Komponente dient der Darstellung der Informationen zu den vom Nutzer gewählten Schedule-Zeitpunkten als Tabelle. Mit der Methode `createTableRow` kann eine Tabellenzeile mit entsprechenden Werten generiert werden. Dabei wird immer ein Name (bzw. ein Attribut) und ein Value für dieses Attribut erwartet. Zurückgegeben wird dann ein Objekt aus beiden Werten. In der Methode `generateTableRows` kann diese Methode dann verwendet werden, um die einzelnen Tabellenzeilen in ein Array zu verpacken, welches alle Tabellenzeilen beinhaltet. Dabei werden die einzelnen Typen der Historisierungszeiten hier unterschieden und es werden für jeden Typ nur die notwendigen Informationen generiert.

Mit den Methoden `getIntervalString`, `getTypeString` und `getWeekdaySelectionString` können dann die einzelnen Werte für den Nutzer lesbar umgewandelt werden, da das Schedule-Objekt nur eine interne Repräsentation der Daten beinhaltet. Die Methode `getWeekdayString` ist eine Hilfsmethode, welche für eine Zahl den entsprechenden Wochentag zurückgibt. Dabei steht die 0 für Montag und die 6 für Sonntag, alle anderen Werte liegen also dazwischen.

Das Rendering der Komponente generiert dann anhand des Arrays, welches durch `generateTableRows` zurückgegeben wird, die Tabelle mit ihren entsprechenden Zeilen.
