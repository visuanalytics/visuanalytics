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
    MPaddingTB: {
        paddingBottom: 15,
        paddingTop: 15
    },
    SPaddingTB: {
        paddingTop: 10,
        paddingBottom: 10
    },
    XSPaddingTB: {
        paddingTop: 5,
        paddingBottom: 5
    },
    SPaddingB: {
        paddingBottom: 10
    },
    SPaddingT: {
        paddingTop: 10
    },
    inputFields: {
        width: "45%"
    },
    expIcon: {
        marginRight: 5,
        float: "left"
    },
    centerDiv: {
        textAlign: "left",
        margin: "0 auto",
        width: 180
    },
    centerDivMedium: {
        textAlign: "left",
        margin: "0 auto",
        width: 500,
    }
}));