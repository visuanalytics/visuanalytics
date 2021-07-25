# Dashboard

Das Dashboard ist die Startkomponente der Anwendung Visuanalytics. In dieser kann man per Tabs zwischen den drei Kernkomponenten und somit zu den wichtigsten Funktionalitäten wechseln:
* den Infoprovidern und ihre Erstellung und Bearbeitung (**InfoProviderOverview**),
* den Szeneneditor (**SceneOverview**),
* und den Videojobs (**VideoOverview**).

Die Dashboard-Komponente besteht intern aus einer **index**-Datei und verschiedenen Inhalten der Tabs in dem Ordner  **TabsContent**. In der **index**-Datei wird das Grundkonstrukt für die Tabs gerendert. Dabei werden drei Unter-Komponenten implementiert, die sich gegenseitig einbinden und so zusammen die gesamte Komponente ergeben. **Dashboard** rendert die komplette Komponente und bindet **DashboardTabs** ein. Über die Konstante **DashboardTabs** wird erreicht, dass die Funktionalität der Tabs gewährleistet wird. Es wird eine Kopfzeile erstellt, in welcher die verschiedenen Tabs mit Icon und Namen angezeigt werden. Danach werden per **TabContent** die darunter liegenden Kernkomponenten eingebunden. **TabContent** wird eine Kind-Komponente übergeben, die in unseren Fall der **InfoProviderOverview**, **SceneOverview** oder **VideoOverview** ist. Jeder **TabContent** bekommt einen eindeutigen Index zugewiesen und **DashboardTabs** hat eine Variable namens **value**. Wenn der User auf einen Tab klickt, wird in **DashboardTabs** eine handleChange-Methode aufgerufen, die den **value**-Wert auf den neuen Index setzt, der dem Tab entspricht, der ausgewählt wurde. So kann korrekt zwischen den unterschiedlichen Tabs gewechselt werden.

## InfoProviderOverview

Die erste der drei Kernkomponenten ist die Übersicht der Infoprovider. Wenn die Anwendung neu gestartet wird, ist dieser Tab auch der, der standardmäßig angezeigt wird. Ein User kann hier:
* einen neuen Infoprovider erstellen,
* seine bereits erstellten Infoprovider in einer Liste ansehen und hier zusätzlich:
  * Infoprovider bearbeiten
  * Infoprovider löschen,
* und auf die Historisierungs-Datenbank zugreifen.

### Neuer Infoprovider

Für diese Funktionalität wurde eine Schaltfläche implementiert. Diese befindet sich über der Liste der Infoprovider und ist somit immer schnell aufzufinden. Das Einzige, was hier erledigt werden muss, ist, beim Betätigen der Schaltfläche die Komponente zu wechseln. Dazu gibt es die Funktion **setCurrent**. Der Schaltfläche wird diese Funktion mit der Ziel-Komponente **createInfoProvider** übergeben:
```javascript
onClick={() => components?.setCurrent("createInfoProvider")}
```

### Liste der erstellten Infoprovider

Hier soll der User seine erstellten Infoprovider einsehen und mit ihnen interagieren können. Dazu müssen intern einige Vorkehrungen getroffen werden. Die Infoprovider des Users liegen im Backend und müssen angefordert werden. Diese erhaltenen Informationen sollen nun im Frontend hinterlegt sein, damit Funktionalitäten wie Bearbeiten und Löschen korrekt ausgeführt werden können. Die Liste der Infoprovider wird auch mit diesen Informationen erstellt. 

#### Laden der Infoprovider aus dem Backend

Die Route zum Backend heißt ```/infoprovider/all```. Über die Methode **fetchAllInfoprovider** wird die Anfrage an das Backend geschickt. Dabei gibt es eine Methode **handleSuccessFetchAll** für den Erfolgs-Fall und eine Methode **handleErrorFetchAll**, falls ein Fehler in der Anfrage auftritt. Im Fehler-Fall wird dem User die Nachricht mit dem entsprechenden Fehler angezeigt. Im Erfolgs-Fall sollen die zurückgegebenen Informationen verarbeitet werden. Dazu wird die Deklaration von einem Typ benötigt, welcher sich mit dem Rückgabewert gleicht. Dieser Typ ist hier **jsonRef**:
```javascript
export type jsonRef = {
    infoprovider_id: number;
    infoprovider_name: string;
}
```
Dieser Typ beschreibt allerdings nur ein Infoprovider. Da wir alle Infoprovider anfordern, bekommen wir mehrere Objekte dieses Typen zurück. Darum gibt es noch einen zweiten Typ als Erweiterung:
```javascript
type requestBackendAnswer = Array<jsonRef>
```
Es sein hier noch erwähnt, das sich die Informationen zu einem Infoprovider auf den Namen und seine Id beschränken. Um den Inhalt eines Infoproviders zu erfragen, muss man eine andere Route benutzten (siehe *Infoprovider bearbeiten*), die sich dann aber auch nur auf einen einzelnen Infoprovider bezieht.

