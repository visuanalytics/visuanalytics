# Dokumentation
## Frontend
### Gui
Die grafische Benutzeroberfläche ist mit mithilfe des Web-Frameworks ReactJS in TypeScript geschrieben und mit der Erweiterung Material-UI designt.
### Struktur
Die Oberfläche besteht aus mehreren Components, welche je nach Bedarf geladen und angezeigt werden. So wird Beispielsweise bei einem Klick auf einen Button keine neue html-Datei geladen, sondern in die aktuelle, der neue `Component`.

<figure>
  <img width="90%" src="../_static/images/documentation/ReactDiagramm.png"/>
  <figcaption>Abbildung 1</figcaption>
</figure>  
<br> 

#### index
Die `index.html` wird vom Browser geladen. Diese beinhaltet den div-Container `root`:
~~~HTML
<div id="root"></div>
~~~

In der `index.tsx` wird mit Hilfe der ID, der Component `App` in den Container geladen

~~~tsx
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
~~~

#### App
Der Component `App` besteht aus einem `Header` und einem `Main` Component. 

Der `Header` steht immer am Oberen Bildschirmrand daher liegt dieser über `Main`. In `Main` wird der Inhalt der Seite geladen.

~~~html
<ComponentProvider>
    <Header />
    <Main />
</ComponentProvider>
~~~

#### Header

<figure>
  <img width="100%" src="../_static/images/documentation/Header.png"/>
  <figcaption>Abbildung 2</figcaption>
</figure>  
<br>

Der Component `Header` stellt den Header der Oberfläche dar. Dieser soll durchgehend am oberen Bildschirmrand angezeigt werden. Er zeigt immer an auf welcher Seite des Programmes man sich befindet.

#### Main

~~~tsx
export const Main = () => {
  const component = React.useContext(ComponentContext);
  return <>{component ? <component.current.component /> : null}</>;
};
~~~

`Main` zeigt immer den aktuellen Component an. Soll sich also die Seite beim Klicken auf einen Button verändern, so muss nur der aktuelle Component (`current.component`) gesetzt werden.

#### Home

~~~tsx
<Container maxWidth={"md"} className={classes.margin}>
    <Paper variant="outlined" className={classes.paper}>
        {..}
        <JobList/>
    </Paper>
</Container>

~~~

`Home` stellt die Startseite dar. Auf dieser wird eine Liste aller angelegten Jobs angezeigt. Dazu gibt es den Component `JobList`.

#### JobList

~~~tsx
{jobInfo.map(j =>
    <div key={j.id}>
        <JobItem/>
    </div>)
}
~~~

In dem Component `JobList` wird pro angelegten Job ein Component von `JobItem` generiert.

#### JobItem
<figure>
  <img width="100%" src="../_static/images/documentation/Item.png"/>
  <figcaption>Abbildung 3</figcaption>
</figure>  
<br>

Ein JobItem besteht aus den genaueren Informationen zu einem Job. 

#### JobCreate
Möchte man einen neuen Job erstellen, so wird bei dem klicken auf den dazugehörigen Button der Component `JobCreate` in den Main-Component geladen.

~~~ts
onClick={() => components?.setCurrent("jobpage")}
~~~

Daraufhin wird ein Stepper geladen, welcher aus drei Seiten besteht.

<figure>
  <img width="100%" src="../_static/images/documentation/stepper.png"/>
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
Die zweite Seite des Steppers gibt einem die Möglichkeit je nach Thema individuelle Angaben zu tätigen. So kann bei einem Wetterbericht z.B. der gewünschte Ort angegeben werden.

<figure>
  <img width="70%" src="../_static/images/documentation/param.png"/>
  <figcaption>Abbildung 6</figcaption>
</figure>  
<br>

ScheduleSelection
Auf der letzten Seite kann der Benutzer auswählen, wie häufig ein Video generiert werden soll.

**täglich:** Das Video wird täglich zu einer bestimmten Uhrzeit generiert  
**wöchentlich:** Das Video wird an bestimmten Wochentagen wöchentlich generiert  
**an festem Datum:** Das Video wird einmalig an einem Datum generiert.

<figure>
  <img width="70%" src="../_static/images/documentation/schedule.png"/>
  <figcaption>Abbildung 7</figcaption>
</figure>  
<br>

## Web-API
### Datenbank
Für die Datenbank wird eine SQLite Datenbank verwendet. 

_(Eine spätere Anbindung an einen SQL-Server ist aber einfach möglich.)_

