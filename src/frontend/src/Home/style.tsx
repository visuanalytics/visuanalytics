import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: '0 0 20px',
            zIndex: 0,
            position: 'relative'
        },
        margin: {
            margin: '0 auto',
        },
        infoIcon: {
            fontSize: "50px",
        },
        hintIcons: {
            color: "white"
        }
    }),
);