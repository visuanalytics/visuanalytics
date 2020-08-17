import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    jobCreateBox: {
        backgroundColor: 'white',
        textAlign: "center",
        border: "solid rgba(0, 0, 0, 0.12) 1px",
        borderRadius: "4px",
        width: '100%',
    },
    header: {
        fontWeight: "normal",
        fontSize: "large"
    },
    MPaddingTB: {
        paddingBottom: 15,
        paddingTop: 15
    },
    MPaddingB: {
        paddingBottom: 15,
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
    inputElement: {
      mozAppearance: "textfield",
      appearance: "textfield",
      webkitAppearance: "none",
      margin: 0,
    },
    expIcon: {
        marginRight: 5,
        float: "left"
    },
    centerDiv: {
        textAlign: "left",
        margin: "0 auto",
        maxWidth: "180px"
    },
    centerDivMedium: {
        textAlign: "left",
        margin: "0 auto",
        maxWidth: "500px",
        padding: "0px 24px"
    },
    checkboxParam: {
        display: "flex",
        justifyContent: "space-between",
        margin: 0
    },
    checkIcon: {
        fontSize: "50px",
        color: "#81c784",
    }
}));