import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    elementSmallMargin: {
      marginTop: "5px",
    },
    elementLargeMargin: {
      marginTop: "10px",
    },
    elementExtraLargeMargin: {
      marginTop: "20px",
    },
    listFrame: {
      width: "100%",
      height: 400,
      overflow: "auto",
      overflowX: "hidden",
      marginTop: "20px",
      marginBottom: "10px",
    },
    choiceListFrame: {
      width: "90%",
      height: "150px",
      overflow: "auto",
      overflowX: "hidden",
      marginTop: "20px",
      marginBottom: "10px",
      padding: "10px",
      paddingTop: "0px",
    },
    blockableButtonPrimary: {
      "& .Mui-disabled": {
        backgroundColor: theme.palette.primary.main,
        opacity: "75%",
      },
    },
    blockableButtonSecondary: {
      "& .Mui-disabled": {
        backgroundColor: theme.palette.secondary.main,
        opacity: "75%",
      },
    },
    redDeleteIcon: {
      color: theme.palette.error.main,
    },
    redDeleteButton: {
      color: "#FFFFFF",
      backgroundColor: theme.palette.error.main,
      "&:hover": {
        backgroundColor: theme.palette.error.dark,
      },
    },
    centeredText: {
      marginTop: "43%",
    },
    colorTool: {
      width: "70%",
      height: "80%",
    },
    creatorFormControlLabel: {
      pointerEvents: "none",
      marginLeft: "5px",
    },
    creatorFormControlLabelWide: {
      pointerEvents: "none",
      marginLeft: "5px",
      marginRight: "20px",
      width: "100%",
      align: "left",
    },
    inputFieldWithLabel: {
      pointerEvents: "auto",
      marginLeft: "10px",
    },
    inputFieldWithLabelWide: {
      pointerEvents: "auto",
      marginLeft: "10px",
      width: "89%",
    },
    amountChoiceContainer: {
      marginRight: "20px",
    },
    amountWarningContainer: {
      paddingTop: "10px",
    },
    intervalInputField: {
      pointerEvents: "auto",
      marginLeft: "10px",
      width: "4.8em",
    },
    intervalChoiceRightLabel: {
      paddingTop: "1.75em",
      marginRight: "5px",
    },
    wrappedText: {
      overflowWrap: "break-word",
    },
    wrappedLabel: {
      "& .MuiFormControlLabel-label": {
        overflowWrap: "break-word",
        width: "19em",
      },
    },
  })
);
