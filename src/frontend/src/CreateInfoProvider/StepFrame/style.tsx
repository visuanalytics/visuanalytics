import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            paddingTop: "20px",
            paddingBottom: "20px",
            marginTop: '72px',
            paddingLeft: '75px',
            paddingRight: '75px',
        },
        header: {
            margin: "7px",
        },
        margin: {
            margin: "30px auto",
        },
        button: {
            margin: theme.spacing(1),
            color: "#2E97C5",
        },
    })
);
