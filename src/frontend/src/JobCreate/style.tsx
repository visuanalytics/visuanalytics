import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
    jobCreateBox: {
        textAlign: "center",
        border: "solid #b4b4b4 1px",
        width: 800,
    },
    jobCreateHeader: {
        fontWeight: "normal",
        fontSize: "x-large"
    },
    paddingSmall: {
        padding: theme.spacing(3)
    }
}));