import React from "react";
import {useStyles} from "../../../style";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Tab
} from "@material-ui/core";
import {LogEntry, StatusMessage} from "../../../types";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {log} from "util";

interface LogDialogProps {
    infoproviderID: number;
    infoproviderName: string;
    showLogDialog: boolean;
    setShowLogDialog: (showLogDialog: boolean) => void;
}

export const LogDialog: React.FC<LogDialogProps> = (props) => {
    const classes = useStyles();

    const [logMessages, setLogMessages] = React.useState<Array<LogEntry>>([{
        logID: 1,
        status: "success",
        logDate: "01.07.2021",
        logTime: "12:03",
        message: "Daten wurden historisiert."
    }, {
        logID: 2,
        status: "error",
        logDate: "30.06.2021",
        logTime: "12:03",
        message: "Generieren der historisierten Daten ist fehlgeschlagen."
    }]);

    const getReadableStatus = (status: StatusMessage) => {
        switch (status) {
            case "success":
                return "Erfolgreich";
            case "warning":
                return "Warnung";
            case "error": return "Fehler";
            default:
                return "Unbekannter Status";
        }
    }

    const renderTableRow = (entry: LogEntry) => {
        return (
            <TableRow key={entry.logID}>
                <TableCell>{entry.logID}</TableCell>
                <TableCell>{entry.logDate}</TableCell>
                <TableCell>{entry.logTime}</TableCell>
                <TableCell>{getReadableStatus(entry.status)}</TableCell>
                <TableCell>{entry.message}</TableCell>
            </TableRow>
        );
    }


    return (
        <Dialog aria-labelledby="LogDialog-Title" open={props.showLogDialog} onClose={() => props.setShowLogDialog(false)}>
            <DialogTitle id="LogDialog-Title">
                Logs für {props.infoproviderName}
            </DialogTitle>
            <DialogContent dividers>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            Hier können Sie die Log-Daten für den Infoprovider {props.infoproviderName} einsehen.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table aria-label="Log-Einträge">
                                <TableBody>
                                    {logMessages.map((logEntry: LogEntry) => renderTableRow(logEntry))}
                                </TableBody>
                            </Table>
                        </TableContainer>
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
    );
}