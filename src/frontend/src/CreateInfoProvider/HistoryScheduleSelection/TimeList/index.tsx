import React, {ChangeEvent} from "react";
/*import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@material-ui/core";
import { JobList } from "../../JobList";
import { useStyles } from "./style";
import AddCircleIcon from "@material-ui/icons/AddCircle";*/
import { ComponentContext } from "../../../ComponentProvider";
/*import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { ExpandMore } from "@material-ui/icons";
import { PageTemplate } from "../../PageTemplate";*/
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from "@material-ui/core/CircularProgress";
import Input from '@material-ui/core/Input';
import {Web} from "@material-ui/icons";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";


interface TimeListProps {
    times: Set<string>;
    removeHandler: (time: string) => void;
};

/**
 *
 *
 */
export const TimeList: React.FC<TimeListProps>  = (props) => {
    //holds the currently selected time

    const renderListItem = (time: string) => {
        return (
                <ListItem key={time}>
                    <ListItemText
                        primary={time}
                        secondary={null}
                    />
                    <ListItemSecondaryAction>
                        <IconButton onClick={() => props.removeHandler(time)}>
                            <DeleteIcon
                            />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
        )
    }


    //const components = React.useContext(ComponentContext);
    return (
        <div style={{width: '20%'}}>
            <List>
                {Array.from(props.times).map(renderListItem)}
            </List>
        </div>
    )
};
