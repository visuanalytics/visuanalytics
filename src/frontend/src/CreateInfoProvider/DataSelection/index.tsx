import React, {ChangeEvent} from "react";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {StepFrame} from "../StepFrame";
import {hintContents} from "../../util/hintContents";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import {useStyles} from "./style";

interface DataSelectionProps {
    continueHandler: () => void;
    backHandler: () => void;
    selectedData: Set<string>;
    setSelectedData: (set: Set<string>) => void;
}


interface ListItemRepresentation {
    keyName: string;
    value: any;
    parentKeyName: string;
}


export const DataSelection: React.FC<DataSelectionProps>  = (props) => {
    const classes = useStyles();

    const [data, setData] = React.useState<Array<string>>(['Temperatur', 'Windgeschwindigkeit', 'Regenwahrscheinlichkeit', 'Temperatur(gefühlt)', 'Sonnenuntergang', 'Sonnenaufgang', 'Sonnenstunden', 'data0', 'data1', 'data2']);

    const[listItems, setListItems] = React.useState<Array<ListItemRepresentation>>([]);
    //a local variable is used since it will be reset to zero when re-rendering, this behavior is wanted
    let indexCounter = 0

    //everytime there is a change in the source data, rebuild the list and clean the selection
    React.useEffect(() => {
        transformJSON(sampleJSON);
        props.setSelectedData(new Set());
    }, [listItems]);

    //sample JSON-data to test the different depth levels and parsing
    const sampleJSON = {
        data_1: {
            data_1_1: 1,
            data_1_2: "value2"
        },
        data_2: {
            data_2_1: {
                data_2_1_1: "value3"
            },
            data_2_2: "value4"
        },
        data_3: "value5"
    };


    /**
     * Takes an object (supposed to be JSON data) and returns an array representation of it.
     * @param jsonData The data-Object to be turned into an array.
     * @param parent Used for recursive calls, marks the parent of items in a sub-object.
     * Note: Currently not supporting any kind of array within the object.
     */
    const transformJSON = (jsonData: any, parent = "") => {
        let stringRep = JSON.stringify(jsonData);
        console.log(stringRep)
        const resultArray: Array<(ListItemRepresentation)> = [];
        let finished = true;
        stringRep = stringRep.substring(1);
        while(finished) {
            //get the key name
            let key = stringRep.split(":", 2)[0];
            stringRep = stringRep.substring(key.length + 1);
            key = key.substring(1, key.length-1);
            let value: any = "";
            //check if the value is another object
            if (stringRep[0]==="{") {
                let subObject = stringRep.split("}", 1)[0] + "}"
                let counter = 1;
                while(subObject.split("{").length-1 != subObject.split("}").length-1) {
                    let splitArray = stringRep.split("}", counter);
                    subObject = "";
                    for (let i = 0; i<counter; i++) {
                        subObject += splitArray[i] + "}";
                    }
                    counter += 1;
                    if(counter>3) break;
                }
                value = transformJSON(JSON.parse(subObject), key);
                stringRep = stringRep.substring(subObject.length +1);
            } else {
                value = stringRep.includes(",")?stringRep.split(",", 1)[0]:stringRep.split("}", 1)[0];
                stringRep = stringRep.substring(value.length + 1);
            }
            //get the returned array or the read value and store it in the listItem
            if(value.includes('\"')) value = value.substring(1, value.length-1);
            resultArray.push({
                keyName: key,
                value: value,
                parentKeyName: parent
            })
            if(stringRep.length==0) finished = false;
        }
        return resultArray;
    };


    /**
     * Renders a list entry for the provided list entry
     * @param data The list item to be displayed, or an array of list items
     * Currently doesnt display a checkbox for parents, option to be added
     */
    const renderListItem = (data: ListItemRepresentation, level = 0) => {
        indexCounter++;
        const itemKey = indexCounter + data.keyName
        if(Array.isArray(data.value)) {
            return (
                <React.Fragment key={indexCounter + "listFragment"}>
                    <ListItem style={{marginLeft: level*30}} key={itemKey} divider={true}>
                        <ListItemText
                            primary={data.keyName + " (object)"}
                            secondary={null}
                        />
                    </ListItem>
                    {data.value.map((item) => renderListItem(item, level+1))}
                </React.Fragment>
        )
        } else {
            return (
                <ListItem style={{marginLeft: level*30}} key={itemKey} divider={true}>
                    <ListItemIcon>
                        <FormControlLabel
                            control={
                                <Checkbox onClick={() => checkboxHandler(itemKey)} checked={props.selectedData.has(itemKey)}/>
                            }
                            label={''}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={data.keyName + " - " + data.value}
                        secondary={null}
                    />
                </ListItem>
            )
        }
    };

    /**
     * Adds an item to the set of selected list items
     * @param data The item to be added
     */
    const addToSelection = (data: string) => {
        props.setSelectedData(new Set(props.selectedData).add(data));
    };

    /**
     * Removes an item from the set of selected list items
     * @param data The item to be removed
     */
    const  removeFromSelection = (data: string) => {
        const setCopy = new Set(props.selectedData);
        setCopy.delete(data);
        props.setSelectedData(setCopy);
    };

    /**
     * Method that handles clicking on a checkbox.
     * @param data The name of the list item key the checkbox was set for.
     */
    const checkboxHandler = (data: string) => {
        console.log(data);
        console.log(props.selectedData.has(data));
        if (props.selectedData.has(data)) {
            removeFromSelection(data);
        } else {
            addToSelection(data)
            console.log("new: " + props.selectedData.has(data));
        }

        //console.log(props.selectedData.values().next())
    };

    //not used anymore: {data.sort((a, b) => a.localeCompare(b)).map(renderListItem)}
    return (
        <StepFrame
            heading = "Datenauswahl"
            hintContent = {hintContents.dataSelection}
        >
            <Grid container justify="space-around" className={classes.elementMargin}>
                <Grid item xs={12}>
                    <Typography variant="body1">
                        Folgende Datenwerte wurden von der Request zurückgegeben:
                    </Typography>
                </Grid>
                <Grid item xs={10}>
                    <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.listFrame} key={indexCounter + "listBox"}>
                        <List disablePadding={true} key={indexCounter + "listRoot"}>
                            {listItems.map((item) => renderListItem(item, 0))}
                        </List>
                    </Box>
                </Grid>
                <Grid item xs={12} className={classes.elementMargin}>
                    <Typography variant="body1">
                        Bitte wählen sie alle von der API zu erfassenden Daten.
                    </Typography>
                </Grid>
                <Grid item xs={12} className={classes.elementMargin}>
                    <Typography variant="body2">
                        Die Daten sehen fehlerhaft aus? Gehen sie einen Schritt zurück und prüfen sie Request und Key der API.
                    </Typography>
                </Grid>
                <Grid item container xs={12} justify="space-between" className={classes.elementMargin}>
                    <Grid item>
                        <Button variant="contained" size="large" color="primary" onClick={props.backHandler}>
                            zurück
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonPrimary}>
                        <Button variant="contained" size="large" color="primary" disabled={props.selectedData.size==0} onClick={props.continueHandler}>
                            weiter
                        </Button>
                        <Button variant="contained" size="large" onClick={(event) => {setListItems(transformJSON(sampleJSON))}}>Janek Test</Button>
                    </Grid>
                </Grid>
            </Grid>
        </StepFrame>
    )

}
