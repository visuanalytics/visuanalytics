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
  )
};
