import React from "react";
/*import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@material-ui/core";
import { JobList } from "../../JobList";
import AddCircleIcon from "@material-ui/icons/AddCircle";*/
import { ComponentContext } from "../../ComponentProvider";
/*import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { ExpandMore } from "@material-ui/icons";
import { PageTemplate } from "../../PageTemplate";*/
import { APIInputField } from "./APIInputField/APIInputField";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {useCallFetch} from "../../Hooks/useCallFetch";
import CircularProgress from "@material-ui/core/CircularProgress";
import {StepFrame} from "../StepFrame";
import {hintContents} from "../../util/hintContents";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select"
import { useStyles } from "./style";
import { borders } from '@material-ui/system';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import {FormControl} from "@material-ui/core";


interface BasicSettingsProps {
    continueHandler: () => void;
    backHandler: () => void;
    setApiData: (jsonData: any) => void;
    checkNameDuplicate: (name: string) => boolean;
    query: string;
    setQuery: (query: string) => void;
    apiKey: string;
    setApiKey: (key: string) => void;
    noKey: boolean;
    setNoKey: (noKey: boolean) => void;
    method: string;
    setMethod: (method: string) => void;
};

/**
 * Defines the type that is expected for the backends answer to our request
 */
type requestBackEndAnswer = {
    status: number
    api_keys: object
}

/**
 * A type guard to check the type of the backends answer
 * @param pet
 */
function isrequestBackEndAnswer(element:  any ): element is requestBackEndAnswer {
    return (element as requestBackEndAnswer).status !== undefined
}

/**
 * Component displaying the second step in the creation of a new Info-Provider.
 * The state of this component handles the input made to its children.
 */
export const BasicSettings: React.FC<BasicSettingsProps>  = (props) => {
    const classes = useStyles();
    const [name, setName] = React.useState("");
    const [param, setParam] = React.useState("");
    const [paramValue, setParamValue] = React.useState("");
    //state variable that manages toggling between input and loading spinner
    const [displaySpinner, setDisplaySpinner] = React.useState(false);
    //const components = React.useContext(ComponentContext);


    /**
     * Handler method for clicking the "proceed" button.
     * Sends the API data for testing to the backend and displays a loading animation
     */
    const handleProceed = () => {
        if(props.checkNameDuplicate(name)) {
            //TODO: display error that the name is already in use
        } else {
            sendTestData();
            setDisplaySpinner(true);
        }
    }
    /**
     * Handler for a successful request to the backend for receiving the API data.
     * Passes the received data to the parent component and proceeds to the next step.
     * param @jsonData The JSON-object delivered by the backend
     */
   const handleSuccess = (jsonData: any) => {
       const data = jsonData as requestBackEndAnswer;
       if(data.status!=0) {
           //TODO: error handling
       }
       props.setApiData(data.api_keys);
       props.continueHandler();
   }
   //TODO: create error message display, possibly reuse util/Notification
    /**
     * Handler for errors happening when requesting the backend.
     * Will display an error message and not proceed.
     * @param err Error delivered by the backend
     */
   const handleError = (err: Error) => {
        alert(err);
        setDisplaySpinner(false);
    }

    /**
     * Method to post the input data to the backend in order to receive the APIs answer.
     */
    const sendTestData = useCallFetch("/Request", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: props.query,
                api_key: props.noKey?"":props.apiKey,
                has_key: !props.noKey
            })
        }, handleSuccess, handleError
    );
    /**
     * Adds a new pair of parameter and value at the end of the api-query.
     * Values will be taken from the corresponding input fields.
    */
    const addParamToQuery = () => {
        if (!(param==""||paramValue=="")) {
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
     * Generates the components content based on the current state.
     * @param: displaySpinner Determines if the spinner should be displayed. If not, normal input is shown.
     */
    const selectContent = (displaySpinner: boolean) => {
        if(displaySpinner) {
            return (
                <div>
                    <Typography>
                        Bitte warten, während die API-Daten ermittelt werden...
                    </Typography>
                    <CircularProgress />
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
                                    value={name}
                                    changeHandler={(s) => {setName(s)}}
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.elementMargin}>
                                <Typography variant="body1" >
                                    Bitte geben sie die Query an, die der Info-Provider nutzen soll:
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <APIInputField
                                    defaultValue="Ihre API-Query"
                                    value={props.query}
                                    changeHandler={(s) => {props.setQuery(s)}}
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
                                    <Button disabled={param===""||paramValue===""} variant="contained" size="large" color="secondary" onClick={addParamToQuery}>
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
                                <Grid item xs={7}>
                                    <APIInputField
                                        defaultValue="Ihr API-Key"
                                        value={props.apiKey}
                                        changeHandler={(s) => {props.setApiKey(s)}}
                                        noKey={props.noKey}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl disabled={props.noKey} variant="filled" style={{width: "100%"}} margin="normal">
                                        <InputLabel id="methodSelectLabel">Methode</InputLabel>
                                        <Select
                                            labelId="methodSelectlabel"
                                            id="methodSelect"
                                            value={props.method}
                                            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {if(e.target!=null) props.setMethod(e.target.value as string)}}
                                        >
                                            <MenuItem value="KeyInQuery">Key in Query</MenuItem>
                                            <MenuItem value="KeyInHeader">Key in Header</MenuItem>
                                            <MenuItem value="BearerToken">Bearer Token</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} className={classes.elementMargin}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={props.noKey} onChange={(e) => props.setNoKey(!props.noKey)}/>
                                    }
                                    label="Diese API benötigt keinen Key"
                                />
                            </Grid>
                            <Grid item container xs={12} justify="space-between" className={classes.elementMargin}>
                                <Grid item>
                                    <Button variant="contained" size="large" color="primary" onClick={props.backHandler}>
                                        zurück
                                    </Button>
                                </Grid>
                                <Grid item className={classes.blockableButtonPrimary}>
                                    <Button disabled={!(name!==""&&props.query!==""&&(props.noKey||(props.apiKey!==""&&props.method!=="")))} variant="contained" size="large" color="primary" onClick={handleProceed}>
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
        </StepFrame>
    );
};
