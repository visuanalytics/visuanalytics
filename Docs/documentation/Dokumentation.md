# Dokumentation

## Frontend

### Gui

Die grafische Benutzeroberfläche wurde mithilfe des Web-Frameworks ReactJS in TypeScript geschrieben und mit der Erweiterung Material-UI designt.

### Struktur

Die Oberfläche besteht aus mehreren Komponenten (Components), welche je nach Bedarf geladen und angezeigt werden. So wird beispielsweise bei einem Klick auf einen Button keine neue html-Datei geladen, sondern in die aktuelle, der neue `Component` hinzugefügt.

<figure>
  <img width="90%" src="../_static/images/documentation/ReactDiagramm.png"/>
  <figcaption>Abbildung 1</figcaption>
</figure>  
<br>

#### index

Die `index.html` wird vom Browser geladen. Diese beinhaltet den div-Container `root`:

```HTML
<div id="root"></div>
```

In der `index.tsx` wird mithilfe der ID, der Component `App` in den Container geladen.

```tsx
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
```

#### App

Der Component `App` besteht aus einem `Header`- und einem `Main`-Component.

Der `Header` steht immer am oberen Bildschirmrand, daher liegt dieser über `Main`. In `Main` wird der Inhalt der Seite geladen.

```html
<ComponentProvider>
  <header />
  <main />
</ComponentProvider>
```

#### Header

<figure>
  <img width="100%" src="../_static/images/documentation/Header.png"/>
  <figcaption>Abbildung 2</figcaption>
</figure>  
<br>

Der Component `Header` stellt den Header der Oberfläche dar. Dieser soll durchgehend am oberen Bildschirmrand angezeigt werden. Er zeigt immer an auf welcher Seite des Programms man sich befindet.

#### Main

```tsx
export const Main = () => {
  const component = React.useContext(ComponentContext);
  return <>{component ? <component.current.component /> : null}</>;
};
```

`Main` zeigt immer den aktuellen Component an. Soll sich also die Seite beim Klicken auf einen Button verändern, so muss nur der aktuelle Component (`current.component`) gesetzt werden.

#### Home

```tsx
<Container maxWidth={"md"} className={classes.margin}>
    <Paper variant="outlined" className={classes.paper}>
        {..}
        <JobList/>
    </Paper>
</Container>

```

`Home` stellt die Startseite dar. Auf dieser wird eine Liste aller angelegten Jobs angezeigt. Dazu gibt es den Component `JobList`.

#### JobList

```tsx
{
  jobInfo.map((j) => (
    <div key={j.id}>
      <JobItem />
    </div>
  ));
}
```

In dem Component `JobList` wird für jeden angelegten Job ein Component von `JobItem` generiert.

#### JobItem

<figure>
  <img width="100%" src="../_static/images/documentation/Item.png"/>
  <figcaption>Abbildung 3</figcaption>
</figure>  
<br>

Ein `JobItem` beinhaltet die genaueren Informationen zu einem Job.

#### JobCreate

Möchte man einen neuen Job erstellen, so wird beim klicken auf den dazugehörigen Button der Component `JobCreate` in den `Main`-Component geladen.

```ts
onClick={() => components?.setCurrent("jobpage")}
```

Daraufhin wird ein Stepper geladen, welcher aus drei Seiten besteht.

<figure>
  <img width="100%" src="../_static/images/documentation/stepper.gif"/>
  <figcaption>Abbildung 4</figcaption>
</figure>
<br>

#### TopicSelection

Die erste Seite `TopicSelection` dient zur Auswahl des Themas. Dort kann man sich für eines der vorgegebenen Themen entscheiden und einen Namen für den Job festlegen.

<figure>
  <img width="70%" src="../_static/images/documentation/topic.png"/>
  <figcaption>Abbildung 5</figcaption>
</figure>  
<br>

#### ParamSelection

Die zweite Seite des Steppers gibt einem die Möglichkeit - je nach Thema - individuelle Angaben zu tätigen. So kann bei einem Wetterbericht z.B. der gewünschte Ort angegeben werden.

<figure>
  <img width="70%" src="../_static/images/documentation/param.png"/>
  <figcaption>Abbildung 6</figcaption>
</figure>  
<br>

#### ScheduleSelection
Auf der letzten Seite kann der Benutzer auswählen, wie häufig ein Video generiert werden soll.

