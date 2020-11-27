import { withStyles, Theme } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

export const ContinueButton = withStyles((theme: Theme) => ({
    root: {
        width: 120,
        color: "white",
        backgroundColor: "#2E97C5",
        "&:hover": {
            backgroundColor: "#00638D",
            borderColor: "#0062cc",
            boxShadow: "none",
        }
    }
}))(Button) as typeof Button;