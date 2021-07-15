import React, {useEffect, useRef} from "react";
import {DataSelection} from "../../CreateInfoProvider/DataSelection";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
    ArrayDiagramProperties,
    DataSource, Diagram,
    ListItemRepresentation, SelectedDataItem,
    testDataBackendAnswer
} from "../../CreateInfoProvider/types";
import {getListItemsNames, transformJSON} from "../../CreateInfoProvider/helpermethods";
import {FormelObj} from "../../CreateInfoProvider/DataCustomization/CreateCustomData/CustomDataGUI/formelObjects/FormelObj";
import {hintContents} from "../../util/hintContents";
import {StepFrame} from "../../CreateInfoProvider/StepFrame";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {useStyles} from "../style";



interface EditDataSelectionProps {
    continueHandler: (index: number) => void;
    backHandler: (index: number) => void;
    editInfoProvider: () => void;
    reportError: (message: string) => void;
    dataSource: DataSource;
    apiKeyInput1: string;
    apiKeyInput2: string;
    diagrams: Array<Diagram>
    setDiagrams: (diagrams: Array<Diagram>) => void;
    setSelectedData: (selectedData: Array<SelectedDataItem>) => void;
    setHistorizedData: (historizedData: Array<string>) => void;
    setCustomData: (customData: Array<FormelObj>) => void;
    cleanDataSource: (newListItems: Array<ListItemRepresentation>) => void;
    infoProvDataSources: Array<DataSource>;
    selectedDataSource: number;
    dataCustomizationStep: number;
    setDataCustomizationStep: (step: number) => void;
}