Die Tabelle `job` beinhaltet einen Job für eine Videoreihe. Diese hat die ID für seine Schritte gespeichert. In der Tabelle `schedule` wird die Zeit gespeichert, an welcher der Job ausgeführt werden soll. z.B.: Wenn der Job täglich um 12:00 Uhr ausgeführt werden soll, steht in der Datenbank, 

date = null,  
time = 12:00,  
weekday = null,  
daily = True.  

Es sind auch mehrere Schedule-einträge für einen Job möglich. 

In der Tabelle job_config stehen die Configwerte, die bei der Ausführung des Jobs verwendet werden. Diese bestehen aus key, value paaren.

<figure>
  <img width="70%" src="../_static/images/documentation/db-diagramm.png"/>
  <figcaption>Abbildung 8</figcaption>
</figure>  
<br>

## Scheduler

<figure>
  <img width="70%" src="../_static/images/documentation/SchedulerClass.png"/>
  <figcaption>Abbildung 8</figcaption>
</figure>  
<br>

Der Scheduler prüft minütlich, ob ein neuer Job ausgeführt werden soll. 

Es gibt zwei Varianten des Schedulers. Der JsonScheduler prüft anhand einer Json-Datei, ob ein Job ausgeführt werden soll. Der DbScheduler hingegen entnimmt die Informationen einer Datenbank und prüft anhand diesen, ob ein Job ausgeführt werden soll.

``start()``  
Diese Methode startet den Scheduler.

``_check_all()``  
Nachdem der Scheduler gestartet wurde, wird in dieser Methode jede Minute geprüft, ob ein Job auszuführen ist. Ist dies der Fall, so wird die Methode _start_job() aufgerufen.

``_start_job()``  
Diese Methode startet den Job in einem neuen Thread.

## StepData

Eine Beschreibung hierfür befindet sich [hier](../usage/stepsConfig.md).

## API
Für die API-Anfragen gibt es folgende Möglichkeiten: 

``request``  
Fragt einmal die gewünschten Daten einer API ab.

``request_multiple``  
Fragt für einen variablen Key, mehrere Male gewünschte Daten einer API ab.

``request_multiple_custom``  
Fragt unterschiedliche Daten einer API ab.

Für die Wetterberichte werden die ersten beiden Funktionen verwendet.

## Transform
Mit den ``transform``-Typen werden Funktionen implementiert, mit denen man die aus den API-Request erhaltenen Daten transformieren kann.

**Wetterbericht**  
Für den Wetterbericht werden folgende Funktionen verwendet:

|        Funktion        |       Beschreibung       |
|------------------------|--------------------------|
| transform_dict |Führt alle angegebenen `transform`-Funktionen für alle Werte eines Dictionaries aus.|
|select|Entfernt alle Keys, die nicht in `relevant_keys` stehen aus dem Dictionary.|
|select_range|Entfernt alle Werte aus `array_key`, die nicht in `range` sind.|
|transform_array|Führt alle angegebenen `transform`-Funktionen für alle Werte eines Arrays aus.|
|calculate(round)|Rundet gegebene Werte auf eine gewünschte Nachkommastelle.|
|append|Speichert den Wert unter `key` in einem Array.|
|calculate(ms_to_kmh)||
|add_symbol |Fügt ein Zeichen, Symbol, Wort oder einen Satz zu einem Wert hinzu.|
|replace|Ersetzt ein Zeichen, Symbol, Wort, einen Satz oder eine ganzen Text in einem String.|
|date_weekday|Wandelt das angegebene Datum in den jeweiligen Wochentag um.|
|timestamp|Wandelt einen UNIX-Zeitstempel in ein anderes Format um.|
|wind_direction|Wandelt einen String von Windrichtungen um. (geht nur für dieses Format und nur für die Weatherbit-API) |
|translate_key|Setzt den Wert eines Keys zu einem neuen Key als Wert für die JSON. (wählt aus dict einen Code als Key und gibt dazu den Value aus) |
|choose_random | (wählt Text aus dict ..dort sind pro key mehrere Wahlmöglichkeiten -> random) |
|date_now|Generiert das heutige Datum und gibt es im gewünschten Format aus.|

Für den deutschlandweiten Wetterbericht werden die Wetterdaten von 19 Städtenabgefragt, um eine Tendenz berechnen zu können wie die Durchschnittswerte an einem Tag in ganz Deutschland sind.  
Dafür wird die ``transform``-Funktion ``transform_dict`` verwendet. Mithilfe dieser Funktion kann in der JSON-Datenstruktur ein neuer Dictionary-Eintrag generiert werden, in dem Zusammenfassungen von Daten aus allen 19 Anfragen zu einem bestimmten Datum berechnet werden.  
Zunächst werden z.B. alle maximalen Temperaturwerte für einen Tag von allen Städten in einem Array gespeichert. Mit der ``calculate_mean``-Funktion wird aus diesem Array an Zahlen der Mittelwert berechnet und anstelle des Arrays in das Dictionary geschrieben. Außerdem kann z.B. auch der Minimal- und Maximalwert eines Arrays anstelle des Arrays zu einem Key in dem Dictionary abgespeichert werden.  
Mit ``calculate_mode`` wird das am häufigsten in einem Array vorkommende Element anstelle des Arrays gespeichert. 

