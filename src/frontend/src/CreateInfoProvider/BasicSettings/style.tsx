import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        stepPaper: {
            padding: '0 0 20px',
            zIndex: 0,
            position: 'relative'
        },
        paper: {
            padding: '20px',
        },
        margin: {
            margin: '0 auto',
        },
        additionalParams: {
            width: "80%",
            margin: "auto",
            marginTop: "15px",
            marginBottom: "15px",
            borderColor: theme.palette.primary.main,
            border: "2px solid",
            borderRadius: "5px",
            padding: "15px"
        },
        elementMargin: {
            marginTop: "5px"
        },
        addParamButton: {
            marginTop: "12px"
        },
        newParamInput: {
            marginLeft: "10px",
            marginRight: "5px",
        },
        blockableButtonPrimary: {
            '& .Mui-disabled': {
                backgroundColor: theme.palette.primary.main,
                opacity: "75%"
            }
        },
        blockableButtonSecondary: {
            '& .Mui-disabled': {
                backgroundColor: theme.palette.secondary.main,
                opacity: "75%"
            }
        }
}),
);
