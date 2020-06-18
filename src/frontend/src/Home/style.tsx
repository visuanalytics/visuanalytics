import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: '20px',
        },
        header: {
            margin: '7px',
        },
        margin: {
            margin: '30px auto',
        },
        button: {
            margin: theme.spacing(1),
            color: '#2E97C5'
        },
    }),
);