import React, {ChangeEvent} from "react";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import {CheckBox} from "@material-ui/icons";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

interface DataSelectionProps {
    continueHandler: () => void;
    backHandler: () => void;
    selectedData: Set<string>;
    setSelectedData: (set: Set<string>) => void;
}

export const DataSelection: React.FC<DataSelectionProps>  = (props) => {

    const [data, setData] = React.useState<Array<string>>([]);


    const renderListItem = (data: string) => {
        return (
            <ListItem key={data}>
                <ListItemSecondaryAction>
                    <FormControlLabel
                        control={
                            <Checkbox onClick={(event) => checkboxHandler(data)}/>
                        }
                        label={data}
                    />
                </ListItemSecondaryAction>
            </ListItem>
        )
    }

    const addToSelection = (data: string) => {
        props.setSelectedData(new Set(props.selectedData).add(data));
    }

    const  removeFromSelection = (data: string) => {
        const setCopy = new Set(props.selectedData);
        setCopy.delete(data);
        props.setSelectedData(setCopy);
    }

    const checkboxHandler = (data: string) => {
        if (props.selectedData.has(data)) {
            removeFromSelection(data);
        } else {
            addToSelection(data)
        }

        console.log(props.selectedData.values().next())
    }

    return (
        <div>
            <div style={{width: '20%'}}>
                <List>
                    {data.map(renderListItem)}
                </List>
            </div>
            <div>
                <Button variant="contained" onClick={() => setData(['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data8', 'data9', 'data10'])}>
                    Test!
                </Button>
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
