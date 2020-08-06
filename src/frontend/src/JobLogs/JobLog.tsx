import React, { FC } from "react";
import { useStyles } from "./style";
import {
  Card,
  Tooltip,
  CardContent,
  Grid,
  Typography,
} from "@material-ui/core";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import CachedOutlinedIcon from "@material-ui/icons/CachedOutlined";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import { format, fromUnixTime } from "date-fns";
import { de } from "date-fns/locale";

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
  | "header"
  | "runningIcon"
  | "finishedIcon"
  | "unownIcon"
  | "margin"
  | "paper"
  | "card"
  | "errorIcon"
  | "durationText"
  | "durationIcon",
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

const getStateValues = (log: Log, classes: ClassesType): SateValues => {
  switch (log.state) {
    case -1:
      // On State Error
      return {
        icon: <HighlightOffOutlinedIcon className={classes.errorIcon} />,
        iconTitle: "Fehler bei der Video generierung",
        jobNameXS: 9,
        infoFC: <></>,
      };
    case 0:
      // On State Running
      return {
        icon: <CachedOutlinedIcon className={classes.runningIcon} />,
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
        iconTitle: "Video wird generiert",
        jobNameXS: 9,
        infoFC: (
          <Grid item container justify="flex-end" md={2} xs>
            {log.duration ? (
              <>
                <Tooltip arrow title="Dauer">
                  <Typography color="textSecondary" variant="subtitle1">
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
  const stateValues = getStateValues(log, classes);

  return (
    <Card className={classes.card} variant="outlined">
      <CardContent>
        <Grid container spacing={2}>
          <Grid item>{stateValues.icon}</Grid>
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
