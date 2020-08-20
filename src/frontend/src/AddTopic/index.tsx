import React, { useState, useCallback } from "react";
import { PageTemplate } from "../PageTemplate";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  List,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Paper,
  Link,
} from "@material-ui/core";
import { useFetchMultiple } from "../Hooks/useFetchMultiple";
import { Topic } from "../JobCreate/TopicSelection";
import { getUrl } from "../util/fetchUtils";
import GetAppIcon from "@material-ui/icons/GetApp";
import { ContinueButton } from "../JobCreate/ContinueButton";
import { useStyles } from "./style";
import { Load } from "../Load";
import { useCallFetch } from "../Hooks/useCallFetch";

export const AddTopic = () => {
  const classes = useStyles();

  const [loadFailed, setLoadFailed] = useState(false);
  const handleLoadFailed = useCallback(() => {
    setLoadFailed(true);
  }, [setLoadFailed]);

  const [topics, getTopics] = useFetchMultiple<Topic[]>(
    getUrl("/topics"),
    undefined,
    handleLoadFailed
  );
  const deleteTopic = useCallFetch(
    getUrl("/topic/1"),
    { method: "DELETE" },
    getTopics
  );
  const getTopicFile = useCallFetch(getUrl("/topic/1"));
  const [open, setOpen] = useState(false);

  //const t = window.navigator.msSaveBlob(new Blob());

  const handleReaload = () => {
    setLoadFailed(false);
    getTopics();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <PageTemplate
      heading="Themen"
      action={{
        title: "Thema hinzufügen",
        Icon: <AddCircleIcon fontSize="large" />,
        onClick: handleOpen,
      }}
      hintContent=""
    >
      <Load
        failed={{
          hasFailed: loadFailed,
          name: "Themen",
          onReload: handleReaload,
        }}
        data={topics}
      >
        <List>
          {topics?.map((topic) => (
            <ListItem divider key={topic.topicId} className={classes.listItem}>
              <ListItemText
                primary={topic.topicName}
                secondary={topic.topicInfo}
                primaryTypographyProps={{
                  className: classes.text,
                  variant: "h6",
                }}
                secondaryTypographyProps={{
                  className: classes.text,
                }}
              />
              <ListItemSecondaryAction>
                <Grid container>
                  {/* The download does not work in development mode, because requests accepting html are not forwarded by the proxy*/}
                  <Link
                    className={classes.listAction}
                    component={IconButton}
                    href={getUrl("/topic/1")}
                    target="_blank"
                    download
                  >
                    <GetAppIcon />
                  </Link>
                  <IconButton
                    onClick={deleteTopic}
                    className={classes.listAction}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
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
              />
              <input
                accept="application/json"
                className={classes.input}
                id="json-button-file"
                type="file"
              />
              <label htmlFor="json-button-file">
                <ContinueButton className={classes.fileButton} component="span">
                  JSON-Datei
                </ContinueButton>
              </label>
            </Paper>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Abbrechen
            </Button>
            <Button onClick={handleClose} color="primary">
              hinzufügen
            </Button>
          </DialogActions>
        </Dialog>
      </Load>
    </PageTemplate>
  );
};
