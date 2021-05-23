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
        }
    }),
);
