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
    apiData: any;
    selectedData: Set<string>;
    setSelectedData: (set: Set<string>) => void;
}

/** Internal representation of a list item extracted from the JSON object.
 * @param keyName The direct key name of the entry
 * @param value Holds a string with the type of the value or a sub-object
 * @param parentKeyName Holds the keyName of the parent as a full path within the JSON object
 * @param arrayRep True when this entry represents an array, used for specific rendering
 * @param arrayLength Holds the length of the array, if it is such
 */
interface ListItemRepresentation {
    keyName: string;
    value: any;
    parentKeyName: string;
    arrayRep: boolean;
    arrayLength: number;
}


export const DataSelection: React.FC<DataSelectionProps>  = (props) => {
    const classes = useStyles();

    const [data, setData] = React.useState<Array<string>>(['Temperatur', 'Windgeschwindigkeit', 'Regenwahrscheinlichkeit', 'Temperatur(gefühlt)', 'Sonnenuntergang', 'Sonnenaufgang', 'Sonnenstunden', 'data0', 'data1', 'data2']);

    const[listItems, setListItems] = React.useState<Array<ListItemRepresentation>>([]);
    //a local variable is used since it will be reset to zero when re-rendering, this behavior is wanted
    let indexCounter = 0


    //everytime there is a change in the source data, rebuild the list and clean the selection
    React.useEffect(() => {
        transformJSON(props.apiData);
        props.setSelectedData(new Set());
    }, [props.apiData]);

    //sample JSON-data to test the different depth levels and parsing
    const sample2 = {
        "season_helper": {
            "Envelope": {
                "Body": {
                    "GetMatchByMatchIDResponse": {
                        "GetMatchByMatchIDResult": {
                            "leagueSaison": "Text"
                        }
                    }
                }
            }
        },
        "Spiele": {
            "same_type": true,
            "length": 2,
            "object": {
                "MatchID": "Zahl",
                "MatchDateTime": "Text",
                "TimeZoneID": "Text",
                "LeagueId": "Zahl",
                "LeagueName": "Text",
                "MatchDateTimeUTC": "Text",
                "Team1": {
                    "TeamId": "Zahl",
                    "TeamName": "Text",
                    "ShortName": "Text",
                    "TeamIconUrl": "Text",
                    "TeamGroupName": "Ohne Wert"
                },
                "LastUpdateDateTime": "Text",
                "MatchIsFinished": "Wahrheitswert",
                "MatchResults": {
                    "same_type": true,
                    "length": 2,
                    "object": {
                        "ResultID": "Zahl",
                        "ResultName": "Text",
                        "PointsTeam1": "Zahl",
                        "PointsTeam2": "Zahl",
                        "ResultOrderID": "Zahl",
                        "ResultTypeID": "Zahl",
                        "ResultDescription": "Text"
                    }
                },
                "Goals": {
                    "same_type": true,
                    "length": 2,
                    "object": {
                        "GoalID": "Zahl",
                        "ScoreTeam1": "Zahl",
                        "ScoreTeam2": "Zahl",
                        "MatchMinute": "Zahl",
                        "GoalGetterID": "Zahl",
                        "GoalGetterName": "Text",
                        "IsPenalty": "Wahrheitswert",
                        "IsOwnGoal": "Wahrheitswert",
                        "IsOvertime": "Wahrheitswert",
                        "Comment": "Ohne Wert"
                    }
                },
                "Location": "Ohne Wert",
                "NumberOfViewers": "Ohne Wert"
            }
        },
        "Tabelle": {
            "same_type": true,
            "length": 2,
            "object": {
                "TeamInfoId": "Zahl",
                "TeamName": "Text",
                "Points": "Zahl",
                "test": {
                    "same_type": true,
                    "length": 5,
                    "type": "Text"
                },
                "test2": {
                    "same_type": false,
                    "length": 4,
                    "type": [
                        "Zahl",
                        "Text",
                        "Liste",
                        "JSON"
                    ]
                },
                "test3": {
                    "same_type": true,
                    "length": 2,
                    "object": {
                        "same_type": true,
                        "length": 1,
                        "type": "Text"
                    }
                }
            }
        },
        "Vorherige-Season": "Text"
    };

    /**
     * Takes an object (supposed to be JSON data) and returns an array representation of it.
     * @param jsonData The data-Object to be turned into an array.
     * @param parent Used for recursive calls, marks the parent of items in a sub-object.
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
            key = key.substring(1, key.length - 1);
            console.log("key: " + key);

            let value: any = "";
            //check if the value is another object
            if (stringRep[0] === "{") {
                //The value is a sub-object or an array
                let subObject = stringRep.split("}", 1)[0] + "}"
                let counter = 1;
                //detect the whole sub-object/array
                while (subObject.split("{").length - 1 != subObject.split("}").length - 1) {
                    let splitArray = stringRep.split("}", counter);
                    subObject = "";
                    for (let i = 0; i < counter; i++) {
                        subObject += splitArray[i] + "}";
                    }
                    counter += 1;
                }
                console.log("checking subobject: " + subObject);
                //lookahead to the next key - if it is same_type, we know that we have an array
                let nextKey = subObject.split(":", 2)[0];
                //strip quotation marks and the opening curly bracket
                nextKey = nextKey.substring(2, nextKey.length - 1);
                console.log("nextKey: " + nextKey);
                if(nextKey=="same_type") {
                    //a sub array was detected
                    let same_type_value = subObject.split(",", 2)[0];
                    same_type_value = same_type_value.substring(nextKey.length+4);
                    console.log(same_type_value)
                    //we also parse the length and store it in the corresponding attribute
                    let array_length = subObject.split(",", 2)[1];
                    array_length = array_length.substring(9);
                    console.log(array_length);
                    console.log(subObject);
                    if(same_type_value=="true") {
                        //check if the value of nextKey is "true" - if this is the case, our value is the subobject
                        //we now need to differentiate if the content is an object or primitives
                        let element = subObject.substring(24 + same_type_value.length + array_length.length).split(":", 1)[0]
                        if(element.substring(1, element.length-1)=="object") {
                            //when the object starts with sameType as the first key, we need to mark it as array in array and not further display it
                            let object = subObject.substring(33 + same_type_value.length + array_length.length, subObject.length-1);
                            let objectLookahead = object.split(":")[0];
                            if(objectLookahead.substring(2, objectLookahead.length-1)=="same_type") {
                                value = "[Array]"
                            } else {
                                value = transformJSON(JSON.parse(object), (parent==""?key:parent + "|" + key) + "|0")
                            }
                            resultArray.push({
                                keyName: key + "|0",
                                value: value,
                                parentKeyName: parent,
                                arrayRep: true,
                                arrayLength: parseInt(array_length)
                            })
                        } else {
                            //primitive array contents
                            value = subObject.substring(32 + same_type_value.length + array_length.length, subObject.length-2);
                            resultArray.push({
                                keyName: key + "|0",
                                value: value,
                                parentKeyName: parent,
                                arrayRep: true,
                                arrayLength: parseInt(array_length)
                            })
                        }
                    } else {
                        //if it is false, we set a string containing all the data types
                        let object = subObject.substring(31 + same_type_value.length + array_length.length, subObject.length-1);
                        let typeString = "";
                        for (let x of object.substring(1, object.length-1).split(",")) {
                            typeString+=x.substring(1, x.length-1) + ", ";
                        }
                        typeString = typeString.substring(0, typeString.length-2);
                        resultArray.push({
                            keyName: key + "|0",
                            value: typeString,
                            parentKeyName: parent,
                            arrayRep: true,
                            arrayLength: parseInt(array_length)
                        })
                    }
                    //cut the handled array-object
                    stringRep = stringRep.substring(subObject.length + 1);
                    if(stringRep.length==0) finished = false;
                    continue
                }
                //only reached when it is an object, not an array
                value = transformJSON(JSON.parse(subObject), parent==""?key:parent + "|" + key);
                stringRep = stringRep.substring(subObject.length + 1);
            } else {
                //the value is a type, the data is primitive
                value = stringRep.includes(",")?stringRep.split(",", 1)[0]:stringRep.split("}", 1)[0];
                stringRep = stringRep.substring(value.length + 1);
            }
            //get the returned array or the read value and store it in the listItem
            if(value.includes('\"')) value = value.substring(1, value.length-1);
            resultArray.push({
                keyName: key,
                value: value,
                parentKeyName: parent,
                arrayRep: false,
                arrayLength: 0
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
        if(Array.isArray(data.value)) {
            //object or array with same_type==true
            return (
                <React.Fragment key={indexCounter + "listFragment"}>
                    <ListItem style={{marginLeft: level * 30}}
                              key={data.parentKeyName == "" ? data.keyName : data.parentKeyName + "|" + data.keyName}
                              divider={true}>
                        {data.arrayRep &&
                        <ListItemIcon>
                            <FormControlLabel
                                control={
                                    <Checkbox onClick={() => checkboxHandler(data.parentKeyName==""?data.keyName:data.parentKeyName + "|" + data.keyName)} checked={props.selectedData.has(data.parentKeyName==""?data.keyName:data.parentKeyName + "|" + data.keyName)}/>
                                }
                                label={''}
                            />
                        </ListItemIcon>
                        }
                        <ListItemText
                            primary={data.arrayRep ? data.keyName + " (Array[0]), length: " + data.arrayLength : data.keyName + " (object)"}
                            secondary={null}
                        />
                    </ListItem>
                    {data.value.map((item) => renderListItem(item, level + 1))}
                </React.Fragment>
            )
        } else if(data.arrayRep) {
            //array without same_type==false
            return (
                <ListItem style={{marginLeft: level*30}} key={data.parentKeyName==""?data.keyName:data.parentKeyName + "|" + data.keyName} divider={true}>
                    <ListItemIcon>
                        <FormControlLabel
                            control={
                                <Checkbox onClick={() => checkboxHandler(data.parentKeyName==""?data.keyName:data.parentKeyName + "|" + data.keyName)} checked={props.selectedData.has(data.parentKeyName==""?data.keyName:data.parentKeyName + "|" + data.keyName)}/>
                            }
                            label={''}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={data.keyName + " (Array[0]), length: " + data.arrayLength +", content types: " + data.value}
                        secondary={null}
                    />
                </ListItem>
            )
        } else {
            return (
                <ListItem style={{marginLeft: level*30}} key={data.parentKeyName==""?data.keyName:data.parentKeyName + "|" + data.keyName} divider={true}>
                    <ListItemIcon>
                        <FormControlLabel
                            control={
                                <Checkbox onClick={() => checkboxHandler(data.parentKeyName==""?data.keyName:data.parentKeyName + "|" + data.keyName)} checked={props.selectedData.has(data.parentKeyName==""?data.keyName:data.parentKeyName + "|" + data.keyName)}/>
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
                        <Button variant="contained" size="large" onClick={(event) => {setListItems(transformJSON(sample2))}}>Janek Test</Button>
                    </Grid>
                </Grid>
            </Grid>
        </StepFrame>
    )

}
