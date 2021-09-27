import { withStyles, Theme } from "@material-ui/core/styles";
import { Divider } from "@material-ui/core";

export const GreyDivider = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: "#b4b4b4",
    height: "0.2rem",
  },
}))(Divider) as typeof Divider;
