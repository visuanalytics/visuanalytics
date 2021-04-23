import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import {strict} from "assert";

interface CreateCustomDataProps {
    continueHandler: () => void;
    backHandler: () => void;
    selectedData: Set<string>;
    setSelectedData: (set: Set<string>) => void;
}

export const CreateCustomData: React.FC<CreateCustomDataProps>  = (props) => {

    const[customData, setCustomData] = React.useState<string>('');

    const renderListItem = (data: string) => {
        return (
            <ListItem key={data}>
                {data}
            </ListItem>
        )
    }


    return (
        <div>
            <div style={{width: '20%'}}>
                <List>
                    {Array.from(props.selectedData).sort((a, b) => a.localeCompare(b)).map(renderListItem)}
                </List>
            </div>
            <div>
                <Button variant="contained" size="large" onClick={props.backHandler}>
                    zurück
                </Button>
                <Button variant="contained" size="large" onClick={props.continueHandler}>
                    weiter
                </Button>
            </div>
        </div>
    )

}
