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
        },
        blockableButtonSecondary: {
            margin: "auto auto",
            marginLeft: "30px",
            '& .Mui-disabled': {
                backgroundColor: theme.palette.secondary.main,
                opacity: "75%",
            }
        },
        sceneContainerBox: {
            width: "100%",
            height: "100%",
            overflowY: "hidden",
            marginRight: "20px"
        },
        availableScenesBox: {
            overflowX: "hidden",
            height: "100%",
            marginLeft: "20px"
        },
        verticalButtonAlignContainer: {
            display: "flex"
        },
        alignedButton: {
            margin: "auto auto",
        },

    }),
);
