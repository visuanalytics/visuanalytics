import React, { useEffect } from "react";
import { Tooltip } from "@material-ui/core";
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
import { fromFormattedDates, showTimeToNextDate } from "../../util/schedule";
import { ComponentContext } from "../../ComponentProvider";
import { Job } from "../index";
import { useCallFetch } from "../../Hooks/useCallFetch";
import { getUrl } from "../../util/fetchUtils";
import { JobSettings } from "./JobSettings";
import { JobInfos } from "./JobInfos";
import { DeleteDialog } from "../../util/DeleteDialog";

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

  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [openSettings, setOpenSettings] = React.useState(false);
  const schedule = fromFormattedDates(job.schedule);
  const [next, setNext] = React.useState(showTimeToNextDate(schedule));
  const [confirmDelete, setConfirmDelete] = React.useState(false);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setNext(showTimeToNextDate(schedule));
    }, 2000);
    return () => clearInterval(interval);
  }, [schedule]);

  const handleChange =
    (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleCloseModal = () => {
    setOpenSettings(false);
  };

  return (
    <div className={classes.root}>
      <Accordion
        expanded={expanded === String(job.jobId)}
        onChange={handleChange(String(job.jobId))}
      >
        <AccordionSummary>
          <Grid container>
            <Grid item container sm={9} xs={12} alignItems="center">
              <Grid item>
                {expanded ? (
                  <ExpandLess className={classes.expIcon} />
                ) : (
                  <ExpandMore className={classes.expIcon} />
                )}
              </Grid>
              <Grid item>
                <Typography component="span" className={classes.heading}>
                  #{job.jobId} {job.jobName}
                </Typography>
              </Grid>
            </Grid>
            <Grid item sm={3} xs container justify="flex-end">
              <div onClick={(event) => event.stopPropagation()}>
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
              </div>
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
              handleEditSuccess={handleEditSuccess}
              reportError={reportError}
            />
          ) : null}
        </AccordionDetails>
      </Accordion>
      <DeleteDialog
        title={`Job '#${job.jobId} ${job.jobName}' löschen?`}
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onDelete={deleteJob}
      />
    </div>
  );
};