**täglich:** Das Video wird täglich zu einer bestimmten Uhrzeit generiert.
**wöchentlich:** Das Video wird an bestimmten Wochentagen wöchentlich generiert.
**an festem Datum:** Das Video wird einmalig an einem bestimmten Datum generiert.

<figure>
  <img width="70%" src="../_static/images/documentation/schedule.png"/>
  <figcaption>Abbildung 7</figcaption>
</figure>  
<br>

## Web-API

### Datenbank

Für die Datenbank wird eine SQLite-Datenbank verwendet.

_(Eine spätere Anbindung an einen SQL-Server ist aber einfach möglich.)_

Die Tabelle `job` beinhaltet einen Job für eine Videoreihe. Diese hat die ID für seine Schritte gespeichert. In der Tabelle `schedule` wird die Zeit gespeichert, an welcher der Job ausgeführt werden soll. z.B.: Wenn der Job täglich um 12:00 Uhr ausgeführt werden soll, steht in der Datenbank:

date = null,  
time = 12:00,  
weekday = null,  
daily = True.

Es sind auch mehrere Schedule-Einträge für einen Job möglich.

In der Tabelle `job_config` stehen die Konfigurationswerte, die bei der Ausführung des Jobs verwendet werden. Diese bestehen aus Key/Value-Paaren.

<figure>
  <img width="70%" src="../_static/images/documentation/db-diagramm.png"/>
  <figcaption>Abbildung 8</figcaption>
</figure>  
<br>

## Scheduler

<figure>
  <img width="70%" src="../_static/images/documentation/SchedulerClass.png"/>
  <figcaption>Abbildung 9</figcaption>
</figure>  
<br>

Der Scheduler prüft minütlich, ob ein neuer Job ausgeführt werden soll (_Abbildung 10_).

<figure>
  <img width="100%" src="../_static/images/documentation/scheduler.gif"/>
  <figcaption>Abbildung 10</figcaption>
</figure>  
<br>

Es gibt zwei Varianten des Schedulers. Der JsonScheduler prüft anhand einer Json-Datei, ob ein Job ausgeführt werden soll. Der DbScheduler hingegen entnimmt die Informationen einer Datenbank und prüft anhand von diesen, ob ein Job ausgeführt werden soll.

`start()`  
Diese Methode startet den Scheduler.

`_check_all()`  
Nachdem der Scheduler gestartet wurde, wird in dieser Methode jede Minute geprüft, ob ein Job auszuführen ist. Ist dies der Fall, so wird die Methode `\_start_job()` aufgerufen.

`_start_job()`  
Diese Methode startet den Job in einem neuen Thread.

## StepData

Eine Beschreibung hierfür befindet sich [hier](../usage/stepsConfig.md).

## API

Für die API-Anfragen gibt es folgende Möglichkeiten:

`request`  
Fragt einmal die gewünschten Daten einer API ab.

`request_multiple`  
Fragt für einen variablen Key, mehrere Male gewünschte Daten einer API ab.

`request_multiple_custom`  
Fragt unterschiedliche Daten einer API ab.

Für die Wetterberichte werden die folgenden API-Typen verwendet:

| API-Typ              | Beschreibung                                                                                                                        |
| -------------------- | ------------------------------------------------ |
|request_multiple      |Anfrage für die Wetterdaten von mehreren Städten  |
|request               |Anfrage für die Wetterdaten von einer Stadt       |

Für den Fußballbericht werden die folgenden API-Typen verwendet:

| API-Typ               | Beschreibung                                                                                                                        |
| --------------------  | ----------------------------------------------------------------------------------------------------------------------------------- |
|request_multiple_custom|Anfrage für mehrere unterschiedliche Daten, die jeweils noch andere Parameter haben.       |
|request                |Anfrage, um z.B. die Tabelleneinträge oder die Spielergebnisse eines Spieltages abzufragen.|
|request_memory         |Zugriff auf in der internen Datenbank abgespeichertes Dictionary                           |

Für die Twitter-Wordcloud werden die folgenden API-Typen verwendet:

| API-Typ              | Beschreibung                                                                                                                        |
| -------------------- | ------------------------------------------ |
|request               |Anfrage für die Twitter-Daten zu einem Thema|

## Transform

Mit den `transform`-Typen werden Funktionen implementiert, mit denen man die aus den API-Request erhaltenen Daten transformieren kann.

