import React, {useEffect, useRef} from "react";
import {useStyles} from "../style";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, TableHead
} from "@material-ui/core";
import {LogEntry} from "../types";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

interface LogDialogProps {
    objectId: number;
    objectName: string;
    objectType: "infoprovider" | "videojob"
    showLogDialog: boolean;
    setShowLogDialog: (showLogDialog: boolean) => void;
    reportError: (message: string) => void;
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
     * Methods to fetch the logs when the component is mounted.
     */
        //this static value will be true as long as the component is still mounted
        //used to check if handling of a fetch request should still take place or if the component is not used anymore
    const isMounted = useRef(true);

    /**
     * Handler for successful fetches of log data from the backend.
     * Extracts the log data and writes it to the state.
     */
    const handleFetchLogsSuccess = React.useCallback((jsonData: any) => {
        const logData = jsonData as Array<LogEntry>;
        setLogMessages(logData);
    }, [])

    //extract reportError from props to use it in dependency
    const reportError = props.reportError;

    /**
     * Handler method for errors when fetching log data from the backend.
     */
    const handleFetchLogsError = React.useCallback((err: Error) => {
        reportError("Fehler beim Abrufen der Logs: " + err);
    }, [reportError])

    /**
     * Method that fetches the log data for the backend for the specified objectId.
     * @param objectId the id of the infoprovider or videojob to fetch the logs for
     * @param type Specifies whether a infoprovider or videojob is queried currently
     */
    const fetchLogs = React.useCallback((objectId: number, type: string) => {
        let url = "/visuanalytics/" + type + "/" + objectId + "/logs";
        //if this variable is set, add it to the url
        if (process.env.REACT_APP_VA_SERVER_URL) url = process.env.REACT_APP_VA_SERVER_URL + url
        //setup a timer to stop the request after 5 seconds
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 5000);
        //starts fetching the contents from the backend
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json\n"
            },
            signal: abort.signal
        }).then((res: Response) => {
            //handles the response and gets the data object from it
            if (!res.ok) throw new Error(`Network response was not ok, status: ${res.status}`);
            return res.status === 204 ? {} : res.json();
        }).then((data) => {
            //success case - the data is passed to the handler
            //only called when the component is still mounted
            if (isMounted.current) handleFetchLogsSuccess(data)
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted.current) handleFetchLogsError(err)
        }).finally(() => clearTimeout(timer));
    }, [handleFetchLogsSuccess, handleFetchLogsError])

    //defines a cleanup method that sets isMounted to false when unmounting
    //will signal the fetchMethod to not work with the results anymore
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    //extract objectId und type from props to use in dependencies
    const objectId = props.objectId;
    const objectType = props.objectType;

    /**
     * Fetches the logs when loading the component.
     */
    React.useEffect(() => {
        fetchLogs(objectId, objectType);
    }, [fetchLogs, objectId, objectType]);


    /**
     * Renders one row for the table with logs
     * Every row holds exactly one log entry
     * @param entry The log entry that should be rendered
     * @param index Index in the list of logs
     */
    const renderTableRow = (entry: LogEntry, index: number) => {
        return (
            <TableRow key={index}>
                <TableCell className={classes.logTableCell}>{index}</TableCell>
                <TableCell className={classes.logTableCell}>{entry.object_name}</TableCell>
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
            <Dialog maxWidth={"md"} aria-labelledby="LogDialog-Title" open={props.showLogDialog}
                    onClose={() => props.setShowLogDialog(false)}>
                <DialogTitle id="LogDialog-Title" className={classes.wrappedText}>
                    Logs für {props.objectName}
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="body1" className={classes.wrappedText}>
                                Hier können Sie die Log-Daten für den {props.objectType==="infoprovider"?"Infoprovider":"Videojob"} "{props.objectName}" einsehen.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.elementLargeMargin}>
                            {logMessages.length > 0 &&
                            <TableContainer component={Paper}>
                                <Table aria-label="Log-Einträge">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nr.</TableCell>
                                            <TableCell>{props.objectType==="infoprovider"?"Datenquelle":"Videojob"}</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Nachricht</TableCell>
                                            <TableCell>Dauer</TableCell>
                                            <TableCell>Startzeit</TableCell>
                                            <TableCell>Traceback</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {logMessages.map((logEntry: LogEntry, index) => renderTableRow(logEntry, index + 1))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            }
                            {logMessages.length === 0 &&
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
                            <Button variant="contained" size="large" color="primary"
                                    onClick={() => props.setShowLogDialog(false)}>
                                schließen
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
            <Dialog maxWidth={"md"} aria-labelledby="TracebackDialog-Title" open={showTracebackDialog}
                    onClose={() => closeTracebackDialog()}>
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
                            <Button variant="contained" size="large" color="primary"
                                    onClick={() => closeTracebackDialog()}>
                                schließen
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