**handleSuccessFetchAll** bekommt ein Objekt namens jsonData mit dem Typ ```any``` übergeben. 
Mit ```const data = jsonData as requestBackendAnswer``` wird die Antwort in das Format gebracht, mit dem wir weiter arbeiten wollen. Die Komponente **InfoProviderOverview** besitzt den State **infoprovider**. In diesem werden dann mit ```setInfoProvider(data)``` die angefragten Infoprovider abgespeichert und können verwendet werden.
Die Funktionalität, die jetzt noch fehlt, ist, dass man die Methode **fetchAllInfoprovider** nicht manuell ausgeführen muss, sondern sie automatisch beim Rendern der Komponente aufgerufen wird. Das lösen wir durch einen React-useEffect:
```javascript
React.useEffect(() => {
        fetchAllInfoprovider();
    }, [fetchAllInfoprovider]
);
```
Hiermit wird **fetchAllInfoprovider** automatisch aufgerufen, wenn man zu den **InfoProviderOverview** wechselt, sodass die Liste der Infoprovider immer aktuell aus dem Backend geladen wird.
Die Infoprovider liegen bisher nur als Information vor und sind noch nicht für den User erkennbar. Die Liste mit den Infoprovidern, die der User sieht, wird durch **InfoProviderList** beschrieben. **InfoProviderList** bekommt in den Properties den State **infoprovider** übergeben und kann somit die Informationen verarbeiten. Für jedes Objekt in **infoprovider** wird hier **renderListItem()** ausgeführt. **renderListItem()** macht nichts anderes, als ein **jsonRef** zu erhalten und mit dessen Name einen Eintrag in der Liste mit einer Löschen- und Bearbeiten-Schaltfläche zu generieren. So wird für jeden Infoprovider die Liste erweitert.

#### Infoprovider Löschen

Um ein Infoprovider endgültig zu löschen, muss er aus der Datenbank im Backend entfernt werden. Wenn dieses Entfernen bestätigt ist, werden auch die im Frontend liegenden Informationen aktualisiert, damit in der GUI auch die aktuelle Änderungen übernommen werden. 
Wenn der User die Löschen-Schaltfläche betätigt, wird ein Dialog geöffnet. Hier muss der User nochmal bestätigen, ob der Infoprovider wirklich gelöscht werden soll. Das Verwenden eines Dialogs dient der Benutzerfreundlichkeit, falls ein User sich verklickt. Intern gibt es im State von **InfoProviderOverview** ein Boolean-Wert namens **removeDialogOpen**. Wenn dieser *true* ist, wird der Dialog angezeigt. **handleDeleteButton** ist die Handler-Methode für die Löschen-Schaltfläche. Sie wird aufgerufen, wenn die Schaltfläche betätigt wird. In ihr werden die zwei Variablen **currentDeleteName** und **currentDeleteId**, die im State initialisiert sind zugewiesen. Das dient dem Abspeichern, der Information für den zu löschenden Infoprovider. Danach wird **removeDialogOpen** auf true gesetzt und der Dialog erscheint.
Der User kann in dem Dialog "Abbrechen" und "Löschen bestätigen" auswählen. Mit "Abbrechen" wird der Vorgang abgebrochen und die für das Löschen verwendeten Informationen(**currentDeleteName**, **currentDeleteId**) zurückgesetzt und **removeDialogOpen** auf false gesetzt, damit sich der Dialog schließt. Mit "Löschen bestätigen" wird **confirmDelete()** aufgerufen, die ebenfalls den Dialog schließt und **deleteInfoProvider()** aufruft und somit der Löschvorgang startet. 
Wie immer, bei der Kommunikation mit dem Backend wird eine bestimmte Route verwendet, die die erforderlichen Aktionen beschreibt. Hier wird ```visuanalytics/infoprovider/``` + *infoProviderId* benutzt. Im Backend wird dann der Infoprovider, der zu der übergebenen Id passt gelöscht. **deleteInfoProvider** ist ein React-Hook und führt genau diese Route aus. Es gibt wieder eine **handleSuccessDelete**-Methode für den Erfolgsfall und eine **handleErrorDelete**-Methode im Fehlerfall. **handleErrorDelete()** gibt dabei den übergebenen Fehler vom Backend dem User aus. Wenn **handleSuccessDelete** aufgerufen wird, wurde der Infoprovider im Backend erfolgreich entfernt. Mit **currentDeleteId** kann jetzt auch der gewünschte Infoprovider aus **infoprovider** entfernt werden. Damit wird die angezeigte Liste aktualisiert und der User sieht den Eintrag für den zu löschenden Infoprovider verschwinden. 

