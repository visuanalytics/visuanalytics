import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    stepPaper: {
      padding: "0 0 20px",
      zIndex: 0,
      position: "relative",
    },
    paper: {
      padding: "20px",
    },
    margin: {
      margin: "0 auto",
    },
    infoIcon: {
      fontSize: "50px",
    },
    hintIcons: {
      color: "white",
    },
  })
);
