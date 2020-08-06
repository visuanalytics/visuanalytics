import React from "react";
import Dialog from "@material-ui/core/Dialog";
import {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export const LogErrorDialog: React.FC<Props> = ({
  open,
  onClose,
  title,
  content,
}) => {
  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} scroll="body">
      {" "}
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText
          style={{ whiteSpace: "pre-wrap" }}
          tabIndex={-1}
          color="error"
        >
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>schließen</Button>
      </DialogActions>
    </Dialog>
  );
};
