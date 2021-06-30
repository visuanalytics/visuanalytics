import React from "react";
import {APIInputField} from "./APIInputField/APIInputField";
import {useCallFetch} from "../../Hooks/useCallFetch";
import {StepFrame} from "../StepFrame";
import {hintContents} from "../../util/hintContents";
import {useStyles} from "../style";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select"
import CircularProgress from "@material-ui/core/CircularProgress";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {Diagram, ListItemRepresentation, Schedule, SelectedDataItem, testDataBackendAnswer, uniqueId} from "../types";
import {transformJSON} from "../helpermethods";
import {FormelObj} from "../CreateCustomData/CustomDataGUI/formelObjects/FormelObj";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";

interface BasicSettingsProps {
    continueHandler: () => void;
    backHandler: () => void;
    //setApiData: (jsonData: any) => void;
    checkNameDuplicate: (name: string) => boolean;
    query: string;
    setQuery: (query: string) => void;
    apiKeyInput1: string;
    setApiKeyInput1: (key: string) => void;
    apiKeyInput2: string;
    setApiKeyInput2: (key: string) => void;
    noKey: boolean;
    setNoKey: (noKey: boolean) => void;
    method: string;
    setMethod: (method: string) => void;
    apiName: string;
    setApiName: (name: string) => void;
    reportError: (message: string) => void;
    setSelectedData: (selectedData: SelectedDataItem[]) => void;
    setCustomData: (customData: FormelObj[]) => void;
    setHistorizedData: (historizedData: string[]) => void;
    setSchedule: (schedule: Schedule) => void;
    setHistorySelectionStep: (historySelectionStep: number) => void;
    diagrams: Array<Diagram>
    setDiagrams: (diagrams: Array<Diagram>) => void;
    setListItems: (array: Array<ListItemRepresentation>) => void;
    isInEditMode: boolean;
}


/**
 * Component displaying the second step in the creation of a new Info-Provider.
 * The state of this component handles the input made to its children.
 */
