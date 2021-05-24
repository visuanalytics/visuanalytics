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
    }),
);
