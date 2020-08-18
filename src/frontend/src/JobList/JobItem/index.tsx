import React, { useEffect } from "react";
import {
  ParamValues,
  toTypedValues,
  trimParamValues,
  validateParamValues,
  initSelectedValues,
} from "../../util/param";
import {
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import { AccordionSummary, useStyles } from "../style";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";
import DeleteIcon from "@material-ui/icons/Delete";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Grid from "@material-ui/core/Grid";
import DescriptionIcon from "@material-ui/icons/Description";
import {
  Schedule,
  withFormattedDates,
  fromFormattedDates,
  showTimeToNextDate,
  validateSchedule,
} from "../../util/schedule";
import { ComponentContext } from "../../ComponentProvider";
import { Job } from "../index";
import { useCallFetch } from "../../Hooks/useCallFetch";
import { getUrl } from "../../util/fetchUtils";
import { DeleteSchedule } from "../../util/deleteSchedule";
import { JobSettings } from "./JobSettings";
import { JobInfos } from "./JobInfos";

interface Props {
  job: Job;
  getJobs: () => void;
  reportError: (message: string) => void;
  reportSuccess: (message: string) => void;
}

export const JobItem: React.FC<Props> = ({
  job,
  getJobs,
  reportError,
  reportSuccess,
}) => {
  const classes = useStyles();
  const components = React.useContext(ComponentContext);

  const initParamValues = (topics: any) => {
    return topics.map((t: any) => {
      return { ...initSelectedValues(t.params), ...t.values };
    });
  };

  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [jobName, setJobName] = React.useState(job.jobName);
  const [openSettings, setOpenSettings] = React.useState(false);
  const [paramValues, setParamValues] = React.useState<ParamValues[]>(
    initParamValues(job.topics)
  );
  const [schedule, setSchedule] = React.useState<Schedule>(
    fromFormattedDates(job.schedule)
  );
  const [deleteSchedule, setDeleteSchedule] = React.useState<DeleteSchedule>({
    type: "noDeletion",
  });
  const [next, setNext] = React.useState(showTimeToNextDate(schedule));
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const handleSelectSchedule = (schedule: Schedule) => {
    setSchedule(schedule);
  };

  const handleSelectDeleteSchedule = (deleteSchedule: DeleteSchedule) => {
    setDeleteSchedule(deleteSchedule);
  };

  const handleSelectParam = (key: string, value: any, idx: number) => {
    const updated = [...paramValues];
    updated[idx][key] = value;
    setParamValues(updated);
  };

  const handleEditError = () => {
    reportError("Bearbeitung fehlgeschlagen");
  };

  const handleEditSuccess = () => {
    setOpenSettings(false);
    getJobs();
    reportSuccess("Job erfolgreich geändert");
  };

  const handleDeleteJobSucess = () => {
    getJobs();
    reportSuccess("Job erfolgreich gelöscht");
  };

  const handleDeleteJobFailure = () => {
    reportError("Job konnte nicht gelöscht werden");
  };

  const deleteJob = useCallFetch(
    getUrl(`/remove/${job.jobId}`),
    { method: "DELETE" },
    handleDeleteJobSucess,
    handleDeleteJobFailure
  );

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

  useEffect(() => {
    const interval = setInterval(() => {
      setNext(showTimeToNextDate(schedule));
    }, 60000);
    return () => clearInterval(interval);
  }, [schedule]);

  useEffect(() => {
    setNext(showTimeToNextDate(schedule));
  }, [schedule]);

  const handleChange = (panel: string) => (
    event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
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
  const handleSaveModal = () => {
    handleCheckClick();
  };

  const handleCloseModal = () => {
    setOpenSettings(false);
    setParamValues(initParamValues(job.topics));
    setJobName(job.jobName);
    setSchedule(fromFormattedDates(job.schedule));
  };

  const handleDeleteJob = () => {
    setConfirmDelete(false);
    deleteJob();
  };

  return (
    <div className={classes.root}>
      <Accordion
        expanded={expanded === String(job.jobId)}
        onChange={handleChange(String(job.jobId))}
      >
        <AccordionSummary>
          <Grid container>
            <Grid item container sm={8} xs={12} alignItems="center">
              <Grid item>
                {expanded ? (
                  <ExpandLess className={classes.expIcon} />
                ) : (
                  <ExpandMore className={classes.expIcon} />
                )}
              </Grid>
              <Grid item>
                <Typography component="span" className={classes.heading}>
                  #{job.jobId} {jobName}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              sm={4}
              xs
              container
              justify="flex-end"
              onClick={(event) => event.stopPropagation()}
            >
              <Tooltip title="Logs öffnen" arrow>
                <IconButton
                  onClick={() =>
                    components?.setCurrent("jobLogs", { jobId: job.jobId })
                  }
                  className={classes.button}
                >
                  <DescriptionIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Job löschen" arrow>
                <IconButton
                  onClick={() => setConfirmDelete(true)}
                  className={classes.button}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Konfiguration" arrow>
                <IconButton
                  onClick={() => setOpenSettings(true)}
                  className={classes.button}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid xs={1} item />
          <Grid xs={10} item>
            <JobInfos job={job} next={next} />
          </Grid>
          <Grid xs={1} item />

          {openSettings ? (
            <JobSettings
              open={openSettings}
              onClose={handleCloseModal}
              job={job}
              jobName={jobName}
              handleSetJobName={(jobName: string) => setJobName(jobName)}
              deleteSchedule={deleteSchedule}
              schedule={schedule}
              handleSelectSchedule={handleSelectSchedule}
              handleSelectDeleteSchedule={handleSelectDeleteSchedule}
              handleSaveModal={handleSaveModal}
              handleSelectParam={handleSelectParam}
              paramValues={paramValues}
            />
          ) : null}
        </AccordionDetails>
      </Accordion>
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>
          {`Job '#${job.jobId} ${job.jobName}' löschen?`}
        </DialogTitle>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => setConfirmDelete(false)}
            color="primary"
          >
            Abbrechen
          </Button>
          <Button onClick={handleDeleteJob} color="primary">
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
