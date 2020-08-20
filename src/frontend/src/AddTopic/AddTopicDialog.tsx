import React from "react";
import { useUploadTopic } from "../Hooks/useUploadTopic";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Paper,
} from "@material-ui/core";
import { useStyles } from "./style";
import { ContinueButton } from "../JobCreate/ContinueButton";

interface Props {
  open: boolean;
  onClose: () => void;
  getTopics: () => void;
  reportError: (message: string) => void;
  reportSuccess: (message: string) => void;
}

export const AddTopicDialog: React.FC<Props> = ({
  open,
  onClose,
  getTopics,
  reportError,
  reportSuccess,
}) => {
  const classes = useStyles();
  const topicNameRef = React.createRef<HTMLInputElement>();
  const topicConfigRef = React.createRef<HTMLInputElement>();
  const [nameError, setNameError] = React.useState(false);
  const [configError, setConfigError] = React.useState(false);

  const handleClose = () => {
    setNameError(false);
    setConfigError(false);
    onClose();
  };

  const handleUploadTopicSuccess = () => {
    getTopics();
    reportSuccess("Thema wurde erstellt");
  };

  const handleUploadTopicFailed = () => {
    reportError("Thema konnte nicht erstellt werden");
  };

  const uploadTopic = useUploadTopic(
    handleUploadTopicSuccess,
    handleUploadTopicFailed
  );

  const handleAddTopic = () => {
    const topicName = topicNameRef.current?.value;
    const topicConfig = topicConfigRef.current?.files
      ? topicConfigRef.current?.files[0]
      : undefined;

    // Reset Errors
    setNameError(false);
    setConfigError(false);

    if (!topicName) {
      reportError("Name des Themas fehlt");
      setNameError(true);
      return;
    }

    if (!topicConfig) {
      reportError("JSON-Datei fehlt");
      setConfigError(true);
      return;
    }

    uploadTopic(topicName, topicConfig);

    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Thema hinzufügen</DialogTitle>
      <DialogContent>
        <Paper variant="outlined" className={classes.paper}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            fullWidth
            variant="outlined"
            inputRef={topicNameRef}
            required
            error={nameError}
          />
          <input
            accept="application/json"
            className={classes.input}
            id="json-button-file"
            type="file"
            ref={topicConfigRef}
          />
          <label htmlFor="json-button-file">
            <ContinueButton
              style={{ boxShadow: configError ? undefined : "none" }}
              className={classes.fileButton}
              component="span"
            >
              JSON-Datei
            </ContinueButton>
          </label>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Abbrechen
        </Button>
        <Button onClick={handleAddTopic} color="primary">
          hinzufügen
        </Button>
      </DialogActions>
    </Dialog>
  );
};
