import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    jobCreateBox: {
        backgroundColor: 'white',
        textAlign: "center",
        border: "solid #b4b4b4 1px",
        borderRadius: "10px",
        width: '100%',
    },
    jobCreateHeader: {
        fontWeight: "normal",
        fontSize: "large"
    },
    paddingSmall: {
        padding: theme.spacing(3)
    },
    inputFields: {
        width: "45%"
    },
    centerDiv: {
        textAlign: "left",
        margin: "0 auto",
        width: 180
    }
}));