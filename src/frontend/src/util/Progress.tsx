// Code mostly from https://material-ui.com/components/progress/#customized-progress
import {
  makeStyles,
  Theme,
  createStyles,
  CircularProgress,
  Box,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
    },
    bottom: {
      color: theme.palette.grey[300],
    },
    top: {
      color: "#2E97C5",
      animationDuration: "600ms",
      position: "absolute",
    },
    circle: {
      strokeLinecap: "round",
    },
  })
);

export const Progress = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root} display="flex" justifyContent="center">
      <CircularProgress
        variant="determinate"
        className={classes.bottom}
        size={40}
        thickness={4}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={40}
        thickness={4}
      />
    </Box>
  );
};
