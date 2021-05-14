import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import HomeIcon from "@material-ui/icons/Home";

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
            overflowX: "hidden",
            marginTop: "20px",
            marginBottom: "10px"
        },
        infoProvBorder: {
            width: "50%",
            height: 28,
            overflow: 'auto',
            overflowX: "hidden",
            marginTop: "20px",
            marginBottom: "10px",
            borderColor: theme.palette.secondary.main
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
        test: {
            height: 75
        }
    }),
);
