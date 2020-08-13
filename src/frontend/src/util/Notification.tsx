import React from "react";
import {
  Snackbar,
  IconButton,
  SnackbarContent,
  makeStyles,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DoneOutlinedIcon from "@material-ui/icons/DoneOutlined";
import { NotificationContent } from "./NotificationContent";
import ErrorOutlineOutlinedIcon from "@material-ui/icons/ErrorOutlineOutlined";

const useStyles = makeStyles({
  message: {
    padding: "0px",
  },
});

const Message_States = (message: string) => ({
  error: {
    style: { backgroundColor: "#e57373" },
    message: (
      <NotificationContent>
        <ErrorOutlineOutlinedIcon />
        <Typography style={{ marginLeft: "5px" }}>{message}</Typography>
      </NotificationContent>
    ),
  },
  success: {
    style: { backgroundColor: "#81c784" },
    message: (
      <NotificationContent>
        <DoneOutlinedIcon />
        <Typography style={{ marginLeft: "5px" }}>{message}</Typography>
      </NotificationContent>
    ),
  },
});

export type TMessageStates = "error" | "success";

export interface NotificationState {
  open: boolean;
  message: string;
  type: TMessageStates;
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
        type: "success",
      };
    case "reportError":
      return {
        open: true,
        message: action.message,
        type: "error",
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
  type: TMessageStates;
}

export const Notification: React.FC<Props> = ({
  message,
  handleClose,
  open,
  type,
}) => {
  const classes = useStyles();
  const settings = Message_States(message)[type];

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={open}
      autoHideDuration={3000}
      resumeHideDuration={3000}
      onClose={handleClose}
    >
      <SnackbarContent
        style={settings.style}
        message={settings.message}
        classes={classes}
        action={
          <React.Fragment>
            <IconButton size="small" color="inherit" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      />
    </Snackbar>
  );
};
