import React from "react";
import Typography from "@material-ui/core/Typography";

export const hintContents = {
  time: (
    <div>
      <Typography variant="h5" gutterBottom>
        Zeitplan auswählen
      </Typography>
      <Typography gutterBottom>
        Auf dieser Seite können Sie auswählen an welchem Zeitpunkt das Video
        generiert werden soll.
      </Typography>
      <Typography variant="h6">täglich</Typography>
      <Typography gutterBottom>
        Das Video wird täglich zur unten angegebenen Uhrzeit erstellt
      </Typography>
      <Typography variant="h6">wöchentlich</Typography>
      <Typography gutterBottom>
        Das Video wird zu den angegebenen Wochentagen wöchentlich zur unten
        angegebenen Uhrzeit erstellt
      </Typography>
      <Typography variant="h6">Intervall</Typography>
      <Typography gutterBottom>
        Das Video wird nach dem angegebenen Intervall generiert
      </Typography>
      <Typography variant="h6">an festem Datum</Typography>
      <Typography gutterBottom>
        Das Video wird zum angegebenen Datum und zur angegebenen Uhrzeit
        erstellt
      </Typography>
    </div>
  ),
  delete: (
    <div>
      <Typography variant="h5" gutterBottom>
        Löschen
      </Typography>
      <Typography gutterBottom>
        Auf dieser Seite können Sie auswählen an welchem Zeitpunkt das Video
        gelöscht werden soll.
      </Typography>
      <Typography variant="h6">nie</Typography>
      <Typography gutterBottom>Das Video wird nie gelöscht</Typography>
      <Typography variant="h6">nach Zeit</Typography>
      <Typography gutterBottom>
        Das Video wird nach einer bestimmten Anzahl an Tagen und Stunden
        gelöscht
      </Typography>
      <Typography variant="h6">nach Anzahl</Typography>
      <Typography gutterBottom>
        Das Video wird nach einer bestimmten Anzahl an generierten Videos
        gelöscht
      </Typography>
      <Typography variant="h6">feste Namen</Typography>
      <Typography gutterBottom>
        Es wird eine bestimmte Anzahl an Videos generiert, wobei das neuste
        immer den Namen <i>jobName</i>_1 besitzt
      </Typography>
    </div>
  ),
};
