# Videojob
Die Komponentenstruktur der Anwendung ist in diesem Abschnitt wie folgt aufgebaut:
![Übersicht_VideoCreator.png](images/videojob/Übersicht_VideoCreator.png)
<div style="page-break-after: always;"></div>

## VideoCreation
Die Hauptkomponente des Videojob-Editors, die vom Dashboard aus aufgerufen wird ist **VideoCreation**. Sie verwaltet alle für die Erstellung von Videojobs notwendigen States und ruft die anderen Komponenten in ihrem Rendering auf. Dazu verwaltet sie als **videoCreationStep** den aktuellen Schritt, der den Wert 0-2 annehmen kann, da der Prozess aus drei Schritten besteht:
1. Auswahl der Infoprovider für Text-To-Speech
2. Erstellung des eigentlichen Videos
3. Auswahl der Generierungszeitpunkte

* Über den Step hinaus enthält der State u.a. den Namen des Videojobs **videoJobName**, die Erstellungszeitpunkte als **schedule** sowie **sceneList**, welcher die Liste aller vom Nutzer ausgewählten Szenen ist.

### Fetch-Methoden
Weiterhin enthält die Komponente drei Fetch-Methoden, durch die eine Datenkommunikation mit dem Backend stattfindet:
* **fetchAllInfoProvider**, welche vom Backend den Namen und die IDs aller verfügbaren Infoprovider holt.
* **fetchAllScenes**, welche vom Backend Namen und IDS aller verfügbaren Szenen holt.
* **sendVideoToBackend**, welche per POST-Request die fertige Konfiguration des Videojobs an das Backend sendet.

Die Erläuterung soll trotz der Tatsache, dass die Methoden in **VideoCreation** stehen in den jeweiligen Abschnitten der Komponenten erfolgen, zu denen sie gehören.

## InfoProviderSelection
Im ersten Schritt der Erstellung eines Videojobs muss der Nutzer festlegen, welche Infoprovider ihm zur Verfügung stehen sollen, um ihre Daten in der Text-To-Speech-Sprachausgabe der Videos einzuschließen (sowohl aktuelle Daten als auch historisierte Daten). Dies geschieht in der Komponente **InfoProviderSelection**.

Wir haben uns hier explizit dagegen entschieden, alle Infoprovider zur Verfügung zu stellen, zumindest wenn der Nutzer dies nicht explizit möchte.
* Primär liegt diese Entscheidung daran, dass im Produktiveinsatz die Anzahl der erstellten Infoprovider durchaus groß werden kann. Würden wir alle Daten laden, so müssten wir mindestens die Liste an verfügbaren Daten sowie historisierten Daten im Speicher des Clients halten, damit diese im Frontend genutzt werden können - das könnte schnell zum Problem werden. Darüber hinaus wird die Auswahl der Daten im Editor für Text-To-Speech-Vorlagen sehr schnell unübersichtlich.
* Daher muss der Nutzer per Checkboxen wählen, welche Infoprovider er alle haben möchte. Um auf das Problem des Speicherbedarfs hinzuweisen zeigen wir ab einer bestimmten Anzahl eine entsprechende allgemeine Warnung, die den Nutzer aber nicht daran hindert, viele Infoprovider zu laden (wir setzen hier auf Eigenverantwortung).

### Laden der verfügbaren Infoprovider
Die Liste der insgesamt verfügbaren Infoprovider wird wie bereits oben erwähnt von der Methode **fetchAllInfoprovider** am Endpunkt **/visuanalytics/infoprovider/all** des Backends angefragt. Die Methode befindet sich dabei nicht in dieser Komponente, sondern in **VideoCreation** und wird dort per **useEffect**-Hook nur beim erstmaligen Laden der Komponente ausgeführt, sodass man das Backend nur einmalig anfragt.

Für die Methode konnten wir dabei nicht **useCallFetch** nutzen, sondern mussten wieder eine eigene Fetch-Methode schreiben - das hat den Hintergrund, dass eine Benutzung in **useEffect** erfordert, dass die Methode in den Dependencies dieser Hook steht. Damit sie nicht bei jedem Neuladen geändert wird und somit die Hook auslöst (welche neu rendert und so eine Endlosschleife erzeugt) müssen wir mit **useCallback** memoisieren, sodass wir nur eine eigene Methode nutzen können.

Das Backend liefert als Antwort ein Array mit allen Infoprovidern, deren Format wir als **InfoProviderData** bezeichnen - es handelt sich um ID und Name des Infoproviders.
```javascript
export type InfoProviderData = {
    infoprovider_id: number;
    infoprovider_name: string;
}
```
* Wir benötigen beide Daten - den Namen zur Anzeige in der Liste, die ID, um den Infoprovider und seine vollständigen Daten beim Backend anzufragen, wenn der Nutzer diesen auswählt.
* Das Ergebnis der Anfrage wird im State **infoProviderList** gespeichert, welcher auch per **props** an **InfoProviderSelection** weitergegeben wird.

### Auswahlliste der Infoprovider
Die Darstellung der Liste aller Infoprovider erfolgt so, wie es aus zahlreichen anderen Komponenten bereits bekannt ist - durch eine **.map()**-Funktion ruft man für alle Elemente aus **infoProviderList** eine Methode **renderListItem** auf, die ein Listenelement für einen Eintrag generiert.
* Dabei hat jeder Eintrag eine Checkbox zum Auswählen sowie den Namen, der angezeigt wird.
* Das Anklicken der Checkbox ruft **checkBoxHandler** auf, welche mit der Methode **checkIdIncluded** prüft, ob sich der angeklickte Infoprovider bereits in der Liste **selectedInfoProvider** befindet. Bei **selectedInfoprovider** handelt es sich dabei um die gespeicherte Information, welche Infoprovider zur Verwendung gewählt wurden.
    * Falls ja, so wird er aus dieser Liste entfernt, falls nein wird er hinzugefügt.
    * **checkIDIncluded** geht schlicht **selectedInfoProvider** durch und prüft, ob die ID des angeklickten Infoproviders gefunden werden kann - wenn ja, so ist der gewählte Infoprovider bereits enthalten.

