# Github Automatisation

## Projekt Board

Um das Arbeiten mit dem Projekt Board von Github einfacher zu machen, wurde eine Github Action erstellt die dessen Funktionen erweiter.

Neue Funktionen:

_Issue Branch erstellen_

Wird ein Issue in die Spalte _In progress_ gezogen wird Automatisch ein neuer Branch erstell.

Der Name des Branches ist so aufgebaut: i[issueNumer]-[issueName], also z.b.: `i1-test`, desweiteren wird bei dem Issue ein Kommentar geschreiben das der Branch erstellt wurde.

_Pull request erstellen_

Wird ein Issue in dei Spalte _Review_ gezogen wird Automatisch ein pullrequest erstellt. Dieser hat die Nachicht `resolves #[issueNumber]`, sommit wird beim Mergen automatich des Issue geschlossen.

### Einrichtung

_Projekt Hinzufügen_:

- Neues Projekt erstellen (oder Vorhandenes Benutzen)
  - Template (Basic kanban)
- Projekt einrichten
  - Neu Spalte mit dem Namen `Review` erstellen und zwichen `In progress` und `Done` einordnen.
  - Die `Colum ID` von `In Progress` & `Review` Copieren (Drei Punkte -> Copy colum link -> letzte zahl im Link Kopieren (wird Später noch benötigt))

Optional kann noch die Normale Github Automatisation für `TODO` und `Done` verwendet werden:

- `TODO` Automatisieren:

  - (drei Punkte -> Mange Automatisation )
  - `Preset: TODO`
  - Haken bei Issues: `Newly added` und `Reopened`

- `Done` Automatisieren
  - (drei Punkte -> Mange Automatisation )
  - `Preset: Done`
  - Haken bei Issues: `Closed`

> Achtung: Die Pull requests dürfen nicht dem Projekt Board Hinzugefügt werden.

> Hinweiß: Uns ist aufgefallen das Wenn man ein Issue erstellt und es direkt dem Projekt zuweißt Funktioniert die `TODO` **Automatisation nicht**. Dieses Probem kann man umgehen wenn man das Issue dem Projekt erst nach dem erstellen des Issues hinzufügt.

_Github Action erstellen_:

- Im Repo bei Actions:
  - `new Workflow` klicken
  - `set up a workflow yourself` klicken
  - inhalt durch Script ersetzen
  - Namen festlegen (oben wo `main` steht)
  - In Zeile `10` die Zahl nach `...colum_id ==` ersetzen (durch die id der Todo Spalte)
  - In Zeile `59` die Zahl nach `...colum_id ==` ersetzen (durch die id der Review Spalte)
  - `Start commit` klicken & Datei Commiten

> Die Datei muss im master(default) branch liegen damit sie ausgelöst wird.

_Github App erstellen_:

Um mit dieser Action auch andere Actions auslösten zu können muss man eine Github App erstellen, die dann zur Authentifizierung verwendet wird.

> Wenn man diese Funktion nicht braucht kann man das Script auch ohne App verwenden. Dan kann man diesen Schritt überspringen und nur die Punkte bei **Ohne Github App** beachten

