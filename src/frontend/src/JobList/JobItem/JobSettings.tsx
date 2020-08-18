import React from "react";
import { useStyles } from "../style";
import Backdrop from "@material-ui/core/Backdrop";
import {
  Dialog,
  Grid,
  Tooltip,
  InputBase,
  TextField,
  Paper,
  Typography,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import { HintButton } from "../../util/HintButton";
import { SettingsPage } from "../../util/SettingsPage";
import { ContinueButton } from "../../JobCreate/ContinueButton";
import { Job } from "../index";
import { DeleteSchedule } from "../../util/deleteSchedule";
import {
  Schedule,
  withFormattedDates,
  validateSchedule,
} from "../../util/schedule";
import {
  ParamValues,
  toTypedValues,
  trimParamValues,
  validateParamValues,
  initSelectedValues,
} from "../../util/param";
import { hintContents } from "../../util/hintContents";
import { useCallFetch } from "../../Hooks/useCallFetch";
import { getUrl } from "../../util/fetchUtils";

interface Props {
  open: boolean;
  onClose: () => void;
  job: Job;
  jobName: string;
  handleSetJobName: (jobName: string) => void;
  schedule: Schedule;
  handleSelectSchedule: (schedule: Schedule) => void;
  handleEditSuccess: () => void;
  reportError: (msg: string) => void;
}

const initParamValues = (topics: any) => {
  return topics.map((t: any) => {
    return { ...initSelectedValues(t.params), ...t.values };
  });
};

export const JobSettings: React.FC<Props> = ({
  open,
  onClose,
  job,
  jobName,
  handleSetJobName,
  schedule,
  handleSelectSchedule,
  handleEditSuccess,
  reportError,
}) => {
  const classes = useStyles();
  const [edit, setEdit] = React.useState(false);
  const [hintState, setHintState] = React.useState(0);
  const [deleteSchedule, setDeleteSchedule] = React.useState<DeleteSchedule>({
    type: "noDeletion",
  });
  const [paramValues, setParamValues] = React.useState<ParamValues[]>(
    initParamValues(job.topics)
  );

  const handleEditError = () => {
    reportError("Bearbeitung fehlgeschlagen");
  };

  const handleSelectDeleteSchedule = (deleteSchedule: DeleteSchedule) => {
    setDeleteSchedule(deleteSchedule);
  };

  const handleCheckClick = () => {
    if (jobName.trim() === "") {
      reportError("Jobname nicht ausgefüllt");
      return;
    }
    if (
      !job.topics.every((t: any, idx: number) =>
        validateParamValues(paramValues[idx], t.params)
      )
    ) {
      reportError("Parameter nicht korrekt gesetzt");
      return;
    }
    if (!validateSchedule(schedule)) {
      reportError("Es muss mindestens ein Wochentag ausgewählt werden");
      return;
    }
    editJob();
  };

  const editJob = useCallFetch(
    getUrl(`/edit/${job.jobId}`),
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobName: jobName.trim(),
        topics: job.topics.map((t: any, idx: number) => {
          return {
            topicId: t.topicId,
            values: toTypedValues(trimParamValues(paramValues[idx]), t.params),
          };
        }),
        schedule: withFormattedDates(schedule),
      }),
    },
    handleEditSuccess,
    handleEditError
  );

  const handleSelectParam = (key: string, value: any, idx: number) => {
    const updated = [...paramValues];
    updated[idx][key] = value;
    setParamValues(updated);
  };

  const hintContent = [
    hintContents.time,
    hintContents.delete,
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
    setParamValues(initParamValues(job.topics));
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
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle className={classes.dialogTitle}>
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
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Paper variant="outlined" className={classes.dialogPaper}>
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
        <DialogActions className={classes.dialogActions}>
          <ContinueButton onClick={handleCheckClick}>SPEICHERN</ContinueButton>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
