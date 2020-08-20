import { withStyles, Theme } from "@material-ui/core/styles";
import { FormControlLabel } from "@material-ui/core";

export const BooleanParam = withStyles((theme: Theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    margin: 0,
  },
}))(FormControlLabel) as typeof FormControlLabel;
