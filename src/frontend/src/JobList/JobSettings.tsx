import React from "react";
import { useStyles } from "./style";
import Backdrop from "@material-ui/core/Backdrop";
import {
  Dialog,
  Container,
  Grid,
  Tooltip,
  InputBase,
  TextField,
  Paper,
  Typography,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import { HintButton } from "../util/HintButton";
import { SettingsPage } from "../util/SettingsPage";
import { ContinueButton } from "../JobCreate/ContinueButton";
import { Job } from "./index";
import { DeleteSchedule } from "../util/deleteSchedule";
import { Schedule } from "../util/schedule";
import { ParamValues } from "../util/param";

interface Props {
  open: boolean;
  onClose: () => void;
  job: Job;
  jobName: string;
  handleSetJobName: (jobName: string) => void;
  schedule: Schedule;
  deleteSchedule: DeleteSchedule;
  handleSelectSchedule: (schedule: Schedule) => void;
  handleSelectDeleteSchedule: (deleteSchedule: DeleteSchedule) => void;
  paramValues: ParamValues[];
  handleSelectParam: (key: string, value: any, idx: number) => void;
  handleSaveModal: () => void;
}

export const JobSettings: React.FC<Props> = ({
  open,
  onClose,
  job,
  jobName,
  handleSetJobName,
  schedule,
  deleteSchedule,
  handleSelectSchedule,
  handleSelectDeleteSchedule,
  paramValues,
  handleSelectParam,
  handleSaveModal,
}) => {
  const classes = useStyles();
  const [edit, setEdit] = React.useState(false);
  const [hintState, setHintState] = React.useState(0);

  const hintContent = [
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
    </div>,
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
    </div>,
    <div>
      <Typography variant="h5" gutterBottom>
        Parameter bearbeiten
      </Typography>
      <Typography gutterBottom>
        Auf dieser Seite können Sie die Parameter für das Video bearbeiten.
      </Typography>
    </div>,
  ];

  const handleClose = () => {
    setEdit(false);
    onClose();
  };

  const handleJobName = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    handleSetJobName(event.target.value);
  };

  const handleHintState = (hint: number) => {
    setHintState(hint);
  };

  return (
    <Dialog
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Container className={classes.backdropContent}>
        <Grid container>
          <Grid item container xs={1} justify={"flex-end"}>
            <Tooltip title="Job-Name bearbeiten" arrow>
              <IconButton
                onClick={() => setEdit((b) => !b)}
                className={classes.button}
              >
                <EditIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={10}>
            {edit ? (
              <TextField
                fullWidth
                onChange={handleJobName}
                value={jobName}
                inputProps={{
                  style: { textAlign: "center", fontSize: 20 },
                }}
              />
            ) : (
              <InputBase
                fullWidth
                disabled
                value={jobName}
                inputProps={{
                  style: {
                    color: "black",
                    textAlign: "center",
                    fontSize: 20,
                    cursor: "default",
                  },
                }}
              />
            )}
          </Grid>
          <Grid item container xs={1} justify={"flex-end"}>
            <HintButton content={hintContent[hintState]} />
          </Grid>
        </Grid>
        <Paper
          variant="outlined"
          className={classes.paper}
          style={{ maxHeight: 600, overflow: "auto" }}
        >
          <SettingsPage
            offset={-1}
            schedule={schedule}
            deleteSchedule={deleteSchedule}
            selectScheduleHandler={handleSelectSchedule}
            selectDeleteScheduleHandler={handleSelectDeleteSchedule}
            handleHintState={handleHintState}
            paramSelectionProps={{
              topicNames: job.topics.map((t: any) => t.topicName),
              values: paramValues,
              params: job.topics.map((t: any) => t.params),
              loadFailedProps: undefined,
              selectParamHandler: handleSelectParam,
            }}
          />
        </Paper>
        <div>
          <div style={{ textAlign: "center", paddingTop: 15 }}>
            <ContinueButton onClick={handleSaveModal}>SPEICHERN</ContinueButton>
          </div>
        </div>
      </Container>
    </Dialog>
  );
};
