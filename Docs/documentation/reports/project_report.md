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
## Anhang