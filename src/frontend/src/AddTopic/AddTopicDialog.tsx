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
}

export const AddTopicDialog: React.FC<Props> = ({
  open,
  onClose,
  getTopics,
}) => {
  const classes = useStyles();
  const topicNameRef = React.createRef<HTMLInputElement>();
  const topicConfigRef = React.createRef<HTMLInputElement>();
  const uploadTopic = useUploadTopic(getTopics);

  const handleAddTopic = () => {
    const topicName = topicNameRef.current?.value;
    const topicConfig = topicConfigRef.current?.files
      ? topicConfigRef.current?.files[0]
      : undefined;

    if (!topicName || !topicConfig) {
      console.log("error");
      return;
    }

    uploadTopic(topicName, topicConfig);

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
          />
          <input
            accept="application/json"
            className={classes.input}
            id="json-button-file"
            type="file"
            ref={topicConfigRef}
          />
          <label htmlFor="json-button-file">
            <ContinueButton className={classes.fileButton} component="span">
              JSON-Datei
            </ContinueButton>
          </label>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Abbrechen
        </Button>
        <Button onClick={handleAddTopic} color="primary">
          hinzufügen
        </Button>
      </DialogActions>
    </Dialog>
  );
};
