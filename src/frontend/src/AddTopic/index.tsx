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
  Link,
  Typography,
} from "@material-ui/core";
import { useFetchMultiple } from "../Hooks/useFetchMultiple";
import { Topic } from "../JobCreate/TopicSelection";
import { getUrl } from "../util/fetchUtils";
import GetAppIcon from "@material-ui/icons/GetApp";
import { useStyles } from "./style";
import { Load } from "../Load";
import { useCallFetch } from "../Hooks/useCallFetch";
import { DeleteDialog } from "../util/DeleteDialog";
import { InfoMessage } from "../util/InfoMessage";
import { AddTopicDialog } from "./AddTopicDialog";
import { Notification, notifcationReducer } from "../util/Notification";
import { hintContents } from "../util/hintContents";

export const AddTopic = () => {
  const classes = useStyles();

  const [message, dispatchMessage] = React.useReducer(notifcationReducer, {
    open: false,
    message: "",
    severity: "success",
  });

  const reportError = (message: string) => {
    dispatchMessage({ type: "reportError", message: message });
  };

  const reportSuccess = (message: string) => {
    dispatchMessage({ type: "reportSuccess", message: message });
  };

  const [loadFailed, setLoadFailed] = useState(false);
  const handleLoadFailed = useCallback(() => {
    setLoadFailed(true);
  }, [setLoadFailed]);

  const [topics, getTopics] = useFetchMultiple<Topic[]>(
    getUrl("/topics"),
    undefined,
    handleLoadFailed
  );
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState({
    open: false,
    topicId: -1,
  });

  const handleDeleteSuccess = () => {
    getTopics();
    reportSuccess("Thema wurde gelöscht");
  };

  const handleDeleteError = () => {
    reportError("Thema konnte nicht gelöscht werden");
  };

  const deleteTopic = useCallFetch(
    getUrl(`/topic`),
    { method: "DELETE" },
    handleDeleteSuccess,
    handleDeleteError
  );

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

  const handleConfirmDelete = (topicId: number) => {
    setConfirmDelete({ open: true, topicId: topicId });
  };

  const handleDelete = () => {
    deleteTopic(`/${confirmDelete.topicId}`);
  };

  const handleCloseDelete = () => {
    setConfirmDelete({ open: false, topicId: -1 });
  };

  return (
    <PageTemplate
      heading="Themen"
      action={{
        title: "Thema hinzufügen",
        Icon: <AddCircleIcon fontSize="large" />,
        onClick: handleOpen,
      }}
      hintContent={hintContents.addTopic}
    >
      <Load
        failed={{
          hasFailed: loadFailed,
          name: "Themen",
          onReload: handleReaload,
        }}
        data={topics}
      >
        <InfoMessage
          condition={topics?.length === 0}
          message={{
            headline: "Willkommen bei Ihrer Themen-Übersicht!",
            text: (
              <Typography align={"center"} color="textSecondary">
                Mit VisuAnalytics können Sie sich Videos zu bestimmten Themen
                generieren lassen.
                <br /> Klicken Sie auf 'Thema erstellen', um ein neues
                Thema anzulegen.
              </Typography>
            ),
            button: {
              text: "Neues Thema erstellen",
              onClick: handleOpen,
            },
          }}
        >
          <List>
            {topics?.map((topic) => (
              <ListItem
                divider
                key={topic.topicId}
                className={classes.listItem}
              >
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
                      href={getUrl(`/topic/${topic.topicId}`)}
                      target="_blank"
                      download
                    >
                      <GetAppIcon />
                    </Link>
                    <IconButton
                      onClick={() => handleConfirmDelete(topic.topicId)}
                      className={classes.listAction}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </InfoMessage>
        <AddTopicDialog
          open={open}
          onClose={handleClose}
          getTopics={getTopics}
          reportError={reportError}
          reportSuccess={reportSuccess}
        />
        <DeleteDialog
          title={`Thema löschen?`}
          open={confirmDelete.open}
          onClose={handleCloseDelete}
          onDelete={handleDelete}
        />
        <Notification
          handleClose={() => dispatchMessage({ type: "close" })}
          open={message.open}
          message={message.message}
          severity={message.severity}
        />
      </Load>
    </PageTemplate>
  );
};
