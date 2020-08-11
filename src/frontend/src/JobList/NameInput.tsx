import { withStyles } from "@material-ui/core/styles";
import { InputBase } from "@material-ui/core";

export const NameInput = withStyles({
  root: {
    cursor: "pointer",
  },
  input: {
    padding: "0 8px",
    marginLeft: "8px",
    color: "white",
    fontSize: "1.5625rem",
  },
})(InputBase);