1. Github App erstllen (siehe [hier](https://developer.github.com/apps/building-github-apps/creating-a-github-app/))
2. Die App Berechtigungen einstellen:

- Contents: Read & Write
- Issues: Read & Write
- Metadate: Read-only
- Pull requests: Read & write
- Projects: Read-only

3. App zum Reposetory Hinzufügen (siehe [hier](https://developer.github.com/apps/installing-github-apps/))
4. Secrets anlegen:

Es Müssen zwei Secrets für das Repo angelegt werden:

- Name: `APP_ID`
- Value: id der App (Findet man in den App einstellungen bei General)

- Name: `APP_PEM`
- Value: Private Key der App (Kann in den einstellungen bei General erstellt werden)

_Ohne Github App_

> Wenn man die Schritte bei **Github App erstellen** schon erfolgreich beendet hat kann man diese Schritte einfach übersprigen.

> Wenn man die Action ohne Github App verwendet, können die von der Action erstellen Pull requests keine andere Action (wie. zb. Automatische Tests) auslösen.

- Zeilen `16 - 21` & Zeilen `65 - 70` entfernen
- In den Zeilen `26` & `75` `steps.generate_token.outputs.token` durch `secrets.GITHUB_TOKEN` ersetzen

### Funktionsweiße

Um wie in der Einrichtung beschrieben eine Github App für die Authentifikation zu verwenden wird die Action `tibdex/github-app-token@v1.0.2` aus dem Github Marketplace verwendet. Diese Generiert für einen den Authentifizierungs Schlüssel, aus der App ID und dem Private Key der App.

Im nächsten Schritt werden mithilfe der Github Action `actions/github-script@0.9.0` Github APi anfragen gemacht. Dieser App übergibt man ein Script (geschrieben in Java Script) welches dann von der App ausgeführt wird. Die Github Abfragen sind in diesem Sript ganz einfach möglich, man verwendet einfach die vordefinierte Variable github und context. z.B.:

```js
// Create branch

github.git.createRef({
  owner: context.repo.owner,
  repo: context.repo.repo,
  ref: `refs/heads/${branchName}`,
  sha: mSha.data.object.sha,
});
```

Eine Dokumentation aller möglichen Api abfragen befindet sich [hier](https://octokit.github.io/rest.js/v17)(Dies ist die Doku der App die, die Action im hintergrund verwendet, man kann aber alle dortzbeschriebenen Abfrage verwendet man muss nur das in der Doku stehende `octokit` durch `github` ersetzen)

Um den Namen des Repos oder den Owner usw. herauszufinden stellt die Action noch die variable `context` bereit mit der man z.B. mit: `context.repo.owner` auf verschiedene Informationen zugriff hat.

### Einschränkungen

- Der Namen der Issues wird **nicht vollständig** auf **Zeichen** überprüft bzw. es werden nicth alle Zeichen Entfernt die für einen Branch Namen **nicht zulässing** sind. Vorhandenen Funktionen:
  - Alle Buchstaben werden zu **Kleinbuchstaben**
  - **Leerzeichen** werden durch ein `-` ersetzt
  - `[text]` wird **entfern** (diese Funktion ist da, da wir diese Schreibweise verwenden um Issues zu Kategorisieren)
- Wenn man ein Issue **umbenent** deren Branch es schon gibt kann **kein Pull request** mehr **erstellt** werden da der branch nicht mehr gefunden wird.
- Durch einen Fehler von github werden die **verlinketen Issues** bei einem Pull request erst **nach** dem **Mergen**, oder wenn jemand ein **Kommentar** schreibt **richtig angezeigt**.
- Wenn der **Branch keine änderungen** zum Master Branch enthält kann **kein Pull request** erstellt werden (Ist von Github so gewollt)
- Im **Projekt Board** sollten **keine Pullrequests** hinzugefügt werden. Da diese in Github nur eine Unterkategorie von Issues sind, kann die Action nicht zwichen ihnen unterscheiden und würde für die Pull requests auch branches usw. erstellen. Da die Verlinkden Pull requests aber eh im Projekt Board unter dem Issue angezeigt werden ist dies eigentlich keine Problem.

## Automatisierte Tests

Bei einem Pull request werden autmatisierte Tests durchgeführt.

### Einrichtung

_Docker Dateien erstellen_:

- Dockerfile für Projekt erstellen (siehe [hier](https://docs.docker.com/engine/reference/builder/))
- Docker Test Datei erstellen: `docker-compose.test.yml` (im gleichen Ordner wie das Dockerfile)
- Datei mit folgendem inhalt ausfüllen:

```Docker
sut:
    build: .
    working_dir: dir // Workdir des Dockercontainers
    command: test // Command der die Tests auführt
```

> Natürlich können noch Wessentlich mehr Sachen in der Datei Eingestellt werden. (siehe [hier](https://docs.docker.com/compose/))

_Github Action erstellen_:

- Im Repo bei Actions:

  - `new Workflow` klicken
  - `set up a workflow yourself` klicken
  - inhalt durch Script ersetzen
  - Namen festlegen (oben wo `main` steht)
  - In zeile 18 & 19 pfad hinter `--file` anpassen
  - `Start commit` klicken & Datei Commiten

  ### Funktionsweiße

  Nachdem die Action das Repo ausgecheckt hat wird zuerst der Docker Container erstellt und danach wird die datei `docker-compose.test.yml` verwendet um die Tests auszuführen.