Um den Nutzer auf das mögliche Problem einer hohen Speicherauslastung bei vielen, sehr großen Infoprovidern gleichzeitig aufmerksam zu machen haben wir uns entschlossen, eine Warnung anzuzeigen. Diese ist standardmäßig verborgen und wird dargestellt, sobald der mehr als 5 Infoprovider ausgewählt wurden. Für eine Justierung dieses Schwellenwerts wären Praxis-Daten zur durchschnittlichen Auslastung je Infoprovider notwendig.

### Abfragen aller Infoprovider vom Backend
Wenn der Nutzer auf "weiter" klickt, so ist seine Auswahl abgeschlossen und er möchte zur Video-Editierung wechseln. In dieser benötigt man für die Erstellung der Text-To-Speech-Inhalte Zugriff auf die (historisierten) Daten der ausgewählten Infoprovider.
* Hierbei hätte man eine Backend-Methode implementieren können, die eine bestimmte Menge an IDs entgegennimmt und die zugehörigen Infoprovider liefert. Dies ist auf beiden Seiten aber eher umständlich, sodass wir stattdessen für jede ID einzeln eine Abfrage machen.

Dazu nutzen wir das Array **infoProviderToFetch**, welches eine Liste aller Infoprovider sein soll, die noch vom Backend abgeholt werden müssen. Beim Klick auf "weiter" wird der Wert dieser Liste auf **selectedInfoProvider** gesetzt.
* Es handelt sich hierbei um keine State-Variable, sondern um eine solche, die mit **useRef** angelegt wurde. Eine Änderung von ihr sorgt für kein Re-Render, es muss jedoch auch kein Render geschehen, damit sich ihr Wert ändert!
    * Dies ist wichtig, da sich zwischen den Abfragen ggf. kein erneuter Render ergibt, wir die Liste aber aktualisieren müssen - es ist daher essentiell, dass die Liste auf diese Weise direkt verändert werden kann.

Anschließend wird die Methode **fetchNextInfoProvider()** aufgerufen, welche die Abfrage aller Infoprovider steuert. Sie prüft zunächst die Länge von **infoProviderToFetch** - ist diese 0, so wurden alle ausgewählten Infoprovider vom Backend geholt und es kann fortgefahren werden. Dazu überträgt man die Liste der Abfrage-Ergebnisse in **props.minimalInfoProvObjects** und ruft anschließend die Methode zur Abfrage aller Szenen auf.
* Wenn jedoch noch Einträge in **infoProviderToFetch** vorhanden sind, so greift man auf den ersten Eintrag zu, entnimmt dessen ID und ruft **fetchInfoProviderById** mit dieser auf. Diese Methode ist eine fetch-Methode, die über den Endpunkt **/visuanalytics/infoprovider/<id>** für die jeweilige ID das Objekt des Infoproviders anfragt.
    * Wir können hier erneut nicht **useCallFetch** nutzen, da wir einen Parameter (die ID) übergeben wollen. Daher haben wir auch hier eine eigene Methode geschrieben.

In der Handler-Methode **handleSuccessFetchById** wird dann der Erfolgsfall dieser Abfrage behandelt. Man nimmt dazu das Objekt, welches das Backend zurückliefert und extrahiert nur die Informationen, die man für die Video-Editierung benötigt. So werden bspw. die Diagramme, die Liste aller überhaupt von der API gelieferten Daten oder Authentifizierungs- und Query-Daten gar nicht benötigt.
* Um also das oben beschriebene Problem von potentiell hohem Datenaufkommen bei vielen Infoprovidern abzufangen haben wir den Datentyp **MinimalInfoProvider** angelegt, der nur genau diese Informationen enthält:
```javascript
export type MinimalInfoProvider = {
    infoproviderName: string;
    dataSources: Array<MinimalDataSource>;
}
```

Der Typ `MinimalDataSource` sieht dabei wie folgt aus:

```javascript
export type MinimalDataSource = {
    apiName: string;
        selectedData: SelectedDataItem[];
        customData: FormelObj[];
        historizedData: string[];
        schedule: Schedule;
}
```
Mit der Methode **createMinimalInfoProvider** wird das vom Backend gelieferte Objekt in diese Struktur umgewandelt und anschließend dem Ergebnis-Array **minimalInfoProvObjects** hinzugefügt.
* Auch dieses ist nicht im State, sondern mit **useRef** angelegt - dies hat den Hintergrund, das nach dem letzten Fetch der Wert in den State der Parent-Komponente übertragen werden soll. Zwischen den Abfragen findet aber kein Re-Render statt, sodass eine Variable im State sich gar nicht ändern würde.
Diese Variante sorgt hingegen für eine sichere Speicherung der Ergebnisse.
* Abschließend entfernt **handleSuccessFetchById** den soeben abgefragten Infoprovider aus **infoProviderToFetch**, sodass markiert ist, dass dieser nicht mehr gefetched werden muss.
* Es wird zuletzt wieder **fetchNextInfoProvider()** aufgerufen. Es entsteht so eine rekursive Aufrufskette, die so lange läuft, bis die ganze Liste abgearbeitet wurde.

Problematisch wäre es, wenn der Nutzer während der Abfrage eine zweite startet - um das soweit möglich zu verhindern setzen wir beim Klick auf "weiter" den State **continueDisabled** auf **true**, welcher damit den "weiter"-Button blockiert - im Fehlerfall einer Abfrage wird er wieder freigegeben, damit der Nutzer ggf. noch eine Abfrage machen kann.

### Laden aller Szenen
Es wurde bereits erwähnt, dass nach erfolgreichem Laden aller ausgewählten Infoprovider das Laden aller Szenen ausgelöst wird. Dies ist eine weitere nötige Vorbereitung für den folgenden Schritt und geschieht durch den Aufruf der Methode **fetchAllScenes**.
* Diese fragt den Endpunkt **/visuanalytics/scene/all** an und kann mit **useCallFetch** umgesetzt werden, da hier keine besonderen Anforderungen vorliegen.
```javascript
export type SceneData = {
    scene_id: number;
    scene_name: string;
}
```
* Der Erfolgsfall wird durch **fetchAllScenesSuccess** behandelt, welches ein Array vom oben gezeigten Typ **SceneData** liefert. Da die IDs nicht weiter benötigt werden extrahiert man aus diesem Array nur die Namen und speichert die Liste aller Namen im State **availableScenes**.
* Abschließend wird **continueHandler** aufgerufen, um zum zweiten Schritt weiterzugehen.