**Wetterbericht**  
Für den Wetterbericht werden folgende Funktionen verwendet:

| transform-Typ        | Beschreibung                                                                                                                        |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| transform_dict       | Führt alle angegebenen `transform`-Funktionen für alle Werte eines Dictionaries aus.                                                |
| select               | Entfernt alle Keys, die nicht in `relevant_keys` stehen aus dem Dictionary.                                                         |
| select_range         | Entfernt alle Werte aus `array_key`, die nicht in `range` sind.                                                                     |
| transform_array      | Führt alle angegebenen `transform`-Funktionen für alle Werte eines Arrays aus.                                                      |
| calculate(round)     | Rundet gegebene Werte auf eine gewünschte Nachkommastelle.                                                                          |
| append               | Speichert den Wert unter `key` in einem Array.                                                                                      |
| calculate(ms_to_kmh) | Wandelt die gegebenen Werte mit der Einheit m/s in km/h pro Stunde um -> Multiplikation mit 3.6                                                                                                                                    |
| add_symbol           | Fügt ein Zeichen, Symbol, Wort oder einen Satz zu einem Wert hinzu.                                                                 |
| replace              | Ersetzt ein Zeichen, Symbol, Wort, einen Satz oder eine ganzen Text in einem String.                                                |
| date_weekday         | Wandelt das angegebene Datum in den jeweiligen Wochentag um.                                                                        |
| timestamp            | Wandelt einen UNIX-Zeitstempel in ein anderes Format um.                                                                            |
| wind_direction       | Wandelt einen String von Windrichtungen um. (geht nur für dieses Format und nur für die Weatherbit-API)                             |
| translate_key        | Setzt den Wert eines Keys zu einem neuen Key als Wert für die JSON. (wählt aus dict einen Code als Key und gibt dazu den Value aus) |
| choose_random        | Wählt einen Text aus mehreren gegebenen Texten aus                                                        |
| date_now             | Generiert das heutige Datum und gibt es im gewünschten Format aus.                                                                  |

Für den deutschlandweiten Wetterbericht werden die Wetterdaten von 19 Städtenabgefragt, um eine Tendenz berechnen zu können wie die Durchschnittswerte an einem Tag in ganz Deutschland sind.  
Dafür wird die `transform`-Funktion `transform_dict` verwendet. Mithilfe dieser Funktion kann in der JSON-Datenstruktur ein neuer Dictionary-Eintrag generiert werden, in dem Zusammenfassungen von Daten aus allen 19 Anfragen zu einem bestimmten Datum berechnet werden.  
Zunächst werden z.B. alle maximalen Temperaturwerte für einen Tag von allen Städten in einem Array gespeichert. Mit der `calculate_mean`-Funktion wird aus diesem Array an Zahlen der Mittelwert berechnet und anstelle des Arrays in das Dictionary geschrieben. Außerdem kann z.B. auch der Minimal- und Maximalwert eines Arrays anstelle des Arrays zu einem Key in dem Dictionary abgespeichert werden.  
Mit `calculate_mode` wird das am häufigsten in einem Array vorkommende Element anstelle des Arrays gespeichert.

**Fußball-Bundesliga**

Nachdem die Weatherbit-API erfolgreich implementiert wurde, wurde sich um die Einbindung einer neuen API gekümmert. Die neue API ist die _openligadb_-API.  
Genauer genommen wurde zunächst die Darstellung der Fußball-Bundesliga-Ergebnisse in einem Video umgesetzt. Die zuvor implementierten Funktionen konnten größtenteils übernommen werden.

Für die API-Anfrage wurde die Funktion `request_multiple_custom` (ruft die Funktion `request` mehrmals) verwendet, die zuvor noch keine Verwendung gefunden hatte. Nun sollten nämlich die Tabelle der Bundesliga und die Spiele des aktuellen Spieltages abgefragt werden, dies sind bei der API zwei verschiedene einzelne Requests. Außerdem wurde eine weitere Funktion für die API-Anfragen implementiert: `request_memory`. Diese wird dafür benötigt, zuvor abgefragte Requests zu speichern.  
Bei _openligadb_ war das Problem, dass man nur die aktuelle Tabelle abfragen konnte und keine vorherigen. Vorherige Spieltage waren allerdings kein Problem. Die vorherigen Tabellen werden dafür benötigt Veränderungen zwischen der vorherigen und der aktuellen Tabelle visualisieren zu können. Wenn sich zum Bespiel eine Mannschaft auf der Tabelle um einen Platz verbessert oder verschlechtert hat, kann man dies mithilfe von Pfeilen oder einem anderen dazugehörigen Text darstellen.

