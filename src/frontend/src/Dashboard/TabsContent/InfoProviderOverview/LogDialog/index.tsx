import React from "react";
import {useStyles} from "../../../style";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Tab, TableHead
} from "@material-ui/core";
import {LogEntry} from "../../../types";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

interface LogDialogProps {
    infoproviderID: number;
    infoproviderName: string;
    showLogDialog: boolean;
    setShowLogDialog: (showLogDialog: boolean) => void;
}

export const LogDialog: React.FC<LogDialogProps> = (props) => {
    const classes = useStyles();

    // Holds all log entries which will be fetched from the backend
    const [logMessages, setLogMessages] = React.useState<Array<LogEntry>>([]);

    // Holds the string with the traceback if the corresponding button is clicked in one of the table rows
    const [selectedTraceback, setSelectedTraceback] = React.useState("");

    // This state handles the opening of a second dialog which holds information about the selected traceback
    const [showTracebackDialog, setShowTracebackDialog] = React.useState(false);

    /**
     * This method is called when a user selects the traceback button of a log entry
     * It prepares the states to show the ordered traceback.
     * @param traceback The traceback which will be shown
     */
    const handleTracebackClick = (traceback: string) => {
        setSelectedTraceback(traceback);
        setShowTracebackDialog(true);
    }

    /**
     * This method will be called when the user exits the dialog which shows the traceback information
     */
    const closeTracebackDialog = () => {
        setSelectedTraceback("");
        setShowTracebackDialog(false);
    }

/**
* Renders one row for the table with logs
* Every row holds exactly one log entry
* @param entry The log entry that should be rendered
*/
    const renderTableRow = (entry: LogEntry) => {
        return (
            <TableRow key={entry.jobID}>
                <TableCell className={classes.logTableCell}>{entry.jobID}</TableCell>
                <TableCell className={classes.logTableCell}>{entry.state}</TableCell>
                <TableCell className={classes.logMessageTableCell}>{entry.errorMsg}</TableCell>
                <TableCell className={classes.logTableCell}>{entry.duration}</TableCell>
                <TableCell className={classes.logTableCell}>{entry.startTime}</TableCell>
<TableCell className={classes.logTableCell}>
<Button onClick={() => handleTracebackClick(entry.errorTraceback)}>
Traceback anzeigen
</Button>
</TableCell>
            </TableRow>
        );
    }

    return (
        <React.Fragment>
    <Dialog maxWidth={"md"} aria-labelledby="LogDialog-Title" open={props.showLogDialog} onClose={() => props.setShowLogDialog(false)}>
<DialogTitle id="LogDialog-Title" className={classes.wrappedText}>
        Logs für {props.infoproviderName}
</DialogTitle>
<DialogContent dividers>
<Grid container>
<Grid item xs={12}>
<Typography variant="body1" className={classes.wrappedText}>
Hier können Sie die Log-Daten für den Infoprovider "{props.infoproviderName}" einsehen.
</Typography>
</Grid>
<Grid item xs={12} className={classes.elementLargeMargin}>
    {logMessages.length > 0 &&
    <TableContainer component={Paper}>
        <Table aria-label="Log-Einträge">
            <TableHead>
                <TableRow>
                    <TableCell>Nr.</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Nachricht</TableCell>
                    <TableCell>Dauer</TableCell>
                    <TableCell>Startzeit</TableCell>
                    <TableCell>Traceback</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {logMessages.map((logEntry: LogEntry) => renderTableRow(logEntry))}
            </TableBody>
        </Table>
    </TableContainer>
    }
    {logMessages.length == 0 &&
        <Typography variant="body1">
            Es liegen keine Logs für diesen Infoprovider vor.
        </Typography>
    }
</Grid>
</Grid>
</DialogContent>
<DialogActions className={classes.elementLargeMargin}>
<Grid container justify="space-around">
<Grid item xs={12}>
<Button variant="contained" size="large" color="primary" onClick={() => props.setShowLogDialog(false)}>
schließen
</Button>
</Grid>
</Grid>
</DialogActions>
</Dialog>
            <Dialog maxWidth={"md"} aria-labelledby="TracebackDialog-Title" open={showTracebackDialog} onClose={() => closeTracebackDialog()}>
                <DialogTitle id="TracebackDialog-Title">
                    Traceback-Anzeige
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="body1">
                                {selectedTraceback}
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions className={classes.elementLargeMargin}>
                    <Grid container justify="space-between">
                        <Grid item xs={12}>
                            <Button variant="contained" size="large" color="primary" onClick={() => closeTracebackDialog()}>
                                schließen
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
