import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        elementSmallMargin: {
            marginTop: "5px"
        },
        elementLargeMargin: {
            marginTop: "10px"
        },
        elementExtraLargeMargin: {
            marginTop: "20px"
        },
        listFrame: {
            width: "100%",
            height: 400,
            overflow: 'auto',
            overflowX: "hidden",
            marginTop: "20px",
            marginBottom: "10px"
        },
        choiceListFrame: {
            width: "60%",
            height: "220px",
            overflow: 'auto',
            overflowX: "hidden",
            marginTop: "10px",
            padding: "10px",
            paddingTop: "0px"
        },
        blockableButtonPrimary: {
            '& .Mui-disabled': {
                backgroundColor: theme.palette.primary.main,
                opacity: "75%"
            }
        },
        blockableButtonSecondary: {
            '& .Mui-disabled': {
                backgroundColor: theme.palette.secondary.main,
                opacity: "75%"
            }
        },
        redDeleteIcon: {
            color: theme.palette.error.main
        },
        redDeleteButton: {
            color: '#FFFFFF',
            backgroundColor:  theme.palette.error.main,
            '&:hover': {
                backgroundColor: theme.palette.error.dark,
            },
        },
        centeredText: {
            marginTop: "43%",
        },
        colorTool: {
            width: "70%",
            height: "80%"
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
            align: "left"
        },
        inputFieldWithLabel: {
            pointerEvents: "auto",
            marginLeft: "10px",
        },
        inputFieldWithLabelWide: {
            pointerEvents: "auto",
            marginLeft: "10px",
            width: "89%"
        },
        amountChoiceContainer: {
            marginRight: "20px"
        },
        amountWarningContainer: {
            paddingTop: "10px"
        },
        intervalInputField: {
            pointerEvents: "auto",
            marginLeft: "10px",
            width: "4.8em"
        },
        intervalChoiceRightLabel: {
            paddingTop: "1.75em", marginRight: "5px"
        },

        editorMain: {
            margin: "auto",
            backgroundColor: "#FFFFFF",
            padding: "10px",
            width: "960px",
            height: "540px"
        },

        editorCanvas: {
            
            backgroundColor: "rgb(255, 255, 255)",
            border: "solid 5px",
            borderColor: theme.palette.primary.main,
            width: "960px",
            height: "540px"
        },
        
        editorText: {
            position: "absolute",
            padding: "15px",
            margin: "0px",
            border: "none",
            overflow: "hidden",
            background: "none",
            outline: "none",
            resize: "none",
            transformOrigin: "top left",
        },
    
        colorPicker:{
            display: "none",
        },

        buttonArea: {
            margin: "auto",
            marginTop: "10px",
            padding: "10px",
            width: "500px",
            height: "520px",
            backgroundColor: "rgb(223, 223, 223)",
            border: "5px solid",
            borderColor: theme.palette.primary.main,
        },

        button: {
            backgroundColor: "#ccc",
            border: "2px solid #666666",
            color: "rgb(0, 0, 0)",
            padding: "5px 15px",
            align: "center",
            textDecoration: "none",
            display: "inline-block",
            fontSize: "16px",
            margin: "4px 2px",
            transitionDuration: "0.4s",
            cursor: "pointer",
            borderRadius: "5px",
            width: "250px",
            '&:hover': {
                backgroundColor: "rgb(206, 195, 255)",
            }
        },
    
        input: {
        backgroundColor: "#eee",
        border: "2px solid #666666",
        color: "rgb(0, 0, 0)",
        padding: "5px",
        textAlign: "left",
        textDecoration: "none",
        display: "inline-block",
        fontSize: "16px",
        margin: "4px 2px",
        transitionDuration: "0.4s",
        borderRadius: "5px",
        },
    
        buttonColor: {
            width: "90px",
        },
    
        buttonNumber: {
            width: "60px",
        },
    
        buttonText: {
        width: "235px",
        },
    })
);