Die zuvor implementierten `transform`-Funktionen konnten größtenteils übernommen werden. Einige wurden verallgemeinert, ergänzt, entfernt oder zusammengefügt zu einer Funktion. Nachdem die verbesserten Funktionen getestet wurden, wurden die Änderungen auch in den JSON-Dateien der Wetterberichte eingepflegt.

Folgende `transform`-Funktionen wurden verwendet:

| transform-Typ      | Beschreibung                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| alias              | Erstzt einen Key durch einen neuen Key.                                                                       |
| transform_array    | Führt alle angegebenen `transform`-Funktionen für alle Werte eines Arrays aus.                                |
| select             | Entfernt alle Keys, die nicht in `relevant_keys` stehen aus dem Dictionary.                                   |
| date_weekday       | Wandelt das angegebene Datum in den jeweiligen Wochentag um.                                                  |
| option             | Führt die aufgeführten `transform`-Funktionen aus, je nachdem ob ein bestimmter Wert `true` oder `false` ist. |
| compare            | Vergleicht zwei                                                                                               |
| random_string      | Wählt einen Text aus mehreren gegebenen Texten aus                                                                                                 |
| calculate subtract | Die jeweiligen Werte, die in subtract stehen, werden von den Werten, die in key stehen, subtrahiert.          |
| copy               | Kopiert einen Wert zu einem neuen Key                                                                        |
| delete             | Löscht die angegebenen Keys aus den Daten                                                                     |

Folgende Änderungen wurden durchgeführt, um die Funktionen allgemeiner und modularer zu gestalten:

`ms_to_kmh` wurde zu `calculcate_multiply`.  
Mit dieser Funktion kann man beliebige Einträge von Arrays miteinander mulitplizieren oder Array-Einträge immer mit einer bestimmten Zahl oder einfach zwei Zahlen miteinander.

Außerdem wurden `calculate_divide`, `calculate_subtract` und `calculate_add` hinzugefügt, um alle vier Hauptrechenarten abzudecken.

Die Funktion `choose_random` hatte ein Dictionary mit kleinen Dictionaries gegeben. Ein Key hatte eine festgelegte Anzahl an Key-Value-Paaren (ein kleines Dictionary) aus denen zufällig ein Value ausgewählten werden soll.

Beispiel:

`"500": {"1": "Text1", "2": "Text2"}`

Man musste immer genau diese Anzahl an Key/Value-Paaren eintragen, um die Funktion nutzen zu können.

Dies wurde so geändert, dass dort ein Dictionary mit

`"key": ["Array"]`

anstelle von

`"key": {"key": "Dictionary"}`

steht und man aus diesem Array zufällig einen Text auswählen kann, egal wie viele Einträge das Array hat.

Beispiel:

`"500": ["Text1", "Text2"]`

Diese Funktion (`choose_random`) wurde zu `random_string` umbenannt und man kann entweder ein Dictionary oder ein Array einfügen, aus dem ein Value per Zufall ausgewählt werden soll und unter einem neuen Key in der JSON abgespeichert wird.

Bei allen Funktion, mit denen das Datumsformat geändert werden kann, wurde ergänzt, dass man z.B. aus 05. Mai -> 5. Mai machen kann, wenn `zeropaded_of` auf `True` gesetzt wird. Dieser Key ist optional. Die Funktionen `option` und `compare` wurden neu hinzugefügt. Bei `option` wird überprüft, ob ein gewisser Wert `True` oder `False` ist und je nachdem, werden unterschiedliche Funktionen durchgeführt.  
Bei `compare` werden zwei Werte miteinander vergleichen. Je nachdem ob ein Wert gleich, größer oder kleiner als der andere Wert ist, werden unterschiedliche Funktionen durchgeführt.

Zudem wurden die Funktionen `copy` und `delete` implementiert.  
`copy` dient dazu, um einen Wert von einem Key zu einem anderen Key zu kopieren.  
Die Funktion `delete` dient dazu, Werte mit dem dazugehörigen Key aus der Datenstruktur zu entfernen, falls diese nicht mehr benötigt werden.