export const BasicSettings: React.FC<BasicSettingsProps> = (props) => {
    const classes = useStyles();
    const [param, setParam] = React.useState("");
    const [paramValue, setParamValue] = React.useState("");
    //state variable that manages toggling between input and loading spinner
    const [displaySpinner, setDisplaySpinner] = React.useState(false);
    //the values when the component is initially mounted - used for change detection
    const [oldApiName] = React.useState(props.apiName);
    const [oldQuery] = React.useState(props.query);
    //const [oldMethod] = React.useState(props.method);
    //const [oldApiKeyInput1] = React.useState(props.apiKeyInput1);
    //const [oldApiKeyInput2] = React.useState(props.apiKeyInput2);
    //const [oldNoKey] = React.useState(props.noKey);
    //true when the dialog for confirming the deletion of diagrams
    const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false);
    //const components = React.useContext(ComponentContext);

    /**
     * Handler method for clicking the "proceed" button.
     * Sends the API data for testing to the backend and displays a loading animation.
     * If the dataSource was renamed, all elements in diagrams are also renamed.
     * If the query changes, a dialog is opened, asking the user for confirmation to delete all data related to the dataSource.
     * If this component is called from the editation of an infoprovider the given continue handler will be called. The function terminates afterwards
     */
    const handleProceed = () => {
        if(props.isInEditMode) {
            props.continueHandler();
            return;
        }
        //check if the name was changed, rename diagrams if this is the case
        //checking for empty string secures that we are not in BasicSettings for the first time
        if(oldApiName !== "" && oldApiName !== props.apiName) {
            //search trough all diagrams for objects that use data of this datasource
            const diagramsCopy = props.diagrams.slice();
            diagramsCopy.forEach((diagram) => {
                if(diagram.sourceType === "Array" && diagram.arrayObjects !== undefined) {
                    //diagram containing arrays - the listItem.parentKeyName would contain the dataSource name here
                    for (let index = 0; index < diagram.arrayObjects.length; index++) {
                        //check if the apiName at the beginning of the parentKeyName is the old one of this dataSource
                        if(diagram.arrayObjects[index].listItem.parentKeyName.split("|")[0] === oldApiName) {
                            //overwrite the name for this array
                            const parentKeyName = diagram.arrayObjects[index].listItem.parentKeyName
                            diagram.arrayObjects[index] = {
                                ...diagram.arrayObjects[index],
                                listItem: {
                                    ...diagram.arrayObjects[index].listItem,
                                    parentKeyName: props.apiName +  diagram.arrayObjects[index].listItem.parentKeyName.substring(parentKeyName.split("|")[0].length, parentKeyName.length)
                                }
                            }
                        }
                    }
                } else if(diagram.sourceType === "Historized" && diagram.historizedObjects !== undefined) {
                    //diagram containing historized data - the name would contain the dataSource nam here
                    for (let index = 0; index < diagram.historizedObjects.length; index++) {
                        //check if the apiName at the beginning of the name is the old name of this dataSource
                        if(diagram.historizedObjects[index].name.split("|")[0] === oldApiName) {
                            //overwrite the name for this historized data element
                            const name = diagram.historizedObjects[index].name;
                            diagram.historizedObjects[index] = {
                                ...diagram.historizedObjects[index],
                                name: props.apiName + name.substring(name.split("|")[0].length, name.length)
                            }
                        }
                    }
                }
            })
            //overwrite the state with the changed diagram
            props.setDiagrams(diagramsCopy);
        }
        //check if the query differs from the old settings
        const wasChanged = (
            props.query !== oldQuery
        );
        //send a new request to the backend when the user made changes to his settings
        if (wasChanged && oldQuery !== "") {
            setRemoveDialogOpen(true);
        } else if (wasChanged) {
            //in this case, the user is in this settings for this first time
            //send the data to the api
            sendTestData();
            setDisplaySpinner(true);
        }else {
            //just continue when there were no changes
            props.continueHandler();
        }
    }

    /**
     * Method called when proceeding after changing the api data - deletes all states
     * related to this datasource since it cannot be verified that the data will be the same after it.
     * The only thing not deleted is listItems because this is necessary for workin with errors.
     */
    const deleteAllDependencies = () => {
        //reset all following settings when a new api request is made
        // Clean up the session storage for all following steps
        sessionStorage.removeItem("selectedData-" + uniqueId);
        sessionStorage.removeItem("customData-" + uniqueId);
        sessionStorage.removeItem("historizedData-" + uniqueId);
        sessionStorage.removeItem("schedule-" + uniqueId);
        sessionStorage.removeItem("historySelectionStep-" + uniqueId);
        //sessionStorage.removeItem("listItems-" + uniqueId);

        // Reset the states of the following steps
        //props.setApiData({});
        props.setSelectedData(new Array<SelectedDataItem>());
        props.setCustomData(new Array<FormelObj>());
        props.setHistorizedData(new Array<string>());
        props.setSchedule({type: "", interval: "", time: "", weekdays: []});
        props.setHistorySelectionStep(1);
        //props.setListItems(new Array<ListItemRepresentation>());
        //find all diagrams with this dataSource and delete them
        const diagramsToDelete: Array<string> = [];
        props.diagrams.forEach((diagram) => {
            if(diagram.sourceType === "Array" && diagram.arrayObjects !== undefined) {
                //diagram containing arrays - the listItem.parentKeyName would contain the dataSource name here
                for (let index = 0; index < diagram.arrayObjects.length; index++) {
                    //check if the apiName at the beginning of the parentKeyName is the old one of this dataSource
                    if(diagram.arrayObjects[index].listItem.parentKeyName.split("|")[0] === props.apiName) {
                        //add this diagram to the deletion list
                        diagramsToDelete.push(diagram.name);
                        break;
                    }
                }
            } else if(diagram.sourceType === "Historized" && diagram.historizedObjects !== undefined) {
                //diagram containing historized data - the name would contain the dataSource nam here
                for (let index = 0; index < diagram.historizedObjects.length; index++) {
                    //check if the apiName at the beginning of the name is the old name of this dataSource
                    if(diagram.historizedObjects[index].name.split("|")[0] === props.apiName) {
                        //add this diagram to the deletion list
                        diagramsToDelete.push(diagram.name);
                        break;
                    }
                }
            }
        })
        props.setDiagrams(props.diagrams.filter((diagram) => {
            return !diagramsToDelete.includes(diagram.name);
        }));
    }

    /**
     * Handler for a successful request to the backend for receiving the API data.
     * Passes the received data to the parent component and proceeds to the next step.
     * param @jsonData The JSON-object delivered by the backend
     */
    const handleSuccess = (jsonData: any) => {
        const data = jsonData as testDataBackendAnswer;
        if (data.status !== 0) {
            props.reportError("Fehler: Backend meldet Fehler bei der API-Abfrage. Bitte überprüfen sie die Eingabe.")
            setDisplaySpinner(false);
        } else {
            //console.log(data.api_keys);
            //props.setApiData(data.api_keys);
            //everytime we get a new answer, all previous data is deleted
            deleteAllDependencies();
            props.setListItems(transformJSON(data.api_keys));
            //console.log(transformJSON(data.api_keys));
            props.continueHandler();
        }
    }

    /**
     * Handler for errors happening when requesting the backend.
     * Will display an error message and not proceed.
     * @param err Error delivered by the backend
     */
    const handleError = (err: Error) => {
        props.reportError("Fehler: Senden der Daten an das Backend fehlgeschlagen! (" + err.message + ")");
        setDisplaySpinner(false);
    }

    /**
     * Method to post the input data to the backend in order to receive the APIs answer.
     */
    const sendTestData = useCallFetch("visuanalytics/checkapi", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                api_info: {
                    type: "request",
                    api_key_name: props.method === "BearerToken" ? props.apiKeyInput1 : props.apiKeyInput1 + "||" + props.apiKeyInput2,
                    url_pattern: props.query
                },
                method: props.noKey ? "noAuth" : props.method,
                response_type: "json"
            })
        }, handleSuccess, handleError
    );
    /**
     * Adds a new pair of parameter and value at the end of the api-query.
     * Values will be taken from the corresponding input fields.
     */
    const addParamToQuery = () => {
        if (!(param === "" || paramValue === "")) {
            if (props.query.includes("?")) {
                props.setQuery(props.query + "&" + param + "=" + paramValue);
            } else {
                props.setQuery(props.query + "?" + param + "=" + paramValue);
            }
            setParam("");
            setParamValue("");
        }
    }

    /**
     * Handler for changing the method. Calculates if the categories of the input fields will change and resets values if true
     * @param e The event that was triggered by changing the method.
     *
     */
    const handleMethodChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        if (e.target !== null) {
            //check if the categories of the elements change, in this case empty the input
            const methodIndexList = ["KeyInHeader", "KeyInHeader", "BearerToken", "BasicAuth", "DigestAuth"];
            const methodIndex = methodIndexList.indexOf(props.method);
            const targetIndex = methodIndexList.indexOf(e.target.value as string)
            if ((methodIndex <= 1 && targetIndex > 1) || (methodIndex === 2 && targetIndex !== 2) || (methodIndex > 2 && targetIndex <= 2)) {
                props.setApiKeyInput1("");
                props.setApiKeyInput2("")
            }
            props.setMethod(e.target.value as string);
        }
    }

    const handleTestContinue = () => {
        props.continueHandler()
    }


    /**
     * Generates the components content based on the current state.
     * @param: displaySpinner Determines if the spinner should be displayed. If not, normal input is shown.
     */
    const selectContent = (displaySpinner: boolean) => {
        if (displaySpinner) {
            return (
                <div>
                    <Typography>
                        Bitte warten, während die API-Daten ermittelt werden...
                    </Typography>
                    <CircularProgress/>
                </div>
            )
        } else {
            return (
                <div>
                    <form>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography variant="body1">
                                    Bitte wählen sie einen Namen für ihre API-Datenquelle:
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <APIInputField
                                    defaultValue="Name der API-Datenquelle"
                                    value={props.apiName}
                                    changeHandler={(s) => {
                                        props.setApiName(s.replace(' ', '_'))
                                    }}
                                    errorText="Dieser Name wird bereits für eine andere API verwendet!"
                                    checkNameDuplicate={props.checkNameDuplicate}
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.elementSmallMargin}>
                                <Typography variant="body1">
                                    Bitte geben sie die Query an, die der Info-Provider nutzen soll:
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <APIInputField
                                    defaultValue="Ihre API-Query"
                                    value={props.query}
                                    changeHandler={(s) => props.setQuery(s)}
                                />
                            </Grid>
                            <Grid item container className={classes.additionalParams}>
                                <Grid item xs={12}>
                                    <Typography variant="body1">
                                        Weitere Parameter am Query-Ende hinzufügen:
                                    </Typography>
                                </Grid>
                                <Grid item container xs={12} justify="space-around">
                                    <Grid item md={5} xs={12}>
                                        <APIInputField
                                            defaultValue="Parameter"
                                            value={param}
                                            changeHandler={(s) => setParam(s)}
                                        />
                                    </Grid>
                                    <Grid item md={5} xs={12}>
                                        <APIInputField
                                            defaultValue="Wert"
                                            value={paramValue}
                                            changeHandler={(s) => setParamValue(s)}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item className={`${classes.addParamButton}  ${classes.blockableButtonSecondary}`}>
                                    <Button disabled={param === "" || paramValue === ""} variant="contained"
                                            size="large" color="secondary" onClick={addParamToQuery}>
                                        Hinzufügen
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1">
                                    Bitte geben sie den API-Key für ihre Anfragen ein:
                                </Typography>
                            </Grid>
                            <Grid item container xs={12} justify="space-between">
                                <Grid item xs={3}>
                                    <FormControl disabled={props.noKey} variant="filled" style={{width: "100%"}}
                                                 margin="normal">
                                        <InputLabel id="methodSelectLabel">Methode</InputLabel>
                                        <Select
                                            labelId="methodSelectlabel"
                                            id="methodSelect"
                                            value={props.method}
                                            onChange={handleMethodChange}
                                        >
                                            <MenuItem value="KeyInQuery">Key in Query</MenuItem>
                                            <MenuItem value="KeyInHeader">Key in Header</MenuItem>
                                            <MenuItem value="BearerToken">Bearer Token</MenuItem>
                                            <MenuItem value="BasicAuth">Basic Auth</MenuItem>
                                            <MenuItem value="DigestAuth">Digest Auth</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={props.method === "BearerToken" ? 8 : 4}>
                                    <APIInputField
                                        defaultValue={(props.method === "BasicAuth" || props.method === "DigestAuth") ? "Nutzername" : props.method === "BearerToken" ? "Token" : "Name Key-Parameter"}
                                        value={props.apiKeyInput1}
                                        changeHandler={(s) => props.setApiKeyInput1(s)}
                                        noKey={props.noKey}
                                        disabled={props.method === ""}
                                    />
                                </Grid>
                                {props.method !== "BearerToken" &&
                                <Grid item xs={4}>
                                    <APIInputField
                                        defaultValue={(props.method === "BasicAuth" || props.method === "DigestAuth") ? "Passwort" : "API-Key"}
                                        value={props.apiKeyInput2}
                                        changeHandler={(s) => {
                                            props.setApiKeyInput2(s);
                                        }}
                                        noKey={props.noKey || props.method === "BearerToken"}
                                        disabled={props.method === ""}
                                    />
                                </Grid>
                                }
                            </Grid>
                            <Grid item xs={12} className={classes.elementSmallMargin}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={props.noKey} onChange={() => props.setNoKey(!props.noKey)}/>
                                    }
                                    label="Diese API benötigt keinen Key"
                                />
                            </Grid>
                            <Grid item container xs={12} justify="space-between" className={classes.elementSmallMargin}>
                                <Grid item>
                                    <Button variant="contained" size="large" color="primary"
                                            onClick={props.backHandler}>
                                        zurück
                                    </Button>
                                </Grid>
                                {<Grid item>
                                    <Button variant="contained" size="large" color="primary"
                                            onClick={handleTestContinue}>
                                        Weiter ohne Backend (Test)
                                    </Button>
                                </Grid>}
                                <Grid item className={classes.blockableButtonPrimary}>
                                    <Button
                                        disabled={!(props.apiName !== "" && props.query !== "" && (props.noKey || (props.apiKeyInput1 !== "" && props.apiKeyInput2 !== "" && props.method !== "") || (props.method === "BearerToken" && props.apiKeyInput1 !== "")) && !props.checkNameDuplicate(props.apiName))}
                                        variant="contained" size="large" color="primary" onClick={handleProceed}>
                                        weiter
                                    </Button>
                                </Grid>
                            </Grid>

                        </Grid>
                    </form>
                </div>
            )
        }
    }

    return (
        <StepFrame
            heading="API-Einstellungen"
            hintContent={hintContents.basicSettings}
        >
            {selectContent(displaySpinner)}
            <Dialog onClose={() => {
                setRemoveDialogOpen(false);
            }} aria-labelledby="deleteDialog-title"
                    open={removeDialogOpen}>
                <DialogTitle id="deleteDialog-title">
                    Ändern der API-Abfrage bestätigen
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Durch eine Änderung in der API-Abfrage muss die API erneut angefragt werden.
                    </Typography>
                    <Typography gutterBottom>
                        Durch die neue Abfrage und die mit ihr möglicherweise geänderten Antwortdaten müssen alle Formeln und Diagramme, die diese Datenquelle nutzen, entfernt werden, sofern die Abfrage erfolgreich ist.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Grid container justify="space-between">
                        <Grid item>
                            <Button variant="contained"
                                    onClick={() => {
                                        setRemoveDialogOpen(false);
                                    }}>
                                abbrechen
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained"
                                    onClick={() => {
                                        setRemoveDialogOpen(false);
                                        //send the data to the api
                                        sendTestData();
                                        setDisplaySpinner(true);
                                    }}
                                    className={classes.redDeleteButton}>
                                Änderung bestätigen
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </StepFrame>
    );
};
