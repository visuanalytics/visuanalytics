# Projektbericht <!-- omit in toc -->

## Team

### Timon Pellekoorne (Projektleiter)
**Aufgaben:**  
- Projekt strukturieren
- Berichte schreiben
- Lasten- & Pflichtenheft ausarbeiten
- Grafiken erstellen 
- Benutzeroberfläche erstellen

### Tanja Gutsche (Backend-Entwicklerin)
**Aufgaben:**  
- Konzepte erstellen für die Darstellung der verschiedenen APIs
- Strukturen für Dictionaries bzw. Listen erstellen	
- Datenaufbereitung
- Wordcloud-Grafiken
- Daten visualisieren
    - Fließtexte generieren
    - Sprachausgabe generieren (gTTS)


### Jannik Lapp (Backend-Entwickler, Grafikprogrammierer)
**Aufgaben:**  
- Grafiken mit den Informationen der APIs füllen
    - Pillow
    - Wordcloud
    - Diagramme
- FFMPEG
- Linker implementieren
- Testen mit Nvidia-Grafikkarte


### David Martschenko (Full-Stack-Web-Entwickler)
- Anfragen für API-Keys verschicken
- API-Schnittstelle implementieren
- Entscheiden, welche API-Requests relevant sind
- Daten für die Weiterverwendung aufbereiten
- Implementierung der Benutzeroberfläche

### Max Stephan (Softwarearchitekt)
**Aufgaben:**  
- GitHub verwalten
    - Automatisation
    - Einstellungen
- Docker
- Scheduler
- Steps Config (JSON-Datei)
- Projektstruktur verwalten
    - Flask-Server aufsetzen
    - ReactJS integrieren
    - Datenbank einrichten

---

## Zeitmanagement

<figure style="float: right;">
  <img src="../_static/images/mainreport/Sprintübersicht.png" />
  <figcaption>Abbildung 1</figcaption>
</figure>

Das Projekt findet vom 23.04. – 23.08.2020 statt. 

Inspiriert von der Methode _Scrum_ wird dieser Zeitraum in einwöchige _Sprints_ unterteilt, wobei die ersten eineinhalb Wochen die Planungsphase darstellen. 

Ab Montag, dem 04.05.2020 beginnen die wöchentlichen _Sprints_. Dazu findet jeden Montag ein _Sprint-Planning_ statt, in welchem alle Teammitglieder über ihre Arbeit in dem vergangenen _Sprint_ berichten, neue _Issues_ erstellt und eventuelle neue Herausforderungen besprochen werden.

Hinzu kommen die wöchentlichen Meetings mit dem Auftraggeber. Da dieses Meeting mitten in einem _Sprint_ liegt, kann der Projektleiter dem Auftraggeber eine gute Übersicht über den zuletzt abgeschlossenen _Sprint_, sowie eine Zwischenbilanz des aktuellen _Sprints_, geben.

In der **Abbildung 1** wird die zeitliche Aufteilung des Projektzeitraums grafisch dargestellt. Die rot markierten Linien stellen besondere Termine dar:
1.	Lastenheft
2.	Pflichtenheft
3.	Zwischenpräsentation
4.	Abschlusspräsentation 
5. Abgabe

### Verwaltung der Arbeitszeiten
Um die Arbeitszeiten der Teammitglieder zu verwalten, wird eine Excel-Datei benutzt. Die Funktionen dieser werden im folgenden Text erläutert.

Die Excel-Datei besteht aus neun Tabellenblättern. 
- Übersicht
- Sprintübersicht
- Issues
- Meeting
- Tabellenblatt für jedes Teammitglied (fünf Mitglieder)

#### Übersicht
In diesem Tabellenblatt hat man die Übersicht über das Zeitmanagement des Projektes (**Abbildung 1**), sowie eine Übersicht über die Zeiten eines Teammitgliedes (**Abbildung 2**). 

<figure style="float: right;">
  <img src="../_static/images/mainreport/Übersicht.png" />
  <figcaption>Abbildung 2</figcaption>
</figure>

Für jedes Teammitglied werden folgende Zeiten angezeigt:
- Gesamtstunden für diesen Sprint (_Stunden_)
    - Dieser Wert wird auf dem Tabellenblatt des zugehörigen Mitgliedes berechnet.
- Zielstunden für diesen Sprint (_Soll_)
    - Für das Projekt sind 270 Stunden vorgesehen. Diese Stundenanzahl wird zu Beginn auf alle Sprints aufgeteilt. Wird nun ein Sprint abgeschlossen und in der Übersicht abgehakt, so wird für die folgenden Sprints, anhand der übrigen Gesamtzeit, ein neuer Durchschnitt berechnet.

- Differenz beider Stunden (_Differenz_)
    - Diese Angabe zeigt, wie stark die Abweichung der tatsächlichen Arbeitszeit in einem Sprint, zu der Durchschnittszeit ist.

#### Sprintübersicht
Auf diesem Tabellenblatt werden die Gesamtzeiten jeder Kategorie pro Sprint angezeigt. So lässt sich gut überblicken, welchen Anteil eine Kategorie in einem Sprint hatte.

<figure>
  <img src="../_static/images/mainreport/Kategorieübersicht.png" width="80%"/>
  <figcaption>Abbildung 3</figcaption>
</figure>

#### Issues
Auf diesem Tabellenblatt werden die Eingaben getätigt. Dazu stehen einem drei Funktionen zur Verfügung.

#### Hinzufügen
Drückt man diesen Button, so wird die Tabelle um den nächsten Sprint erweitert. Dies geschieht auf dem Tabellenblatt **Issues**, sowie auf allen Blättern der Mitglieder. 

Die Tabelle besteht aus dem Namen eines Issues, der Dauer, sowie den Mitgliedern, welche diesen bearbeitet haben.
#### Entfernen
Wird dieser Button gedrückt, so wird ein Sprint mit all seinen Issues entfernt.
#### Anwenden
Hat man einen neuen Sprint hinzugefügt, so füllt man die Tabelle nun mit den neuen Issues, deren Dauer und deren Assignee.

Sobald alle Issues übertragen sind, kann man den Button `Anwenden` drücken. Dieser kopiert die Issues in die Tabellenblätter der einzelnen Mitglieder, wenn diese als _Assignee_ aufgeführt sind.
#### Meeting
In dieses Tabellenblatt werden alle Meetings des Teams eingetragen. Dazu wird das Datum, die Dauer und die Teilnehmer des Meetings eingetragen.
#### Mitglieder
Jedes Mitglied hat sein eigenes Tabellenblatt. Nachdem ein neuer Sprint hinzugefügt wurde und die passenden Issues kopiert wurden, werden diese Zeiten pro Kategorie und Sprint in eine Tabelle eingetragen. Da jedes Issue mit einem _tag_ (z.B. [Entwurf]) versehen ist, können die kumulierten Zeiten einer Kategorie einfach dort übernommen werden.

