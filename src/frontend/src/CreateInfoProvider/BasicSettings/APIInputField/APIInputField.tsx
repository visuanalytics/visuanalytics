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


interface APIInputFieldProps {
    defaultValue: string;
    value: string;
    changeHandler: (newValue: string) => void;
    noKey?: boolean;
};

export const APIInputField: React.FC<APIInputFieldProps> = (props) => {
    //const classes = useStyles();
    const components = React.useContext(ComponentContext);
    return (
        <TextField disabled={props.noKey} variant="outlined" color="primary" label={props.defaultValue} value={props.value} onChange={(e) => {props.changeHandler(e.target.value)}}/>
    );
};