#### Infoprovider bearbeiten

Das Bearbeiten eines Infoproviders ist intern genau so geregelt, wie das Löschen. Es gibt im State die Variablen **currentEditName**, **currentEditId** und **editDialogOpen**. Die Handler-Methode für die Bearbeiten-Schaltfläche heißt **handleEditButton()**. In ihr werden wieder die Informationen gesetzt und der Dialog geöffnet. Wenn im Dialog bestätigt wird, wird **confirmEdit()** aufgerufen. Hier wird der React-Hook **editInfoProvider** und damit die Route ```/visuanalytics/infoprovider/``` + *infoProviderId* mit der durch **currentEditId** festgelegten Id für den zu bearbeitenden Infoprovider ausgeführt. **editInfoProvider** besitzt wieder eine **handleSuccessEdit**-Methode für den Erfolgsfall und eine **handleErrorEdit**-Methode für den Fehlerfall. Im Fehlerfall wird dem User, wie bei den anderen Anfragen an das Backend die Fehlermeldung ausgegeben.
Im Erfolgsfall unterscheidet sich jedoch die Verarbeitung vom Löschen. Die ausgeführte Anfrage an das Backend liefert jetzt die Informationen für den angeforderten Infoprovider. Die Information müssen jetzt abgespeichert werden und sie müssen bearbeitet werden können. Das Bearbeiten an sich findet in einer extra Komponente statt und wird hier nicht weiter beschrieben. Das Wechseln der Komponente und das Weitergeben des zu bearbeitenden Infoprovider findet jedoch noch in **InfoProviderOverview** statt. 
Wie bei den Anfragen aller Infoprovider muss ein Typ deklariert sein, der sich mit den erhaltenen JSON vom Backend deckt:
```javascript
export type InfoProviderObj = {
    name: string;
    dataSources: Array<DataSource>;
    diagrams: Array<string>;
}
```
Ein Objekt dieses Typs enthält alle erforderlichen Informationen für einen Infoprovider. In **InfoProviderOverview** wird jetzt lediglich die Komponente zu **EditInfoProvider** gewechselt. Die ausschlaggebenden Informationen werden über Properties übergeben:
```javascript
const handleSuccessEdit = (jsonData: any) => {
        const data = jsonData as InfoProviderObj;
        components?.setCurrent("editInfoProvider", {infoProvId: currentEditId, infoProvider: data})
}
```

## SceneOverview

Der SceneOverview gibt dem Nutzer einen Überblick über alle erstellten Szenen. Dabei wird nicht nur der Name der Szene gezeigt, sondern auch ein im Backend generiertes Vorschaubild. Ebenfalls hat hier der Nutzer die Möglichkeit:
* Eine neue Szene zu erstellen,
* Szenen zu bearbeiten,
* und Szenen zu löschen.

### Neue Szene

Genau so wie bei einem neuen Infoprovider gibt es den **SceneEditor**, der für die Erstellung von Szenen zuständig ist. Dieser ist eine eigene Komponente zu der gewechselt werden muss. Dazu wird eine Schaltfläche generiert und erneut **setCurrent** verwendet:
```javascript
onClick={() => components?.setCurrent("sceneEditor")}
```

### Liste der erstellten Szenen

Die Liste der erstellten Szenen unterscheidet sich im Design von den gezeigten Infoprovidern. Wir verwenden hier das React-Element **Card**. Eine Card eignet sich gut, um das Vorschaubild mit dem Szenen-Namen zu zeigen. Wenn der Nutzer eine solche Card auswählt, wird ein Dialog geöffnet, in dem er mit der Szene interagieren kann. Die Funktionalität eines solchen Dialogs wird nicht weiter erläutert, da das in den Beschreibungen für das Löschen und Editieren eines Infoproviders ausreichend getan wurde.
Bei der Darstellung ist die Herausforderung, dass mehrmals das Backend angefragt werden muss. Zum einen werden alle Szenen geladen und zum anderen muss für jede Szene das Vorschaubild angefragt werden.