**Fußball-Bundesliga**

Nachdem die Weatherbit-API erfolgreich implementiert wurde, wurde sich um die Einbindung einer neuen API gekümmert. Die neue API ist die _openligadb_-API.  
Genauer genommen wurde zunächst die Darstellung der Fußball-Bundesliga-Ergebnisse in einem Video umgesetzt. Die zuvor implementierten Funktionen konnten größtenteils übernommen werden.

Für die API-Anfrage wurde die Funktion ``request_multiple_custom`` (ruft die Funktion ``request`` mehrmals) verwendet, die zuvor noch keine Verwendung gefunden hatte. Nun sollten nämlich die Tabelle der Bundesliga und die Spiele des aktuellen Spieltages abgefragt werden, dies sind bei der API zwei verschiedene einzelne Requests.  Außerdem wurde eine weitere Funktion für die API-Anfragen implementiert: ``request_memory``. Diese wird dafür benötigt, zuvor abgefragte Requests zu speichern.  
Bei _openligadb_ war das Problem, dass man nur die aktuelle Tabelle abfragen konnte und keine vorherigen. Vorherige Spieltage waren allerdings kein Problem. Die vorherigen Tabellen werden dafür benötigt Veränderungen zwischen der vorherigen und der aktuellen Tabelle visualisieren zu können. Wenn sich zum Bespiel eine Mannschaft auf der Tabelle um einen Platz verbessert oder verschlechtert hat, kann man dies mithilfe von Pfeilen oder einem anderen dazugehörigen Text darstellen.

Die zuvor implementierten ``transform``-Funktionen konnten größtenteils übernommen werden. Einige wurden verallgemeinert, ergänzt, entfernt oder zusammengefügt zu einer Funktion. Nachdem die verbesserten Funktionen getestet wurden, wurden die Änderungen auch in den JSON-Dateien der Wetterberichte eingepflegt.

Folgende transform-Funktionen wurden verwendet: 

|        Funktion        |       Beschreibung       |
|------------------------|--------------------------|
|alias|Erstzt einen Key durch einen neuen Key.|
|transform_array|Führt alle angegebenen `transform`-Funktionen für alle Werte eines Arrays aus.|
|select|Entfernt alle Keys, die nicht in `relevant_keys` stehen aus dem Dictionary.|
|date_weekday|Wandelt das angegebene Datum in den jeweiligen Wochentag um.|
|option|Führt die aufgeführten `transform`-Funktionen aus, je nachdem ob ein bestimmter Wert `true` oder `false` ist.|
|compare||
|random_string||
|calculate subtract|Die jeweiligen Werte, die in subtract stehen, werden von den Werten, die in key stehen, subtrahiert.|
|copy|Kopiert einen Wert zu einem neuen Key.|
|delete|Löscht die angegebenen Keys aus den Daten|

Folgende Änderungen wurden durchgeführt, um die Funktionen allgemeiner und modularer zu gestalten:

``ms_to_kmh`` wurde zu ``calculcate_multiply``.  
Mit dieser Funktion kann man beliebige Einträge von Arrays miteinander mulitplizieren oder Array-Einträge immer mit einer bestimmten Zahl oder einfach zwei Zahlen miteinander. 

Außerdem wurden ``calculate_divide``, ``calculate_subtract`` und ``calculate_add`` hinzugefügt, um alle vier Hauptrechenarten abzudecken. 

Die Funktion ``choose_random`` hatte ein Dictionary mit kleinen Dictionaries gegeben. Ein Key hatte eine festgelegte Anzahl an Key-Value-Paaren (ein kleines Dictionary) aus denen zufällig ein Value ausgewählten werden soll. 

Beispiel:

``"500": {"1": "Text1", "2": "Text2"}``

Man musste immer genau diese Anzahl an Key-Value-Paaren eintragen, um die Funktion nutzen zu können. 

Dies wurde so geändert, dass dort ein Dictionary mit 

``"key": ["Array"] ``

anstelle von

``"key":  {"key": "Dictionary"} ``

steht und man aus diesem Array zufällig einen Text auswählen kann, egal wie viele Einträge das Array hat. 

