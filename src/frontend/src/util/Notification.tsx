import React from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

export interface NotificationState {
  open: boolean;
  message: string;
  severity: AlertProps["severity"];
}

export type NotificationAction =
  | { type: "reportSuccess"; message: string }
  | { type: "reportError"; message: string }
  | { type: "close" };

export const notifcationReducer = (
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
    case "close":
      return {
        ...state,
        open: false,
      };
  }
};

interface Props {
  handleClose: (
    event: React.SyntheticEvent | MouseEvent,
    reason?: string
  ) => void;
  open: boolean;
  message: string;
  severity: AlertProps["severity"];
}

export const Notification: React.FC<Props> = ({
  message,
  handleClose,
  open,
  severity,
}) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={open}
      autoHideDuration={3000}
      resumeHideDuration={3000}
      onClose={handleClose}
    >
      <MuiAlert severity={severity} elevation={6} variant="filled">
        {message}
      </MuiAlert>
    </Snackbar>
  );
};
