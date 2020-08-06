import React from "react";
import { useStyles } from "./style";
import { Card, CardContent, CardHeader, Tooltip } from "@material-ui/core";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import CachedOutlinedIcon from "@material-ui/icons/CachedOutlined";
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

export const JobLog: React.FC<Props> = ({ log }) => {
  const classes = useStyles();

  const getIcon = (state: number) => {
    switch (state) {
      case -1:
        return (
          <Tooltip arrow title="Fehler bei der Video generierung">
            <HighlightOffOutlinedIcon className={classes.errorIcon} />
          </Tooltip>
        );
      case 0:
        return (
          <Tooltip arrow title="Video wird generiert">
            <CachedOutlinedIcon className={classes.runningIcon} />
          </Tooltip>
        );
      case 1:
        return (
          <Tooltip arrow title="Video wurde generiert">
            <CheckCircleOutlineOutlinedIcon className={classes.finishedIcon} />
          </Tooltip>
        );
      default:
        return (
          <Tooltip arrow title="Video Status nicht bekannt">
            <HelpOutlineOutlinedIcon className={classes.unownIcon} />
          </Tooltip>
        );
    }
  };

  return (
    <Card className={classes.card} variant="outlined">
      <CardHeader
        title={`#${log.jobId}  ${log.jobName}`}
        subheader={format(fromUnixTime(log.startTime), "d. MMMM yyyy hh:mm", {
          locale: de,
        })}
        avatar={getIcon(log.state)}
        titleTypographyProps={{ variant: "h6" }}
      />
    </Card>
  );
};
