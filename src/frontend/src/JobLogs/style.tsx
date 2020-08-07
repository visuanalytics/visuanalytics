import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableCell: {
      borderBottom: "none",
      padding: "6px 10px 6px 10px",
    },
    card: {
      borderWidth: "2px",
    },
    cardContent: {
      padding: "18px 16px 18px 16px !important",
    },
    errorIcon: {
      fontSize: "40px",
      color: theme.palette.error.light,
    },
    runningIcon: {
      fontSize: "40px",
      animation:
        "MuiCircularProgress-keyframes-circular-rotate 1.4s linear infinite reverse",
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
    durationText: {
      height: "max-content",
    },
    durationIcon: {
      color: "#6b6c68",
    },
    errorBox: {
      border: "1px solid rgba(0, 0, 0, 0.12)",
      borderRadius: "4px",
    },
    errorText: {
      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
      whiteSpace: "pre-wrap",
    },
  })
);
