import React from "react";
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@material-ui/core";
//import { JobList } from "../../JobList";
//import { useStyles } from "./style";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { ComponentContext } from "../../../ComponentProvider";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { ExpandMore } from "@material-ui/icons";
//import { PageTemplate } from "../../PageTemplate";
import TextField from "@material-ui/core/TextField";

/*
defaultValue: value to be displayed as default an as label while writing
value: the current value, state variable is passed here
changeHandler: handler method that changes the value
noKey: optional parameter that signals when the user has chosen that no API-key is necessary. Will disable the input if true is passed.
 */
interface APIInputFieldProps {
    defaultValue: string;
    value: string;
    changeHandler: (newValue: string) => void;
    noKey?: boolean;
};


/*
A basic input field to be used in the process of creating a new API-data-source.
The state of the input is handled in the parent classes.
 */
export const APIInputField: React.FC<APIInputFieldProps> = (props) => {
    //const classes = useStyles();
    //const components = React.useContext(ComponentContext);
    return (
        <TextField disabled={props.noKey} variant="outlined" color="primary" label={props.defaultValue} value={props.value} onChange={(e) => {props.changeHandler(e.target.value)}}/>
    );
};
