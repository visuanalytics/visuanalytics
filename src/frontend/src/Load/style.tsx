import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    waringIcon: {
      fontSize: "50px",
      color: theme.palette.warning.light,
    },
    listBulletIcon: {
      fontSize: "1.5rem",
    },
    listBulletItem: {
      minWidth: "20px",
    },
    listItem: {
      paddingTop: "0px",
      paddingBottom: "0px",
    },
    text: {
      textAlign: "left",
    },
  })
);
