import React from "react";
import { Container, Paper } from "@material-ui/core";
import { useStyles } from "../Home/style";
import JobCreate from "../JobCreate";

export const JobPage = () => {
  const classes = useStyles();
  return (
    <Container maxWidth={"md"} className={classes.margin}>
      <Paper elevation={0} className={classes.stepPaper}>
        <JobCreate />
      </Paper>
    </Container>
  );
};