## VideoEditor
Den zweiten Schritt stellt dann die Komponente **VideoEditor** dar, in welcher das eigentliche Video zusammengestellt wird.

### Grundlegende Oberfläche und States
Die Oberfläche des Videoeditors setzt sich aus folgenden Elementen zusammen:
* Am oberen Rand befindet sich ein großes **TextField**, welches zur Eingabe des Namens für den Videojob verwendet wird.
* Rechts davon befindet sich ein Button **zurück**, mit dem man zurück zum Dashboard gelangt sowie ein Button ***Speichern**, durch welchen man den erstellten Videojob speichert und zur Festlegung der Generierungszeitpunkte übergeht, bevor man die Daten an das Backend absendet. Dieser Button ist dabei ausgegraut, wenn keine Szenen für das Video hinzugefügt wurden, wenn kein Name vergeben wurde oder wenn eine der Szenen keinen gesprochenen Text beinhaltet. Letztere Einschränkung ist notwendig, um kompatibilität mit **FFmpeg** zu gewährleisten. Dieses Tool generiert im Backend die schlussendlichen Videos. Würde man diese Einschränkung aufheben wollen, so müsste man die gesamte Videogenerierung im Backend anpassen. Da solch ein Use-Case im ursprünglichen Projekt anscheinend auch nicht vorgesehen war, haben wir von der Implementierung abgesehen.
* Unter diesen Elementen befindet sich dann die eigentliche Erstellung des Videos: Es gibt eine horizontale Liste aller ausgewählten Szenen mit Möglichkeiten, Details für diese einzustellen. Diese Liste wird durch **SceneContainer** dargestellt. Rechts davon befindet sich eine vertikal scrollende Liste aller verfügbaren Szenen (die Daten hierzu stammen aus dem State **availableScenes**, der im vorherigen Schritt mit Backend-Daten gefüllt wurde).
    * Man generiert diese Liste, indem man jeder Szene ein **AddCircleOutlineIcon** hinzufügt, durch dessen Anklicken die Szene der Auswahl im Video hinzugefügt wird. Die Generierung dieser Liste geschieht wie in allen anderen Komponenten auch, indem man für **availableScenes** **.map()** aufruft und so für jedes Element **renderAvailableScene** aufruft, welche den entsprechenden Eintrag erstellt.
    * Das Hinzufügen geschieht über die Methode **addScene**, welche die Szene mit Default-Einstellungen für Anzeigedauer und Text der Liste hinzufügt.
* Die State-Variable **sceneList** verwaltet die Liste aller vom Nutzer ausgewählten Szenen, die im Video vorkommen sollen.
    * Die Szenen werden durch Objekte des Typ **SceneCardData** repräsentiert, ihre Reihenfolge im Array entspricht der Reihenfolge, in der sie im Video dargestellt werden. Genauere Erläuterungen folgen im Abschnitt zu **SceneContainer**.

### SceneContainer
Die Komponente **SceneContainer** ist das Kernelement der Nutzerinteraktion in der Erstellung eines Videojobs, da sie die horizontal scrollbare Auflistung aller ausgewählten Szenen inklusive der Einstellungen umfasst.

Dabei bekommt die Komponente per **props** **sceneList** und die zugehörige Setter-Methode übergeben. Diese Liste ist die aktuelle Szenenauswahl für das Video und eine Reihe von **SceneCardData**-Objekten. In der Darstellung der Komponente wird per **.map()** auf jedes dieser Objekte die Methode **renderSceneEntry** angewendet, welche neben der Darstellung eines visuellen Effekts (Erläuterung im folgenden Abschnitt) eine **SceneCard**-Komponente mit den Daten des aktuellen Eintrags der Liste lädt.
* Die **SceneCards** sind dabei in eine Liste eingefasst, bei der per **style** mit **display: flex, flexDirection: row** dafür gesorgt wird, dass es sich um eine Liste handelt, in der die Elemente horizontal statt wie üblich vertikal angeordnet werden.

#### Änderungen an einzelnen Szenen vornehmen
Jede Szene, die durch ein **SceneCardData**-Objekt repräsentiert wird besitzt verschiedene Eigenschaften:
```javascript
export type SceneCardData = {
    entryId: string;
    sceneName: string;
    exceedDisplayDuration: number;
    spokenText: Array<AudioElement>;
    visible: boolean;
}
```
* Die **entryId** wird für die Darstellung der Szene in der Liste benötigt (jeder Eintrag benötigt einen eindeutigen Key), **sceneName** ist der Name der Szene, der auch in der Liste der **availableScenes** steht.
* Jede Szene besitzt eine bestimmte Anzeigedauer. Dabei gilt allgemein, dass sie so lange angezeigt wird, wie der gesprochene Text läuft (inklusive der Pause) - darüber hinaus kann der Nutzer aber als **exceedDisplayDuration** angeben, wie viele Sekunden über den gesprochenen Text hinaus die Szene noch weiter angezeigt werden soll.
* **spokenText** ist der vom Nutzer festgelegte Text, der per Text-To-Speech im Video vorgelesen werden soll. Der Text kann auch API-Daten enthalten.
    * Es handelt sich um ein Array, da es sich um eine Folge mehrerer Texte und Pausen handeln kann - so wird es möglich, dass man der Text-To-Speech-Ausgabe Sprechpausen vorschreiben kann.
* **visible** dient zur Steuerung eines optischen Effekts, der im folgenden Abschnitt erläutert wird und hat keine Relevanz für die eigentliche Szene.

Mit der Methode **setDisplayDuration** kann man die Anzeigedauer über die TTS-Ausgabe hinaus ändern, indem man einen neuen Wert für  **exceedDisplayDuration** eingibt.

**setSpokenText** dient dem Verändern des gesprochenen Textes einer Szene und nimmt neben dem Index dieser Szene auch **newSpokenText** als den neuen Text, den der Nutzer eingegeben hat entgegen.