```note::
    Mit der JSON-Konfigurationsdatei kann aktuell nur ein Video zur 1. Fußball-Bundesliga erstellt werden.
    Wenn die neue Saison anfängt, können auch Videos zur 2. Fußball-Bundesliga erstellt werden.
    
    Aktuell können die Testdaten nur zur Generierung eines Videoszur 1. Fußball-Bundesliga erstellt werden, da keine Testdaten 
    der 2. Fußball-Bundesliga vorliegen.

    Bei der Erstellung des Videos zur 1. Fußball-Bundesliga kann aktuell nur der Spielplan für den 1. Spieltag dargestellt werden, die Tabelle ist zunächst nur alphabetisch sortiert.
    Bei der Erstellung des Videos zur 2. Fußball-Bundesliga tritt ein Fehler auf, da in openligadb noch nicht alle Mannschaften aufgeführt sind.
    Wenn der 1. Spieltag allerdings gespielt wurde, sollte auch ein Video, der 2. Fußball-Bundesliga erstellt werden können.

    Da die Datei `football.json` bisher nur auf 18 Mannschaften ausgelegt ist, können keine Videos zu Ligen mit mehr oder 
    weniger Mannschaften erstellt werden. Sollen auch Videos für andere Ligen erstellt werden können, so muss dafür eine eigene JSON-Datei zusammengestellt werden.
```
**Wordcloud**

Um die Twitter-API zu verwenden, wird eine (oder mehrere) API-Anfragen gesendet mit Hashtags. Als Antwort erhält man unter anderem alle Posts, die das gesuchte Hashtag innerhalb der letzten 7 Tage verwendet haben.
Die API-Antwort wird so verkürzt, dass nur noch die Hashtags, die neben dem gesuchten Hashtag in den Posts verwendet wurden. Aus diesen Hashtags werden Wordclouds erstellt.