#### Laden der Ressourcen

Die Route für das Laden aller Szenen unterscheidet sich nicht groß, mit der für die Infoprovider, nur das alle Szenen empfangen werden. Dabei ist das Format wieder ein Paar aus **scene_name** und **scenen_id**. Die benötigten Typen im Frontend sind:
```javascript
export type BackendScene = {
    scene_id: number;
    scene_name: string;
}

export type FetchAllScenesAnswer = Array<BackendScene>
```
Das Laden der Ressourcen findet in der **index.tsx** statt. Wenn ein Nutzer über die Tabs auf den SceneOverview wechselt, wird **fetchAllScenes** aufgerufen. Hier wird die Route ```/visuanalytics/scene/all``` genutzt. Es wird ein Objekt des Typen **FetchAllScenesAnswer** erstellt und der Zugriff auf alle Szenen über **allScenes** ist gegeben.
Genau im Anschluss muss für jede Szenen aber auch ein Vorschaubild vorhanden sein, damit es in der Darstellung nicht zu Problemen kommt. Deswegen wird in dem SuccessHandler von **FetchAllScenesAnswer** direkt **fetchPreviewImages** aufgerufen. Hier wird ein Kreislauf in Gang gesetzt, der für jede Szene das richtige Vorschaubild lädt. Um diesen zu initialisieren wird die Variable **scenesToFetch** erstellt. Sie enthält alle Szenen, von den noch ein Vorschaubild geladen werden muss. **FetchPreviewImages** hat eine Abbruchbedingung in Form von einer If-Abfrage. Wenn **scenesToFetch** leer ist, sind alle Vorschaubilder geladen und es wird über **setValue** zu den Tab **SceneOverview** gewechselt. Ansonsten wird die nächste Szene über **nextId** bestimmt. Diese wird dann aus **scenesToFetch** entfernt. Als Nächstes wird als State **currentFetchId** auch auf die gegebene Szenen-Id gesetzt. Das ist notwendig um später außerhalb der Methode auf die richtige Id zugreifen zu können.
Nun kann **fetchPreviewImgById** ausgeführt werden. Diese Methode benutzt die Route ```/visuanalytics/scene/" + (id) + "/preview```, um mit der gegebenen Id ein Vorschaubild aus dem Backend zu laden. Im SuccessHandler kann dann in das Array **previewImgList** das erhaltene Bild eingefügt werden. Dabei wird die URL (erhaltene Antwort aus dem Backend) für das Bild und die dazugehörige Id (**currentFetchId**) als Paar abgespeichert. Zuletzt wird erneut **fetchPreviewImgages** aufgerufen, um den Kreislauf zu schließen.
Damit haben wird **allScenes** und **previewImgList**, die alle geforderten Informationen enthalten. Diese werden **SceneOverview** übergeben.
Für alle Anfragen an das Backend gilt, dass es ebenfalls ein ErrorHandler gibt, der im Fehlerfall den Fehler ausgeben würde. Die Anfragen wären dann ungültig.

### Löschen einer Szene

Für das Löschen einer Szene ist ein Dialog implementiert, in dem der Nutzer die Aktion bestätigen muss. Wenn das geschehen ist, wird **deleteSceneInBackend** aufgerufen, die über die Route ``visuanalytics/scene/" + currentScene.scene_id`` und der Methode **DELETE** die Szene im Backend löscht. Mögliche Lösch-Abhängigkeiten sind im Backend implementiert.

### Bearbeiten einer Szene

Für das Bearbeiten einer Szene ist ebenfalls ein Dialog implementiert. Nach Bestätigen wird über **fetchSceneById** und die Route ``visuanalytics/scene/" + currentScene.scene_id`` mit der Methode **GET** die geforderte Szene angefragt. Der Rückgabetyp ist dabei:
```javascript
export type FullScene = {
    name: string;
    used_images: Array<number>;
    used_infoproviders: Array<number>;
    images: ImagesBackend;
    backgroundImage: number;
    backgroundType: string;
    backgroundColor: string;
    backgroundColorEnabled: boolean;
    itemCounter: number;
    scene_items: Array<CustomCircle | CustomRectangle | CustomLine | CustomStar | CustomText | CustomImage>;
    infoProvider?: FrontendInfoProvider;
}
```