export const EditDataSelection: React.FC<EditDataSelectionProps> = (props) => {

    const classes = useStyles();

    //holds the value true if the loading spinner should be displayed
    const [displaySpinner, setDisplaySpinner] = React.useState(true);
    //true when the dialog for data missmatch errors is open
    const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);
    //holds the set of listItems as returned by the new api request
    const [newListItems, setNewListItems] = React.useState<Array<ListItemRepresentation>>([]);

    /**
     * Method that checks if all items of selectedData are contained in the API result returned from the backend.
     * Also checks if all arrays of this dataSource used in diagrams are contained.
     * Returns true if that is the case, false otherwise.
     */
    const dataContained = React.useCallback((listItems: Array<ListItemRepresentation>) => {
        const listItemsNames = getListItemsNames(listItems);
        //every key of selectedData also has to be in the listItems
        for (let index = 0; index < props.dataSource.selectedData.length; index++) {
            if(!listItemsNames.includes(props.dataSource.selectedData[index].key)) return false;
        }
        //every array of this dataSource used in diagrams has to be contained
        for(let index = 0; index < props.diagrams.length; index++) {
            const diagram = props.diagrams[index];
            if(diagram.sourceType==="Array"&&diagram.arrayObjects!==undefined) {
                for(let innerIndex = 0; innerIndex < diagram.arrayObjects.length; innerIndex++) {
                    const arrayObject: ArrayDiagramProperties = diagram.arrayObjects[innerIndex];
                    //checking is only necessary if the arrayObject is from this api
                    if(arrayObject.listItem.parentKeyName.split("|")[0]===props.dataSource.apiName) {
                        //construct the keyName without the dataSource and the pipe at the beginning and check if it is contained in the listems
                        if(!listItemsNames.includes(arrayObject.listItem.parentKeyName.substring(props.dataSource.apiName.length + 1) + arrayObject.listItem.keyName)) return false;
                    }
                }
            }
        }
        return true;
    }, [props.dataSource.apiName, props.dataSource.selectedData, props.diagrams])

    //extract reportError from props to use in useEffect/dependencies
    const reportError = props.reportError;

    /**
     * Handler for the return of a successful call to the backend (getting test data)
     * @param jsonData The JSON-object delivered by the backend
     * Transforms the data to listItems-Format, calls the check if selectedData is contained.
     * Depending on the check, an error or DataSelection is shown
     */
    const handleTestDataSuccess = React.useCallback((jsonData: any) => {
        const data = jsonData as testDataBackendAnswer;
        if (data.status !== 0) {
            reportError("Fehler: Backend meldet Fehler bei der API-Abfrage.")
            //TODO: possibly show dialog here
        } else {
            //call the transform method
            const listItems: Array<ListItemRepresentation> = transformJSON(data.api_keys);
            setNewListItems(listItems);
            if(dataContained(listItems)) {
                setDisplaySpinner(false);
            } else {
                setErrorDialogOpen(true);
            }
        }
    }, [dataContained, reportError]);


    /**
     * Handler for unsuccessful call to the backend (getting test data)
     * @param err The error returned by the backend
     */
    const handleTestDataError = React.useCallback((err: Error) => {
        reportError("Fehler: API-Abfrage über das Backend fehlgeschlagen! (" + err.message + ")");
    }, [reportError]);


    //this static value will be true as long as the component is still mounted
    //used to check if handling of a fetch request should still take place or if the component is not used anymore
    const isMounted = useRef(true);

    //extract values from the dataSource to use them in the fetch
    const query = props.dataSource.query;
    const method = props.dataSource.method;
    const noKey = props.dataSource.noKey
    const apiKeyInput1 = props.apiKeyInput1;
    const apiKeyInput2 = props.apiKeyInput2;

    /**
     * Method to send the configuration of the dataSource to the backend and receive the api data of the query.
     * The standard hook "useCallFetch" is not used here since it seemingly caused method calls on each render.
     */
    const fetchTestData = React.useCallback(() => {
        //("fetcher called");
        let url = "/visuanalytics/checkapi"
        //if this variable is set, add it to the url
        if (process.env.REACT_APP_VA_SERVER_URL) url = process.env.REACT_APP_VA_SERVER_URL + url
        //setup a timer to stop the request after 5 seconds
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 5000);
        //starts fetching the contents from the backend
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                api_info: {
                    type: "request",
                    api_key_name: method === "BearerToken" ? apiKeyInput1 : apiKeyInput1 + "||" + apiKeyInput2,
                    url_pattern: query
                },
                method: noKey ? "noAuth" : method,
                response_type: "json"
            }),
            signal: abort.signal
        }).then((res: Response) => {
            //handles the response and gets the data object from it
            if (!res.ok) throw new Error(`Network response was not ok, status: ${res.status}`);
            return res.status === 204 ? {} : res.json();
        }).then((data) => {
            //success case - the data is passed to the handler
            //only called when the component is still mounted
            if (isMounted.current) handleTestDataSuccess(data)
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted.current) handleTestDataError(err)
        }).finally(() => clearTimeout(timer));
    }, [handleTestDataSuccess, handleTestDataError, query, method, apiKeyInput1, apiKeyInput2, noKey])

    //defines a cleanup method that sets isMounted to false when unmounting
    //will signal the fetchMethod to not work with the results anymore
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);


    //on the first load, fetch the data from the backend again
    React.useEffect(() => {
        fetchTestData();
    }, [fetchTestData])

    const handleStepForward = () => {
        props.setDataCustomizationStep(0);
        props.continueHandler(1);
    }

    /**
     * Generates the components content based on the current state. If the spinner has to be shown, it is displayed.
     * If there is no spinner, DataSelection component is rendered.
     */
    const selectContent = () => {
        if (displaySpinner) {
            return (
                <StepFrame
                    heading = "Datenauswahl"
                    hintContent = {hintContents.dataSelection}
                >
                    <Typography>
                        Bitte warten, während die API-Daten ermittelt werden...
                    </Typography>
                    <CircularProgress/>
                    <Dialog onClose={() => {setErrorDialogOpen(false);}} aria-labelledby="deleteDialog-title"
                            open={errorDialogOpen}>
                        <DialogTitle id="deleteDialog-title">
                            Änderung der Datenquelle
                        </DialogTitle>
                        <DialogContent dividers>
                            <Typography gutterBottom>
                                Einige der ausgewählten oder in Diagrammen verwendeten Daten dieser Datenquelle sind nicht in der Antwort der API-Abfrage vorhanden.
                            </Typography>
                            <Typography gutterBottom>
                                Dies ist vermutlich darauf zurückzuführen, dass die API ihr Datenformat geändert hat oder in ihrer Antwort Fehler-Informationen enthäöt.
                            </Typography>
                            <Typography gutterBottom>
                                Sie können die Datenquelle nicht weiter bearbeiten und die alten Einstellungen behalten (sofern sich die Datenquelle tatsächlich geändert hat werden API-Abfragen vermutlich Fehler erzeugen).
                            </Typography>
                            <Typography gutterBottom>
                                Alternativ können sie alle Einstellungen und zugehörigen Diagramme verwerfen und mit der neuen Antwort weiterarbeiten.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Grid container justify="space-between">
                                <Grid item>
                                    <Button variant="contained"
                                            onClick={() => {props.backHandler(1)}}>
                                        Neue Antwort verwerfen
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained"
                                            onClick={() => {
                                                props.cleanDataSource(newListItems);
                                                setDisplaySpinner(false);
                                            }}
                                            className={classes.redDeleteButton}>
                                        Einstellungen/Diagramme löschen
                                    </Button>
                                </Grid>
                            </Grid>
                        </DialogActions>
                    </Dialog>
                </StepFrame>
            )
        } else {
            return (
                <DataSelection
                    continueHandler={() => handleStepForward()}
                    backHandler={() => props.backHandler(1)}
                    selectedData={props.dataSource.selectedData}
                    setSelectedData={props.setSelectedData}
                    listItems={newListItems}
                    setListItems={() => console.log("THIS IS ONLY FOR DEBUGGING AND NOT ALLOWED IN EDIT MODE!")}
                    historizedData={props.dataSource.historizedData}
                    setHistorizedData={props.setHistorizedData}
                    customData={props.dataSource.customData}
                    setCustomData={props.setCustomData}
                    diagrams={props.diagrams}
                    setDiagrams={(diagrams: Array<Diagram>) => props.setDiagrams(diagrams)}
                    apiName={props.infoProvDataSources[props.selectedDataSource].apiName}
                />
            )
        }
    }

    return(
        <React.Fragment>
            {selectContent()}
        </React.Fragment>
    );
}
