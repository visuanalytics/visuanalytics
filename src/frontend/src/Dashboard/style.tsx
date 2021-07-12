import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        elementLargeMargin: {
            marginTop: "10px"
        },
        root: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.paper,
        },
        listFrame: {
            width: "100%",
            height: 350,
            overflow: 'auto',

            marginTop: "20px",
            marginBottom: "10px",
            color: theme.palette.primary.main
        },
        infoProvBorder: {
            width: "90%",
            minHeight: "60px",
            borderColor: theme.palette.primary.dark,
            backgroundColor: theme.palette.secondary.main,
            color: "#000000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        infoProvIconContainer: {
            height: "70px",
            marginTop: "2px"
        },
        tab: {
            width: "80%",
            backgroundColor: theme.palette.primary.light,
            color: "#000000",
            '& .Mui-selected': {
                backgroundColor: theme.palette.primary.dark,
                color: "#FFFFFF"
            },
            '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.secondary.main,
                height: 5
            }
        },
        tabs: {
           height: 75
        },
        settings: {
            width: "100%",
            justifyContent: "flex-start",
            backgroundColor: theme.palette.secondary.main,
            color: "#000000",
            '&:hover': {
                backgroundColor: theme.palette.secondary.dark,
            }
        },
        logs: {
            width: "100%",
            justifyContent: "flex-start",
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
        infoProvName: {
            margin: "auto"
        },
        redDeleteButton: {
            color: '#FFFFFF',
            backgroundColor: theme.palette.error.main,
            '&:hover': {
                backgroundColor: theme.palette.error.dark,
            },
        },
        wrappedText: {
            overflowWrap: "break-word"
        },
        logTableCell: {
            width: "2em",
            overflowWrap: "break-word"
        },
        //TODO: document that this maxWidth is probably "abusing" some kind of CSS things happening
        logMessageTableCell: {
            maxWidth: '1em',
            overflowWrap: "break-word"
        }
    }),
);