Danach müssen die von der Szene benutzen Infoprovider ebenfalls geladen werden. Dazu wird im SuccessHandler **fetchInfoProvider** aufgerufen. Hier wird der gebrauchte Infoprovider angefragt. Nachdem die Information verfügbar ist, kann über **setCurrent** die Komponente gewechselt werden. Die Informationen können dem SceneEditor über Properties übergeben werden.

## VideoOverview

## LogDialog
Ein zentrales Element der Anwendung ist es Logs zu Infoprovidern und Videojobs einsehen zu können. Diese Ansicht wird durch die Komponente `LogDialog` zur Verfügung gestellt. Diese ist dabei so entwickelt worden, dass diese für Videojobs und Infoprovider gleichermaßen verwendet werden kann.

### Das Interface
```javascript
interface LogDialogProps {
    objectId: number;
    objectName: string;
    objectType: "infoprovider" | "videojob"
    showLogDialog: boolean;
    setShowLogDialog: (showLogDialog: boolean) => void;
    reportError: (message: string) => void;
}
```

Das Interface zeigt, dass die Komponente grundsätzlich die ID des Elements übergeben bekommt, für welches die Logs angezeigt werden. Weiterhin wird über `objectType` geregelt, ob es sich um einen Infoprovider oder um einen Videojob handelt. 

### States
Die Komponente hält die folgenden States:
* **logMessages / setLogMessages:** In diesem State werden alle Nachrichten gespeichert, welche im Backend für das ausgewählte Objekt vorhanden sind. Dabei sind die einzelnen Elemente vom Typ `LogEntry`. Dieser entspricht dem gesendeten Objekt vom Backend. Die genaue Spezifikation des Typen ist in `types.tsx` des Dashboards zu finden.
* **selectedTraceback / setSelectedTraceBack:** In diesem State wird der Traceback des ausgewählten Log-Eintrags gespeichert, wenn die entsprechende Schaltfläche betätigt wurde.
* **showTracebackDialog / setShowTracebackDialog:** In diesem State wird eine boolean-Variable gespeichert, welche bestimmt, ob der Dialog angezeigt wird, in welchem der Traceback für das ausgewählte Element angezeigt wird. Der State wird dabei immer auf `true` gesetzt, wenn der Nutzer den Traceback eines Dialogs einsehen möchte. Der Wert `false` wird hingegen bei schließen des Traceback-Dialogs gesetzt und ist gleichzeitig der initiale Wert.

### Aufbau der Komponente
Die gesamte Komponente ist als **Dialog** umgesetzt worden. Dabei enthält der Dialog eine Tabelle, welche die einzelnen Log-Einträge enthält. Der Tabellenkopf wird dabei im `return` der Komponente definiert, während die einzelnen Tabellenzeilen durch `renderTableRow` gerendert werden. Diese Methode wird dabei innerhalb der **Map-Funktion** aufgerufen, welche auf `logMessages` angewandt wird. Jede Zeile enthält dabei einen Button, welcher den Dialog mit Informationen zum Traceback enthält. Dieser Button wird allerdings nur angezeigt, wenn es auch wirklich einen Fehler gab. Andernfalls ist der Traceback leer und muss somit dem Nutzer auch nicht zur Verfügung gestellt werden.

Die Daten für die Logs werden dabei mittels **useEffect** vom Backend abgefragt, sobald die Komponente geladen wurde. Die Methode `fetchLogs` nimt dabei sowohl die ID des abzufragenden Objekts entgegen, als auch den Typ (Infoprovider / Videojob). Anhand dieser Informationen wird die korrekte Route aufgerufen, um entsprechende Logs zu erhalten. Es wird in der Methode ein Timer definiert, welcher nach fünf Sekunden einen Timeout auslöst. Sollte die Abfrage an das Backend keinen Fehler liefern, so werden die Daten an die Methode `handleFetchLogsSuccess` übergeben. Andernfalls wird die Methode `handleFetchLogsError` aufgerufen, welche den Fehlercode übergeben bekommt und die Meldung dem Nutzer zur Verfügung stellt. In beiden Fällen passiert der entsprechende Funktionsaufruf nur, wenn die Log-Komponente noch geladen ist (`isMounted` ist auf `true`). Zum Schluss der Abfrage an das Backend wird, falls eine Antwort erhalten wurde, der Timer deaktiviert.

Die Methode `handleFetchLogsSuccess` wandelt die übergebenen Daten in ein Array mit Werten des Typs `LogEntry` um und speichert diese Werte im State `logMessages`. Wenn im Backend nun Log-Einträge für das ausgewählte Objekt vorhanden waren, so werden diese nun im Frontend angezeigt.
