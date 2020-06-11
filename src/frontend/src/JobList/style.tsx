import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {withStyles} from '@material-ui/core/styles';
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";

export const useStyles = makeStyles((theme: Theme) =>
        createStyles({
        root: {
            width: '100%',
        },
        inputFields: {
            margin: '5px',
            width: '90%'
        },
        button: {
            color: 'white',
        },
        heading: {
            fontSize: theme.typography.pxToRem(25),
            flexBasis: '84%',
            flexShrink: 0,
            margin: 'auto 20px',
        },
        expIcon: {
            margin: 'auto 20px'
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
        },
        inputButton: {
            padding: 0,
            width: '100%',
            justifyContent: 'normal',
        },
        backdropContent: {
            backgroundColor: 'white'
        },
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    }),
);

export const ExpansionPanelSummary = withStyles({
    root: {
        borderTop: '6px solid #C4C4C4',
        backgroundColor: '#2E97C5',
        minHeight: 40,
        color: 'white',
        '&$expanded': {
            minHeight: 40,
        },
    },
    content: {
        margin: 0,
        '&$expanded': {
            margin: 0,
        },
    },
    expanded: {},
})(MuiExpansionPanelSummary);