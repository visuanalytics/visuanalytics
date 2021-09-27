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
      margin: "auto",
      height: "140px",
      overflow: "auto",
      overflowX: "hidden",
      marginTop: "10px",
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

    editorMain: {
      margin: "auto",
      backgroundColor: "#FFFFFF",
      padding: "10px",
      width: "960px",
      height: "540px",
    },

    editorCanvas: {
      backgroundColor: "rgb(255, 255, 255)",
      border: "solid 5px",
      borderColor: theme.palette.primary.main,
      width: "960px",
      height: "540px",
    },

    editorText: {
      position: "absolute",
      padding: "15px",
      border: "none",
      overflow: "hidden",
      background: "none",
      outline: "none",
      resize: "none",
      transformOrigin: "top left",
    },

    colorPicker: {
      display: "none",
    },

    rightButtons: {
      margin: "auto",
      marginTop: "10px",
      padding: "10px",
      width: "500px",
      height: "900px",
      backgroundColor: "white",
      border: "5px solid",
      borderColor: theme.palette.primary.main,
      align: "center",
      overflow: "auto",
    },

    button: {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      padding: "5px 15px",
      align: "center",
      display: "inline-block",
      fontSize: "16px",
      marginLeft: "10px",
      marginTop: "10px",
      transitionDuration: "0.4s",
      cursor: "pointer",
      borderRadius: "5px",
      width: "220px",
      "&:hover": {
        backgroundColor: theme.palette.primary.light,
      },
    },

    uploadButton: {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      padding: "5px 15px",
      textAlign: "center",
      align: "center",
      display: "inline-block",
      fontSize: "16px",
      marginLeft: "10px",
      marginTop: "10px",
      transitionDuration: "0.4s",
      cursor: "pointer",
      borderRadius: "5px",
      width: "220px",
      "&:hover": {
        backgroundColor: theme.palette.primary.light,
      },
    },

    input: {
      backgroundColor: theme.palette.primary.main,
      border: "2px solid white",
      color: "rgb(0, 0, 0)",
      padding: "5px",
      textAlign: "left",
      textDecoration: "none",
      display: "inline-block",
      fontSize: "16px",
      transitionDuration: "0.4s",
      borderRadius: "5px",
    },

    buttonColor: {
      width: "150px",
      backgroundColor: "white",
      border: "1px solid white",
      borderRadius: "5px",
      padding: "5px",
      marginLeft: "10px",
    },

    buttonNumber: {
      width: "150px",
      marginLeft: "10px",
    },

    buttonText: {
      width: "150px",
      marginLeft: "10px",
    },

    title: {
      width: "500px",
    },

    topButtons: {
      marginTop: "21px",
      backgroundColor: theme.palette.primary.main,
      color: "#FFFFFF",
      transitionDuration: "0.4s",
      height: "50px",
      "&:hover": {
        backgroundColor: theme.palette.primary.light,
        color: "#000000",
      },
    },
    saveButton: {
      marginTop: "21px",
      transitionDuration: "0.4s",
      height: "50px",
    },

    selection: {
      backgroundColor: "#FFFFFF",
      width: "150px",
      marginLeft: "10px",
    },

    option: {
      backgroundColor: theme.palette.primary.light,
      "&:hover": {
        backgroundColor: theme.palette.primary.light,
      },
    },

    lowerButtons: {
      color: theme.palette.primary.main,
      marginLeft: "10px",
      marginTop: "10px",
      height: "250px",
      width: "960px",
    },

    labels: {
      marginLeft: "10px",
      width: "100%",
    },

    showData: {
      margin: "10px",
    },

    checkBox: {
      margin: "auto",
      marginTop: "10px",
      marginLeft: "10px",
    },
    firstImage: {
      border: "3px solid black",
    },
    secondImage: {
      borderTop: "3px solid black",
      borderRight: "3px solid black",
      borderBottom: "3px solid black",
    },
    leftImage: {
      borderLeft: "3px solid black",
      borderRight: "3px solid black",
      borderBottom: "3px solid black",
    },
    rightImage: {
      borderRight: "3px solid black",
      borderBottom: "3px solid black",
    },
    fullWidthCollapse: {
      width: "100%",
    },
    imageInList: {
      height: "120px",
      width: "100%",
    },
    overflowButtonText: {
      overflowWrap: "break-word",
      width: "100%",
      textAlign: "left",
    },
    wrappedText: {
      overflowWrap: "break-word",
    },
  })
);
