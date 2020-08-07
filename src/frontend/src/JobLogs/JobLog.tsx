import React from "react";
import { useStyles } from "./style";
import {
  Card,
  Tooltip,
  CardContent,
  Grid,
  Typography,
  IconButton,
} from "@material-ui/core";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import LoopIcon from "@material-ui/icons/Loop";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import { format, fromUnixTime } from "date-fns";
import { de } from "date-fns/locale";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { LogErrorDialog } from "./LogErrorDialog";

export interface Log {
  jobId: number;
  jobName: string;
  state: number;
  startTime: number;
  duration: number | null;
  errorMsg: string | null;
  errorTraceback: string | null;
}

interface Props {
  log: Log;
}

type ClassesType = Record<
  | "runningIcon"
  | "finishedIcon"
  | "unownIcon"
  | "errorIcon"
  | "durationText"
  | "durationIcon"
  | "errorButton"
  | "errorText"
  | "errorBox",
  string
>;

interface SateValues {
  icon: JSX.Element;
  iconTitle: string;
  jobNameXS:
    | boolean
    | 9
    | "auto"
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 10
    | 11
    | 12
    | undefined;
  infoFC: JSX.Element;
}

const useStateValues = (log: Log, classes: ClassesType): SateValues => {
  const [expandError, setExpandError] = React.useState(false);

  switch (log.state) {
    case -1:
      // On State Error
      return {
        icon: <HighlightOffOutlinedIcon className={classes.errorIcon} />,
        iconTitle: "Fehler bei der Video generierung",
        jobNameXS: 4,
        infoFC: (
          <Grid container item md={7} xs className={classes.errorBox}>
            <Grid item xs>
              <Typography
                align="center"
                className={classes.errorText}
                variant="subtitle1"
                color="error"
              >
                {log.errorMsg}
              </Typography>
            </Grid>
            <Grid
              item
              xs={1}
              container
              alignItems="flex-start"
              className={classes.errorButton}
            >
              <IconButton onClick={() => setExpandError(!expandError)}>
                <MoreHorizIcon />
              </IconButton>
            </Grid>
            <LogErrorDialog
              open={expandError}
              onClose={() => setExpandError(false)}
              title="Fehler Traceback"
              content={log.errorTraceback ? log.errorTraceback : ""}
            />
          </Grid>
        ),
      };
    case 0:
      // On State Running
      return {
        icon: <LoopIcon className={classes.runningIcon} />,
        iconTitle: "Video wird generiert",
        jobNameXS: 9,
        infoFC: <></>,
      };
    case 1:
      // On State Success
      return {
        icon: (
          <CheckCircleOutlineOutlinedIcon className={classes.finishedIcon} />
        ),
        iconTitle: "Video wurde generiert",
        jobNameXS: 9,
        infoFC: (
          <Grid item container justify="flex-end" md={2} xs>
            {log.duration ? (
              <>
                <Tooltip arrow title="Dauer">
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    className={classes.durationText}
                  >
                    {log.duration}s
                  </Typography>
                </Tooltip>
                <HourglassEmptyIcon className={classes.durationIcon} />
              </>
            ) : null}
          </Grid>
        ),
      };
    default:
      return {
        icon: <HelpOutlineOutlinedIcon className={classes.unownIcon} />,
        iconTitle: "Video Status nicht bekannt",
        jobNameXS: 9,
        infoFC: <></>,
      };
  }
};

export const JobLog: React.FC<Props> = ({ log }) => {
  const classes = useStyles();
  const stateValues = useStateValues(log, classes);

  return (
    <Card variant="outlined" className={classes.card}>
      <CardContent className={classes.cardContent}>
        <Grid container spacing={2}>
          <Grid item>
            <Tooltip title={stateValues.iconTitle}>{stateValues.icon}</Tooltip>
          </Grid>
          <Grid item xs={stateValues.jobNameXS}>
            <Typography variant="h6">
              {`#${log.jobId}  ${log.jobName}`}
            </Typography>
            <Typography color="textSecondary" variant="subtitle2">
              {format(fromUnixTime(log.startTime), "d. MMMM yyyy HH:mm", {
                locale: de,
              })}
            </Typography>
          </Grid>
          {stateValues.infoFC}
        </Grid>
      </CardContent>
    </Card>
  );
};
