import React from "react";
import {useStyles} from "../../../style";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, TableHead
} from "@material-ui/core";
import {LogEntry, StatusMessage} from "../../../types";
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
        message: "Generieren der historisierten Daten ist fehlgeschlagenaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa."
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
                <TableCell className={classes.logTableCell}>{entry.logID}</TableCell>
                <TableCell className={classes.logTableCell}>{entry.logDate}</TableCell>
                <TableCell className={classes.logTableCell}>{entry.logTime}</TableCell>
                <TableCell className={classes.logTableCell}>{getReadableStatus(entry.status)}</TableCell>
                <TableCell className={classes.logMessageTableCell}>{entry.message}</TableCell>
            </TableRow>
        );
    }


    return (
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
                        <TableContainer component={Paper}>
                            <Table aria-label="Log-Einträge">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nr.</TableCell>
                                        <TableCell>Datum</TableCell>
                                        <TableCell>Uhrzeit</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Nachricht</TableCell>
                                    </TableRow>
                                </TableHead>
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
