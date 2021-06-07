import React, {useEffect, useRef} from "react";
import {DataSelection} from "../../CreateInfoProvider/DataSelection";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
    ArrayDiagramProperties,
    DataSource, Diagram,
    ListItemRepresentation,
    testDataBackendAnswer
} from "../../CreateInfoProvider/types";
import {getListItemsNames, transformJSON} from "../../CreateInfoProvider/helpermethods";
import {ListItem} from "@material-ui/core";



interface EditDataSelectionProps {
    continueHandler: (index: number) => void;
    backHandler: (index: number) => void;
    editInfoProvider: () => void;
    reportError: (message: string) => void;
    dataSource: DataSource;
    setDataSource: (dataSource: DataSource) => void;
    apiKeyInput1: string;
    apiKeyInput2: string;
    diagrams: Array<Diagram>
}

export const EditDataSelection: React.FC<EditDataSelectionProps> = (props) => {

    //const classes = useStyles();

    //holds the value true if the loading spinner should be displayed
    const [displaySpinner, setDisplaySpinner] = React.useState(true);


    /**
     * Handler for the return of a successful call to the backend (getting test data)
     * @param jsonData The JSON-object delivered by the backend
     * Transforms the data to listItems-Format, calls the check if selectedData is contained.
     * Depending on the check, an error or DataSelection is shown
     */
    const handleTestDataSuccess = (jsonData: any) => {
        const data = jsonData as testDataBackendAnswer;
        if (data.status !== 0) {
            props.reportError("Fehler: Backend meldet Fehler bei der API-Abfrage.")
            //TODO: possibly show dialog here
        } else {
            //call the transform method
            const listItems: Array<ListItemRepresentation> = transformJSON(data.api_keys);
            if(dataContained(listItems)) {
                setDisplaySpinner(false);
            } else {
                //TODO: show dialog saying that there was a change in data
                //option to keep old data (on your own risk) or restart the settings for this dataSource
            }
        }
    }

    //extracts method from props to use it in the dependencies of handleErrorDiagramPreview
    const reportError = props.reportError;
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

    /**
     * Method to send a diagram to the backend for testing.
     * The standard hook "useCallFetch" is not used here since it seemingly caused method calls on each render.
     */
    const fetchTestData = React.useCallback(() => {
        //("fetcher called");
        let url = "/visuanalytics/testdiagram"
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
                api: {
                    type: "request",
                    api_key_name: props.dataSource.method === "BearerToken" ? props.apiKeyInput1 : props.apiKeyInput1 + "||" + props.apiKeyInput2,
                    url_pattern: props.dataSource.query
                },
                method: props.dataSource.method ? "noAuth" : props.dataSource.method,
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
    }, [])

    //defines a cleanup method that sets isMounted to false when unmounting
    //will signal the fetchMethod to not work with the results anymore
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);


    /**
     * Method that checks if all items of selectedData are contained in the API result returned from the backend.
     * Also checks if all arrays of this dataSource used in diagrams are contained.
     * Returns true if that is the case, false otherwise.
     */
    const dataContained = (listItems: Array<ListItemRepresentation>) => {
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
    }

    //on the first load, fetch the data from the backend again
    React.useEffect(() => {
        fetchTestData();
    }, [fetchTestData])

    /**
     * Generates the components content based on the current state. If the spinner has to be shown, it is displayed.
     * If there is no spinner, DataSelection component is rendered.
     */
    const selectContent = () => {
        if (displaySpinner) {
            return (
                <React.Fragment>
                    <Typography>
                        Bitte warten, während die API-Daten ermittelt werden...
                    </Typography>
                    <CircularProgress/>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    
                </React.Fragment>
            )
        }
    }

    return(
        <React.Fragment>
            {selectContent()}
        </React.Fragment>
    );
}
