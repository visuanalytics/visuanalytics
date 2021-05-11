import React from "react";
import Typography from "@material-ui/core/Typography";

export const hintContents = {
  time: (
    <div>
      <Typography variant="h5" gutterBottom>
        Zeitplan auswählen
      </Typography>
      <Typography gutterBottom>
        Auf dieser Seite können Sie auswählen, wann der Job Videos generieren soll.
      </Typography>
      <Typography variant="h6">täglich</Typography>
      <Typography gutterBottom>
        Das Video wird täglich zur unten angegebenen Uhrzeit generiert.
      </Typography>
      <Typography variant="h6">wöchentlich</Typography>
      <Typography gutterBottom>
        Das Video wird jede Woche zu den ausgewählten Wochentagen zur unten
        ausgewählten Uhrzeit generiert.
      </Typography>
      <Typography variant="h6">Intervall</Typography>
      <Typography gutterBottom>
        Das Video wird nach dem ausgewählten Intervall generiert.
      </Typography>
      <Typography variant="h6">an festem Datum</Typography>
      <Typography gutterBottom>
        Das Video wird zum ausgewählten Datum und zur ausgewählten Uhrzeit
        generiert.
      </Typography>
    </div>
  ),
  delete: (
    <div>
      <Typography variant="h5" gutterBottom>
        Löschen
      </Typography>
      <Typography gutterBottom>
        Auf dieser Seite können Sie auswählen, wann generierte Videos wieder gelöscht werden sollen.
      </Typography>
      <Typography variant="h6">nie</Typography>
      <Typography gutterBottom>Das Video wird nie gelöscht.</Typography>
      <Typography variant="h6">nach Zeit</Typography>
      <Typography gutterBottom>
        Das Video wird nach einer ausgewählten Anzahl an Tagen und Stunden
        gelöscht.
      </Typography>
      <Typography variant="h6">nach Anzahl</Typography>
      <Typography gutterBottom>
        Das Video wird gelöscht, sobald eine ausgewählte Anzahl an neueren Videos generiert wurde.
      </Typography>
      <Typography variant="h6">feste Namen</Typography>
      <Typography gutterBottom>
        Wie die Option "nach Anzahl". Zusätzlich besitzt das neueste Video immer den
        Dateinamen: <i>jobName</i>. Ältere Videos besitzen
        die Dateinamen <i>Job-Name</i>_1,  <i>Job-Name</i>_2, usw.
      </Typography>
    </div>
  ),
  addTopic: (
    <div>
      <Typography variant="h5" gutterBottom>
        Thema hinzufügen
      </Typography>
      <Typography gutterBottom>
        Auf dieser Seite können Sie neue Themen hinzufügen.
      </Typography>
    </div>
  ),
  basicSettings: (
      <div>
          <Typography variant="h5" gutterBottom>
              API-Einstellungen
          </Typography>
          <Typography gutterBottom>
              Auf dieser Seite legen sie die grundlegenden Einstellungen der aktuellen API fest:
          </Typography>
          <Typography variant="h6">API-Name</Typography>
          <Typography gutterBottom>Der Name, mit dem die API für diesen Info-Provider gespeichert wird.</Typography>
          <Typography variant="h6">API-Query</Typography>
          <Typography gutterBottom>Die an die API zu stellende Anfrage als http-Query.</Typography>
          <Typography variant="h6">API-Key</Typography>
          <Typography gutterBottom>Ihr API-Zugangsschlüssel, den der Info-Provider nutzen soll.</Typography>
      </div>
  ),
    dataSelection: (
        <div>
            <Typography variant="h5" gutterBottom>
                API-Datenauswahl
            </Typography>
            <Typography gutterBottom>
                Auf dieser Seite legen sie fest, welche der von der API-Request gelieferten Daten der Info-Proivder erfassen soll.
            </Typography>

        </div>
    ),
    historySelection: (
        <div>
            <Typography variant="h5" gutterBottom>
                Historisierungsauswahl
            </Typography>
            <Typography gutterBottom>
                Auf dieser Seite werden die zu historisierenden Daten und die Historisierungszeitpunkte festgelegt.
            </Typography>

        </div>
    ),
    formeln: (
        <div>
            <Typography variant="h5" gutterBottom>
                Formeln erstellen
            </Typography>
            <Typography gutterBottom>
                Auf dieser Seite können Sie mit den ausgewählten Daten eigene Formeln und Variablen erstellen!
            </Typography>
        </div>
    ),
    typeSelection: (
        <div>
            <Typography variant="h5" gutterBottom>
                Datenquelle
            </Typography>
            <Typography gutterBottom>
                Wählen Sie hier aus, woher Sie Ihre Daten beziehen wollen!
            </Typography>
        </div>
    ),
    infoProviderOverview: (
        <div>
            <Typography variant={'h5'} gutterBottom>
                Übersicht der InfoProvider
            </Typography>
            <Typography gutterBottom>
                Hier sehen Sie alle erstellten Info-Provider. Sie können diese bearbeiten und exportieren oder Sie erstellen ein komplett Neuen.
                Ebenfalls haben Sie Zugriff auf die Historisierungs-Datenbank.
            </Typography>
        </div>
    ),
    sceneOverview: (
        <div>
            <Typography variant={'h5'} gutterBottom>
                Übersicht der erstellten Szenen
            </Typography>
        </div>
    ),
    videoOverview: (
        <div>
            <Typography variant={'h5'} gutterBottom>
                Übersicht der erstellten Videos
            </Typography>
        </div>
    )
};