Weiterhin ist es möglich, die Reihenfolge, in der die Szenen angezeigt werden zu verändern. Wie bereits erläutert gilt dabei, dass die Reihenfolge im Array **sceneList** der Reihenfolge der Anzeige entspricht, sodass das Tauschen zweier Szenen das Tauschen der Indizes bedeutet.
* Die Methode **moveScene** ist dafür zuständig, indem sie die beiden Objekte in **sceneList** vertauscht. Sie verhindert dabei zudem, dass ein Tausch vorgenommen wird, der über die Grenzen des Arrays hinausgeht.
* Die Eingabeparameter der Methode sind **sourceIndex**, welcher der Index der Szene ist, die in der Liste bewegt wird, sowie **direction**, welche den Wert **left** oder **right** haben kann (die Umsetzung findet über ein Enum statt). Das Bewegen ist also nur nach links oder rechts möglich, man kann eine Szene also nur mit ihrem direkten Nachbarn tauschen und nicht mit jeder beliebigen Szene.

Beim Aufruf der **SceneCard**-Komponenten wird jeweils eine Arrow-Funktion übergeben, die den Setter aufruft und für **index** den Index der aktuellen Karte eingibt. Auf diese Weise können die **SceneCard**s die Methoden aufrufen, ohne Kenntnis über ihren Index haben zu müssen.

#### Tausch-Effekt
Das Tauschen der Szenen in der von uns genutzten Form hat in der Praxis einen dahingehend unschöne Darstellung, dass alle **SceneCard**s grundsätzlich die gleiche Struktur haben und das Tauschen zweier benachbarter Karten einfach einen Austausch der Beschriftungen vornimmt. Dies ist nicht besonders schön anzusehen und für den Nutzer eventuell auch verwirrend, da es schwer zu erkennen sein kann, dass Szenen getauscht werden.

Aus diesem Grund wollten wir eine Art Tausch-Animation, die genutzt wird, wenn man zwei Szenen vertauscht. Leider bietet **MaterialUI** nativ keine wirklichen Animations-Effekte, sodass wir einen eigenen mit den verfügbaren Mitteln gebaut haben. Die Idee: Die beiden getauschten Szenen sollenn kurz verschwinden und dann an der neuen Position mit einer Animation auftauchen.
* Basis dafür ist die **visible**-Variable in **SceneCardData**. Sie ist standardmäßig **true** und wird **false** gesetzt, wenn eine Szene getauscht wird (beim Ersetzen der Objekte in **moveScene** wird diese Variable überschrieben).
* In **renderSceneEntry** wird dann jede **SceneCard** in ein **Collapse**-Element von Material-UI gesetzt, dessen Sichtbarkeit durch **in={sceneEntry.visible}** definiert wird.
    * Weiterhin wird mit **timeout={{ appear: 500, enter: 800, exit: 0 }}** festgelegt, dass das Ausblenden 0 Sekunden dauern soll, währen das Einblenden 500ms beim ersten Mal und 800ms bei jedem weiteren Mal dauern soll.
* Wird also durch **moveScene** der Wert von **visible** auf false gesetzt, so wird das **Collapse** eingeklappt und die Szene nicht mehr angezeigt.
* Nun kommt **renderSceneEntry** ins Spiel: In der Methode wird zunächst geprüft, ob die Szene nicht sichtbar ist. Falls dies der Fall ist, so wird geprüft, ob die Variable **timeoutSet** bereits gesetzt wurde. Dies ist eine mit **useRef** für die Komponente angelegte Variable, die genutzt wird um zu speichern, ob bereits ein Timer zum erneuten Einblenden der Elemente gestartet wurde.
    * Ist **timeoutSet** **false**, so wurde noch kein Timer gesetzt und anschließend mit **setTimeout** ein Timer für die verzögerte Ausführung von Code gestartet. Mit **timeoutSet.current = true** markiert man dann, dass ein Timer gesetzt wurde.
        * Dieser verzögert ausgeführte Code durchläuft die Szenenliste und setzt **visible** überall dort auf **true**, wo es den Wert false hat.
        * Anschließend setzt man **timeoutSet** wieder auf **false**, damit dies für die nächste Animation zurückgesetzt ist.
* Die Dauer des **setTimeout** ist 300ms. Die beiden Szenen werden also für 300ms ausgeblendet, bevor sie über 800ms an ihrer neuen Position mit einer Animation wieder eingeblendet werden.
    * Leider ist eine Animation beim Ausblenen nicht möglich, da sich die Datenwerte der Szenen bereits zum Zeitpunkt des Ausblendens ändern und man so bereits beim Ausblenden die neuen Beschriftungen sehen würde.

#### Erläuterungen zum Test von Drag-And-Drop-Bibliotheken
Für die Einstellung der Reihenfolge der einzelnen Szenen war unsere ursprüngliche Vorstellung, dass man diese in einer horizontalen Anordnung sieht und per Drag-and-Drop die Reihenfolge ändert.

Grundsätzlich gibt es auch Möglichkeiten für Drag-And-Drop, da HTML eine API dafür bietet, auf der einige Frameworks aufbauen. Für React wird hauptsächlich **"React DnD"** empfohlen, mit welchem wir uns deshalb auseinandergesetzt haben. Dazu haben wir uns erst einmal in die grundsätzliche Funktionalität, das System und den Syntax eingelesen und uns anschließend mit Tutorials auseinandergesetzt.
* Die grundsätzliche Idee des Frameworks ist, dass man einzelne Elemente "Draggable" machen kann, d.h. der Nutzer kann sie greifen und nehmen. Als Gegenstücke dienen sogenannte "DropTargets", über die man bewegte Elemente hovern und diese dort ablegen kann.
* Das ist also z.B. sehr gut geeignet, um Antwortkarten in einen Lückentext zu ziehen o.ä.

