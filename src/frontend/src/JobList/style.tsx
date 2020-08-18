import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    inputFields: {
      margin: "5px",
      width: "90%",
    },
    button: {
      color: "white",
    },
    continue: {
      position: "absolute",
      bottom: 0,
      left: "50%",
    },
    continueButton: {
      position: "relative",
      margin: "auto",
      left: "-50%",
      marginBottom: "15%",
    },
    modalpaper: {
      padding: "20px",
      height: "90%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(25),
    },
    expIcon: {
      margin: "auto 20px",
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
    },
    inputButton: {
      padding: 0,
      width: "100%",
      justifyContent: "normal",
      textTransform: "none",
    },
    SPaddingTRB: {
      paddingTop: 10,
      paddingRight: 15,
      paddingBottom: 10,
    },
    MPaddingTB: {
      paddingBottom: 15,
      paddingTop: 15,
    },
    header: {
      fontWeight: "normal",
      fontSize: "large",
    },
    dialogContent: {
      maxHeight: "41rem",
      overflowY: "auto",
    },
    dialogPaper: {
      textAlign: "center",
      padding: "20px",
      minHeight: "560px",
      position: "relative",
    },
    dialogTitle: {
      paddingBottom: "0px",
    },
    dialogActions: {
      justifyContent: "center",
    },
  })
);

export const AccordionSummary = withStyles({
  root: {
    borderTop: "6px solid #C4C4C4",
    backgroundColor: "#2E97C5",
    minHeight: 40,
    color: "white",
    "&$expanded": {
      minHeight: 40,
    },
  },
  content: {
    margin: 0,
    "&$expanded": {
      margin: 0,
    },
  },
  expanded: {},
})(MuiAccordionSummary);
