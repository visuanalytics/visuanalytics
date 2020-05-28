import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
    jobCreateBox: {
        textAlign: "center",
        border: "solid #b4b4b4 1px",
        width: 800,
    },
    jobCreateHeader: {
        fontWeight: "normal",
        fontSize: "x-large"
    },
    continueBtn: {
        color: "white",
        backgroundColor: "#2E97C5",
        "&:hover": {
            backgroundColor: "#00638D",
            borderColor: "#0062cc",
            boxShadow: "none",
        }
    },
    paddingSmall: {
        padding: "20px"
    }
});