import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            paddingTop: "20px",
            paddingBottom: "20px",
            marginTop: '20px',
            paddingLeft: '75px',
            paddingRight: '75px',
            borderColor: theme.palette.primary.main,
            border: "10px solid"
        },
        header: {
            margin: "7px",
            marginBottom: "15px",
            color: theme.palette.secondary.dark,
        },
        margin: {
            margin: "30px auto",
        },
    })
);
