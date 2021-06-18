import React from "react";
import {StepFrame} from "../../CreateInfoProvider/StepFrame";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid, InputLabel, MenuItem, Select,
    TextField,
    Typography
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {useStyles} from "../style";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import {FormelObj} from "../../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/FormelObj";
import {DataSource, ListItemRepresentation, Schedule, SelectedDataItem} from "../../CreateInfoProvider/types";
import {extractKeysFromSelection} from "../../CreateInfoProvider/helpermethods";
import {BasicSettings} from "../../CreateInfoProvider/BasicSettings";

interface EditBasicSettingsProps {
    continueHandler: (index: number) => void;
    backHandler: (index: number) => void;
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
    setApiName: (apiName: string) => void;
    reportError: (message: string) => void;
    setSelectedData: (selectedData: SelectedDataItem[]) => void;
    setCustomData: (customData: FormelObj[]) => void;
    setHistorizedData: (historizedData: string[]) => void;
    setSchedule: (schedule: Schedule) => void;
    setHistorySelectionStep: (historySelectionStep: number) => void;
    setListItems: (array: Array<ListItemRepresentation>) => void;
}

export const EditBasicSettings: React.FC<EditBasicSettingsProps> = (props) => {
    const classes = useStyles();


    // Saving old values of states. This is needed when the user clickes the back button
    const [oldApiName] = React.useState(props.apiName);
    const [oldQuery] = React.useState(props.query);
    const [oldMethod] = React.useState(props.method);
    const [oldApiKeyInput1] = React.useState(props.apiKeyInput1);
    const [oldApiKeyInput2] = React.useState(props.apiKeyInput2);
    const [oldNoKey] = React.useState(props.noKey);


    // This state is needed to open or close the dialog when the user goes back
    const [openBackDialog, setOpenBackDialog] = React.useState(false);

    const continueHandler = () => {
        props.continueHandler(1);
    }

    const backHandler = () => {
        if(dataHasChanged()) setOpenBackDialog(true);
        else props.backHandler(1);
    }

    const confirmBack = () => {
        props.setApiName(oldApiName);
        props.setNoKey(oldNoKey);
        props.setApiKeyInput1(oldApiKeyInput1);
        props.setApiKeyInput2(oldApiKeyInput2);
        props.setMethod(oldMethod);
        props.setQuery(oldQuery);
        setOpenBackDialog(false);
        props.backHandler(1);
    }

    const dataHasChanged = () => {
        return (oldApiName !== props.apiName || oldQuery !== props.query || oldMethod !== props.method || oldApiKeyInput1 !== props.apiKeyInput1 || oldApiKeyInput2 !== props.apiKeyInput2 || oldNoKey !== props.noKey);
    }
    return (
        <React.Fragment>
            <BasicSettings
                continueHandler={continueHandler}
                backHandler={backHandler}
                checkNameDuplicate={props.checkNameDuplicate}
                query={props.query}
                setQuery={props.setQuery}
                apiKeyInput1={props.apiKeyInput1}
                setApiKeyInput1={props.setApiKeyInput1}
                apiKeyInput2={props.apiKeyInput2}
                setApiKeyInput2={props.setApiKeyInput2}
                noKey={props.noKey}
                setNoKey={props.setNoKey}
                method={props.method}
                setMethod={props.setMethod}
                name={props.apiName}
                setName={props.setApiName}
                reportError={props.reportError}
                setSelectedData={props.setSelectedData}
                setCustomData={props.setCustomData}
                setHistorizedData={props.setHistorizedData}
                setSchedule={props.setSchedule}
                setHistorySelectionStep={props.setHistorySelectionStep}
                setListItems={props.setListItems}
                isInEditMode={true}
            />
            <Dialog onClose={() => setOpenBackDialog(false)} aria-labelledby="backDialog"
                    open={openBackDialog}>
                <DialogTitle id="backDialog-Title">
                    Änderungen verwerfen?
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Wenn Sie zurück gehen, gehen ihre hier eingestellten Änderungen verloren.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Grid container justify="space-between">
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={() => setOpenBackDialog(false)}>
                                nein, nicht zurück gehen
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={confirmBack} className={classes.redButton}>
                                ja, zurück gehen
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )


}