Beispiel:

``"500": ["Text1", "Text2"]``

Diese Funktion (``choose_random``) wurde zu ``random_string`` umbenannt und man kann entweder ein Dictionary oder ein Array einfügen, aus dem ein Value per Zufall ausgewählt werden soll und unter einem neuen Key in der JSON abgespeichert wird. 

Bei allen Funktion, mit denen das Datumsformat geändert werden kann, wurde ergänzt, dass man z.B. aus 05. Mai -> 5. Mai machen kann, wenn ``zeropaded_of`` auf ``True`` gesetzt wird. Dieser Key ist optional. Die Funktionen ``option`` und ``compare`` wurden neu hinzugefügt. Bei ``option`` wird überprüft, ob ein gewisser Wert ``True`` oder ``False`` ist und je nachdem, werden unterschiedliche Funktionen durchgeführt.  
Bei ``compare`` werden zwei Werte miteinander vergleichen. Je nachdem ob ein Wert gleich, größer oder kleiner als der andere Wert ist, werden unterschiedliche Funktionen durchgeführt. 

Zudem wurden die Funktionen ``copy`` und ``delete`` implementiert.  
``copy`` dient dazu, um einen Wert von einem Key zu einem anderen Key zu kopieren.  
Die Funktion ``delete`` dient dazu, Werte mit dem dazugehörigen Key aus der Datenstruktur zu entfernen, falls diese nicht mehr benötigt werden.

**Twitter-Wordcloud**

Um die Twitter-API zu verwenden, wird eine (oder mehrere) API-Anfragen gesendet mit Hashtags. Als Antwort erhält man unter anderem alle Posts, die das gesuchte Hashtag innerhalb der letzten 7 Tage verwendet haben.
Die API-Antwort wird so verkürzt, dass nur noch die Hashtags, die neben dem gesuchten Hashtag in den Posts verwendet wurden. Aus diesen Hashtags werden Wordclouds erstellt.


Die zuvor implementierten ``transform``-Typen konnten größtenteils nicht übernommen werden und mussten neu implementiert werden.
transform_array, select, append und delete konnten verwendet werden.

Folgende transform-Typen wurden verwendet: 

|        Funktion        |       Beschreibung       |
|------------------------|--------------------------|
|transform_array||
|select||
|append||
|delete||
|normalize_words||
|counter||
|remove_from_list|Entfernt Wörter aus einer Liste.|
|sub_lists|Erstellt aus einer großen Liste, eine (oder mehrere) kleinere Listen, die nur einen Teil der großen Liste repräsentieren.|
|join||
|length||

## Processing
### Audio
``part.py``

``audio.py``

``generate_audios()``

### Image
**``pillow``** 

``draw.py``

``overlay.py``

**``wordcloud.py``**
Wordclouds sind Images, die erstellt werden können. Der Hintergrund kann einfarbig sein oder aber auch ein anderes Bild als Hintergrund haben. Hier wird dann mit dem overlay-Typ "image" gearbeitet.

Eine Wordcloud zum Thema Bundesliga sähe folgendermaßen aus:

Wordcloud einfügen

Die Wörter, die zu sehen sind, sind alles Hashtags, die neben dem gesuchten Hashtag "Bundesliga" verwendet wurden.
Das Wort, welches am häufigsten als Hashtag verwendet wurde, ist das Wort, welches am größten dargestellt ist. Das Wort, welches am seltensten als Hashtag verwendet wurde, ist das Wort, welches am kleinsten dargestellt ist.

Man kann außerdem entscheiden, welche Wörter man auf keinen Fall in der Wordcloud haben möchte, die Stopwords. Dafür ist eine Textdatei im Resources-Ordner hinterlegt und man kann sie im Frontend eingeben, 
falls spontan neue Stopwords hinzukommen. Die Textdatei mit den Stopwords kann optional verwendet werden. Es kann außerdem berücksichtig werden, dass Wörter, die upper, lower oder capitalized vorkommen, aber zu den Stopwords gehören, auch nicht auftauchen sollen.

Man kann auch Stopwords mit nur einen Wort, welches sich wiederholt, darstellen.

Möchte man einen Verlauf von dem am häufigsten genannten Hashtag zu dem immer das nächsthäufigste hinzu kommt, muss man einzelne Wordclouds erstellen und diese aneinanderhängen, damit man einen Verlauf als Video hat.
Dies geschieht dann mit dem Sequencer. 

## Sequence
``link(values: dict, step_data: StepData)``

``successively(values: dict, step_data: StepData)``

``custom(values: dict, step_data: StepData)``

``_link(images, audios, audio_l, step_data: StepData, values: dict)``
