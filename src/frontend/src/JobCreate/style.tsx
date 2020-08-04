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
    paddingM: {
        paddingTop: 15,
        paddingBottom: 15
    },
    paddingS: {
        paddingBottom: 10,
        paddingTop: 10
    },
    paddingXS: {
        paddingBottom: 5,
        paddingTop: 5
    },
    paddingBottomS: {
        paddingBottom: 10
    },
    paddingTopS: {
        paddingTop: 10
    },
    inputFields: {
        width: "45%"
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
    },
    checkboxParam: {
        display: "flex",
        justifyContent: "space-between",
        margin: 0
    }
}));