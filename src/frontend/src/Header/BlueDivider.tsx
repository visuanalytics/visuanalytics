import { withStyles, Theme } from "@material-ui/core/styles";
import { Divider } from "@material-ui/core";

export const BlueDivider = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: "#2E97C5",
    height: "0.5rem",
  },
}))(Divider) as typeof Divider;
