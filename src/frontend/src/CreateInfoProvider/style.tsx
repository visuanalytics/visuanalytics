import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        weekdaySelected: {
            backgroundColor: theme.palette.primary.dark
        },
        elementSmallMargin: {
            marginTop: "5px"
        },
        elementLargeMargin: {
            marginTop: "10px"
        },
        elementExtraLargeMargin: {
            marginTop: "25px"
        },
        listFrame: {
            width: "100%",
            height: 400,
            overflow: 'auto',
            overflowX: "hidden",
            marginTop: "20px",
            marginBottom: "10px"
        },
        mediumListFrame: {
            width: "100%",
            height: 250,
            overflow: 'auto',
            overflowX: "hidden",
            marginTop: "5px",
            marginBottom: "0px"
        },
        smallListFrame: {
            width: "100%",
            height: 170,
            overflow: 'auto',
            overflowX: "hidden",
            marginTop: "5px",
            marginBottom: "0px"
        },
        apiInput: {
            color: theme.palette.primary.main
        },
        stepPaper: {
            padding: '0 0 20px',
            zIndex: 0,
            position: 'relative'
        },
        paper: {
            padding: '20px',
        },
        margin: {
            margin: '0 auto',
        },
        additionalParams: {
            width: "80%",
            margin: "auto",
            marginTop: "15px",
            marginBottom: "15px",
            borderColor: theme.palette.primary.main,
            border: "2px solid",
            borderRadius: "5px",
            padding: "15px"
        },
        addParamButton: {
            marginTop: "12px"
        },
        newParamInput: {
            marginLeft: "10px",
            marginRight: "5px",
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
        blockableButtonDelete: {
            '& .Mui-disabled': {
                backgroundColor: theme.palette.error.main,
                opacity: "60%"
            }
        },
        redDeleteButton: {
            color: '#FFFFFF',
            backgroundColor: theme.palette.error.main,
            '&:hover': {
                backgroundColor: theme.palette.error.dark,
            }
        },
        redDeleteIcon: {
            color: theme.palette.error.main
        },
        header: {
            color: theme.palette.primary.main
        },
        listFrameData: {
            width: "80%",
            height: 400,
            overflow: 'auto',
            overflowX: "hidden",
            marginTop: "20px",
            marginBottom: "10px"
        },
        tinyListFrame: {
            width: "100%",
            height: 100,
            overflow: 'auto',
            overflowX: "hidden",
            marginTop: "20px",
            marginBottom: "10px"
        },
        historizedOverviewContainer: {
            marginTop: "10px",
            height: "100%"
        },
        typographyLineBreak: {
            overflowWrap: "break-word"
        },
        processingListingText: {
            overflowWrap: "break-word",
            paddingLeft: "0.8rem",
            paddingTop: "0.6rem"
        },
        radioButtonListWrapText: {
            overflowWrap: "break-word",
            marginTop: "0.5rem",
            paddingRight: "0.1rem"
        },
        dataSelectionListItem: {
            marginTop: "10px",
        },
        dataSelectionCheckboxItem: {
            width: "20px"
        },
        overflowButtonText: {
            overflowWrap: "break-word",
            width: "100%",
            textAlign: "left"
        },
        customDataSelectionTitle: {
            marginTop: "0.5rem",
            marginLeft: "1.5rem"
        },
        wrappedText: {
            overflowWrap: "break-word"
        }
    })
);