### Erweiterbarkeit der Excel-Datei
Um die Excel-Datei für das Zeitmanagement auch für andere Projekte verwenden zu können, sollten die Mitglieder, sowie die Anzahl Sprints einstellbar sein. In der aktuellen Version der Excel-Datei ist dies noch nicht ohne Kenntnisse in VBA möglich.

Die Weiterentwicklung dieser Datei läuft parallel zum Projekt ab und ist unter folgendem Link zu erreichen:

[https://github.com/TimonPllkrn/Project_Time_Management](https://github.com/TimonPllkrn/Project_Time_Management)

---

## Versionsverwaltung: Git und GitHub

Um das Projekt ordentlich zu strukturieren, benutzen wir GitHub. Dies dient uns zum einen als Versionsverwaltung, da Git dort integriert ist, sowie auch zum managen unseres Projektes. 

Um unser Zeitmanagement in GitHub umzusetzen, wird in jedem Sprint-Planning ein neuer _Milestone_ mit dem Namen des Sprints (z.B. "Sprint 2") und dem Ende des Sprints (darauffolgender Montag) angelegt. Danach werden ebenfalls im _Sprint-Planning_ _Issues_ gemeinsam mit allen Teammitgliedern erstellt und dem passenden _Milestone_ zugewiesen. Diese _Issues_ werden den Teammitgliedern zugeordnet, welche sie bearbeiten sollen. 

Ist das _Sprint-Planning_ abgeschlossen, stehen alle erstellten _Issues_ im Project Board in der Spalte `To do`. (**Abbildung 4**)

<figure style="float: right;">
  <img src="../_static/images/mainreport/Projectboard.png" width="70%">
  <figcaption>Abbildung 4</figcaption>
</figure>
<br>

Wird nun ein _Issue_ in die Spalte `In progress` gezogen, so wird automatisch ein Branch erstellt, welcher den Namen des zugehörigen _Issues_ trägt. 

Hat ein Teammitglied den _Issue_ erledigt, so zieht er diesen in die Spalte `Review`. Nun wird automatisch ein _Pull Request_ erstellt. Ebenfalls werden alle Unit-Tests, die GitHub finden kann automatisch ausgeführt. Verlaufen diese fehlerfrei, so wird dieses dem Entwickler angezeigt. 

Der _Pull Request_ wird dann einem anderen Teammitglied zum reviewen zugeteilt. Dieses überprüft noch einmal manuell den Code. Wenn alles in Ordnung ist, wird der Code gemerged, also dem Hauptcode hinzugefügt.

Link zum GitHub-Repository: [https://github.com/visuanalytics/visuanalytics](https://github.com/visuanalytics/visuanalytics)

### GitHub Automatisation

#### Project Board
Um das Arbeiten mit dem Project Board einfacher zu gestalten, wurden in GitHub _Actions_ erstellt, welche die Funktionen des Boards erweitern.

_Issue Branch erstellen_

Wird ein _Issue_ in die Spalte `In progress` gezogen, wird automatisch ein neuer Branch erstellt.

Der Name des Branches ist wie folgt aufgebaut:  
`i[issueNummer]-[issueName] (z.B. i1-test)`

_Pull Request erstellen_

Wird ein _Issue_ in die Spalte `Review` gezogen, wird automatisch ein _Pull Request_ erstellt. Dieser beinhaltet die Nachricht `resolves #[issueNummer]`, somit wird beim Mergen der _Issue_ automatisch geschlossen.
##### Einrichtung

_Projekt hinzufügen_

- Neues Projekt erstellen
    - Template `Basic kanban`
- Projekt einrichten
    - Neue Spalte mit dem Namen `Review` erstellen und zwischen die Spalten `In progress` und `Done` einordnen.
    - Die Column ID von `In progress` und `Review` kopieren

Zusätzlich kann auch die GitHub interne Automatisation für `To do` und `Done` verwendet werden.

- `To do` (manage automatisation)
    - Preset: `To do`
    - `Move Issues here when…`
      - Newly added
      - Reopened
- `Done` (manage automatisation)
    - Preset: `Done`
    - `Move Issues here when…`
      - Closed

_GitHub Action erstellen_

Im Repository auf den Reiter `Actions` klicken:
1.	`new workflow` -> `set up a workflow yourself`
2.	Inhalt durch eigenes Script ersetzen
3.	Namen festlegen
4.	Den Wert von `column_id` durch die ID der `To do`-Spalte ersetzen
5.	Den Wert von `column_id` durch die ID der `Review`-Spalte ersetzen
6.	`Start commit` klicken, um die Datei zu committen

Die Datei muss im master(default) branch liegen.

_GitHub App erstellen_

Um mit dieser Action auch andere Actions auslösen zu können, muss eine GitHub-App erstellt werden, die dann zur Authentifizierung verwendet wird. 
1.	GitHub-App erstellen (siehe [hier](https://developer.github.com/apps/building-github-apps/creating-a-github-app/))
2.	App Berechtigungen einstellen:
    - Contents: `read & write`
    - Issues: `read & write`
    - Metadata: `read-only`
    - Pull request: `read & write`
    - Projects: `read-only`
3.	App zum Repository hinzufügen (siehe [hier](https://developer.github.com/apps/installing-github-apps/))
4.	Secrets anlegen  
Es müssen zwei Secrets für das Repository angelegt werden:
    1.	Name: APP_ID
Value: ID der App (zu finden in den App Einstellungen unter `General`)
    2.	Name: APP_DEM
Value: Private Key der App (wird in den Einstellungen unter `General` erstellt)
##### Funktionsweise
Um - wie unter Einrichtung beschrieben - eine GitHub-App für die Authentifikation verwenden zu können, wird die Action `tibdex/github-app-token@v1.0.2` aus dem GitHub-Marketplace verwendet. Diese generiert den Authentifizierungsschlüssel aus der App-ID und dem Private Key der App.

Im nächsten Schritt werden mithilfe der GitHub-Action `actions/github-script@0.9.0` GitHub-API-Anfragen gesendet. Dieser App wird ein Script übergeben (geschrieben in Java Script), welches dann von der App ausgeführt wird. Die GitHub-Anfragen sind in diesem Script ganz einfach möglich, man verwendet einfach die vordefinierte Variable GitHub und context. z.B.:

~~~js
// Create branch

github.git.createRef({
  owner: context.repo.owner,
  repo: context.repo.repo,
  ref: `refs/heads/${branchName}`,
  sha: mSha.data.object.sha,
});
~~~

Eine Dokumentation aller möglichen API-Anfragen finden Sie [hier](https://octokit.github.io/rest.js/v17).

Um den Namen des Repository, des Owners etc. herauszufinden, stellt die Action die Variable `context` bereit. Mit dieser hat man auf verschiedene Informationen Zugriff.

##### Einschränkungen

- Benennt man einen _Issue_ um, dessen _Branch_ es schon gibt, so kann kein _Pull Request_ mehr erstellt werden, da der _Branch_ nicht mehr gefunden wird.
- Durch einen Fehler von GitHub werden die verlinkten _Issues_ bei einem _Pull Request_ erst nach dem Mergen, oder wenn jemand ein Kommentar schreibt, richtig angezeigt.
- Wenn der Branch keine Änderungen zum Master-Branch enthält, kann kein _Pull Request_ erstellt werden.
- Im Project Board sollten keine _Pull Requests_ hinzugefügt werden. Da diese in GitHub nur eine Unterkategorie von Issues sind, kann die Action nicht zwischen ihnen unterscheiden und würde für die _Pull Requests_ auch _Branches_ usw. erstellen.

#### Automatisierte Tests
Bei einem _Pull Request_ werden automatisierte Tests durchgeführt.
##### Einrichtung
_Docker Dateien erstellen:_
- Dockerfile für Projekt erstellen (siehe [hier](https://docs.docker.com/engine/reference/builder/))
- Docker-Testdatei erstellen: docker-compose.test.yml (im gleichen Ordner wie das Dockerfile)
- Datei mit folgendem Inhalt ausfüllen:

```Docker
sut:
    build: .
    working_dir: dir // Workdir des Dockercontainers
    command: test // Command der die Tests auführt
```

_GitHub Action erstellen:_

Im Repository auf den Reiter `Actions` klicken:
1.	`new workflow` -> `set up a workflow yourself`
2.	Inhalt durch Skript ersetzen
3.	Namen festlegen
4.	In Zeile 18 & 19 den Pfad hinter `--file` anpassen
5.	`Start commit` klicken & Datei committen

##### Funktionsweise

Nachdem die Action das Repository ausgecheckt hat, wird zuerst der Docker-Container erstellt und danach wird die Datei `docker-compose.test.yml` verwendet, um die Tests auszuführen.

---

## Entwicklungsumgebung	
Für die Entwicklung des Programmes nutzen wir zwei Entwicklungsumgebungen von **JetBrains**.  
- Entwicklung der Logik in Python: **PyCharm**.
- Entwicklung des User-Interfaces: **WebStorm**.

---

## Testen mit unittest

Zum Schreiben von Unit-Tests stellt Pythons Standard-Bibliothek [unittest](https://docs.python.org/3/library/unittest.html) zur Verfügung.

Hier ist ein Beispiel für den Umgang mit der Test-Bibliothek:

1. Definition von (zu testenden) Funktionen zur Berechnung der Summe aller geraden bzw. ungeraden Zahlen in einer Listeim Modul `sum_fun.py`.

   ```
   def sum_even(l):
       return sum(filter(even, l))
   
   def sum_uneven(l):
       return sum(filter(uneven, l))
   ```

2. Erstellung des Moduls (`test_sum.py`), das die Tests enthalten soll. Je Testfall wird eine Klasse erstellt, welche von `unittest.TestCase` erbt. In diesem Beispiel gibt es nur einen Testfall (Klasse `Test_Sum_Fun`). Innerhalb der Klasse werden nun die einzelnen Test-Methoden definiert. Damit diese auch automatisch beim Starten des Tests ausgeführt werden, müssen ihre Namen mit `test` beginnen. Zentrale Komponente der Test-Funktionen sind die `asserts`. Diese bestimmen, ob der Test durchläuft oder fehlschlägt.  

   ```
   import unittest
   import sum_fun
   
   class TestSumFun(unittest.TestCase):
   
       def test_sum_even(self):
           expected = 6
           actual = sum_fun.sum_even([1, 2, 3, 4, 5])
           self.assertEqual(expected, actual)
   
       def test_sum_uneven(self):
           expected = 9
           actual = sum_fun.sum_uneven([1, 2, 3, 4, 5])
           self.assertEqual(expected, actual)
   
       def test_sum_even_uneven(self):
           l = [1,2,3,4,5]
           expected = sum(l)
           actual = sum_fun.sum_even(l) + sum_fun.sum_uneven(l)
           self.assertEqual(expected, actual, "Sum of even and uneven numbers should equal the sum of all numbers in a list")
   ```

   Die wahrscheinlich wichtigste `assert`-Funktion ist `assertEqual`. Diese nimmt zwei Werte an und wirft eine Exception (d.h. der Test schlägt fehl), wenn sie unterschiedlich sind. Um den Fehler genauer zu beschreiben, lässt sich als optionaler Parameter zusätzlich ein Text angeben, der ausgegeben wird, wenn der Test fehlschlägt.

3. (optional) Um die im Modul enthaltenen Tests auch von der Kommandozeile aus ausführen zu können, werden folgende Anweisung hinzugefügt:

   ```
   if __name__ == '__main__':
       unittest.main()
   ```

   Die Tests lassen sich dann von der Kommandozeile aus so ausführen: 

   ```
   python -m unittest test sum_test
   python -m unittest sum_test.Test_Sum_Fun
   python -m unittest sum_test.Test_Sum_Fun.test_sum_even
   ```

4. Um die Tests in PyCharm auszuführen: Rechtsklick auf das Testmodul im Projektverzeichnis und dann `Run unit tests in ...` auswählen.


Quelle: https://docs.python.org/3/library/unittest.html

Wie die Tests für das Projekt ausgeführt werden können ist [hier](../usage/installation.html#tests-ausfuhren) beschrieben.

## Lastenheft
### Zielbestimmung
Das Programm soll verschiedene Informationen aus dem Internet erfassen und diese automatisiert zu einem Informationsvideo verarbeiten. Dieses Informationsvideo soll anhand von Grafiken, Diagrammen, Wordclouds o.Ä. die Informationen dem Benutzer übersichtlich und verständlich präsentieren.

Dafür sollen dem Benutzer verschiedene Themen zur Verfügung stehen, aus denen ein Video generiert werden kann:

**Beispiele:**
- Wetter
    - Wettervorhersage für den aktuellen, den folgenden und die darauffolgenden Tage zusammengefasst in einem übersichtlichen Video.
- Corona-Daten
    - Zahl der Infizierten, Genesenen und Toten welt- und deutschlandweit.
- Historische Ereignisse
    - Ereignisse zu dem aktuellen Tag vor beliebig vielen Jahren.
- Sport
	- Ergebnisse aus z.B. der Bundesliga zusammengetragen.
- Finanzen
	- Börsenkurse, sowie Gewinner und Verlierer einer Region darstellen
#### Must-Have/Nice-to-Have/If-Time-Allows
##### Must-Have
- Das Programm besitzt die Auswahl aus vier Themenbereichen:
	- Wetter, Corona, Historische Ereignisse, Fußball-Bundesliga
- Diese Themen sollen als Video mithilfe von Grafiken, Diagrammen etc. dargestellt und mit einer Audiospur, welche die dargestellten Informationen erläutert, unterlegt werden.
- Das Programm soll in die Website [https://biebertal.mach-mit.tv/](https://biebertal.mach-mit.tv/) integriert werden.
- Das Programm soll dem Administrator der Website die Möglichkeit geben, die Videos in bestimmten Zyklen generieren und diese auf seiner Website ausgeben zu lassen. 
##### Nice-to-Have
- Die Einbindung des Programmes in die Website per Wordpress-Plugin realisieren.
- Es besteht die Möglichkeit, Videos zu generieren, welche die Daten aus mehreren Themenbereichen zusammenführt.
- Den Themenbereich Finanzen dem Programm hinzufügen
<figure style="float: right;">
  <img width="200px" src="../_static/images/mainreport/Wordcloud.png"/>
  <figcaption>Abbildung 5</figcaption>
</figure>
<br>

- Zu den Themenbereiche Sport und Corona sollen Wordclouds mithilfe von Twitter generiert werden, welche die Stimmung zum jeweiligen Thema einfangen.
(Beispiel: Abbildung 3)
- Docker Image bereitstellen
##### If-Time-Allows
- Die Videos auch auf Englisch bereitstellen.



### Produkteinsatz
Das Produkt soll dem Betreiber der Internetseite [https://biebertal.mach-mit.tv/](https://biebertal.mach-mit.tv/) zur Verfügung stehen. Auf die dort generierten Videos soll jeder öffentlich zugreifen können.

Eine genaue Zielgruppe wird bei der Herstellung nicht berücksichtigt, die Themengebiete werden nach Interesse der breiten Masse ausgesucht.
### Produktübersicht
#### Benutzeroberfläche/Funktion
##### Übersicht
Zu Beginn des Programms befindet sich der Benutzer auf der Übersichtsseite. Dort hat er eine Übersicht über seine angelegten Jobs. Durch das Klicken auf den Job-Namen, werden die dazugehörigen Informationen ausgeklappt. Ein Job besteht aus:
1.	Einer einzigartigen ID (z.B. #1)
2.	Einem zugeordneten Thema 
3.	Dem Zeitpunkt, wann das Video neu generiert wird
4.	Der Zeit bis zum nächsten neu generierten Video
5.	Besonderen Einstellungen, je nach ausgewähltem Thema

Der Benutzer kann auf dieser Seite einen neuen Job anlegen (1), bearbeiten (2), oder die Einstellungen (3) zu einem Job aufrufen.

<figure>
  <img width="70%" src="../_static/images/mainreport/Startseite.png"/>
  <figcaption>Abbildung 6</figcaption>
</figure>
<br>

##### Job anlegen
Möchte der Benutzer einen Job anlegen, so gelangt er zuerst zu der Themenauswahl. Dort werden ihm alle Themen, die zur Auswahl stehen, angezeigt. Außerdem kann er ebenfalls auf dieser Seite den Namen des Jobs festlegen.

<figure>
  <img width="70%" src="../_static/images/mainreport/Topic.png"/>
  <figcaption>Abbildung 7</figcaption>
</figure>
<br>

Hat sich der Benutzer für ein Thema entschieden (in diesem Beispiel `Bundesliga - Ergebnisse`), so kommt er als nächstes zur Parameterauswahl. Die dort zur Auswahl stehenden Parameter sind an das zuvor ausgewählte Thema angepasst. Diese Seite sieht je nach Thema unterschiedlich aus (hier beispielhaft für das Thema `Bundesliga – Ergebnisse`).

<figure>
  <img width="70%" src="../_static/images/mainreport/Param.png"/>
  <figcaption>Abbildung 8</figcaption>
</figure>
<br>

Danach kann der Benutzer den Zeitplan des Jobs festlegen. Hier hat der Benutzer zunächst drei Möglichkeiten. 

**Täglich**:

Wählt er diesen Punkt, so wird das Video täglich generiert.   

**Wöchentlich**:

Hier kann der Benutzer aus allen sieben Wochentagen auswählen, an denen dann wöchentlich das Video generiert wird.  

**Datum**:

Hier kann der Benutzer ein genaues Datum auswählen, an welchem ein Video generiert wird.

Als letztes kann er noch zusätzlich zu einer der drei Auswahlmöglichkeiten Uhrzeiten festlegen, zu welchen das Video neu generiert werden soll.

<figure>
  <img width="70%" src="../_static/images/mainreport/Schedule.png"/>
  <figcaption>Abbildung 9</figcaption>
</figure>
<br>

Abschließend kann der Benutzer noch Einstellungen zu dem Video vornehmen.

Dort kann er den Speicherort und die Auflösung des Videos festlegen, sowie das Format des Videos und der Audiodatei. Diese Einstellungen kann der Benutzer auch im Nachhinein noch ändern.

<figure>
  <img width="70%" src="../_static/images/mainreport/Einstellungen.png"/>
  <figcaption>Abbildung 10</figcaption>
</figure>
<br>

##### Entwicklertools
Zusätzlich zu den `normalen` Einstellungen eines Jobs, soll es dem Benutzer auch noch möglich sein, Entwicklertools zu aktivieren. Dort kann dieser dann spezifischere Änderungen vornehmen.

<figure>
  <img width="70%" src="../_static/images/mainreport/Entwicklertools.png"/>
  <figcaption>Abbildung 11</figcaption>
</figure>
<br>

#### Ausgabe (Beispiel Wetterbericht)
Aus dem Internet sollen die aktuellen Wetterdaten erfasst werden, diese zu Text und Grafiken verarbeitet werden. Aus diesen Ergebnissen soll ein Video erstellt werden, welches einen Wetterbericht für den nächsten Tag und die darauffolgenden drei Tage darstellt.

<figure>
  <img width="32%" src="../_static/images/reports/WetterIcons.png"/>
  <img width="32%" src="../_static/images/reports/WetterGrad.png"/>
  <img width="32%" src="../_static/images/reports/Wetter3Tage.png"/>
  <figcaption>Abbildung 12</figcaption>
</figure>
<br>

### Qualitätsanforderungen
Das Produkt soll ohne großen Aufwand um weitere Funktion, vor allem aber um weitere Schnittstellen erweiterbar sein. 

Das aktuelle Video, welches auf der Website dargestellt wird, soll zu erst dann durch ein neues ersetzt werden, wenn dieses schon fertig generiert wurde. Somit soll sichergestellt werden, dass zu jeder Zeit ein Video dem Besucher zur Verfügung steht

Die Ausführung des Programms soll keine Auswirkung auf die Stabilität der Website haben.
 
### Quellen/Lizenzen
- [https://de.wikipedia.org/wiki/Vorlage:Positionskarte_Europa](https://de.wikipedia.org/wiki/Vorlage:Positionskarte_Europa)
(GNU-Lizenz für freie Dokumentation)  
- [https://commons.wikimedia.org/wiki/File:Karte_Deutschland.svg](ttps://commons.wikimedia.org/wiki/File:Karte_Deutschland.svg)
(Attribution-Share Alike 2.0 Germany)  
- Wetter-Icons: [https://www.weatherbit.io/api](https://www.weatherbit.io/api)
(Wetter-Icons werden durch die kostenlose API mitgeliefert)

---

## Pflichtenheft
### Zielbestimmung
- Das Programm soll mithilfe von APIs Informationen zu einem, vom Benutzer ausgewähltem Thema, bereitstellen. 
- Anhand dieser Informationen sollen Grafiken erstellt werden, welche diese Informationen veranschaulichen. Ebenfalls soll aus den gewonnenen Informationen ein Fließtext generiert werden, welcher die Informationen erläutert. Aus diesem Text soll dann eine Audio-Datei generiert werden.
- Abschließend sollen die Grafiken sowie die Audio-Datei zu einem Video zusammengefügt werden

Die technische Umsetzung der einzelnen Bestimmungen finden Sie [hier](#technische-umsetzung).
### Benutzerschnittstellen
Das Produkt ist betriebssystemunabhängig. Der Zugriff auf das Programm erfolgt über einen Browser. Dort kann das Programm als Plugin der gewünschten Website hinzugefügt und verwendet werden.

Die GUI über die der Benutzer seine Eingaben tätigen kann, wird mithilfe von `React` und `MaterialUI` erstellt.

Für die Kommunikation zwischen dem Client und dem Server, wird das Python basierte Web-Framework `Flask` benutzt.
### Funktionale Anforderungen
Zur Verdeutlichung der funktionalen Anforderungen des Programmes wurde es folgendermaßen strukturiert:

<figure>
  <img width="70%" src="../_static/images/mainreport/Strukturdiagramm.png"/>
  <figcaption>Abbildung 12</figcaption>
</figure>
<br>

1.	Der Client schickt eine Anfrage an das Programm.
2.	Das Programm schickt eine Anfrage über die Schnittstelle an die gewünschte API.
3.	Die Antwort der API landet im `Preprocessing`. Dort werten die Daten aufbereitet, so dass jeder Prozess einheitlich darauf zugreifen kann. In unserem Fall ist dies ein Python-Dictionary.
4.	Die einzelnen `Processing`-Stationen entnehmen dem Dictionary die Daten und verarbeiten diese (z.B. Diagramme erstellen). 
5.	Die daraus resultierenden Daten werden im `Linker` zu einem Endergebnis zusammengefügt (z.B. Video).

### Technische Umsetzung
#### API
##### Wetter
Anhand der Werte welche wir aus der [https://www.weatherbit.io/api](https://www.weatherbit.io/api) API beziehen, soll ein Wetterbericht als Video erstellt werden. Solch ein Bericht kann folgende Informationen beinhalten:
- Wetter heute
- Wettervorhersage für morgen und die darauffolgenden drei Tage
- aktuelle Luftqualität für vorausgewählte Städte in Deutschland

**Technische Details**

|                                        |        Free        |      Starter       |     Developer      |      Advanced      |
| -------------------------------------- | :----------------: | :----------------: | :----------------: | :----------------: |
| **Preis**                              |      $0/Monat      |     $35/Monat      |     $160/Monat     |     $470/Monat     |
| **Anfragen pro Tag**                   |        500         |       50.000       |      500.000       |    5 Millionen     |
| **Anfragen pro Tag (historische API)** |        ❌          |        ❌         |       25.000       |      250.000       |
| **Zugang historische API**             |        ❌          |        ❌         |       1 Jahr       |      10 Jahre      |
| **aktuelles Wetter**                   |        ✔️          |        ✔️         |         ✔️         |         ✔️        |
| **16-Tage Vorhersage**                 |        ✔️          |        ✔️         |         ✔️         |         ✔️        |
| **2 Tage (stündlich) Vorhersage**      |        ❌          |        ✔️         |         ✔️         |         ✔️        |
| **5 Tage (stündlich) Vorhersage**      |        ❌          |        ❌         |         ❌         |         ✔️        |
| **kommerzielle Nutzung**               |        ❌          |        ✔️         |         ✔️         |         ✔️        |

Quelle: [https://www.weatherbit.io/pricing](https://www.weatherbit.io/pricing)

##### Corona 
Das Programm soll die aktuellen Daten zur Corona Pandemie ausgeben. Dazu wird die [https://covid19api.com/](https://covid19api.com/) API verwendet. Diese liefert die aktuellen Corona-Statistiken weltweit und für Deutschland.

**Technische Details:**  
- Daten werden mehrfach täglich aktualisiert
- Die Verwendung der API ist komplett kostenfrei
- Antworten kommen im JSON-Format

##### Historische Ereignisse
Das Programm soll eine Wordcloud zu historischen Daten ausgeben, in der die wichtigsten Themen den größten Anteil haben.

Als Schnittstelle dafür verwenden wir die [http://developer.zeit.de/index/](http://developer.zeit.de/index/) API. Diese enthält das gesamte Archiv der ZEIT bzw. ZEIT ONLINE.

**Technische Details:**
- Öffentliche BETA-Version
- Inhalte des ZEIT Archivs seit 1946
- Nur für nicht-kommerzielle Nutzung
- Keine Volltextübernahme der Artikel
##### Bundesliga
[https://www.openligadb.de/](https://www.openligadb.de/) 

Es sollen die Ergebnisse der Bundesliga für einen Spieltag visuell dargestellt werden.

**Technische Details:**  
- Kostenloses Community-Projekt
- Antworten kommen im JSON-Format
##### Finanzen
[https://rapidapi.com/apidojo/api/yahoo-finance1](https://rapidapi.com/apidojo/api/yahoo-finance1)

- Zusammenfassung zum angefragten Zeitpunkt
- Gewinner/Verlierer in einer bestimmten Region
z.B. Day Gainers - US, Day Losers - US, Most Actives - US
- Daten, um Diagramme zu bestimmten Akteuren zu erstellen
- Gewinne in einer bestimmten Region in einem eingegrenzten Zeitraum

**Technische Details:**
- Unterstützt 175 Länder

|                        |                        |                        |                        |                        |
| ---------------------- | :--------------------: | :--------------------: | :--------------------: | :--------------------: |
| **Preis**              |      €0.00/Monat       |      €9.00/Monat       |      €27.01/Monat      |     €270.11/Monat      |
| **Anfragen pro Monat** |          500           |         10.000         |         50.000         |       Unlimited        |
| **Rate Limit**         | 5 Anfragen pro Sekunde | 5 Anfragen pro Sekunde | 5 Anfragen pro Sekunde | 5 Anfragen pro Sekunde |

Quelle: [https://rapidapi.com/apidojo/api/yahoo-finance1/pricing](https://rapidapi.com/apidojo/api/yahoo-finance1/pricing)

#### Preprocessing
Die durch die API gewonnenen Daten werden zuerst nach den Informationen gefiltert, welche für das Programm wichtig sind. Diese werden dann, in evtl. vereinfachter Struktur, in ein Dictionary geschrieben, sodass intern im Programm das Dictionary zur Datenverarbeitung genutzt wird.
#### Processing
Textgenerierung
Die Daten aus dem im `Preprocessing` angelegten Dictionary, werde nun ebenfalls in ein Dictionary angelegt, wobei zu jeder einzelnen Information mehrere Satzbausteine gespeichert werden. So kann anhand der gewonnenen Informationen ein zufällig generierter Text entstehen.

Um aus diesem generierten Text eine .mp3-Datei zu erzeugen, benutzen wir die Python-Bibliothek `gTTS`.

Einen Vergleich zwischen `gTTS` und `pico2wave` finden Sie [hier](#vergleich-von-gtts-mit-pico2wave).

#### Datenvisualisierung
Um die Daten grafisch darzustellen, wird die Python-Bibliothek `Pillow` zur Bildbearbeitung genutzt. Auf eine vorgefertigte Grafik (z.B. leere Deutschlandkarte) können mithilfe von Pillow, die aus der API gewonnenen Daten, eingetragen werden. 

Um die Daten als Diagramm zu visualisieren, wird NumPy und Matplotlib benutzt. Des Weiteren kann auch Basemap eingesetzt werden, um Verteilungen anhand einer Karte darzustellen.

Für die Erstellung der Wordcloud wird die Python-Bibliothek `wordcloud` verwendet. Diese wird hauptsächlich verwendet, um die Daten der Twitter-API zu visualisieren.
#### Linker
Um am Ende alle Grafiken, Diagramme etc. zu einem Video zusammenzufügen, benutzen wir das Tool `FFMPEG`. Dieses Tool bietet die Möglichkeit, Bilder aneinander zu schneiden und mit einer Audiodatei zu unterlegen. 

Dabei können folgende Einstellungen variabel gehalten werden:
- Länge der angezeigten Bilder (z.B. an die Länge der Audio-Datei anpassen)
- Videoauflösung
- Video-/Audioformat
- Speicherort des Videos

 
### Vergleich von gTTS mit pico2wave

|        | gTTS| pico2wave  |
| ---------------- | ---------------- | ---------------- |
|allgemein|Python-Library und Kommandozeilentool, wobei die API von Google Translate verwendet wird|Kommandozeilentool für Linux/Unix-User, welches von dem Unternehmen SVOX bereitgestellt wird|
|mögliche Sprachen|78 verschiedene Sprachen, darunter Englisch, Spanisch, Deutsch, Tschechisch, Japanisch|Deutsch, Englisch/Amerikanisch, Italienisch, Französisch und Spanisch
|Audioformate|wav-Datei, mp3-Datei|wav-Datei|

#### Vorteile gTTS:
- eine Python-Library, die man direkt einbinden kann, sodass man die Funktionen des Moduls verwenden kann
- einfaches Erstellen der Audiodateien (Dreizeiler)
- viele verschiedene Einstellungen möglich: unterschiedliche Sprachen (`lang='de'`); Sprechgeschwindigkeit (`slow=False` oder `slow=True`); Sprachüberprüfung (`lang_check=True`); Modul, um Text vorzuverarbeiten, um somit Aussprache zu optimieren (`gtts.tokenizer` mit den Funktionen `pre_processor_func` und `tokenizer_func`)
- verschiedene Fehlermeldungen, die abgefangen werden können (AssertionError, ValueError, RuntimeError)
- einzelne Wörter werden richtig und gut betont
- deutliche Aussprache
- gute Audioqualität
- intellektuelle Stimme
#### Nachteile gTTS:
- teilweise unnatürlicher, stockender Redefluss
#### Vorteile pico2wave:
- sehr kompaktes, einfach zu bedienendes Kommandozeilenprogramm
- guter Redefluss
#### Nachteile pico2wave:
- keine direkte Python-Library, man müsste ein Skript schreiben, um es einzubinden
- bringt keine weiteren Einstellungsmöglichkeiten/Funktionen mit sich
- Aussprache manchmal etwas monoton, kaum Betonungen
 
#### Begründung Entscheidung für gTTS:
Wir haben uns nach einem genaueren Vergleich der beiden Text-to-Speech-Programme gTTS und pico2wave für das Programm gTTS entschieden. Dieses ließ sich einfach als Python-Library einbinden, sodass wir es direkt verwenden konnten. Ebenso fanden wir es gut, dass die Bibliothek eine umfangreiche Funktionalität aufweist. So lassen sich viele Kleinigkeiten optimal für unsere Zwecke anpassen. Außerdem haben uns im Großen und Ganzen die erzeugten Audiodateien von der Aussprache, der Betonung und der generellen Audioqualität besser gefallen.
### Besondere Herausforderungen
- Programm für Produktionsbetrieb absichern und zuverlässig machen
- Kompatibilität mit verschiedenen Betriebssystemen
- Verständliches und einfach zu bedienendes User Interface
- Speicherung von Secrets (z.B.: `API-Keys`)
- Umgang mit auftretenden Programmfehlern
- API-Daten sinnvoll zusammenbauen (individuell auf verschiedene Daten reagieren)
- Gute Sprachausgabe (komische Aussprache durch verschiedene Formulierungen vermeiden)
### Nichtfunktionale Anforderungen
Das Programm soll um weitere Schnittstellen einfach erweiterbar sein, dazu muss die Schnittstelle so designt sein, dass das Hinzufügen einer weiteren ohne großen Aufwand von statten geht.
### Abnahmekriterien
Das Programm muss fehlerfreie Ausgaben zu den zur Auswahl stehenden Themen liefern. 

## Fazit

### Zielbestimmung

Das Programm kann verschiedene Informationen aus dem Internet erfassen und diese automatisiert zu einem Informationsvideo verarbeiten. Dieses Informationsvideo präsentiert dem Benutzer Informationen übersichtlich und verständlich mithilfe von Grafiken, Tabellen und Wordclouds die Informationen.

Dem Benutzer stehen die folgenden Themen zur Gernerierung eines Videos zur Verfügung:

**Beispiele:**
- Wetterbericht deutschlandweit
    - Wettervorhersage für den aktuellen, den folgenden und die drei darauffolgenden Tage zusammengefasst in einem übersichtlichen Video.
- Ortsbezogener Wetterbericht
    - Wettervorhersage für den aktuellen, den folgenden und die drei darauffolgenden Tage zusammengefasst in einem übersichtlichen Video.
- Sport
	- Ergebnisse zu einem Spieltag inklusive Tabelle der Fußball Bundesliga zusammengetragen.
- Twitter
	- Wordcloud mit Hashtags zu einem bestimmten Wort

#### Umgesetzte Must-Have/Nice-to-Have/If-Time-Allows
##### Must-Have
- Das Programm besitzt die Auswahl aus drei Themenbereichen mit Daten von drei unterschiedlichen APIs:
	- Wetter, Fußball-Bundesliga, Twitter
- Das Programm kann verschiedene Text-to-Speech-APIs integrieren 
- Die obigen Themen werden als Video, mithilfe von Grafiken, Tabellen und Wordclouds dargestellt und mit einer Audiospur, welche die dargestellten Informationen erläutert, unterlegt.
- Der ortsbezogene Wetterbericht für Biebertal ist bereits live auf der Website [https://biebertal.mach-mit.tv/](https://biebertal.mach-mit.tv/).
- Der Administrator der Website hat die Möglichkeit, die Videos in bestimmten Zyklen generieren und diese auf seiner Website ausgeben zu lassen. 
##### Nice-to-Have
- Die Einbindung des Programmes in die Website ist als Wordpress-Plugin möglich.
- Es besteht die Möglichkeit, Videos zu generieren, welche die Daten aus mehreren Themenbereichen zusammenführt.
<figure style="float: right;">
  <img width="200px" src="../_static/images/mainreport/Wordcloud.png"/>
  <figcaption>Abbildung 13</figcaption>
</figure>
<br>

- Es können Wordclouds zu beliebigen Themenbereichen mithilfe der Twitter-API erstellt werden.
(Beispiel: Abbildung 13)
- Ein Docker-Image wurde bereitgestellt

#### Nicht umgesetzte Must-Have/Nice-to-Have/If-Time-Allows
##### Must-Have
Anstelle von vier APIs zu verschieden Themenbereichen, wurde drei APIs verwendet. Jedoch können verschiedene Text-to-Speech-APIs zur Audiogenerierung verwendet werden.

##### Nice-to-Have
Der Themenbereich Finanzen wurde dem Programm nicht hinzugefügt, da die Zeit nicht ausgereicht hätte und es zudem schwierig ist, Daten von der Börse ohne Erlaubnis zu verändern bzw. verarbeiten und darzustellen. 
##### If-Time-Allows
Die Videos sind bisher nur auf Deutsch verfügbar. Da man aber die JSON-Datei später auch selbst schreibt, kann man die Audiodateien und Texte dort leicht selbst schreiben. Das Frontend ist nur auf Deutsch verfügbar.

### Qualitätsanforderungen
Das Produkt kann ohne großen Aufwand um weitere Funktionen, vor allem aber um weitere Schnittstellen erweitert werden. Möchte man eine neue API-Schnittstelle hinzufügen, ist dies recht einfach möglich. Die JSON-Konfigurationsdatei ist weitestgehend allgemein gehalten in ihren Funktionen, sodass man sie für viele verschiedene Themen und Datenverarbeitungen verwenden kann. 

Das aktuelle Video, welches auf der Website dargestellt wird, wird erst dann durch ein neues ersetzt, wenn dieses schon fertig generiert wurde. Somit soll sichergestellt werden, dass zu jeder Zeit dem Besucher der Website ein Video zur Verfügung steht.

Die Ausführung des Programms soll keine Auswirkung auf die Stabilität der Website haben.

### Produkteinsatz
Das Produkt steht dem Betreiber der Internetseite [https://biebertal.mach-mit.tv/](https://biebertal.mach-mit.tv/) zur Verfügung. Auf die dort generierten Videos - aktuell der ortstebzogene Wetterbericht für Biebertal - kann jeder öffentlich zugreifen.

Eine genaue Zielgruppe wurde bei der Herstellung nicht berücksichtigt. Der Wetterbericht ist interessant für die breite Masse.

### Produktübersicht
#### Benutzeroberfläche/Funktion
##### Übersicht

Bei der Gestaltung des Frontends wurde sich an das zuerst erstellte Mock-up gehalten.

**Beispiel**

Links: Mock-up  
Rechts: Benutzeroberfläche

<img src="../_static/images/mainreport/StartseiteMock.png" width="48%">
<img src="../_static/images/mainreport/StartseiteReal.png" width="45%">

<hr>

<img src="../_static/images/mainreport/Topic.png" width="48%">
<img src="../_static/images/mainreport/TopicReal.png" width="45%">


### Benutzerschnittstellen
Das Produkt ist betriebssystemunabhängig. Der Zugriff auf das Programm erfolgt über einen Browser. Dort kann das Programm als Plugin der gewünschten Website hinzugefügt und verwendet werden.

Die GUI über die der Benutzer seine Eingaben tätigen kann, wurde mithilfe von `React` und `MaterialUI` erstellt.

Für die Kommunikation zwischen dem Client und dem Server, wird das Python basierte Web-Framework `Flask` benutzt.
### Funktionale Anforderungen

1.	Der Client schickt eine Anfrage an das Programm.
2.	Das Programm schickt eine Anfrage über die Schnittstelle an die gewünschte API.
3.	Die Antwort der API liegt in einer JSON-Datei vor. 
4.  Die Daten der JSON-Datei werden in ein Python-Dictionary umgewandelt.
5.  Mithilfe einer JSON-Struktur mit mehreren Konfigurationsmöglichkeiten wie z.B. `transform`-Typen werden die Daten so weit verarbeitet, dass man aus ihnen Bild- und Audiodateien erstellen kann.
6.  Generierung der gewünschten Bilder/Grafiken.
7.  Generierung der gewünschten Audiodateien.
8.  Die daraus resultierenden Daten werden mithilfe des `Scheduler` zu einem Video zusammengefügt.

### Technische Umsetzung
#### API
##### Wetter
Anhand der Werte welche wir aus der [https://www.weatherbit.io/api](https://www.weatherbit.io/api) API beziehen, soll ein Wetterbericht als Video erstellt werden. Solch ein Bericht kann folgende Informationen beinhalten:
- Wetter deutschlandweit für heute, morgen und die darauffolgenden drei Tage
- ortbezogenes Wetter für heute, morgen und die darauffolgenden drei Tage
- optional: weitere Daten wie Luftfeuchtigkeit, gefühlte Temperaturen, Regenwahrscheinlichkeit o.Ä.

Die Preise für die weatherbit-API finden sie unter [https://www.weatherbit.io/pricing](https://www.weatherbit.io/pricing).

##### Bundesliga
[https://www.openligadb.de/](https://www.openligadb.de/) 

Es werden die Ergebnisse der Bundesliga für einen Spieltag visuell dargestellt. 
- Spielergebnisse des aktuellen Spieltags
- Tabelle des aktuellen Spieltags

##### Twitter
[Twitter](https://developer.twitter.com)

Es werden alle Hashtags, die mit einem bestimmten Hashtag in einem Tweet verwendet wurden ausgegeben und in einem String gespeichert.
Nach der Verarbeitung der Wörter, um zum Beispiel gewisse Wörter (wie Beleidigungen) auszuschließen werden die Hashtags mit einer Wordcloud dargestellt.
Die Wordcloud kann verschiedene Größen, Formen und Farben haben, welche bei der Parameterauswahl ausgewählt werden können.

#### Datenvisualisierung
Um die Daten grafisch darzustellen, wird die Python-Bibliothek `Pillow` zur Bildbearbeitung genutzt. Auf eine vorgefertigte Grafik (z.B. leere Deutschlandkarte) können mithilfe von Pillow, die aus der API gewonnenen Daten, eingetragen werden. 

Für die Erstellung einer Wordcloud wird die Python-Bibliothek `wordcloud` verwendet. Diese wird verwendet, um die Daten der Twitter-API zu visualisieren.

### Audioerstellung

Die Audiodateien werden mithilfe der verarbeiteten Daten erstellt. Es werden Lückentexte vorgegeben, die mit den gewünschten Daten gefüllt werden. Es gibt die Möglichkeit mehrere verschiedene Sätze pro möglichen Satz zu hinterlegen, um daraus zufällig einen auszuwählen, so bekommen die Audiodateien eine gewisse Dynamik und es hört sich nicht immer gleich an. Die Sätze können auch unter `transform` schon erstellt werden, jedoch müssen sie unter `audio` hinzugefügt werden, damit sie in eine Audiodatei umgewandelt werden.
Die Audiodateien werden standardmäßig mit der gTTS-Library erstellt. Man kann allerdings weitere Audiotools zur Generierung der Audiodateien wie z.B. Azure verwenden, wenn man einen API-Key dafür hat.

#### Zusammenführung von Bildern und Audios
Um am Ende alle Grafiken, Tabellen und Wordclouds zu einem Video zusammenzufügen, wird das Tool `FFMPEG` verwendet. Dieses Tool bietet die Möglichkeit, Bilder aneinander zu schneiden und mit einer Audiodatei zu unterlegen. 


### Umgesetzte besondere Herausforderungen

- Programm für Produktionsbetrieb absichern und zuverlässig machen
- Kompatibilität mit verschiedenen Betriebssystemen
- Verständliches und einfach zu bedienendes User Interface
- Speicherung von Secrets (z.B.: `API-Keys`)
- Umgang mit auftretenden Programmfehlern
- API-Daten sinnvoll zusammenbauen (individuell auf verschiedene Daten reagieren)
- Gute Sprachausgabe (komische Aussprache durch verschiedene Formulierungen vermeiden)

### Nichtfunktionale Anforderungen
Das Programm ist um weitere Schnittstellen einfach erweiterbar sein. API-Antworten im JSON-Format können einfach weiterverarbeitet werden.


### Möglichkeiten der Erweiterung der Software

#### API-Schnittstellen
Die Software kann leicht durch weitere API-Schnittstellen erweitert werden, um weitere Themen zu integrieren. Beispielsweise Themen wie Corona oder ein Quiz. 
Zudem können weitere Funktionen zur Erstellung von Grafiken wie zum Beispiel Diagramme hinzugefügt werden, um die Population der Welt darzustellen oder Tabellen.

#### Benutzeroberfläche für Erstellung der JSON-Datei
Eine weitere Idee ist es, eine Benutzeroberfläche für die Erstellung der JSON-Konfigurationsdatei zu implementieren, um mithilfe von Formularen die einzelnen Konfigurationen der JSON-Datei hinzuzufügen. (siehe _Abbildung 14_)

<figure>
  <img width="100%" src="../_static/images/mainreport/EditorExample.png" />
  <figcaption>Abbildung 14</figcaption>
</figure>
<br>

#### Asynchrone API-Requests

Um die Abfrage von API-Requests zu beschleunigen, 
kann man diese asynchron ausführen. Dies ist für einen Request natürlich langsamer, 
ab zwei aber schon schneller, umso mehr requests man macht, umso größer wird der Unterschied,
da man ungefähr in der Zeit von einem synchronen Request alle asynchronen machen kann.

> z.B. bei unseren 19 API-Requests an die weatherbit-API für den deutschlandweiten Wetterbericht 
> ist die asynchrone Variante 7 Sekunden schneller.

Möglicher Code:

~~~
import asyncio
from aiohttp import ClientSession


async def _fetch(url, session):
    async with session.get(url) as response:
        return await response.json()


async def _fetch_array(urls):
    async with ClientSession() as session:
        tasks = await asyncio.gather(
            *[_fetch(url, session) for url in urls]
        )

        return tasks


def fetch_all(urls):
    loop = asyncio.get_event_loop()
    task = loop.create_task(_fetch_array(urls))
    loop.run_until_complete(task)
    return task.result()
~~~

Der Funktion `fetch_all` übergibt man eine Liste von URLs und diese macht dann alle Requests und man bekommt eine Liste mit den Ergebnissen zurück.

> Der Code wurde noch nicht eingebaut, da man eine weitere Dependency benötigt 
> und noch nicht ganz sicher ist, ob man diese Funktion häufiger benötigt.