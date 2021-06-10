import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        elementLargeMargin: {
            marginTop: "10px"
        },
        redDeleteIcon: {
            color: theme.palette.error.main,
            '&:hover': {
                color: theme.palette.error.dark,
            }
        }
    }),
);
