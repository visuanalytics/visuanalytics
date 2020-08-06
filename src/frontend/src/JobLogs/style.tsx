import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: "20px",
    },
    header: {
      margin: "7px",
    },
    margin: {
      margin: "30px auto",
    },
    card: {
      margin: theme.spacing(1),
    },
    errorIcon: {
      fontSize: "40px",
      color: theme.palette.error.light,
    },
    runningIcon: {
      fontSize: "40px",
      animation:
        "MuiCircularProgress-keyframes-circular-rotate 1.4s linear infinite",
      color: theme.palette.grey[600],
    },
    finishedIcon: {
      fontSize: "40px",
      color: theme.palette.success.light,
    },
    unownIcon: {
      fontSize: "40px",
      color: theme.palette.grey[500],
    },
  })
);
