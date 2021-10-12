import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

export const useActionHeaderStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "grid",
      gridAutoFlow: "column",
    },
    button: {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      padding: "5px 15px",
      align: "center",
      display: "inline-block",
      fontSize: "16px",
      marginLeft: "10px",
      marginTop: "10px",
      transitionDuration: "0.4s",
      cursor: "pointer",
      borderRadius: "5px",
      width: "220px",
      "&:hover": {
        backgroundColor: theme.palette.primary.light,
      },
    },
  })
);
