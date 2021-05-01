import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        elementMargin: {
            marginTop: "10px"
        },
        listFrame: {
            width: "100%",
            height: 400,
            overflow: 'auto',
            overflowX: "hidden",
            marginTop: "20px",
            marginBottom: "10px"
        }
    }),
);
