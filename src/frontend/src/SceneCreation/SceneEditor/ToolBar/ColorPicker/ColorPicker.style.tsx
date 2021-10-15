import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

export const useColorPickerStyles = makeStyles((theme: Theme) =>
  createStyles({
    labels: {
      marginLeft: "10px",
      width: "100%",
    },
    buttonColor: {
      width: "150px",
      backgroundColor: "white",
      border: "1px solid white",
      borderRadius: "5px",
      padding: "5px",
      marginLeft: "10px",
    },
  })
);
