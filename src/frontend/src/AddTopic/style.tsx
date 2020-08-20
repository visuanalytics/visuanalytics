import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      display: "none",
    },
    fileButton: {
      marginTop: "20px",
      border: `2px solid`,
      boxShadow: `inset 0px 0px 0px 2px ${theme.palette.error.light}`,
    },
    listItem: {
      borderRadius: "4px",
      background: theme.palette.primary.main,
      marginBottom: "15px",
    },
    listAction: {
      color: "white",
    },
    text: {
      width: "60%",
      color: "white",
    },
    paper: {
      padding: "20px",
    },
  })
);
