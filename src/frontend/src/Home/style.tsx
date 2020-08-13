import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: '20px',
        },
        margin: {
            margin: '30px auto',
        },
        infoIcon: {
            fontSize: "50px",
        },
        hintIcons: {
            color: "white"
        }
    }),
);