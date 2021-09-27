import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { JobList } from "../JobList";
import { useStyles } from "./style";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { ComponentContext } from "../ComponentProvider";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { ExpandMore } from "@material-ui/icons";
import { PageTemplate } from "../PageTemplate";

export const Home = () => {
  const classes = useStyles();
  const components = React.useContext(ComponentContext);
  return (
    <PageTemplate
      heading="Job-Pool"
      action={{
        title: "Job erstellen",
        Icon: <AddCircleIcon fontSize="large" />,
        onClick: () => components?.setCurrent("jobPage"),
      }}
      hintContent={
        <div>
          <Typography variant="h5" gutterBottom>
            Job-Pool
          </Typography>
          <Typography>
            Auf dieser Seite haben Sie eine Übersicht über die angelegten Jobs.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon className={classes.hintIcons}>
                <AddCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Neuen Job erstellen" />
            </ListItem>
            <ListItem>
              <ListItemIcon className={classes.hintIcons}>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary="Job bearbeiten" />
            </ListItem>
            <ListItem>
              <ListItemIcon className={classes.hintIcons}>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText primary="Job löschen" />
            </ListItem>
            <ListItem>
              <ListItemIcon className={classes.hintIcons}>
                <ExpandMore />
              </ListItemIcon>
              <ListItemText primary="Job-Informationen ausklappen" />
            </ListItem>
          </List>
        </div>
      }
    >
      <JobList />
    </PageTemplate>
  );
};
