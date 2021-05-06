import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {green} from "@material-ui/core/colors";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        elementLargeMargin: {
            marginTop: "10px"
        },
        header: {
            color: theme.palette.primary.main
        },
        listFrame: {
            width: "100%",
            height: 100,
            overflow: 'auto',
            overflowX: "hidden",
            marginTop: "20px",
            marginBottom: "10px"
        },
        listFrameData: {
            width: "80%",
            height: 400,
            overflow: 'auto',
            overflowX: "hidden",
            marginTop: "20px",
            marginBottom: "10px"
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
        }
    }),
);
