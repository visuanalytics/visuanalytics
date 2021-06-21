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
        blockableButtonPrimary: {
            '& .Mui-disabled': {
                backgroundColor: theme.palette.primary.main,
                opacity: "75%"
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
            height: "25rem",
            overflowY: "hidden",
            marginRight: "20px"
        },
        availableScenesBox: {
            overflowX: "hidden",
            height: "25rem",
            marginLeft: "20px"
        },
        verticalButtonAlignContainer: {
            display: "flex"
        },
        alignedButton: {
            margin: "auto auto",
        },
        listFrame: {
            width: "100%",
            height: 400,
            overflow: 'auto',
            overflowX: "hidden",
            marginTop: "20px",
            marginBottom: "10px"
        },
    }),
);
