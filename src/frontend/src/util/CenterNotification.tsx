import React from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
  errorAlert: {
    "& .MuiAlert-icon": {
      fontSize: 25
    },
    fontSize: 16
  }
});

export interface NotificationState {
  open: boolean;
  message: string;
  severity: AlertProps["severity"];
}

export type NotificationAction =
  | { type: "reportSuccess"; message: string }
  | { type: "reportError"; message: string }
  | { type: "reportWarning"; message: string }
  | { type: "close" };

export const centerNotifcationReducer = (
  state: NotificationState,
  action: NotificationAction
): NotificationState => {
  switch (action.type) {
    case "reportSuccess":
      return {
        open: true,
        message: action.message,
        severity: "success",
      };
    case "reportError":
      return {
        open: true,
        message: action.message,
        severity: "error",
      };
    case "reportWarning":
      return {
        open: true,
        message: action.message,
        severity: "warning",
      };
    case "close":
      return {
        ...state,
        open: false,
      };
  }
};

interface CenterNotificationProps {
  handleClose: (
    event: React.SyntheticEvent | MouseEvent,
    reason?: string
  ) => void;
  open: boolean;
  message: string;
  severity: AlertProps["severity"];
}

export const CenterNotification: React.FC<CenterNotificationProps> = ({
  message,
  handleClose,
  open,
  severity,
}) => {
  const classes = useStyles();
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      autoHideDuration={7000}
      resumeHideDuration={7000}
      onClose={handleClose}
    >
      <MuiAlert severity={severity} elevation={6} variant="filled" className={classes.errorAlert}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
};
