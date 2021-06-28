import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        elementLargeMargin: {
            marginTop: "10px",
        },
        elementExtraLargeMargin: {
            marginTop: "20px"
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
        blockableButtonPrimaryMarginTop: {
            marginTop: "10px",
            '& .Mui-disabled': {
                backgroundColor: theme.palette.primary.main,
                opacity: "75%"
            }
        },
        alignLeftButton: {
            margin: "auto auto",
        },
        verticalAlignBlockableButtonPrimary: {
            display: "flex",
            '& .Mui-disabled': {
                backgroundColor: theme.palette.primary.main,
                opacity: "75%"
            }
        },
        alignRightButton: {
            margin: "auto auto",
            marginLeft: "30px",
        },
        blockableButtonSecondary: {
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
        listFrame: {
            width: "100%",
            height: 400,
            overflow: 'auto',
            overflowX: "hidden",
            marginTop: "20px",
            marginBottom: "10px",
        },
        editDialogListFrame: {
            width: "100%",
            height: 400,
            overflow: 'auto',
            overflowX: "hidden",
            marginTop: "20px",
            marginBottom: "10px",
            margin: "auto",
            padding: "20px"
        },
        elementSmallMargin: {
            marginTop: "5px"
        },
        fixedWarningContainer: {
            height: "65px"
        },
        greyDivider: {
            marginTop: "20px",
            height: "3px",
            backgroundColor: "grey"
        },
        overflowButtonText: {
            overflowWrap: "break-word",
            width: "100%",
            textAlign: "left"
        },
        categoryText: {
            fontSize: "1.1rem",
            fontWeight: "bold"
        }
    }),
);
