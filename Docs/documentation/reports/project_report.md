# Projektbericht

## Das Team
Wir haben das Entwickler-Team, bestehend aus sechs Mitgliedern, in zwei Teams aufgeteilt:

### Backend
* Sören Clausen
* Tim Schwabe

Dieses Team hatte primär die Aufgabe das bisherige Backend in seiner Logik zu verstehen und passend zu erweitern. Zu diesen Erweiterungen gehörte unter anderem die Erweiterung der Datenbank oder das Implementieren neuer Features auf Basis der bereits bestehenden Funktionen. Dabei war es eine Priorität eine Abwärtskompatibilität zum bisherigen Backend zu gewährleisten, damit alte Videos nach wie vor generiert werden können.

### Frontend
* Tristan Wolfram
* Philipp Helfenritter
* Janek Berg
* Daniel Spengler (Projektleiter)

Das Frontend hatte primär die Aufgabe das User-Interface stark zu erweitern, sodass die Dateien zur Generierung von Videos nicht mehr per Hand geschrieben werden müssen. Viel mehr sollten die Dateien automatisch generiert werden. Dem Nutzer sollte dafür eine einfache GUI zur Verfügung gestellt werden. Das Team des Frontends wurde dabei mit mehr Mitgliedern als das Backend besetzt, da es hier mehr Aufgaben gab, welche angefallen sind.

## Zeit- und Aufgabenmanagement

### Rahmenbedingungen
Die Software **VisuAnalytics** ist im Rahmen des **Softwaretechnik-Projekts** im Sommersemester 2021 an der **Technischen Hochschule Mittelhessen** unter der Leitung von Prof. Dr. Frank Kammer entstanden. Dabei startete das Projekt am **08.04.2021** und endet am **26.07.2021**.

In diesem Zeitraum sollte jedes Teammitglied **mindestens 220 Arbeitsstunden** für das Projekt aufbringen.

### Meetings
Das Team hatte insgesamt drei feste Meetings pro Woche:
* **Montags:** Während dieses Meetings wurden die Aufgaben für die aktuelle Woche verteilt. Dabei wurden die Aufgaben zunächst gröber und somit größer gehalten, um das Meeting möglichst kurz zu halten.
* **Donnerstags:** In diesem Meeting hat sich das Team mit dem Auftraggeber getroffen, um mögliche Probleme zu besprechen. Hier konnte allerdings auch der aktuelle Fortschritt gezeigt werden und der Auftraggeber hatte die  Möglichkeit Feedback zu geben.
* **Freitags:** Während dieses Meetings hat sich das Team getroffen, um untereinander den aktuellen Fortschritt zu zeigen. Dabei war diese Vorführung meist etwas detaillierter als die Vorführung beim Auftraggeber, da hier mehr Zeit für die Vorstellungen war. Außerdem wurden bei diesem Meeting aufgetretene Probleme besprochen.

### Aufteilung der Aufgaben
Die Aufteilung der Aufgaben erfolgte in zwei Phasen:
* **Phase 1:** Im Planungsmeeting der Woche (jeden Montag) wurden im gesamten Team die groben Aufgaben für die aktuelle Woche besprochen und in einem Protokoll festgehalten. Dabei wurden die Aufgaben entsprechend der beiden Teams (Front- und Backend) aufgeteilt. Je nach Situation gab es teilweise auch weitere Aufgabenkategorien, wie z.B. die Erstellung des Lasten- oder Pflichtenheftes, welche zur Kategorie **Organisation** gezählt werden können.
* **Phase 2:** Nach dem gemeinsamen Planungsmeeting wurden die Aufgaben vom jeweils zuständigen Team konkretisiert und an die einzelnen Entwickler verteilt. Somit war jedem Teammitglied zu Beginn der Woche bekannt, welche Aufgaben es zu erledigen hatte. Sollten die Aufgaben schnell erledigt worden sein, so konnten einzelne Teammitglieder weitere Aufgaben übernehmen, welche erst zu einem späteren Zeitpunkt geplant gewesen wären.

### Aufteilung der Arbeitszeiten
Grundsätzlich war es jedem Teammitglied freigestellt wann dieses arbeitet und wie viele Stunden dieses pro Wochen in das Projekt investiert hat. Diese Aussage galt während des Projekts grundsätzlich, es sei denn es gab schwerwiegende Fehler, welche dringend behoben werden mussten. Natürlich löst diese freie Aufteilung der Zeiten die 220 Stunden, welche geleistet werden sollten, nicht ab. Für die Einhaltung dieser "Regel" war jedes Teammitglied für sich verantwortlich. Sollten einem Mitglied einmal die Aufgaben ausgegangen sein, so hat das restliche Team versucht weitere Aufgaben zu finden, um das Mitglied bei der Erreichung der erforderlichen Stunden zu unterstützen.

### Zeitmanagement mittels Jira
Um Arbeitszeiten verwalten zu können, haben wir auf die Plattform **Jira** gesetzt, welche von der THM zur Verfügung gestellt wird. Hierbei haben wir das Projekt zu Beginn in **User Stories** eingeteilt, welche in Jira eingetragen wurden. Für jede dieser **User Stories** haben die Teammitglieder sich, entsprechend ihrer Aufgaben, Unteraufgaben erstellt, für welche dann auch Zeiten eingetragen wurden. Dabei ermöglicht Jira es, die Aufgaben auf einem **Board** anzuordnen, um zu visualisieren, wie der Status einer bestimmten Aufgabe zum aktuellen Zeitpunkt ist.

