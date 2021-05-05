import React from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';


interface TimeListProps {
    times: Array<string>;
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
                {props.times.map(renderListItem)}
            </List>
        </div>
    )
};
