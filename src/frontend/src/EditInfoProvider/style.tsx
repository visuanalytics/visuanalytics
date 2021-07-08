import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        elementLargeMargin: {
            marginTop: "10px"
        },
        redButton: {
            color: '#FFFFFF',
            backgroundColor: theme.palette.error.main,
            '&:hover': {
                backgroundColor: theme.palette.error.dark,
            },
        },
        listFrame: {
            width: "100%",
            height: 400,
            overflow: 'auto',
            overflowX: "hidden",
            marginTop: "20px",
            marginBottom: "10px"
        },
        smallListFrame: {
            width: "100%",
            height: 170,
            overflow: 'auto',
            overflowX: "hidden",
            marginTop: "5px",
            marginBottom: "0px"
        },
        settings: {
            backgroundColor: theme.palette.secondary.main,
            color: "#000000",
            '&:hover': {
                backgroundColor: theme.palette.secondary.dark,
            }
        },
        delete: {
            backgroundColor: theme.palette.error.main,
            color: "#FFFFFF",
            marginLeft: 20,
            '&:hover': {
                backgroundColor: theme.palette.error.dark,
            }
        },
        formelBorder: {
            width: "50%",
            height: 100,
            overflow: 'auto',
            overflowX: 'hidden',
            borderColor: theme.palette.primary.dark,
            backgroundColor: theme.palette.secondary.main,
            color: "#000000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        formelNameBorder: {
            width: "100%",
            height: 100,
            overflow: 'auto',
            overflowX: "hidden",
            borderColor: theme.palette.primary.dark,
            backgroundColor: theme.palette.secondary.main,
            color: "#000000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        blockableButtonPrimary: {
            backgroundColor: theme.palette.error.main,
            color: "white",
        },
        blockableButtonSecondary: {
            '& .Mui-disabled': {
                backgroundColor: theme.palette.primary.light,
                opacity: "75%"
            }
        },
        listFrameData: {
            width: "80%",
            height: 400,
            overflow: 'auto',
            overflowX: "hidden",
            marginTop: "20px",
            marginBottom: "10px"
        },
        header: {
            color: theme.palette.primary.main
        },
        redDeleteButton: {
            color: '#FFFFFF',
            backgroundColor: theme.palette.error.main,
            '&:hover': {
                backgroundColor: theme.palette.error.dark,
            }
        },
        blockableButtonDelete: {
            '& .Mui-disabled': {
                backgroundColor: theme.palette.error.main,
                opacity: "60%"
            }
        },
        processingListingText: {
            overflowWrap: "break-word",
            paddingLeft: "0.8rem",
            paddingTop: "0.6rem"
        },
        wrappedText: {
            overflowWrap: "break-word",
        },
    }),
);