Um die Zeiten zu exportieren, haben wir das Tool ["Wochenberichtstool"](https://github.com/kowalski2019/Weekly_report_tool/wiki) verwendet. In diesem kann man einzelne Arbeitswochen hinzufügen und dabei direkt Daten von Jira importieren. Hierfür erstellt man mit Jira einen Bericht für die geleistete Arbeitszeit und beschränkt die Zeitspanne für diesen Bericht auf eine Woche (in unserem Fall von Montag bis Sonntag). Anschließend kann man die heruntergeladene CSV-Datei einfach in genanntem Tool importieren. Dabei erstellt das Werkzeug die benötigten Tabellen. Dazu gehört eine Übersicht über alle Aufgaben, sortiert nach der Woche. Weiterhin gibt es Tabellen für jeden Mitarbeiter, in welchen nur die Aufgaben des jeweiligen Mitglieds gelistet werden.

Auf diese Art, war es für uns einfach und schnell möglich die Zeiten aller Mitglieder zu erfassen und als Datei an unseren Auftraggeber zu senden.

### Kommunikation im Team
Die Kommunikation innerhalb des Teams erfolgte primär durch die oben genannten Meetings und über die Plattform [Slack](https://slack.com/intl/de-de/).

Bei Slack handelt es sich dabei um eine Plattform, auf welcher primär Textnachrichten und Dokumente ausgetauscht werden können. Die Kommunikation erfolgt dabei in verschiedenen **Channels**. Für unseren Anwendungszweck haben wir uns unter anderem die folgenden Channels erstellt:
* **Frontend:** Ein Channel für alle Frontend-Mitglieder, in welchem Informationen über die Entwicklung des Frontends ausgetauscht werden konnten. Auch konnten hier Probleme diskutiert, besprochen und gelöst werden.
* **Backend:** Die Funktionsweise dieses Channels war im Grunde sehr ähnlich, wie die des Frontend-Channels, diente allerdings als Kommunikationskanal für das Backend.
* **General:** In diesem Channel waren alle Teammitglieder angemeldet. Hier wurden generelle Informationen mitgeteilt, zu welchen jedes Teammitglied Zugang haben sollte. Dies waren beispielsweise Informationen des Auftraggebers oder zu größeren Neuigkeiten in der Entwicklung.
* **Protokolle:** Hier wurden alle Protokolle gesammelt, welche während der Planung- und Fortschrittsmeetings geschrieben wurden.

Weiterhin existierte eine Gruppe auf der Plattform [WhatsApp](https://www.whatsapp.com/). Hier wurden Nachrichten ausgetauscht, wenn es etwas sehr kurzfristiges zu besprechen gab oder wenn es sich um eine äußerst dringliche Angelegenheit gehandelt hat.

## Versionsverwaltung / Entwicklung neuer Features
Um unser Projekt zu verwalten haben wir [ein bereits bestehendes Repository](https://github.com/Biebertal-mach-mit-TV/Data-Analytics) auf der Plattform Github verwendet. Dieses Repository wurde dabei vom Vorgänger-Projekt erstellt und von uns für die Weiterentwicklung verwendet. Dabei stellt das Repository einige Features bereit, welche uns aktiv bei der Entwicklung unterstützt haben. Auf diese Features soll in den folgenden Abschnitten eingegangen werden.

### Entwicklung neuer Features
Wenn ein neues Feature entwickelt werden sollte oder auch ein Fehler korrigiert wurde, so wurde dies immer in einem eigens dafür erstellten Branch gemacht. Die Besonderheit ist nun, dass dieser Branch nicht manuell erstellt werden musste, sondern automatisiert von Github erstellt wurde. Damit dies möglich war, ist es nötig wie folgt bei der ERstellung eines Issues vorzugehen.
1. Den Tab **Issues** im Repository wählen.
2. Auf der angezeigten Seite die Erstellung eines neuen Issues wählen.
3. Ein Template für das Issue wählen, z.B. **Implementierung**.
4. Informationen zum Issue eingeben. Dazu gehört z.B. eine Beschreibung für das Issue oder die zuständige Person. In diesem Schritt ist es wichtig, mit Klick auf **Projects** das zugehörige Projekt auszuwählen. Das Projekt hat den Namen **Multimediales Data Analytics**.
5. Nach der erfolgreichen ERstellung des Issues wählt man **Projects** im Repository und wählt das Projekt **Multimediales Data Analytics**. Hier sieht man nun eine Übersicht des Projekts mit dem eben erstellten Issue unter der Spalte **To do**.
6. Verschiebt man ein Issue auf die Spallte **In progress* so wird nach kurzer Zeit ein Branch dafür erstellt.

Hat ein Entwickler die Arbeit an einem Feature / Bugfix abgeschlossen, so konnte das entsprechende Feature auf die Spalte **Review** verschoben werden. Hierbei wurde das Repository so eingerichtet, dass automatisch ein ** Pull request** für den **Master branch** gestellt wurde. Gleichzeitig erfolgten nach diesem Schritt die automatisierten Tests und unser Review-Prozess.

### Automatisiertes Testen
Wie im vorherigen Abschnitt angesprochen, wurden bei Erstellung eines **Pull requests** automatisch automatisierte Tests angestoßen. Die Tests haben sich dabei in **Frontend Tests** und **Backend Tests** aufgeteilt.

Für das Frontend wurde dabei unter anderem ein Linter verwendet, welcher die Qualität des Codes sicherstellen sollte und z.B. auf ungenutzte Variablen oder Imports aufmerksam gemacht hat. Gleichzeitig haben die Tests aber auch versucht das Frontend zu starten und konnten so auch benachrichtigen, wenn ein Syntax-Fehler oder ähnliches vorlag.

Im Backend werden bislang während der automatisierten Tests nur die entwickelten **Unit Tests** geprüft. Können diese erfolgreich abgeschlossen werden, so wird auch der automatisierte Test erfolgreich abgeschlossen.

### Ablauf der Code-Reviews
Sobald ein Issue auf die Spalte **Review** im Projekt verschoben wurde, begann auch der Review-Prozess. Hierzu wurde vom jeweiligen Entwickler des Features zunächst das restliche Entwicklungsteam (Front- oder Backend) benachrichtigt. Anschließend hat ein anderes Mitglied dieses Teams sich gemeldet das Code-Review durchzuführen. Dazu wurden während des Code-Reviews standardmäßig die beiden folgenden Schritte ausgeführt:
* Anwendung starten und neue Funktionalität rudimentär testen.
* Den neu geschriebenen Code möglichst detailliert nachvollziehen und kritisch hinterfragen.

Während dieser Arbeit war der Reviewer dazu angehalten sich Notizen zu Auffälligkeiten zu machen und diese dem ursprünglichen Entwickler des Branches zur Verfügung zu stellen. Nach Überarbeitung des Branches mit diesen Anmerkungen durfte dieser in den Master gemerget werden. Wenn es keine Anmerkungen gab, so konnte der Branch natürlich sofort gemerget werden, es sei denn es gab explizit andere Anweisungen.

Der Review-Prozess fand nur in den Fällen nicht statt, in welchen mindestens zwei Mitglieder am gleichen Feature entwickelt haben (Pair-Programming). In diesem Fall sehen wir die Kontrolle der Qualität durch die jeweils zuschauende Person als gegeben an.

### Verwendung der angesprochenen Automatisierungen
Die Angesprochenen Automatisierungen in den ersten beiden Abschnitten deses Kapitels wurden nicht eigenständig von uns entwickelt, sondern wurden bereits vom Vorgängerteam implementiert. Für eine genauere Dokumentation zu diesen Features empfehlen wir die Abschnitte der [zugehörigen Dokumentation](https://visuanalytics.readthedocs.io/de/latest/mainreport/Projektbericht.html) zu lesen. In diesen gibt es weitere Informationen zu diesen Features.

## Entwicklungsumgebung, Programmiersprachen

### Entwicklungsumgebungen
Innerhalb unseres Teams wurden zwei verschiedene Entwicklungsumgebungen eingesetzt:
* **WebStorm:** Entwicklung des Frontends
* **PyCharm:** Entwicklung des Backends.

### Verwendete Programmiersprachen
Da wir kein vollständig neues Projekt entwickelt haben, haben wir uns dazu entschieden die Programmiersprachen, welche durch das Vorgänger-Team definiert und verwendet wurden, selbst zu verwenden:
* [Python](https://www.python.org/)
* [TypeScript](https://www.typescriptlang.org/)

Das Frontend hat dabei insbesondere die Frameworks [React](https://reactjs.org/) für die Darstellung und [Material-UI](https://material-ui.com/) für das Design verwendet.

Im Backend kamen primär die Frameworks [Flask](https://palletsprojects.com/p/flask/) für die Bereitstellung des Servers, [ast](https://docs.python.org/3/library/ast.html) für die Syntax-Überprüfung von Formeln und [Matplotlib](https://matplotlib.org/) für die Generierung von Diagrammen zum Einsatz.

### Hinweis: Version von Material-UI
Momentan ist es nicht möglich die neueste Version von **Material-UI** für das Frontend zu verwenden, da diese mit den alten Frontend-Komponenten des Vorgängerprojekts nicht kompatibel wäre. Beim versuchten Update sidn in diesen Komponenten Syntax-Fehler entstanden. Wir hatten während des Projekts keine Zeit diese zu beheben und haben uns deshalb dafür entschieden, kein Update von Material-UI einzubinden.

Die Komponenten des alten Frontends haben wir nicht entfernt, da wir der Meinung sind, dass es ein nützliches Feature sein könnte in der Weiterentwicklung dem Nutzer die Möglichkeit zu geben, zwischen beiden Versionen zu wechseln.

## Projektfazit

### Zielsetzung
Unser Ziel war es, die Anwendung **VisuAnalytics**, welche im letzten Sommersemester an der THM entstanden ist, generell benutzerfreundlicher zu machen, indem neue Themen / Videos für die Anwendung nun nicht mehr vom Nutzer in einer JSON-Datei spezifiziert werden müssen. Mit unserer Erweiterung sollte es möglich werden, dass ein Nutzer die benötigten Einstellungen in einer **GUI** wählen und individualisieren können soll. Dabei sollte sich die Anwendung nicht auf eine bestimmte API beschränken, aus welcher Informationen bezogen werden können, sondern generisch aufgebaut sein, sodass alle APIs, welche XML- oder JSON-Objekte als Antwort liefern, verwendet werden können.

Diese Zielsetzung wurde durch unsere Arbeit in den letzten Monaten erfüllt. Es ist zwar nicht möglich gewesen in der gegebenen Zeit, alle Möglichkeiten, welche bereits im Backend zur Verfügung standen, auch im neuen Frontend umzusetzen, jedoch ist es möglich, ein sehr individuelles Video nach eigenen Vorstellungen zu generieren. Dabei benötigt ein Nutzer nun deutlich weniger Fachwissen. Dennnoch sollte die Zielgruppe sich mit IT etwas auskennen, um die Dokumentationen zu APIs zu verstehen, welche er benutzen möchte.

Auf spezifischere Teile der Zielsetzung, welche später im **Pflichtenheft** definiert wurden, soll im weiteren Verlauf dieses Kapitels eingegangen werden.

### Abgeschlossene Aufgaben
Im Folgenden sollen die Aufgaben genannt werden, welche während des Projekts umgesetzt werden konnten. Dabei sind diese Aufgaben kategorisiert nach **Must-Have**, **Nice-To-Have** und **If-Time-Allows**. Die entsprechenden Einträge wurden dabei in ihrem Sinn aus dem **Lastenheft** übernommen.

#### Abgeschlossene Must-Haves
* Als Nutzer möchte ich einen **Infoprovider** erstellen können. Diesem kann ich einen Namen geben und eine URL zu einer API sowie den zugehörigen API-Key übergeben. Anschließend wird mit diesen Daten und durch Abfrage der API eine Liste von verfügbaren Parametern generiert, aus welcher ich beliebig viele Parameter wählen kann. Diese möchte ich später für die Erstellung von Videojobs verwenden können. Wahlweise kann ich zu einem Infoprovider auch mehrere APIs hinzufügen.
* Als Nutzer möchte ich **Formeln** aus den Attributen des Infoproviders erstellen und so z.B. eine Differenz von zwei Werten bestimmen können.
* Als Nutzer möchte ich im Infoprovider Daten auswählen können, welche ich historisieren möchte, um später Zugriff auf ältere Werte zu haben. Außerdem möchte ich dabei beliebige Zeitpunkte für die Historisierung wählen können.
* Als Nutzer möchte ich meine angelegten Infoprovider bearbeiten können, um nicht für jede Änderung einen neuen Infoprovider definieren zu müssen.
* Als Nutzer möchte ich mit einem **Videoeditor** Videojobs erstellen können. Diese Jobs bestehen dabei aus Standbildern, welche hier als *Szene* bezeichnet werden. In dem Videojob möchte ich Daten aus meinen Infoprovidern verwenden können, um damit beispielsweise einen Text zu verfassen, welcher nach Generierung des konkreten Videos von einer synthetischen Stimme (TTS) vorgelesen wird. Den Text, welcher vorgelesen wird, möchte ich dabei in eigenen Worten verfassen können. Weiterhin soll der Text Variablen enthalten können, welche durch Werte von der API befüllt werden können.
* Als Nutzer möchte ich zu einem Videojob eine **Szene** hinzufügen können, in welcher ich eine beliebige Hintergrundfarbe festlegen kann. Außerdem soll der **Szeneneditor** die Möglichkeit enthalten eigene Hintergrundbilder festzulegen. Text, Diagramme und Daten aus den Infoprovidern, sowie eigene Bilder sollen dabei überall im Bild frei platzierbar sein.
* Als Nutzer möchte ich Videojobs und Szenen bearbeiten können, damit ich für kleine Änderungen nicht einen vollständig neuen Job erstellen muss.
* Als Nutzer möchte ich einen Infoprovider für verschiedene Videojobs und Szenen verwenden können.

#### Abgeschlossene Nice-To-Haves
* Als Nutzer möchte ich, dass bei Absturz des Servers die Infoprovider samt ihrer Historisierung erhalten bleiben. Es sollen also keine Daten verloren gehen.
* Als Benutzer möchte ich im Szeneneditor **Hilfen zur Anordnung** (alignment) für Elemente haben, damit diese perfekt ausgerichtet sind. (Alignment wurde bei uns dabei durch die manuelle Eingaben von Koordinaten für die Position ermöglicht.)

#### Abgeschlossene If-Time-Allows
Es wurden aus zeitlichen Gründen keine **If-Time-Allows** abgeschlossen. Hierfür war der gegebenen Zeitrahmen zu knapp gewählt.

### Bewährte Kommunikationsmittel
Während des Projekts hat sich insbesondere **Slack** als Kommunikationsmethode bewährt. Nachdem jeder die Funktionsweise von Slack durchdrungen hatte, gab es hier eine sehr gute Struktur und die Nachrichten, welche gesucht wurden, konnten schnell gefunden werden. Auch war jedes Mitglied über den Nachrichtendienst gut erreichbar. So konnten meist sehr schnell Meetings ausgemacht werden, wenn es größere Probleme gab. Auch konnten schnell Probleme gelöst wurden, wenn die benötigten Personen die Nachrichten entsprechend schnell sahen. Es wäre bei Slack sogar möglich gewesen eine **Github-Erweiterung** zu installieren, mit welcher es möglich gewesen wäre, den Fortschritt im Repository direkt auf Slack einzusehen. Wir haben uns damit allerdings aus zeittechnischen Gründen nicht auseinandergesetzt.

Auch die Meetings haben sich bewährt und dafür gesorgt, dass wir ein gutes Arbeitstempo vorweisen konnten. Dabei hat sich auch die angesprochene Struktur / Anzahl der Meetings bewährt und musste nicht weiter angepasst werden.

Die Gruppe auf **WhatsApp** blieb während des Projekts in den allermeisten Fällen ruhig und wurde kaum benötigt. In dringenden Fällen wurden aber auch hier Nachrichten ausgetauscht. Es hat sich hier also um eine gute Ergänzung zu Slack gehandelt.

### Erweiterbarkeit
Ein Ziel von uns war es, die Anwendung so zu entwickeln, dass weitere Features hinzugefügt werden können. Wir sind der Meinung dieses Ziel durch eine gute Doku und eine geeignete Struktur des Quellcodes auch erreicht zu haben. Dennnoch wird es für weitere Teams schwierig sein sich in den Code einzuarbeiten, da dieser auf Grund der Anforderungen an einigen Stellen ein sehr hohes Level an Komplexität erreicht hat.

### Abwärtskompatibilität
Ein weiteres Ziel unserer Anwendung war es **abwärtskompatibel** zur "alten" Version der Anwendung zu sein. Da wir am ursprünglichen Backend nur wenig ändern mussten und die ehemaligen Strukturen weiterhin existieren, sollte auch dieser Teil der Zielsetzung erfüllt worden sein.

### Test der Software
Für den Test der Software hatten wir vergleichsweise wenig zeit. Jedoch haben wir uns so organisiert, dass das Backend mit intensiven Tests 10 Tage vor Abgabe beginnen konnte. Damit ist nicht gemeint, dass vorherige Teile der Anwendung nicht getestet wurden (dies passierte immer im Review-Prozess), sondern viel mehr der Test der Anwendung im Zusammenspiel mit allen entwickelten Komponenten. Wir sind trotz dieses kurzen Zeitraums allerdings der Meinung die Anwendung gut getestet haben zu können. Wir schließen kleinere Fehler dennnoch nicht aus.

### Bekannte Fehler / Bugs
Trotz dem Anspruch an eine hohe Code-Qualität durch die ergriffenen Maßnahmen und Methoden, konnten wir bis zum Ende des Projekts die folgenden Fehler nicht korrigieren:
* Update von Material-UI, da durch das Update Fehler auftreten wurden. Auf dieses Problem wurde bereits im Abschnitt **Entwicklungsumgebung, Programmiersprachen und Frameworks** eingegangen.

### Mögliche Fehler / Bugs
Da die Anwendung stark weiterentwickelt wurde und es unter Umständen Fälle gibt, welche wir durch unsere Tests nicht abdecken konnten, kann es - wie bei jeder anderen Software auch - zu Fehlern kommen, welche uns noch nicht bekannt waren.

### Abschließende Reflektion
Insgesamt hat das Team in den vergangenen Monaten eine spannende Zeit erleben dürfen. Allerdings ist sich das Team einig, dass das Projekt für den gegebenen Zeitraum vermutlich zu umfangreich war. So war es zu Beginn sehr schwierig sich in das Projekt einzuarbeiten, da vor allem im Backend bereits sehr viel - auch komplexer - Code vorhanden war. Im Frontend war vor allem der Szeneneditor problematisch in seiner Implementierung, da es zunächst überhaupt schwierig war ein geeignetes Framework zu finden. Nachdem dieses gefunden war, war es zusätzlich aber auch schwierig die Implementierung damit umzusetzen, da sämtliche offizielle Beispiele in **ECMA-Script** geschrieben wurden. So erforderte es einige Versuche, bis eine erste Version des Szeneneditors zu Stande kommen konnte. Ein weiterer Faktor war es, dass die Bugs der Software teils erst sehr spät gefunden werden konnten, da viele dieser Bugs nur auftreten, wenn man den letzten Schritt der Videogenerierung ausführt. Hier wird nämlich nicht nur etwas abgespeichert, sondern die Daten werden zur Verarbeitung genutzt. Aufgrund diesens Asspektes war es enorm schwierig länger angelegte Tests zu organisieren.

Wenn wir als Team unsere getane Arbeit im Nachhinein betrachten, so erkennen wir die zeitlichen Probleme und die dadurch zu kurz ausgefallenen Tests, allerdings sind wir mit unserer entstandenen Arbeit dennnoch sehr zufrieden.

## Anhang

## **Anhang A: Lastenheft**

### **Momentaner Stand der Anwendung VisuAnalytics**
Bisher ist es mit der Software VisuAnalytics möglich, sich Videos zu bestimmten Themen, wie z.B. einem Wetterbericht, generieren zu lassen. Dabei werden die Informationen für den Wetterbericht von einer spezifizierten API abgegriffen und durch Definitionen in Form eines JSON-Objekts so aufbereitet, dass ein Video automatisiert erstellt werden kann. Welche APIs mit welchen Daten hierbei unterstützt werden, wird ebenfalls durch JSON-Dateien festgelegt.
Es ist außerdem möglich, die Erstellung des Videos bis zu einem gewissen Grad zu individualisieren. Dafür können bei Erstellung des Videos vorgegebene Parameter verändert werden. So wird es beispielsweise möglich, die gleiche API zu verwenden, um den Wetterbericht für zwei verschiedene Orte zu generieren.


### **Zielbestimmung**
Das Projekt **VisuAnalytics** aus dem Softwaretechnik-Projekt des letzten Sommersemesters soll im Laufe dieses Projekts erweitert werden. Unter anderem soll die Anwendung dadurch generell benutzerfreundlicher werden und mehr Möglichkeiten als bisher bieten. Um welche Verbesserungen es sich dabei konkret handelt, soll in Form von **User Stories** erläutert werden.

#### **Aufteilung in Kategorien**
Die Anforderungen an die Erweiterung sollen im nachfolgenden in die drei Kategorien *Must-Have*, *Nice-To-Have* und *If-Time-Allows* gegliedert werden, um eine Priorisierung der einzelnen Aufträge zu ermöglichen.

##### **Must-Have**
* Als Nutzer möchte ich einen **Infoprovider** erstellen können. Diesem kann ich einen Namen geben und eine URL zu einer API sowie den zugehörigen API-Key übergeben. Anschließend wird mit diesen Daten und durch Abfrage der API eine Liste von verfügbaren Parametern generiert, aus welcher ich beliebig viele Parameter wählen kann. Diese möchte ich später für die Erstellung von Videojobs verwenden können. Wahlweise kann ich zu einem Infoprovider auch mehrere APIs hinzufügen.
* Als Nutzer möchte ich **Formeln** aus den Attributen des Infoproviders erstellen und so z.B. eine Differenz von zwei Werten bestimmen können.
* Als Nutzer möchte ich im Infoprovider Daten auswählen können, welche ich historisieren möchte, um später Zugriff auf ältere Werte zu haben. Außerdem möchte ich dabei beliebige Zeitpunkte für die Historisierung wählen können.
* Als Nutzer möchte ich meine angelegten Infoprovider bearbeiten können, um nicht für jede Änderung einen neuen Infoprovider definieren zu müssen.
* Als Nutzer möchte ich mit einem **Videoeditor** Videojobs erstellen können. Diese Jobs bestehen dabei aus Standbildern, welche hier als *Szene* bezeichnet werden. In dem Videojob möchte ich Daten aus meinen Infoprovidern verwenden können, um damit beispielsweise einen Text zu verfassen, welcher nach Generierung des konkreten Videos von einer synthetischen Stimme (TTS) vorgelesen wird. Den Text, welcher vorgelesen wird, möchte ich dabei in eigenen Worten verfassen können. Weiterhin soll der Text Variablen enthalten können, welche durch Werte von der API befüllt werden können. Zusätzlich zur Sprachausgabe möchte ich außerdem die Möglichkeit haben Soundeffekte hinzuzufügen, welche der Nutzer bei Abspielen des Videos hört.
* Als Nutzer möchte ich zu einem Videojob eine **Szene** hinzufügen können, in welcher ich eine beliebige Hintergrundfarbe festlegen kann. Außerdem soll der **Szeneneditor** die Möglichkeit enthalten eigene Hintergrundbilder festzulegen. Text, Diagramme und Daten aus den Infoprovidern, sowie eigene Bilder sollen dabei überall im Bild frei platzierbar sein.
* Als Nutzer möchte ich Videojobs und Szenen bearbeiten können, damit ich für kleine Änderungen nicht einen vollständig neuen Job erstellen muss.
* Als Nutzer möchte ich eine Szene als Vorschau für den Videojob wählen können, um z.B. Aufmerksamkeit für ein Video zu erzeugen. Dabei muss die Szene nicht aus dem Video selbst stammen, sondern ich kann eine beliebige Szene wählen, welche ich zuvor erstellt habe.
* Als Nutzer möchte ich einen Infoprovider für verschiedene Videojobs und Szenen verwenden können.



> **WARNUNG:** Es sei an dieser Stelle nochmal ausdrücklich erwähnt, dass der "Videoeditor" einen nur sehr begrenzten Funktionsumfang besitzt. Es wird lediglich möglich sein, Szenen aneinander zu reihen, eine Sprachausgabe hinzuzufügen und Soundeffekte einzuspielen. Szenen bestehen dabei aus Standbildern. Bewegtbilder oder dynamische Bilder werden also nicht zur Verfügung stehen.

##### **Nice-To-Have**
* Als Nutzer möchte ich Soundeffekte auswählen können, welche nur abgespielt werden, wenn bestimmte Bedingungen gegeben sind (z.B. die Voraussage von regnerischem Wetter).
* Als Nutzer möchte ich, dass bei Absturz des Servers die Infoprovider samt ihrer Historisierung erhalten bleiben. Es sollen also keine Daten verloren gehen.
* Als Benutzer möchte ich im Szeneneditor **Hilfen zur Anordnung** (alignment) für Elemente haben, damit diese perfekt ausgerichtet sind.
* Für Webseiten, welche keine API zur Verfügung stehen haben, möchte ich eine simple *Drag-And-Drop-Skriptsprache* zur Verfügung gestellt bekommen, durch welche ich automatisiert bestimmte Daten aus einem HTML-Dokument erhalten kann. Diese Daten möchte ich genau wie Daten von einer API zur Erstellung von Videos nutzen und in einem Infoprovider sichern können.
* Als Nutzer möchte ich Videos aus einer vorhandenen Wissensdatenbank generieren lassen, welche z.B. die Zubereitung eines Rezepts visualisieren oder einen Witz erzählen.
* Die Anwendung soll dafür sorgen können, dass eine API nicht zu oft hintereinander von verschiedenen Videos oder Infoprovidern angefragt wird, damit die API die gehäuften Requests nicht irgendwann einfach blockiert. Alternativ möchte ich selbst einen Zeitabstand wählen können, in welchem die API angefragt wird.
* Als Nutzer möchte ich, dass der Webscraper Cookies verwenden und speichern kann, damit nicht bei jeder neuen Anfrage an eine Website eine Autorisierung erforderlich ist.

##### **If-Time-Allows**
* Als Nutzer möchte ich die Möglichkeit haben **Lernvideos** zu verschiedenen Themen zu generieren (z.B. für simple Kopfrechenaufgaben).
* Als Nutzer möchte ich Infoprovider ex- und importieren können, um Infoprovider mit anderen teilen zu können.
* Wenn ich mit dem WordPress-Plugin der Anwendung arbeite, so möchte ich das Theme meiner WordPress-Seite für die Anwendung übernehmen können.
* Zu den einzelnen Videos, welche generiert werden, möchte ich die Möglichkeit haben, Untertitel einzubinden.

### **Einsatz der Software**
Genau wie die ursprüngliche Software, soll die Erweiterung den Betreibern der Seite [https://biebertal.mach-mit.tv/](https://biebertal.mach-mit.tv/) zur Verfügung gestellt werden. Dort soll diese produktiv genutzt werden können. Die Videos, welche dabei generiert werden, müssen so gespeichert werden können, dass sie von den Betreibern bei Bedarf öffentlich gemacht werden können.

Die Zielgruppe, welche die Videojobs erstellt, sollte grundlegende IT-Kenntnisse besitzen, um aus einer Dokumentation einer API herausfinden zu können, welchen API-Endpunkt sie für bestimmte Informationen anfragen muss. Die Zielgruppe, für welche die Videos generiert werden, ist durch die Entwicklung des Produkts nicht genau definierbar, da durch den generischen Aufbau Videos zu Themen aus verschiedensten Bereichen entstehen können.



### **Übersicht über die Benutzeroberfläche**
Die folgende Übersicht geht nur auf Elemente der Kategorie **Must-have** ein. Weitere Elemente welche das UI betreffen, werden bei Bedarf hier ergänzt.

#### **Übersichtsseite**
Hier soll ein Nutzer eine grundlegende Übersicht bekommen. So soll es u.a. möglich sein die angelegten Infoprovider ansehen und bearbeiten zu können, die erstellten Videojobs inklusive zugehöriger Details einsehen zu können und auch neue Videojobs sowie Infoprovider erstellen zu können.

### **Anlegen eines Infoproviders**
Hier kann der Nutzer zunächst einen Namen für seinen neuen Infoprovider angeben, anschließend eine API spezifizieren und deren Key eingeben. Anschließend wird ihm eine Liste von verfügbaren Attributen angezeigt, aus welcher er seine gewünschten Daten auswählen kann. Zusätzlich steht ihm für jedes Attribut die Möglichkeit zur Verfügung, auszuwählen, ob die Daten dieses Felds historisiert werden sollen. Weiterhin soll dem Nutzer noch die Möglichkeit gegeben werden auszuwählen, wie viele Datensätze in der Datenbank gleichzeitig vorliegen sollen und zu welchen Zeitpunkten die Daten historisiert werden.



#### **Erstellen eines Videojobs**
Dieser Vorgang teilt sich auf mehrere Schritte auf:
1. Der Nutzer spezifiziert einen Namen für den Videojob.
2. Nun gelangt der Nutzer zu einem Videoeditor, in welchem er die Bearbeitung abschließen kann oder weitere Szenen hinzufügen kann. Für die einzelnen Szenen kann er außerdem entscheiden, ob die Szene eine von ihm festgelegte Länge erhält, oder ob die Länge aus dem Audio bestimmt werden soll. In letzterem Fall soll der Nutzer auch angeben, ob das Bild länger eingeblendet werden soll als die Audio. Bei Erstellung einer neuen Szene gelangt der Nutzer in einen weiteren Editor, in welchem ihm Tools zur Verfügung stehen, um Elemente in der Szene zu platzieren. Für die Erstellung von Szenen kann der Nutzer außerdem Infoprovider auswählen, deren Daten er anschließend in die Szene einfügen kann. Während der Erstellung des Videojobs kann der Nutzer außerdem eine Audiospur für das Video generieren und diese mit TTS und eigenen Audio-Dateien befüllen, welche, falls gewünscht, auch auf Daten des Infoproviders zugreifen können.
3. Nun kann der Nutzer weitere Einstellungen vornehmen, wie beispielsweise die Konfiguration der Zeiten, zu welchen das Video generiert werden soll. (Bei Generierung des Videos wird dabei durch den Infoprovider eine Abfrage an die API gesendet, um aktuelle Daten zu erhalten.)

### **Qualitätsanforderungen**
1. Die Erweiterung soll die gleichen Qualitätsanforderungen wie die aktuelle Version des Produkts besitzen.
2. Durch die eingeführten Erweiterungen soll das Generieren von Videos mit neuen Themen deutlich einfacher werden, da keine Kenntnisse über JSON vorausgesetzt werden müssen. Nutzer sollen sich lediglich damit auseinandersetzen, welche API passend für den Zweck ist.
3. Das Produkt sollte größtenteils barrierefrei umgesetzt sein, um nicht in rechtliche Schwierigkeiten zu kommen.

### **Anmerkungen**
* Die Barrierefreieheit wird für digitale Medien immer weiter durch gesetzliche Vorgaben vorangetrieben, insbesondere durch den European Accessibility Act (EAA). Nach dessen Vorgaben ist es zwar noch nicht gesetzlich gefordert das Produkt barrierefrei umzusetzen, in Zukunft könnte dies allerdings der Fall werden. Um einen großen Umbau zu verhindern ist unser Vorschlag daher, wenn möglich, Barrierefreiheit im Produkt umzusetzen. Auch schlagen wir eine Dokumentation der verwendeten Techniken vor, damit bei eventuellen späteren Erweiterungen darauf zurückggegriffen werden kann.

### **Quellen**
* Einführung in den European Accessibility Act (letzter Zugriff am 12.04.2021): [https://www.bundesfachstelle-barrierefreiheit.de/DE/Themen/European-Accessibility-Act/european-accessibility-act.html?nn=1108170#doc1108168bodyText2](https://www.bundesfachstelle-barrierefreiheit.de/DE/Themen/European-Accessibility-Act/european-accessibility-act.html?nn=1108170#doc1108168bodyText2)

### **Anhang**

#### **Übersicht über das Programm**
Das nachfolgende Diagramm soll eine visuelle Übersicht über den Ablauf des Programms darstellen:

![Übersicht](images/overview.png)

## **Pflichtenheft**



### **Einleitung**



#### **Auftraggeber**

Im Rahmen des Softwaretechnik-Projekts an der Technischen Hochschule Mittelhessen (THM) wurde dem Entwicklerteam von Herr Prof. Dr. Kammer der Auftrag erteilt, die VisuAnalytics-Software aus dem vorherigen Sommersemester weiterzuentwickeln. Das Ziel ist es, die neue Version der Gemeinde Biebertal zur Verfügung zu stellen.



#### **Das Entwicklerteam**

Das Entwicklerteam besteht aus den nachfolgend aufgelisteten Mitgliedern.

* Tristan Wolfram (Frontend)
* Philipp Helfenritter (Frontend)
* Janek Berg (Frontend)
* Sören Clausen (Backend)
* Tim Schwabe (Backend)
* Daniel Spengler (Projektleiter / Frontend)



#### **Kurzbeschreibung des Projekts**

Mit der von uns umzusetzenden Erweiterung von **Visuanalytics** soll es für einen Nutzer einfach möglich sein, Videos zu generieren, welche unter anderem Informationen von eigens gewählten APIs aufbereitet anzeigen können. Dazu ist es ebenfalls geplant dem Nutzer ein Werkzeug an die Hand zu geben, mit welchem er sich neue APIs in der Software speichern kann. Somit entsteht also ein sehr generisches Framework, mit welchem Videos zu allen denkbaren Themen erstellt werden können.



### **Informationen zum Auftrag**



#### **Rahmenbedingungen**

Die Weiterentwicklung der Anwendung **VisuAnalytics** erfolgt im Rahmen des Sommersemester 2021 an der Technischen Hochschule Mittelhessen im Pflichtmodul **Softwaretechnik-Projekt**, welches von Herrn Prof. Dr. Kammer begleitet wird. Dabei hat das Modul eine Gewichtung von 9 Creditpoints, d.h. ca. 270 Stunden Arbeitsaufwand pro Person. Dies ergibt einen Arbeitsaufwand von ca. 16 Stunden pro Woche. Wie sich die einzelnen Mitglieder diese Zeiten aufteilen, ist ihnen selbst überlassen, solange alle vorgegebenen Aufgaben in der vorgegebenen Zeit erledigt werden.



#### **Besonderheiten**

Hervorgehoben sei an dieser Stelle, dass die Anwendung jede beliebige API zur Informationsgewinnung nutzen kann, solange diese ein JSON-Objekt oder eine XML-Datei als Antworttext versenden kann. Dadurch ist es möglich ein Video zu einem Thema einmal zu erstellen und die Aktualisierung dieses Videos wird dann von der Software selbst erledigt. Es benötigt also beispielsweise keine Person, die jeden Tag einen neuen Wetterbericht hochlädt, denn nach dessen Erstellung und Eingabe von verwendeten API-Daten wird die Software diesen Bericht zu festgelegten Zeiten selbstständig erneuern. Weiterhin ist es geplant die Software so zu erweitern, dass auch Internetseiten ohne eine API zur Informationsgewinnung genutzt werden können. Dafür soll ein Webscraper entwickelt werden, welcher die Informationen einer Webseite extrahieren kann. Welche Informationen dabei gesammelt werden sollen, kann durch den Nutzer festgelegt werden. Dazu ist es geplant eine einfache Skriptsprache zu entwickeln, welche durch Eingabe von wenigen Parametern die Webseite nach den gewünschten Informationen durchsucht.



#### **Etappenziele**

Um eine bessere Struktur in das Projekt und über die anstehenden Aufgaben zu bekommen, soll die folgende Auflistung einen kurzen Überblick über die einzelnen Etappen liefern:

1. **Infoprovider erstellen:** Nach Abschluss dieser Etappe soll es möglich sein, einen Infoprovider vollumfänglich nutzen zu können. Es wird also möglich sein, eine API abzufragen, die verfügbaren Daten anzuzeigen und diese auszuwählen. Weiterhin wird der Nutzer zu diesem Zeitpunkt in der Lage sein, Daten auszuwählen, welche historisiert werden sollen. Außerdem wird es hier möglich sein, eine Regel für die Historisierungszeit festzulegen (Wöchentlich, Täglich, Intervall). Zuletzt soll es dabei möglich sein, den Infoprovider bearbeiten und löschen zu können.
2. **Szeneneditor erstellen:** Mit dem Abschluss des Szeneneditors wird der Nutzer in der Lage sein, die Grundlagen für die späteren Videos zu erstellen. Auf Szenen befinden sich Text, Diagramme, Bilder und Hintergrundbilder oder Hintergrundfarben. Der Text und die Diagramme können dabei Informationen von den vorher erstellten Infoprovidern beziehen. Später soll es auch möglich sein, eine Szene mit Daten aus der Wissensdatenbank zu befüllen.
3. **Erstellung von Videojobs:** Nach Abschluss dieser Etappe wird es möglich sein, aus den vorher erstellten Szenen ein zusammenhängendes Video in Form eines Videojobs zu erstellen. Dabei kann für jeden Videojob kann noch eine Sprachausgabe eingebunden werden, mit welcher zusätzliche Texte vorgelesen werden können. Ein Videojob beschreibt dabei ein Video, welches auf feste Art und Weise zu definierten Zeitpunkten mit aktuellen Informationen von APIs generiert wird.



Nach Abschluss dieser drei Etappen würde das Grundgerüst der Anwendung stehen. Von diesem Zeitpunkt an lassen sich weitere Features hinzufügen, ohne das die Grundstruktur der Anwendung überarbeitet werden muss.



### **Bereits bestehende Systeme**

Bereits im letzten Semester ist ein Projekt erstellt worden, in welchem es möglich ist, sich Videos zu vorgegebenen Themen erstellen zu lassen. Dabei haben die Nutzer allerdings nur wenig Anpassungsmöglichkeiten und neue Themen können nur durch Kenntnisse im Umgang mit JSON-Dateien hinzugefügt werden.

Das Ziel unseres Projekts ist es deshalb, diese Basis zu verwenden und eine benutzerfreundliche Möglichkeit zu bieten, mit welcher Videojobs bequem über eine GUI erstellt werden können.



### **Teams und Schnittstellen**



#### **Teams**

Das Entwicklerteam besteht aus insgesamt sechs Mitgliedern, welche sich auf zwei kleinere Teams, Front- und Backend, aufgeteilt haben. Dadurch kann jedes Teammitglied seinen eigenen Schwerpunkt setzen, und kann sich auf seinen zugewiesenen Bereich konzentrieren.

Der Projektleiter unterstützt dabei in der Entwicklung das Frontend-Team, verfolgt aber auch, bedingt durch seine Rolle, die Entwicklungen im Backend.



#### **Jira für die Projektverwaltung**

Bei einem Projekt ist es wichtig einen Überblick darüber zu behalten, welche Aufgaben von welcher Person erledigt werden und welche Aufgaben demnächst anstehen oder bereits erledigt worden sind. Auch ist es wichtig, die Arbeitszeiten strukturiert zu verwalten, um einen Überblick über die bereits geleistete Arbeit zu haben.

Um dies alles zu ermöglichen, setzt unser Team auf die Plattform Jira. Hier ist es möglich Aufgaben in Form von User-Stories auf ein Kanban-Board zu laden, welches sich standardmäßig in die Spalten "Backlog", "Zur Entwicklung ausgewählt", "In Arbeit" und "Fertig" unterteilt. Die einzelnen Mitglieder können diese Aufgaben dabei nach Bedarf auf dem Board verschieben und so kenntlich machen, woran sie gerade arbeiten. Dabei ist jede Aufgabe einer Person zugewiesen, kann allerdings trotzdem von mehreren Personen erledigt werden (Beispiel: Meetings). Die einzelnen Stories können von den Personen, falls nötig, noch in einzelne Unteraufgaben zerlegt werden, welche dann schnell abgearbeitet werden können.

Zusätzlich kann mit Jira die Arbeitszeit für jede Aufgabe von jedem Teammitglied protokolliert werden. Anschließend können diese Daten in verschiedenen Formaten exportiert werden und auch von anderen Tools verarbeitet werden. So verwenden wir beispielsweise ein Tool, welches die Arbeitszeiten pro Woche und pro Mitglied auflistet. So entsteht ein detaillierter Bericht über die geleistete Arbeit.



#### **GitHub zur Verwaltung des Quellcodes**

Wenn in einem Team an einer Software entwickelt wird, ist eine Möglichkeit von Nöten, den Code über verschiedene Rechner hinweg synchron zu halten. Hierfür verwenden wir die Plattform GitHub, mit einem bereitgestellten Repository. Dieses enthält bereits bestimmte Automationen, wie z.B. das Erstellen eines neuen Branches, sobald ein Issue den Status "In Progress" erhält. Durch diese Automation ist es leicht möglich, zu erkennen, welches Mitglied gerade an welchem Feature arbeitet.



#### **Meetings**

Alle sechs Teammitglieder treffen sich pro Woche insgesamt drei Mal zu Meetings:

* Montags: Hier wird die Planung für neue Aufgaben besprochen und es können eventuell aufgetretene Probleme diskutiert werden.
* Donnerstags: Hier trifft sich das Team mit Herrn Prof. Dr. Kammer und es werden wichtige Informationen ausgetauscht.
* Freitags: Hier wird ein Blick auf die Arbeit der Woche geworfen und es werden eventuell Aufgaben besprochen, welche über das Wochenende hinweg erledigt werden können oder müssen.



Dabei kommt als Konferenzsoftware die Plattform Pilos mit Big Blue Button (BBB) zum Einsatz.



Zusätzlich ist es nicht ausgeschlossen, dass sich einzelne Mitglieder zu Meetings außerhalb der genannten treffen, um interne Dinge zu diskutieren, wie z.B. die Tauglichkeit eines Datenbankmodells. Dies ermöglicht einen schnelleren Ablauf bei der Vorstellung vor dem restlichen Team.

<br>

#### **Kommunikationswege**

Grundsätzlich verwendet unser Team die folgenden Kommunikationswege:

* Meetings: Diese dienen für den unmittelbaren Austausch. Hier werden meist Dinge geklärt, welche sich in Textnachrichten nur schwer klären lassen.
* Slack: Auf Slack können sich die Mitglieder des Teams über die aktuellen Aufgaben austauschen. Außerdem werden hier die Statusberichte und wichtige Informationen vom Projektleiter verkündet. Durch die Organisation in Channels ist es außerdem möglich die Unterhaltungen sinnvoll nach Themen zu gruppieren. So gibt es beispielsweise einen Channel "Backend" und einen Channel "Frontend".
* Mail: Für vertrauliche Informationen werden Mails versendet. Außerdem dienen diese außerhalb des Meetings am Donnerstag der Kommunikation mit dem Auftraggeber.



### **Technische Anforderungen**

Im Folgenden sollen die Anforderungen an das Projekt detailliert beschrieben und die technischen Mittel zur Umsetzung genannt werden.



### **Frontend**

Die Implementierung der geforderten Features für das Frontend erfolgt mit dem Framework React.js und der Sprache TypeScript. Für das Design wird dabei auf das CSS-Framework MaterialUI gesetzt. Damit unterscheidet sich die Umsetzung des Frontends in den verwendeten Technologien nicht zum Ursprungsprojekt.

Da jedoch die geforderten Funktionalitäten des Frontends kaum Übereinstimmung mit denen des Vorgängerprojektes haben, wird das Frontend komplett neu aufgebaut, wobei jedoch möglichst viel Code des bisherigen Frontends wiederverwertet werden soll.
Der Code des bisherigen Frontends soll dabei weitgehend unangetastet bleiben, sodass auch dieses noch funktional bleibt.



##### **Startseite / Dashboard**

Hier soll es dem Nutzer möglich sein, zwischen der Erstellung eines neuen Infoproviders, der Erstellung einer Szene oder eines Videojobs zu wählen. Mit Klick auf die entsprechenden Schaltflächen, werden die dafür benötigten Komponenten geladen. Weiterhin soll es möglich sein, bestehende Infoprovider, Szenen und Videojobs einzusehen, diese zu bearbeiten und gegebenenfalls zu löschen.



##### **Erstellen des Infoproviders**

Um einen Infoprovider erstellen zu können, wird von dem Nutzer zunächst die Eingabe einer Request-URL, eines API-Namen und eines API-Schlüssels erwartet. Außerdem muss dieser die Parameter für die Abfrage angeben, damit die entsprechenden Attribute angezeigt werden können. Diese Parameter können dabei entweder direkt an die URL angehängt werden oder in eigenen Feldern angegeben werden. Um den API-Key sicher speichern zu können, sollte dieser nicht in der finalen JSON-Datei gespeichert sein, sondern weiterhin in der privaten config.json. In der Realität gibt es dabei verschiedene Möglichkeiten, den API-Key anzugeben. Das Projekt wird davon die Folgenden unterstützen:
* Kein Key
* Key im Header
* Key in der Query
* Bearer Token
* Basic Auth

Je nach gewählter Methode, passen sich auch die verfügbaren Eingabefelder an. Dabei gibt es die Folgenden Möglichkeiten:
* Kein Eingabefeld
* Parametername + Key
* Token
* Nutzername + Passwort

Alternativ zu einer API-Abfrage soll hier im späteren Verlauf noch die Möglichkeit bereitgestellt werden, einen Webscraper zum Erhalt von Informationen zu verwenden.

Mit diesen Daten wendet sich das Frontend an den Server, welcher durch einen zur Verfügung gestellten API-Endpunkt die Daten entgegen nimmt und eine Abfrage an die geforderte API stellt. Die erhaltene Antwort wird anschließend an das Frontend zurückgeschickt. Dieses könnte die Ziel-API zwar auch direkt anfragen, dadurch wäre aber der Mechanismus des Abfragens einer API sowohl im Front- als auch im Backend vorhanden.

Nach dem Erhalt der API-Antwort extrahiert das Frontend das JSON-Objekt / die XML-Datei, damit der Nutzer auswählen kann, welche Daten er behalten möchte. Im nächsten Schritt kann ein Nutzer noch Formeln hinzufügen, mit welchen er neue Daten aus den bestehenden Attributen gewinnen kann. Dabei muss darauf geachtet werden, dass keine Typinkompatibilität entsteht (es darf also beispielsweise nicht ein String mit einem Integer addiert werden).

Formeln sollen dabei einfache Rechenoperationen ermöglichen, sollen aber auch eine Formatierung ermöglichen. So soll der Nutzer beispielsweise wählen können, ob die Kommatrennung durch einen Punkt oder ein Komma verwendet werden soll. Dies ist im Video von Vorteil, da die Werte mit den bekannten Zeichen formatiert werden. Der Punkt könnte hier zu Missverständnissen führen. Dabei könnte es beispielsweise die folgenden Formatierungen und Rechenoperationen geben:
* Einfache Rechenoperationen: +, -, \*, /
* Benutzung von Klammern
* Händische Ersetzung von Strings. Beispielsweise ersetzen von "Und so weiter" durch "usw."
* String-Erweiterung: Anhängen einer Zeichenfolge an den String. Hiermit könnte aus "10" beispielsweise "10 %" entstehen.
* Trimmfunktion: Entfernen von Leerzeichen und Leerzeilen.

Nun kann der Nutzer noch auswählen, welche Daten zu welchen Zeitpunkten historisiert werden sollen. Weiterhin soll es möglich sein, Daten zu verwenden, um Diagramme zu generieren. Dabei sollen die folgenden Diagrammtypen unterstützt werden:
* Punktdiagramm
* Liniendiagramm
* Balkendiagramm
* Tortendiagramm
* Säulendiagramm

Für jedes dieser Diagramme kann der Nutzer dabei ein oder mehrere Arrays aus dem Infoprovider verwenden. Dabei dürfen in dem Array nur Zahlen enthalten sein, da andernfalls die Verarbeitung keinen Sinn macht. Diese Arrays werden für die y-Achse (Werte des Diagramms) verwendet. Die x-Achse (Beschriftung) kann der Nutzer selbst wähen. Sollte ein Array aus Objekten bestehen, so kann der Nutzer genau ein String-Attribut des Objekts wählen, welches zur Auswertung verwendet wird. Dieses Attribut muss dabei auch wieder eine Zahl sein. Sollte der Nutzer die Beschriftung nicht selbst wählen wollen, so kann er im Falle eines Objekts ein Attribut aus dem gleichen Objekt für diese wählen. Wenn ein Array jedoch wiederum Unterarrays enthält, so kann dieses Array nicht zur Verwendung in Diagrammen gewählt werden. Die Verwendung von mehreren Arrays pro Diagramm ist dabei sinnvoll, um z.B. den Wetterverlauf in mehreren Städten gleichzeitig anzeigen zu können.

Ebenfalls ist es bei Diagrammen möglich historisierte Daten zu verwenden. Hierfür können mehrere Daten verwendet werden, welche eine eigene Beschriftung erhalten. Durch das festlegen einer Intervalldifferenz (Beispiel: Aktuell - 3 Intervalle) legt man fest, wie viele historisierte Daten auf dem Diagramm abgebildet werden.

Generell ist es bei Diagrammen möglich, festzulegen, wie viele Werte abgebildet werden sollen, es muss also nicht zwangsläufig ein ganzes Array für ein Diagramm verwendet werden. Gleichzeitig lässt sich für jedes gewählte Datum der Historisierung, bzw. für jedes Array, eine eigene Farbe für die spätere Darstellung wählen.

Nach diesen Schritten kann ein Nutzer den Infoprovider entweder fertigstellen oder eine weitere API hinzufügen. Wählt er die letztere Option, so beginnt der beschriebene Prozess von neuem. Wählt er hingegen die erste Option, so werden die eingegebenen Daten vom Frontend so verpackt, dass ein JSON-Objekt entsteht, welches die Datengrundlage  für die Steps *api*, *transform* und *storing* der bisherigen Themenkonfiguration enthält. 

Bevor dieses Objekt final fertiggestellt wird, muss der Nutzer noch einen Namen für den Infoprovider spezifizieren, unter welchem dieser einsehbar sein wird. 

Mit diesem Objekt wendet sich das Frontend an das Backend. Damit ist für das Frontend die Erstellung des Infoproviders abgeschlossen.

Natürlich ist es später für den Nutzer möglich, die angelegten Infoprovider zu bearbeiten.

##### **Bearbeitung von Infoprovidern**

Wenn ein Infoprovider bearbeitet werden soll, so fragt das Frontend beim Backend nach der entsprechenden JSON-Datei und bereitet die enthaltenen Informationen für den Nutzer leserlich auf. Nach Abschluss der Bearbeitung wird die aktualisierte JSON-Datei zurückgesendet, damit das Backend diese verarbeiten kann.



##### **Erstellung von Szenen**

Da kein passendes Framework für die Erstellung einer Szene gefunden werden konnte (die meisten sind zu unmodular oder nicht Open Source), wurde beschlossen, den Canvas-Editor selbst zu implementieren und gegebenenfalls auf kleinere Frameworks zurückzugreifen, welche einen Teil der Funktionalität erfüllen. Dabei stellt [Konva.js](https://konvajs.org) die technische Grundlage für unsere Implementierung dar.

Bei der Erstellung einer Szene kann ein Infoprovider gewählt werden, von welchem die Informationen einer API (oder auch mehreren APIs) verwendet werden können.

Eine Szene enthält weiterhin Hintergrundfarben, Hintergrundbilder, Bilder, Texte oder Symbole, welche auf der Fläche des Canvas frei platziert werden können. Auch wird es hier möglich sein, Diagramme hinzuzufügen, welche durch den gewählten Infoprovider für die Szene zur Verfügung stehen.

Bei den Bildern soll dem Nutzer die Möglichkeit gegeben werden, verschiedene Bilder für unterschiedliche Situationen festzulegen. Als Beispiel könnte der Nutzer also verschiedene Bilder für Sonnenschein oder Regen definieren.

Mit Fertigstellung einer Szene generiert das Frontend eine JSON-Datei, welche den Aufbau eines Images aus der bisherigen Themenkonfigurationsdatei besitzt. Dieses wird an das Backend gesendet, damit es auf dem Server entsprechend gespeichert werden kann.

Außerdem gibt es beim Erstellen der Szenen die Möglichkeit Bilder hochzuladen. Diese werden dabei auch gleichzeitig an den Server übertragen und somit gespeichert. Wenn ein Bild also einmal hochgeladen wurde, kann dieses mehrfach verwendet werden. Ebenfalls über einen API-Endpunkt kann das Frontend dabei auf die bisherigen Bilder zugreifen, damit dem Nutzer angezeigt werden kann, welche Bilder bereits existieren.

Nach Erstellung der Szene, hat der Nutzer die Möglichkeit, sich eine Vorschau der erstellten Szene anzuschauen. Mit diesem Feature kann er sicherstellen, dass die Szene in Videos so aussieht, wie er es beabsichtigt.



##### **Erstellung eines Videojobs**

In diesem Editor  legt der Nutzer zunächst einen Namen für einen Videojob fest, unter welchem dieser abgespeichert wird. Außerdem können die bisher erstellten Szenen eingebunden und angeordnet werden. Weiterhin steht hier die Möglichkeit zur Verfügung, einen Infoprovider auszuwählen, dessen Daten für eine Audiospur verwendet werden können, welche mit einem Text befüllt werden kann, der von einer synthetischen Stimme (TTS) vorgelesen wird.

Ebenfalls ist es möglich, die Länge der einzelnen Szenen festzulegen oder die Länge anhand des Audiomaterials zu bestimmen. So soll der Nutzer die Möglichkeit haben, zu spezifizieren, dass die Szene erst fünf Sekunden nach Abschluss der Audiodatei wechselt.

Der Nutzer wird außerdem in der Lage sein, eine Szene als Vorschaubild wählen zu können. Dieses soll dabei sofort mit konkreten API-Werten gefüllt werden, damit der Nutzer das Endresultat beurteilen kann.

Mit Abschluss der Erstellung des Videojobs muss vom Frontend eine JSON-Datei erstellt werden, welche im Grunde genau dem Aufbau der bisherigen Themenkonfiguration entspricht. Diese Datei wird an den bereits implementierten API-Endpunkt gesendet. Weiterhin muss vom Frontend noch die JSON-Datei erzeugt werden, welche den konkreten Job enthält. Dieser wird auch an das Backend übergeben, welches mit bereits existierenden Routen diesen Job aufnimmt. Anschließend kann dieser wie bisher generiert werden.

Natürlich muss der Nutzer bei der Erstellung eines Videojobs auch die Generierungszeitpunkte angeben. Um die bisherige Datenstruktur in der Datenbank beibehalten zu können, wird dem Nutzer eine ähnliche Möglichkeit zum Einstellen der Zeit, wie bisher, gegeben. Es kann also nicht vollständig präzise eine Zeit eingegeben werden, sondern nur ein Intervall, welches zwischen Generierungen vergehen soll. Dabei ist die Angabe des Zeitintervalls nur ein Beispiel. In der bisherigen Struktur können auch noch andere Generierungsregeln festgelegt werden.

##### **Logs anzeigen**
In der Datenbank der Anwendung werden bei Durchläufen von Jobs detaillierte Logs gespeichert. Diese sollen vom Frontend abgerufen und angezeigt werden können.

Diese Logs sollen sehr aussagekräftig sein, damit der Nutzer Fehler in seiner Konfiguration leicht finden kann. Bei Bedarf kann der Nutzer die Logs löschen, um Speicherplatz auf der Festplatte zurückzugewinnen. Dabei kann der Nutzer die Logs manuell löschen oder eine Regel festlegen, nach welcher Logs automatisiert gelöscht werden werden.

#### **Backend**

Das Backend wird ebenfalls in der Sprache, in welcher es begonnen wurde, weiterentwickelt. Dies bedeutet, dass Python genutzt wird. Für das Networking wird auch weiterhin Flask verwendet. Ziel ist es im Backend, ohne große Teile des Codes neu schreiben zu müssen, die geforderte Funktionalität umzusetzen. Bleibt der Code vollständig erhalten, so ist es sogar möglich, dass alle bisher erstellten Jobs verwendbar sind. Hauptsächlich muss im Backend dafür die Datenbank erweitert werden, und es müssen neue API-Endpunkte hinzugefügt werden.



##### **API-Endpunkte**



###### **/checkapi (POST)**

Mit diesem Endpunkt soll das Backend eine beliebige API abfragen können. Der Request muss dabei ein JSON-Objekt enthalten, welches die notwendigen Daten für einen API-Aufruf enthält. Konkret also die URL der API und den zugehörigen API-Key, insofern einer von Nöten ist.

Als Antwort auf die Anfrage, schickt das Backend ein JSON-Objekt zurück, welches die Daten der abgefragten API enthält. Gleichzeitig enthält das Objekt einen Statuscode, welcher auf Fehler hinweisen kann. Sollte die angefragte API dabei ein XML-Objekt geliefert haben, so wird dieses im Backend zunächst zu einem JSON-Objekt konvertiert.

###### **/infoprovider (POST)**

Hierbei wird ein neuer Infoprovider in der erweiterten Datenbank angelegt und eine zugehörige JSON-Datei entsteht im Ordner Resources. Als Antwort erhält der Anfrager, ob die Operation erfolgreich war oder nicht.



###### **/infoprovider/all (GET)**

Als Antwort auf diese Anfrage sendet das Backend eine Liste mit den verfügbaren Infoprovidern. Diese können dann vom Frontend dem Nutzer beispielsweise aufgelistet werden.

###### **/infoprovider/\<id\> (PUT)**
An diesen Endpunkt wird ein aktualisierter Infoprovider gesendet. Die zugehörige JSON-Datei wird anschließend im Backend ersetzt und der entsprechende Datenbankeintrag wird angepasst.

###### **/infoprovider/\<id\> (GET)**
Das Backend sendet bei dieser Anfrage das konkrete JSON-Objekt des Infoproviders. Sollte dies nicht vorhanden sein, so wird ein Fehler gesendet.

###### **/infoprovider/\<id\> (DELETE)**
Dieser API-Endpunkt löscht den Infoprovider mit der übergebenen ID.

###### **/testformula**
Dieser API-Endpunkt wird benötigt, damit der Nutzer bei der Erstellung von Formeln über eine Schaltfläche prüfen kann, ob seine eingegebene Formel syntaktisch korrekt ist. Mit Klick auf die genannte Schaltfläche, wird die Formel dabei an den Endpunkt **/testformula** übersendet.

###### **/scene (POST)**

Hierfür muss der Anfrager das JSON-Objekt mitsenden, welches eine Szene enthält. Dieses Objekt entspricht dabei dem Step images aus der bisherigen Themenkonfigurationsdatei. Dieses wird anschließend vom Backend in der Datenbank aufgenommen und eine zugehörige JSON-Datei wird erstellt, welche auf dem Server abgelegt werden kann. Sollte eine Szene mit gleichem Namen bereits existieren, so ist ein Fehler an das Frontend zu übersenden.



###### **/scene/all (GET)**

Hierbei sendet das Backend eine Liste aller vorhandenen Szenen an den Anfrager.



###### **/scene/\<id\> (GET)**

Das zugehörige JSON-Objekt zu der ID wird an den Anfrager übersendet. Falls dieses nicht vorhanden sein sollte, wird ein Fehler geworfen.

###### **/scene/\<id\> (PUT)**
Mit diesem API-Endpunkt ersetzt das Backend die spezifizierte Szene mit dem neuen übergebenen Objekt. Gleichzeitig wird der Eintrag in der Datenbank aktualisiert.

###### **/scene/\<id\> (DELETE)**
Mit diesem API-Endpunkt wird die übergebene Szene gelöscht.

###### **/image/all (GET)**

Mit dieser Abfrage werden dem Abfrager alle Pfade zu den Bildern gesendet, welche vorhanden sind. Diese kann das Frontend anschließend anzeigen.



###### **/image (POST)**

Bei Upload eines Bildes, wird dieses vom Backend der Datenbank hinzugefügt und die entsprechende Datei wird im Ordner Images abgelegt.

###### **/image/\<id\> (DELETE)**
Mit diesem API-Endpunkt wird das Bild mit der übergebenen ID gelöscht.

###### **/thumbnailpreview (POST)**
Hierbei wird dem Backend die Information übergeben, welche Szene als Vorschau generiert werden soll. Das generierte Bild wird anschließend als Antwort zurückgesendet. Somit kann ein Vorschaubild mit konkreten Werten angezeigt werden.

###### **Weitere API-Endpunkte**

Für die restlichen Operationen können die bisherigen API-Endpunkte übernommen werden. So kann beispielsweise mittels **/topics** die endgültige Themenkonfiguration an das Backend übergeben werden und mit **/add** ein zugehöriger Job erstellt werden.



##### **Erweiterung der Resources**

Im Ordner Resources müssen folgende neue Ordner angelegt werden:

* Infoprovider: Hier werden die JSON-Dateien der Infoprovider aufbewahrt. Diese umfassen dabei die Steps api, transform und storing der bisherigen Themenkonfiguration.
* Scenes: Hier werden die JSON-Dateien für die Szenen abgelegt. Diese umfassen dabei den Step images.
* diagrams: Hier werden die Daten für Diagramme abgespeichert.
  

Um einfache Abfragen an die neuen Ordner stellen zu können, werden entsprechend auch die Methoden für den Zugriff auf die Pfade ergänzt.



##### **Erweiterung des Datenbankmodells**

Um den neuen Anforderungen des Projekts gerecht zu werden, ist es notwendig die bestehende Datenbank zu erweitern. Beim Entwurf der zusätzlichen Tabellen wurde dabei darauf geachtet, dass die bisherige Struktur erhalten bleibt. So sollten alle bisher gespeicherten Jobs auch mit der neuen Funktionalität kompatibel sein. Es ist allerdings ausdrücklich darauf hinzuweisen, dass es in der GUI nicht möglich sein wird Parameter bei Erstellung des Jobs anzugeben. Die Entität run_config wird also keine weiteren Einträge mehr erhalten. Eine Tabelle für Diagramme ist hierbei nicht von Nöten, da ein Array von Diagrammen im Ordner **diagrams** abgelegt wird. Die Datei soll dabei den Namen des Infoproviders erhalten und ist somit über den Eintrag des Infoproviders in der Datenbank abrufbar.

![Datenbankmodell](images/db.png)


##### **Erhaltung der bisherigen Datei zur Themenkonfiguration**

Wie erkennbar sein sollte, wird mit den geplanten Erweiterungen versucht, so zu verfahren, dass am Ende (bei Erstellung eines Jobs) die einzelnen Bereiche (Infoprovider, Scenes und Videojobs) wieder zur bisher existierenden Themenkonfiguration zusammengesetzt werden können. Dies sorgt für einen relativ geringen Aufwand im Backend, da das Erstellen der Videos mit dieser Datei als Basis schon implementiert ist. Es muss lediglich eine Möglichkeit gefunden werden, Steps auch einzeln zu durchlaufen, damit beispielsweise für die Historisierung nur die Steps bis inklusive "storing" durchlaufen werden.



### **Problemanalyse**



#### **Mehraufwand des Frontends**

Bei den beschriebenen Aufgaben fällt auf, dass das Frontend deutlich mehr Aufgaben hat als das Backend. Dies könnte dazu führen, dass das Frontend weitere Unterstützung benötigen könnte. In diesem Fall wäre es möglich einen Entwickler aus dem Backend in beide Teams zu verschieben. Dieser würde dann also als Art Schnittstelle dienen und immer dort helfen, wo gerade Hilfe benötigt wird.



#### **Erstellung des Szeneneditors**
Da es kein passendes Framework für die Erstellung einer Szene mit unseren Anforderungen gibt, haben wir uns dazu entschieden, einen eigenen Editor zu entwickeln. Hierbei ist es gut möglich, dass es zu Verzögerungen in der Entwicklung kommt, da der Aufwand für diesen Editor nur schwer einschätzbar ist.

<br>


#### **Zeitmangel**

Bei einem solchen Projekt ist es immer schwierig abzusehen, ob die gedachten Pläne sich auch wirklich so umsetzen lassen. Deshalb ist es theoretisch möglich, dass nicht alle Features implementiert werden können. In solch einem Fall ist es notwendig, dass die Arbeiten von einem späteren Team fortgeführt werden.



### **Qualität**

1. Es soll ein universeller Einsatz auf allen Betriebssystemen durch die Architektur als Webseite möglich sein und bleiben.
2. Sicherheit hat Priorität: Die API-Keys müssen zu jeder Zeit sicher aufbewahrt sein und dürfen nicht an die Öffentlichkeit gelangen.
3. Die Benutzerfreundlichkeit sollte im Vergleich zum aktuellen Stand stark gestiegen sein, wodurch auch weniger Kenntnisse im Umgang mit dem JSON-Format notwendig sein sollen. Die Anwendung soll dabei nach Möglichkeit barrierefrei gemäß der WCAG 2.1 Level AA (Web Content Accessibility Guidelines) sein.
4. Es sollte eine gute Dokumentation entstehen, damit spätere Teams einen guten Einstieg finden können.



#### **Qualitätskontrolle**

Als Qualitätskontrolle sollen Tests von jedem Teammitglied der Anwendung dienen und es sollen auch die automatisierten Tests erweitert werden.



#### **Abnahmekriterien**

Das Programm bietet die fehlerfreie Möglichkeit, Videos zu allen Themenbereichen zu generieren. Videos können von Nutzern einfach selbst erstellt werden, wobei grundlegendes Wissen von Nutzern in der IT vorausgesetzt wird.



### **Projektentwicklung und Zeitplan**

* 10.05.2021: Abschluss der Entwicklung des Infoproviders (Daten des Infoproviders können in die Datenbank eingetragen werden und zugehörige JSON-Objekte können erzeugt werden. Außerdem sollte die Historisierung von Daten auch möglich sein.)
* 31.05.2021: Abschluss der Szenenerstellung
* 14.06.2021: Videos können wie bisher generiert werden, mit dem Zusatz, dass die JSON-Datei nun graphisch konfiguriert werden kann.
* Zwischenpräsentation (17.06.2021): In der Zwischenpräsentation sollen alle Schritte des Infoproviders vorgestellt werden können. Weiterhin soll ein erster, nutzbarer, Szeneneditor gezeigt werden. Dabei ist es nicht das Ziel, dass zu diesem Zeitpunkt alle Details der beiden Features vollständig implementiert sind. Viel mehr soll ein minimaler Use-Case vorgestellt werden können.
* Endpräsentation: Diese wird kurz vor Abschluss des Projekts stattfinden. Hier soll ein umfänglicher Use-Case der Anwendung präsentiert werden. Es ist auch möglich, dass hier mehr als nur ein Use-Case präsentiert wird.

Weitere Aspekte sollen in diesen Zeitplan vorerst nicht einfließen, da es schwer ist abzuschätzen, welche Features wie viel Zeit benötigen werden. Es ist allerdings geplant nach Abschluss der oben genannten Schritte weitere Punkte der Kategorien "Must-Have", "Nice-To-Have" und "If-Time-Allows" abzuarbeiten.



Die Dokumentation des Projekts soll simultan zur Implementierung erfolgen, damit diese möglichst mit "frischen" Erinnerungen verfasst werden kann. Sollte diese erst im Nachhinein entstehen, so ist es möglich, dass wichtige Aspekte vergessen werden oder nur unzureichend erklärt werden.



### **Anhang**

In diesem Anhang sind die Mockups der meisten Teile der Benutzeroberfläche zu finden. Es sei an dieser Stelle gesagt, dass die Mockups eher die Funktionalität und die Aufteilung wiederspiegeln. An der konkreten Gestaltung wird sich im Verlaufe des Projekts vermutlich durch hinzukommende Features noch einiges tun.

![Mockup 2](images/2.png)

Im ersten Teil des Dashboards existiert eine Übersicht der existierenden Infoprovider, mit Möglichkeit zum Bearbeiten von Infoprovidern, sowie dem Erstellen von neuen Infoprovidern. Weitere geplante Features sind das Exportieren, sowie das Einsehen der Daten in der Historisierungsdatenbank.

<hr>

![Mockup 3](images/3.png)

Die Szenenübersicht im Dashboard zeigt alle bisher erstellten Szenen mit einem Namen und einem kleinen Vorschaubild. Weiterhin gibt es die Möglichkeit, eine neue Szene anzulegen.

<hr>

![Mockup 4](images/4.png)

Das Anklicken einer Szene öffnet ein Pop-Up, in der man die Szene im Detail betrachten kann. Weiterhin kann man hier über einen Button zur Bearbeitung der Szene gelangen.

<hr>

![Mockup 5](images/5.png)

Der Überblick über erstellte Videojobs liefert alle existierenden Videojobs mit Kurzinformationen und der Möglichkeit zum manuellen Download des aktuellsten Videos. Es können zudem neue Videojobs erstellt werden.

<hr>

![Mockup 6](images/6.png)

Durch das Anklicken eines Videojobs in der Liste erhält man Detailinformationen über das Video mit der Möglichkeit, Aktualisierungs- zeitpunkte zu Bearbeiten. Über einen weiteren Button gelangt man zur Veränderung des Videos im Editor, sowie den Logs.

<hr>

![Mockup 7](images/7.png)

Die Logs stellen alle Statusberichte des Videojobs dar, die durch das Backend generiert werden. Sie sollen möglichst aussagekräftige Informationen liefern.

<hr>

![Mockup 8](images/8.png)

Das Erstellen des Infoproviders beginnt, sofern diese Features implementiert werden, mit der Auswahl zwischen neuer API-Datenquelle, Webscraper-Datenquelle oder Import einer Datenquelle.

<hr>

![Mockup 9](images/9.png)

Der Nutzer muss nun die Grunddaten der API angeben. Hier sollen über das Mock-Up hinaus auch Parameter per Buttons an die Query angehängt, sowie die Methode des API-Key gewählt werden können.

<hr>

![Mockup 10](images/10.png)

Der Nutzer wartet auf Rückmeldung des Backends, welches eine Anfrage mit den gegebenen API-Daten stellt.

<hr>

![Mockup 11](images/11.png)

Der Nutzer erhält nun eine Auflistung aller vom Backend gelieferten Daten in einer Tabelle. Hierbei werden auch die Schachtelungen von Objekten oder Arrays soweit möglich dargestellt, indem eine Einrückung der Elemente erfolgt. Durch das Anklicken wird ein Datum ausgewählt.

<hr>

![Mockup 12](images/12.png)

Im Formel-Editor kann der Nutzer anhand der in einer Liste zur Verfügung stehenden Daten und einem Textfeld mit Button-Bedienung eigene Formeln erstellen. Die Eingabe assistiert ihn dabei, indem sie auf korrekte Nutzung von Klammern und Operatoren achtet.

Per Button prüft das Backend den Syntax der Formel. Das Speichern einer Formel fügt diese der Liste rechts hinzu, der Nutzer kann also eine beliebige Menge Formeln erstellen, bis er fortfährt.

<hr>

![Mockup 13](images/13.png)

Hier werden alle API-Daten und Formeln aufgelistet, aus welchen der Nutzer wählen kann, welche historisiert werden sollen.

<hr>

![Mockup 14](images/14.png)

Anschließend wählt er Zeitpunkte der Historisierung aus. Wenn keine Daten gewählt wurden, wird dieser Schritt übersprungen.

<hr>

![Mockup 15](images/15.png)

Bei der Diagrammerstellung erhält der Nutzer zunächst eine Übersicht aller erstellten Programme mit der Option, diese zu bearbeiten oder wieder zu löschen. Er kann zudem neue Diagramme erstellen.

<hr>

![Mockup 16](images/16.png)

Beim Erstellen eines neuen Diagramms muss zuerst gewählt werden, ob dieses auf Arrays oder historisierten Datenwerten basieren soll. Diese können dabei aus allen Datenquellen des Info-Providers stammen. Der Nutzer wählt dann die entsprechenden Array / die entsprechenden Werte.

<hr>

![Mockup 17](images/17.png)

Wenn ein Array mit Objekten gewählt wird, muss der Nutzer neben dem Diagrammtyp wählen, welches Zahl-Attribut des Objekts auf dem Diagramm abgetragen werden soll.
Weiterhin muss er ein String-Attribut zur Beschriftung der Werte wählen oder aber eigene Beschriftungen erstellen. Außerdem kann man eine Farbe wählen, welche für die Daten des Arrays im Diagramm verwendet wird.

Mit einer Drop-Down-Auswahl kann ein Nutzer zwischen den verschiedenen vorher ausgewählten Arrays wechseln - es wird dabei für jedes Array individuell gespeichert, ob man String-Attribute oder eigene Beschriftungen nutzen möchte, genauso wie Farbe und gewählte Daten.
Weiterhin wählt man die Anzahl der zu berücksichtigenden Werte. Überschreitet diese die Länge eines der Arrays bei der Test-Abfrage, erhält der Nutzer eine Warnung.

Über einen Button wird eine Vorschau der gewählten Einstellungen (mit Zufallsdaten) generiert, die der Nutzer dann in einem Dialog/Modal betrachten kann.

<hr>

![Mockup 18](images/18.png)

Wenn ein Array mit Zahlen gewählt wird, muss hier ebenfalls die Anzahl der Werte gewählt werden. Für jeden Wert muss der Nutzer dann eine individuelle Beschriftung hinzufügen. Die Farbauswahl, sowie der Wechsel zwischen den Arrays, bleiben gleich.

<hr>

![Mockup 19](images/19.png)

Wenn ein Diagramm über historisierte Daten gewählt wird, werden wieder Typ und Länge benötigt. Weiterhin muss man für jeden Wert wählen, welcher es sein soll - dabei wird anhand der Intervalle der Historisierung gewählt (Wochentage, täglich, Stunden oder Minuten). Auch hier werden Namen für alle Werte eingegeben.
Man kann weiterhin wieder, per Drop-Down-Auswahl, zwischen den verschiedenen historisierten Daten wechseln und dabei für alle Daten einzeln eine Farbe festlegen, die die Werte im Diagramm haben sollen.

Die Komponente zeigt zudem bei jedem Wert an, welches Intervall vorher für die Historisierung gewählt wurde.

<hr>

![Mockup 20](images/20.png)

Im Abschluss beider Schritte, muss ein Name festgelegt werden, um das Diagramm zu erstellen.

<hr>

![Mockup 21](images/21.png)

Den Abschluss der Info-Provider-Erstellung bildet eine Gesamtübersicht, in welcher der Nutzer nochmal die wichtigsten Eingaben sieht. Weiterhin sieht er die Anzahl der erstellten Diagramme und kann per Button in den Diagramm-Editor gehen, um dort genauere Informationen zu erhalten.

Von hier aus kann er weitere Datenquellen hinzufügen oder die Erstellung des Infoproviders abschließen.

<hr>

![Mockup 22](images/22.png)

Beim Anlegen einer neuen Szene wählt man zunächst den Infoprovider, der die Datenquelle für diese Szene darstellen soll.

<hr>

![Mockup 23](images/23.png)

Der Szenen-Editor ermöglicht das Erstellen des Layouts der Szene auf einer freien Zeichenfläche. Der Nutzer kann hier Texte, Formen, Bilder sowie auch Diagramme einfügen und diese verschieben oder ihre Größe ändern. In Texten und Diagrammen können dann die Daten des Infoproviders genutzt werden. Auch das Hintergrundbild oder die Hintergrundfarbe ist wählbar.

<hr>

![Mockup 24](images/24.png)

In der Übersicht aller Bilder sieht der Nutzer alle Bilder, die bereits hochgeladen und im Backend gespeichert wurden. Er wählt aus diesen aus, um sie der Szene hinzuzufügen. Denkbar wäre auch die Einbindung einer Symbol-Bibliothek, wie der von Material.

<hr>

![Mockup 25](images/25.png)

Im Video-Editor sieht der Nutzer eine Übersicht aller von ihm erstellten Szenen. Diese kann er anschließend in die Szenenfolge des Videojobs hineinziehen und eine Anzeigedauer für sie festlegen. Zu jeder Szene kann neben der Szene auch ein Text angelegt werden, der per TTS vorgelesen wird.

<hr>

![Mockup 26](images/26.png)

Per Pop-Up kann der Nutzer die Texte für die TTS-Ausgabe editieren und dabei auf Daten der Infoprovider zurückgreifen.

<hr>

![Mockup 27](images/27.png)

Den Abschluss der Videoerstellung bildet die Auswahl der Zeitpunkte, an denen das Video generiert werden soll.