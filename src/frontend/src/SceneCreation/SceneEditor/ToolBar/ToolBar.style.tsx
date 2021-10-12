import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

export const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "grid",
      gridTemplateRows: "max-content auto",
      gap: "10px",
      color: theme.palette.primary.main,
      marginLeft: "10px",
      marginTop: "10px",
      height: "250px",
      width: "960px",
    },

    selection: {
      backgroundColor: "#FFFFFF",
      width: "150px",
      marginLeft: "10px",
    },
    buttonNumber: {
      width: "150px",
      marginLeft: "10px",
    },
    colorPicker: {
      display: "grid",
      gridRowStart: 1,
      gridRowEnd: 4,
    },
    actionBody: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "10px",
    },
  })
);