Mithilfe der Python-Library Wordcloud (Quelle: [https://github.com/amueller/word_cloud](https://github.com/amueller/word_cloud)) wurde der Image-Typ Wordcloud ergänzt. Es ist möglich verschiedene Parameter für die Wordcloud festzulegen.
Zum Beispiel kann die Wordcloud verschiedene Formen annehmen. Implementiert wurden Masken für "circle" und "square".
(siehe [Images: Wordcloud](#wordcloud))

Die zuvor implementierten `transform`-Typen konnten größtenteils nicht weiter verwendet werden und es mussten neue implementiert werden.
`transform_array`, `select`, `append` und `delete` konnten wiederverwendet werden.

Folgende transform-Typen wurden verwendet:

| transform-Typ    | Beschreibung                                                                                                                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| split_string     | Teilt einen String an der Stelle, an der ein bestimmtes Trennzeichen (delimiter) im String vorkommt.                                                                                          |
| convert          | Konvertiert einen Datentyp in einen anderen Datentyp.                                                                                                                                         |
| transform_array  | Durchläuft ein bestimmtes Array, um bestimmte Daten transformieren zu können.                                                                                                                 |
| delete           | Entfernt Key/Value-Paare, die nicht relevant für die Erstellung der Wordcloud sind.                                                                                                           |
| remove_from_list | Entfernt Wörter aus einer Liste.                                                                                                                                                              |
| option           | transform-Typen, die durchgeführt werden, wenn ein gewisser Wert true bzw. false ist.                                                                                                         |
| most_common      | Zählt wie oft ein Wort vorkommt und sortiert diese Liste (mit bzw. ohne die Zahl).                                                                                                            |
| sub_lists        | Erstellt aus einer großen Liste, eine (oder mehrere) kleinere Listen, die nur einen Teil der großen Liste repräsentieren.                                                                     |
| to_dict          | Wandelt ein Array aus Tupeln in ein Dictionary um.                                                                                                                                            |
| length           | Gibt die Länge eines Ararys bzw. einer Liste aus.                                                                                                                                             |
| join             | Erstellt aus den Elementen einer Liste einen String, indem die Elemente mit dem gewünschten Trennzeichen aufgeführt werden.                                                                   |
| select           | Wählt die Key/Value-Paare aus, die relevant für die Erstellung oder die Datenverarbeitung für die Wordcloud sind.                                                                             |
| append           | Fügt den Daten weitere Key/Value-Paare hinzu.                                                                                                                                                 |
| normalize_words  | Wörter, die mehrmals in einer Liste vorkommen, werden wenn die Groß- bzw. Kleinschreibung anders it als beim ersten Vorkommen eines Worts so geschrieben wie beim ersten Vorkommen des Worts. |

**Wordcloud-Parameter**

Es gibt verschiedene Parameter, die man beim Erstellen einer Wordcloud beeinflussen kann. Diese betreffen die Größe der Wordcloud und der Schrift. Die Hintergrundfarbe, Schriftfarben. Will man anstatt eines einfarbigen Hintergrunds ein Bild, geht dies durch die JSON und den Overlay-Typ "image" auch.
Die verschiedenen Parameter werden in der [Dokumentation zur Themenkonfiguration](#themenkonfiguration) genauer erläutert. Zum Teil wurden die Default-Parameter als solche übernommen (Quelle: [https://www.datacamp.com/community/tutorials/wordcloud-python](https://www.datacamp.com/community/tutorials/wordcloud-python)).
Andere Default-Parameter wurden angepasst. Die Schriftart sollte diegleiche sein, wie sie in den Wetterberichten und dem Fußball-Bericht auch verwendet wurde.

## Processing

### Audio

Im Audio Part können beliebig viele Texte welche in Audio übersetzt werden, angegeben werden.
Eine Audio datei besteht in der regel aus mehreren Parts, welche beim Programmdurchlauf dann zu einem Text zusammengesetzt werden
In der Regel erzeugt mann pro erstelltes Bild eine Audio Datei, dh wenn es `Football_Image_1`-`Football_Image_7` gibt  
so sollte es auch `Football_Audio_1` bis `Football_Image_7` geben, dies dient im Sequence Bereich dazu dass zu jeder Audio datei eine Video datei zugeordnert werden kann.
Natürlich kann dies auch varieren, dazu muss mann dann in Sequence aber den typ `custom` wählen

### Images

Im Image part können ebenso beliebig viele Bilder generiert werden. 
Es gibt derzeit 2 Image Typen mit welchen Bilder erzegt werden können:

#### Pillow
Bilder welche mit Pillow erstellt werden sind die meist Verwendeten Bilder in unseren Videos
Mit Pillow kann ein Angegebnes Bild bearbeitet werden mit folgenden Möglichkeiten:
Text einfügen sowie
Bilder einfügen, dies geschieht mit den beiden overlay Typen `Text` sowie `Image`, 
zusätzlich gibt es noch die Typen `Image-Array` und `Text-Array` diese dienen lediglich dazu um ähnliche Text/Bilder einfacher auf das Bild zu schreiben.
Ebensfalls funktioniert auch hier der `option` sowie `compare` Typ sofern man bestimmt Information auf das Bild schreiben möchte wenn eine Bedingung erfüllt ist

#### Wordcloud
Wordclouds sind Images, die erstellt werden können. Der Hintergrund kann einfarbig sein oder aber auch ein anderes Bild als Hintergrund haben. Hier wird dann mit dem overlay-Typ "image" gearbeitet.

Eine Wordcloud zum Thema Bundesliga sähe folgendermaßen aus:

<figure>
  <img width="90%" src="../_static/images/documentation/wordcloud_circle.png"/>
  <figcaption>Abbildung : Wordcloud zum Thema Bundesliga (mit "figure": "circle")</figcaption>
</figure>  
<br>

<figure>
  <img width="90%" src="../_static/images/documentation/wordcloud_square.png"/>
  <figcaption>Abbildung : Wordcloud mit "figure": "square"</figcaption>
</figure>  
<br>

Die Wörter, die zu sehen sind, sind alles Hashtags, die neben dem gesuchten Hashtag "Bundesliga" verwendet wurden.
Das Wort, welches am häufigsten als Hashtag verwendet wurde, ist das Wort, welches am größten dargestellt ist. Das Wort, welches am seltensten als Hashtag verwendet wurde, ist das Wort, welches am kleinsten dargestellt ist.

Man kann außerdem entscheiden, welche Wörter man auf keinen Fall in der Wordcloud haben möchte, die Stopwords. Dafür ist eine Textdatei im Resources-Ordner hinterlegt und man kann sie im Frontend eingeben,
falls spontan neue Stopwords hinzukommen. Die Textdatei mit den Stopwords kann optional verwendet werden. Es kann außerdem berücksichtig werden, dass Wörter, die upper, lower oder capitalized vorkommen, aber zu den Stopwords gehören, auch nicht auftauchen sollen.

Man kann auch Stopwords mit nur einen Wort, welches sich wiederholt, darstellen.

Möchte man einen Verlauf von dem am häufigsten genannten Hashtag zu dem immer das nächsthäufigste hinzu kommt, muss man einzelne Wordclouds erstellen und diese aneinanderhängen, damit man einen Verlauf als Video hat.
Dies geschieht dann mit dem Sequencer.

## Storing

Der Abschnitt `storing` ist dafür da, dass man z. B. die Tabelle eines jeden Spieltags im gleichen Zug abspeichert wie man sie aus der API erhält.
Der Abschnitt wurde hinzugefügt, weil die openligadb-API nur die Bundesliga-Tabelle des aktuellen Spieltags bereitstellt und nicht auch die der vorherigen Spieltage.
Um jedoch herauszufinden, ob sich eine Mannschaft im Vergleich zum vorherigen Spieltag verbessert oder verschlechtert hat oder auf dem gleichen Tabellenplatz ist wie zuvor, wurde auch die Tabelle vom vorherigen Spieltag benötigt. 

Zuerst wurden transform-Typen geschrieben, welche die vorherigen Tabelle anhand der Spielergebnisse des aktuellen Spieltags rekonstruiert haben (darunter gehörte u.A. `subtract`).
Dies war recht aufwändig, also kam die Idee mit dem Speichern von Dictionaries bzw. API-Antworten auf. Dies ist generell sehr sinnvoll und kann womöglich auch gut für weitere API-Schnittstellen bzw. weitere Video-Ideen verwendet werden.

## Thumbnail

Für ein Video, welches erstellt wird, kann man - wenn man das möchte - einen Thumbnail erstellen. Dieser kann zum Beispiel in einer Übersicht angezeigt werden.
Man kann einen Thumbnail aus einem bereits für das Video erstellten Bild generieren oder ein neues Bild erstellen, welches dann als Thumbnail abgespeichert wird.  

Nützlich ist dies zum Beispiel bei einer Übersichtsseite wie z.B. [hier](https://biebertal.mach-mit.tv/gemeinde/).
Es ist eine Art Vorschau für das, was im Video gezeigt wird. 

## Sequence

Im Sequence Bereich wird definiert wie ein Video zu render ist, bzw in welchen Reihenfolge und welcher Länge die Audios / Bilder
aneinander gereiht werden sollen. Als einfachsten Typ gibt es hier den `successively` Typ welcher einfach alle Bilder und alle Audios 
aneinanderreiht und jedes Bild solange zeigt wie die passende Audio Datei lang ist.

## run_config

Hier werden Parameter angegeben, die bei der Themen-Konfiguration im Frontend angegeben werden können.
Unter dem Abschnitt `run_config` werden die Konfigurationen eingefügt, die zur Laufzeit noch angegeben werden können.

| Name | Beschreibung | Frontend |
|----|----| ---- |
|`enum`|Auswahl an verschiedenen Werten vorgeben|Dropdown-Menü|
|`string`|Nutzereingabe eines Strings|Textfeld|
|`multi_string`|Nutzereingabe mehrerer Strings|Textfeld (komma-separierte Eingabe)|
|`number`|Nutzereingabe einer Zahl|Textfeld|
|`multi_number`|Nutzereingabe mehrerer Zahlen|Textfeld (komma-separierte Eingabe)|
|`boolean`|`true` oder `false`|Checkbox|
|`sub_params`|Wenn ein Parameter ausgewählt wurde, gibt es weitere Auswahlmöglichkeiten, die dann angezeigt werden, um ausgewählt zu werden| Je nachdem welchen Typ, der Unterparameter bzw. die Unterparameter haben (siehe vorherige Typen).|

## presets

Unter dem Abschnitt `presets` können Einstellungen vorgenommen werden für Images, die sich sonst bei der Konfiguration oft wiederholen.

Um diese Code-Mehrfachnennungen zu vermeiden, kann man diese als Preset anlegen indem man einem Set an Parametern einen Namen gibt, welcher dann z.B. bei der Image-Generierung als Einzeiler angegeben wird.
