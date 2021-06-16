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

    return (
        <React.Fragment>

        </React.Fragment>
    )


}