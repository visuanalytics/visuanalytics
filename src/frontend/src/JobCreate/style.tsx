import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
    jobCreateBox: {
        textAlign: "center",
        border: "solid #b4b4b4 1px",
        borderRadius: "10px",
        width: 800,
    },
    jobCreateHeader: {
        fontWeight: "normal",
        fontSize: "large"
    },
    paddingSmall: {
        padding: theme.spacing(3)
    },
    inputField: {
        width: 300
    }
}));