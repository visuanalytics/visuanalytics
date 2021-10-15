import { withStyles, Theme } from "@material-ui/core/styles";
import { Divider } from "@material-ui/core";

export const BlueDivider = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    height: "0.5rem",
  },
}))(Divider) as typeof Divider;