Unsere Anforderung war jedoch eine sortierbare Liste, sodass jedes Element sowohl Draggable als auch DropTarget gleichzeitig sein muss. Das Framework referenziert in seinen Tutorials dabei eine [Beispiel-Sandbox](https://codesandbox.io/s/github/react-dnd/react-dnd/tree/gh-pages/examples_hooks_ts/04-sortable/simple?from-embed=&file=/src/Card.tsx), mit deren Code und Funktionalität wir uns intensiv beschäftigt haben.
* Dabei handelt es sich um eine vertikale Liste, wir benötigten aber eine horizontale Liste. Die Erkennung basiert auf Pixel-Berechnungen (sobald ein Element die Hälfte der Pixel eines anderen überschneidet werden sie getauscht), welche wir also für die horizontale Darstellung umschreiben mussten. Interessanterweise sind dabei Fehler aufgetreten, für die wir in unseren Recherchen keine Erklärung finden konnten.
* Selbst im vertikalen Beispiel gibt es Fehler, in denen eine "Kollision" mit bestimmten Funktionalitäten des React-Frameworks entsteht und die Seite abstürzt.

Weiterhin ist das Beispiel nur darauf ausgelegt, eine Liste fester Größe zu haben - wir wollten aber eine flexible, beliebig lange Liste. Entsprechend wird dafür auch eine Scrollbar notwendig. Mit dieser gehen neue Probleme einher, da die pixelbasierte Berechnung der Verschiebungen spätestens dann nicht mehr funktioniert, wenn einmal gescrollt wurde (sodass man das Element weiterbewegt, aber nicht mehr getauscht wird und es nicht dort landet, wo man es ablegt).
* Es gibt für das Scrolling zwei Frameworks: **react-dnd-scrollzone** und **react-dnd-srolling**. Dabei scheint zweiteres schlicht eine Adaption des ersten zu sein. Tests zum Integrieren von **react-dnd-scrollzone** schlugen fehl, die Recherche hat ergeben, dass das nicht mehr gepflegte Modul (letzter Publish vor 2 Jahren) nicht mit den aktuellen React-Versionen kompatibel ist.
    * **react-dnd-scrolling** scheint eine neuere Adaption (letzter Publish vor einem Monat) dieses Moduls zu sein, dass es mit den aktuellen React-Versionen kompatibel macht. Damit wäre eine Nutzung also möglich gewesen, jedoch trat nun das Problem auf, dass TypeScript beim Einbinden von NPM-Modulen stets ein zugehöriges **@types**-Modul erfordert. Ein solches existiert für das erste, veraltete Modul, für das neuere aber nicht, sodass es scheinbar nur mit Javascript nutzbar ist.

Neben diesen Scroll-Problemen gab es wie bereits erwähnt auch Probleme mit dem grundlegenden Modul **react-dnd**, bei welchem selbst in den Demos des Anbieters bei bestimmten Aktionen Abstürze auftreten. Im zugehörigen GitHub existieren Issues wie beispielhaft [dieses](https://github.com/react-dnd/react-dnd/issues/763), die seit langer Zeit existierende, auch bei uns auftretende Probleme behandeln. Quasi bis heute wird von Usern über mögliche Workarounds diskutiert, eine offizielle Pflege des Moduls mit Fehlerbehebungen scheint es aber nicht zu geben.
* Aus diesen Gründen sehen wir die Integration dieser Module als kritisch an, da ihre Funktionalität nicht garantiert werden kann und ihre fehlende Pflege dafür sorgen könnte, dass unser von ihnen abhängiges Produkt eines Tages plötzlich nicht mehr funktioniert - das sollte um jeden Preis vermieden werden.
* Daher haben wir uns nach einigen Stunden Auseinandersetzung mit der Materie vorläufig gegen eine Drag-And-Drop-Lösung und für eine einfachere, Button-basierte Variante entschieden, um überhaupt einen fertigen und funktionalen Videoeditor abzuliefern.

### SceneCard
Wie bereits im Abschnitt **SceneContainer** angesprochen wird eine einzelne vom Nutzer ausgewählte Szene als **SceneCard**-Komponente dargestellt. Diese erhält per **props** die Werte und Setter-Methoden aller relevanten Eigenschaften für die jeweilige Szene.

Dargestellt wird die Szene durch eine **Card**-Komponente von Material-UI, die den Namen der Szene sowie Einstellungen für Anzeigedauer und Text enthält.
* Für die Eingabe der Dauer über die TTS-Dauer hinaus wird ein **Slider** verwendet, der durch einen **Input** ergänzt wird. Auf diese Weise kann der Slider genutzt werden, gleichzeitig aber auch händisch eine Eingabe erfolgen. Diese Option ist auch für die Barrierefreiheit bedeutsam.
* Die zweite Einstellung ist der gesprochene Text

#### State-Updates für Anzeigedauer
Die Nutzung von Slidern verstärken ein allgemeines Problem, welches mit Eingabeelementen auftritt, deren Wert ein State einer höheren Komponente ist: Werden schnell viele Eingaben hintereinander gemacht wird das Frontend sehr ruckelig, da extrem viele Rerenders der höher liegenden Komponente und damit der ganzen Ansicht notwendig werden.
* Bei den Slidern finden besonders schnelle und viele Änderungen statt, da bei einer Bewegung alle 1er-Schritte als State-Änderung registriert werden. Zwar fasst React diese Änderungen teilweise zusammen, dennoch ist es nicht wirklich responsiv.
* Als Lösung verwenden wir **localExceedDisplayDuration** als State direkt innerhalb von **SceneCard**, welches den Wert des Slider und Inputs hält.
    * Anhand des Timers **timeoutExceedDisplayDuration** wird mit der Methode **changePropsExceedDisplayDuration** gewartet, bis 200ms lang keine Änderung stattfindet. Erst dann wird der State von **VideoEditor** überschrieben, indem man die Dauer der Szene dort neu setzt und **sceneList** überschreibt.
* Auf diese Weise wird nicht **VideoEditor**, sondern nur **SceneCard** neu gerendert, wenn man den Slider bedient - dadurch lassen sich die Performance-Probleme größtenteils lösen und die User Experience wird verbessert.

### EditTextDialog
In **EditTextDialog** wird ein Dialog gerendert, welcher die Bearbeitung für TTS-Texte ermöglicht. Dabei wurde dieser Dialog nicht in **SceneCard** direkt integriert, da dieser viel eigene Logik enthält und die Komponente aufgebläht hätte. In der Komponente **SceneCard** gibt es lediglich einen State, welcher dafür zuständig ist, den Dialog bei Bedarf anzuzeigen. Der State dafür heißt **showEditTextDialog** und wird bei Klick auf entsprechenden Button auf true gesetzt. Gleichzeitig wird der State und dessen Setter dem Dialog mittels props übergeben, damit dieser sich selbst schließen kann.

Der Dialog selbst enthält States, um das hinzufügen von TTS-Parts und Pausen zu verwalten.

**audioElements** ist dabei das Array, welches nach und nach vom Nutzer durch die verschiedenen Aktionen gefüllt werden kann. Dabei wird das Array (bestehend aus Objekten vom Typ **AudioElement**) entweder mit dem übergebenen **spokenText** initialisiert oder mit einem leeren Text-Eintrag, falls **spokenText** leer ist. Dies ist notwendig damit im Dialog standardmäßig ein Textfeld angezeigt wird, in welches der Nutzer Text eingeben kann.

Ein Objekt vom Typ **AudioElement** hat dabei die folgende Struktur:

```javascript
export type AudioElement = {
    type: AudioType;
    text?: string;
    duration?: number;
}
```

`text` und `duration` sind dabei beide optional und es wird pro Element nur einer der beiden Werte gesetzt. Auf welchen von beiden man dabei beim aktuell betrachteten Element zugriefen kann, wird im Grunde durch den Typen angegeben:
* Typ "text" = Zugriff auf Attribut `text`.
* Typ "pause" = Zugriff auf Attribut `duration`

Bevor auf diese Attribute zugegriffen werden kann, muss allerdings trotzdem eine Prüfung auf "ungleich undefined" erfolgen oder der Wert muss explizit mittels "!" angegeben werden. Letzteres sollte in der Softwareentwicklung allerdings eher vermieden werden. 

Das Rendering von Textfeldern für Pausen und TTS-Parts kann durch eine einzige Methode (**renderEditElement**) erledigt werden. Diese Methode rendert dabei konditionell verschiedene Textfelder mit unterschiedlichen Labels. Das Rendering hängt dabei vom Typen des aktuellen Elements ab, welches der Funktion übergeben wird. Die Funktion wird dabei wieder in einer **.map**-Funktion aufgerufen, welche auf **audioElements** angewendet wird. Die übergebene ID an **renderEditElement** wird als ID der Textfelder gesetzt. Dies wird wichtig, sobald Texte editiert werden und an entsprechender Stelle im Array **audioElements** ersetzt / erweitert werden müssen. Auch für die Löschung von Abschnitten ist dies wichtig.

Mittels **changeElement** werden die Änderungen, welche in oben beschriebenen Textfeldern gemacht werden, verarbeitet. Dabei wird zuerst die ID des übergebenen Events mittels `event.target.id` aus dem Event geholt. Nun wird im Array **audioElements** nachgeschaut, ob dieses Element ein Text oder eine Pause ist.
* Im Falle eines Textes kann der Value des Events einfach an `audioElements[index].text` geschrieben werden, wobei `index` hier als Platzhalter für den tatsächlichen Index im Array dient.
Im Falle einer Pause, wird die `duration` des entsprechenden Elementes gesetzt (und nicht der Text). Dazu kann der Value des Events gefahrlos zu `number` konvertiert werden, da die zugehörigen Textfelder nur Zahlen erlauben.

Das Löschen von Elementen wird mittels **deleteText** erledigt. Diese Methode bekommt den Index des Textfelds übergeben, welches gelöscht werden soll. Dabei enthält jedes Rendering eines Textfelds einen Button, welcher als onClick-Event die Löschmethode besitzt und den Index des Textfelds weitergibt. Die Methode löscht dabei aber nicht nur das Textfeld, da ansonsten mehrere Pausen aneinander gehängt werden könnten. Dies ist von uns allerdings nicht beabsichtigt. Um dieses Problem zu lösen, wird die nachfolgende Pause ebenfalls mitgelöscht. Sollte das Textfeld allerdings das letzte Element sein, so wird die vorhergehende Pause gelöscht. Somit wird sichergestellt, dass die Abfolge von "Text", "Pause" niemals gebrochen wird.

Das Hinzufügen eines neuen Text-Abschnitts erfolgt durch einen Button, welcher nach allen Audioelementen gerendert wird. Dieser ist allerdings nur anklickbar, wenn:
1. Im aktuell letzten Textfeld ein Text eingetragen ist.
2. Der State **newPause** einen Wert besitzt (nicht undefined) und dieser >= 0 ist.

Sind diese Voraussetzungen erfüllt, so kann der Button angeklickt werden und ruft die Methode **addNewText** auf. Diese Methode fügt zunächst die Pause hinzu, deren Länge aktuell durch newPause definiert wird. Anschließend wird ein weiteres Audioelement gepusht, welches den Typen "text" besitzt und einen leeren Text als Wert hält. Danach wird **newPause** wieder auf 0 gesetzt, um am Ende des nächsten Abschnittes wieder eine gleichbleibende Darstellung zu ermöglichen. Würden wir dies nicht tun, so wäre die Standardzeit für jede neue Pause die vorher festgelegte (jeweils des vorher hinzugefügten Abschnitts).

#### Speichern und Abbrechen der TTS-Bearbeitung
Mittels **saveNewAudio** wird mit dem Setter von **spokenText** (übergeben mittels props) **spokenText** in der höherliegenden Komponente mit dem Array **audioElements** überschrieben. Dabei wird **spokenText** nicht für die oben erklärten Operationen verwendet, da somit das Zurücksetzen bei Abbruch der Bearbeitung schwieriger wäre. Nachdem der State überschrieben wurde, wird der Dialog mittels des übergebenen Setters geschlossen und alle Szenen werden wieder angezeigt.

Für das Schließen des Dialogs wurde keine eigene Methode implementiert, da dies einfach im Button "abbrechen" über die Setter-Methode, welche das rendering des Dialogs regelt, im onClick-Event direkt getan werden kann. Die entsprechende Setter-Methode, wurde dem Dialog mittels props übergeben.

#### Anzeigen und Hinzufügen von API-Daten
Das Design des Dialogs ist in zwei Spalten aufgeteilt. Der Aufbau und die Funktionen der linken Spalte haben wir bereits besprochen. In der rechten Spalte befinden sich alle Aktionen für für API-Daten der Infoprovider. Hierbei wird in Funktionen mehrfach eine **.map**-Funktion angewendet, um alle Elemente in der richtigen Reihenfolge zu rendern. Dabei sieht der Ablauf wie folgt aus:
1. Das Rendering der Komponente selbst, ruft **.map** auf alle Infoprovider auf. Innerhalb von **.map** wird **renderInfoproviderData** aufgerufen. Diese Methode bekommt den Index des Infoproviders, sowie dessen Namen und Datenquellen. Der Index wird benötigt, um im State **showInfoproviderData** nachzuschauen, ob die Daten (Selected, Custom und Historized Data) eingeklappt oder ausgeklappt sein sollen. Gleichzeitig kann mit Hilfe dieses State ein **collapse**-Element verwendet werden. Dieses rendert, falls `showInfoproviderData[index]` true ist, die zugehörigen Daten. Die zugehörigen Buttons zum aus- bzw. einklappen, rufen mittels onClick-Event die Funktion **toggleInfoproviderData** auf und übergeben den Index des Infoproviders, welcher zu ihnen gehört. Der Wert von **showInfoproviderData** wird mittels dieser Funktion an entsprechendem Index invertiert.
2. Wenn die Daten des Infoproviders angezeigt werden sollen, so wird auf dessen Datenquellen die map-Funktion aufgerufen, welche für jedes Element **renderDataSource** aufruft und den zugehörigen Infoprovidernamen ebenfalls übergibt.
3. **renderDataSource** rendert sowohl die ausgewählten, eigenen und historisierten Daten in drei Listen. Dazu wird für alle drei Felder der **dataSource** eine map-Funktion darauf aufgerufen.
    1. Die map-Funktion für **selectedData** wird auf das Array aufgerufen, welches entsteht, wenn man sich aus **selectedData** nur die Keys holt. Dabei wird hier die Funktion **renderSelectedDataAndCustomData* aufgerufen, welche den vollständigen Key des Wertes als Attribut bekommt. Vollständig bedeutet dabei "Infoprovidername|Datenquellenname|Attributsname".
    2. Für **customData** wird das gleiche Verfahren angewandt, allerdings muss hier nicht erst eine Methode aufgerufen werden, die die Keys aus diesem Array zurückliefert. Innerhalb von **map** wird dabei die gleiche Funktion wie für **selectedData** aufgerufen, da es beim Rendering hier keine Unterschiede gibt.
    3. Für **historizedData** gibt es eine eigene Funktion, **renderHistorizedData**. Diese wird benötigt, da das Rendering dieser Daten andere Aktionen bei einem onClick-Event auslösen wird.

**renderSelectedDataAndCustomData** rendert für jedes übergebene **item** ein einzelnes Listenelement mit einem Button, der den Namen des Items anzeigt und als onClick-Event die Funktion **insertSelectedOrCustomData** mit dem aktuellen Item aufruft. Diese Funktion widerum nutzt den State **lastEditedTTSText**, um das Item in das zuletzt angeklickte TTS-Textfeld einzufügen. Dieser Index ändert sich, wann immer ein Nutzer mit der Maus ein anderes TTS-Textfeld auswählt.

Bei den historisierten Daten wird jedoch nicht sofort mit Anklicken des Buttons das Element gesetzt, obwohl das Rendering der Buttons genau wie oben funktioniert. Da bei den historisierten Daten vor dem Einfügen allerdings noch ein Intervall gewählt werden muss, sind andere und weitere Schritte nötig:

Der onClick-Handler für die Elemente innerhalb von **renderHistorizedData** ruft **handleClickOnHistorizedData** auf und übergibt ihr das **Schedule**-Objekt und den Namen des Elements. Beide Werte werden dann im State (**selectedHistorizedElement** bzw. **selectedSchedule**) gespeichert. Anschließend wird von der Methode noch der State **showAddHistorizedDialog** auf true gesetzt, wodurch sich der Dialog für die Intervallauswahl öffnet.

Der Dialog selbst zeigt mittels der Komponente **ScheduleTypeTable** (bereits beschrieben bei der Erstellung des Infoproviders) die Informationen zu den Historisierungszeitpunkten an. Hier kann der Nutzer nun ein Intervall festlegen. Dabei gilt jedoch, dass dieses minimal 0 sein muss, andernfalls wird der "Speichern"-Button ausgegraut. Intervall 0 beschreibt dabei den letzten Historisierungszeipunkt, 1 den vorletzten, usw. Ändert der Nutzer das Intervall, so wird dies im State **selectedInterval** gespeichert. Mit Klick auf "Speichern" werden die Werte aus den States **selectedHistorizedElement** und **selectedElement** von der Methode **insertHistorizedData** verwendet. Diese funktioniert ähnlich wie auch schon **insertSelectedOrCustomData**.

##### Formatierung von eingefügten Elementen
Eingefügte Daten von **selectedData** und oder **customData** beginnen mit "{:" und enden mit ":}". Bei historisierten Daten ist dies ähnlich, allerdings kommt vor dem schließenden Teil noch ein Paar von geschweiften Klammern "{}", in welchen der Wert des ausgewählten Intervalls eingetragen ist. Also beispielsweise "{1}".

## ScheduleSelection
Nachdem der Nutzer das Video selbst fertig konfiguriert hat kommt die Auswahl der Generierungszeitpunkte hinzu, durch die ein Videojob vollständig wird. Diese Auswahl findet in der Komponente **ScheduleSelection** statt, deren Grundaufbau eine leicht veränderte Kopie der Komponente **HistoryScheduleSelection** aus der Erstellung der Infoprovider ist.
* Das liegt daran, dass das Backend für alle Aktionen, die an bestimmten Zeitpunkten stattfinden sollen das gleiche Datenformat nutzt - damit ist das Scheduling einer Historisierung beinahe gleich zum Scheduling eines Videojobs.

Entsprechend hat die Komponente wieder den gleichen Grundaufbau mit **RadioButtons**, mit denen man zwischen den drei Scheduling-Typen Wochentag, Täglich oder Intervall wechselt. 
* Eine detaillierte Erklärung der Oberfläche und der mit ihr verbundenen Logik-Methoden zur Verwaltung des States soll hier aber nicht stattfinden, da dies bereits im entsprechenden Dokumentationsabschnitt **Infoprovider-Erstellung -> HistorySelection -> HistoryScheduleSelection** geschehen ist und dort nachgelesen werden kann.

Gegenüber der Vorlagen-Komponente wurde modifiziert, dass Logik-Methoden, die mit der Unterscheidung zwischen Bearbeitung und Erstellung von Infoprovidern sowie dem Speichern von Datenquellen zusammenhängen, entfernt wurden. Geändert wurde außerdem der "weiter"-Button zu einem "Abschließen"-Button, der den erstellten Videojob an das Backend sendet (Erläuterung im folgenden Abschnitt).

## Senden der Daten an das Backend
Nach Abschluss der Erstellung des Videojobs muss dieser an das Backend übermittelt werden, um von diesem in der Video-Generierung genutzt werden zu können. Dabei wird wie auch bei den Infoprovidern ein großer Teil der Erstellung des Datenformats bereits auf Ebene des Frontends vorgenommen. Das Grundgerüst der Umsetzung bilden zwei Objekte: **images**, welches alle Szenen in der Reihenfolge enthält, in der sie angezeigt werden sollen und **audio**, in welchem alle durch Text-To-Speech vorzulesenden Texte enthalten sind.

Das Datenformat sieht dabei allgemein so aus (images und audio sind beispielhaft):
```javascript
{
    videojob_name: videoJobName,
    images: {

    },
    audio: {
        audios: {
            audio1: {
                parts: [
                    {
                        type: "text",
                        pattern: //text
                    },
                    {
                        type: "silent",
                        duration: //dauer
                    }
                ]
            },
            audio2: {
                parts: [
                    {
                        type: "text",
                        pattern: //text
                    }
                ]
            }
        }
    }
    sequence: {
        type: "successively",
        transitions: 0.1
    },
    schedule: {
        type: schedule.type,
        time: schedule.time,
        date: "",
        time_interval: schedule.interval,
        weekdays: schedule.weekdays
    }
}
```

Die allgemeine Generierung findet in der Methode **sendVideoToBackend** statt, welche die Fetch-Methode ist, durch die das fertige Objekt an das Backend gesendet wird.
* Diese Methode trägt selbst den Namen **videojob_name** ein, indem sie auf die State-Variable **videoJobName** zugreift.
    * Gleiches gilt für **schedule**, welches dem gleichnamigen State entnommen werden kann. Hier sind lediglich Änderungen der Key-Namen notwendig, wie es bereits vom Datenformat der Infoprovider bekannt ist.
* **sequence** wird nicht durch den Nutzer beeinflusst und hat immer den gleichen Wert, entsprechend wird es auch konstant in **sendVideoToBackend** definiert.

### images-Objekt
Für das images-Objekt gibt es die Methode **createImagesObject()**, welche zur Erstellung des Objektes dient. Allgemein gilt für das Datenformat, dass ein Objekt geliefert werden soll, welches jede Szene als Key enthält, die im Video auftritt.
* Die Reihenfolge, in der die Schlüssel dabei angelegt sind ist gleichzeitig die Abspielreihenfolge.

Die Methode erstellt ein leeres Objekt **imagesObject** vom Typ any - dies ist keine schöne Lösung, aber der einzige Ansatz, mit dem man beliebig viele Keys mit unbekannten Namen hinzufügen kann.
* Die Methode geht dann durch die **sceneList** durch und fügt nach und nach die Szenen in der Reihenfolge hinzu, in der sie der Nutzer sortiert hat.
* Dabei gibt es zwei Probleme:
    * Zum einen kann eine Szene doppelt verwendet werden, das Backend hat jedoch die Namen der Szenen als Keys vorgesehen, die entsprechend einzigartig sein müssten.
    * Weiterhin wird beim Datenverkehr das Objekt automatisch alphanumerisch sortiert, sodass die Key-Reihenfolge nicht gewährleistet werden kann.
* Hier hilft die Nutzung eines **index**, der mit jedem Mal hochgezählt wird. Statt dem Szenennamen verwenden wir als Key ***index*_*szenenname***. Im zugehörigen Objekt legen wir dann unter **key** den tatsächlichen Namen der Szene ab.
* Durch den eindeutigen Index bleibt so jeder Key eindeutig, gleichzeitig sorgt der aufsteigende Index am Anfang des Keys dafür, dass die alphanumerische Sortierung unsere Reihenfolge nicht zerstört.


### audios-Objekt
Analog zum images-Objekt muss auch ein Objekt **audios** angelegt werden. Dieses soll die Definitionen der Tonspuren zu allen Szenen enthalten. Es handelt sich wieder um ein Objekt, in dem jeder Key für eine Tonspur einer Szene steht.
* Zur Zuordnung gilt: Die erste Audio wird der ersten Szene zugeordnet, die zweite Audio der zweiten Szene usw.
* Die **audio**-Objekte im Inneren werden ebenfalls mit einem **index** durchnummeriert - das sichert die Einzigartigkeit der Keys und sorgt dafür, dass die Sortierung genau der unserer Szenenliste entspricht.

Für die Generierung geht man per Schleife durch alle Einträge der **sceneList** durch. Innerhalb dieser durchläuft man das **spokenText**-Array, welches die Abfolge von Texten und Pausen enthält.
* Für jeden Eintrag **audioElement** prüft man anhand von **type**, ob es sich um einen Text oder eine Pause handelt.
    * Für Texte wird dem vorher angelegten **parts**-Array ein Objekt mit dem **type: "text"** hinzugefügt, dass als Wert von **pattern** den entsprechenden Text hat.
    * Für Pausen fügen wir dem **parts**-Array ein Objekt mit dem **type: "silent** hinzu. Hier muss als zweiter Parameter die Dauer eingegeben werden, diese findet man ebenfalls im **audioElement** als **duration**.
* Man geht auf diese Weise für eine einzelne Szene die Folge der Texte und Pausen durch und generiert so ein **parts**-Array für das Audio-Objekt dieser Szene. Zuletzt muss diesem aber noch ein Eintrag hinzugefügt werden, wenn der Nutzer gewählt hat, dass die Anzeigedauer über die TTS-Dauer hinaus gehen soll (dann ist **exceedDisplayDuration** größer als 0). Für diesen Fall fügen wir dem Array ein weiteres Silent-Objekt entsprechender Dauer hinzu.
* Zum Abschluss fügt man das so entstandene Audio-Objekt mit dem Key **audio*index***, welches das erstellte **parts**-Array als Key hat in das gesamte Objekt hinzu.

Als Gesamtergebnis erhält man ein Objekt, welches zu jeder Szene die zugehörige Audio-Konfiguration umfasst.