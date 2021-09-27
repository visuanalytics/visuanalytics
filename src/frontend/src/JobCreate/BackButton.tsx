import { withStyles, Theme } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

export const BackButton = withStyles((theme: Theme) => ({
  root: {
    width: 120,
    color: "white",
    backgroundColor: "#bcbcbc",
    "&:hover": {
      backgroundColor: "#909090",
      borderColor: "#0062cc",
      boxShadow: "none",
    },
  },
}))(Button) as typeof Button;
