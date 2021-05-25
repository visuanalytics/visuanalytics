import React from "react";
import {useStyles} from "../style";
import {StepFrame} from "../StepFrame";
import {hintContents} from "../../util/hintContents";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Box from "@material-ui/core/Box";
import {ListItemRepresentation, SelectedDataItem} from "../types";
import {transformJSON, extractKeysFromSelection} from "../helpermethods";


interface DataSelectionProps {
    continueHandler: () => void;
    backHandler: () => void;
    apiData: any;
    selectedData: Array<SelectedDataItem>;
    setSelectedData: (array: Array<SelectedDataItem>) => void;
}



export const DataSelection: React.FC<DataSelectionProps>  = (props) => {
    const classes = useStyles();

    const[listItems, setListItems] = React.useState<Array<ListItemRepresentation>>([]);
    //a local variable is used since it will be reset to zero when re-rendering, this behavior is wanted
    let indexCounter = 0


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




    //extract apiData and setSelectedData from props to use it in useEffect
    const apiData = props.apiData;
    const setSelectedData = props.setSelectedData

    //TODO: add to documentation
    //everytime there is a change in the source data, rebuild the list and clean the selection
    React.useEffect(() => {
        if(Object.keys(apiData).length!==0) {
            setListItems(transformJSON(apiData));
            setSelectedData([]);
        }
    }, []);


    /**
     * Renders a list entry for the provided list entry
     * @param data The list item to be displayed, or an array of list items
     * @param level Used to identify how deep the item is placed within the structure, will cause a left margin when displayed
     * Currently doesnt display a checkbox for parents, option to be added
     */
    const renderListItem = (data: ListItemRepresentation, level = 0) => {
        indexCounter++;
        if(Array.isArray(data.value)) {
            //object or array with same_type===true
            return (
                <React.Fragment key={indexCounter + "listFragment"}>
                    <ListItem style={{marginLeft: level * 30}}
                              key={data.parentKeyName === "" ? data.keyName : data.parentKeyName + "|" + data.keyName}
                              divider={true}>
                        <ListItemText
                            primary={data.arrayRep ? data.keyName + " (Array[0]), length: " + data.arrayLength : data.keyName + " (object)"}
                            secondary={null}
                        />
                    </ListItem>
                    {data.value.map((item) => renderListItem(item, level + 1))}
                </React.Fragment>
            )
        } else if(data.arrayRep) {
            const selectedDataObj: SelectedDataItem = {
                key: data.parentKeyName===""?data.keyName:data.parentKeyName + "|" + data.keyName,
                type: "Array"
            }
            //array without same_type===false
            return (
                <ListItem style={{marginLeft: level*30}} key={data.parentKeyName===""?data.keyName:data.parentKeyName + "|" + data.keyName} divider={true}>
                    <ListItemIcon>
                        <FormControlLabel
                            control={
                                <Checkbox onClick={() => checkboxHandler(selectedDataObj)} checked={extractKeysFromSelection(props.selectedData).includes(selectedDataObj.key)}/>
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
            const selectedDataObj: SelectedDataItem = {
                key: data.parentKeyName===""?data.keyName:data.parentKeyName + "|" + data.keyName,
                type: data.value
            }
            return (
                <ListItem style={{marginLeft: level*30}} key={data.parentKeyName===""?data.keyName:data.parentKeyName + "|" + data.keyName} divider={true}>
                    <ListItemIcon>
                        <FormControlLabel
                            control={
                                <Checkbox onClick={() => checkboxHandler(selectedDataObj)} checked={extractKeysFromSelection(props.selectedData).includes(selectedDataObj.key)}/>
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
    const addToSelection = (data: SelectedDataItem) => {
        const arCopy = props.selectedData.slice()
        arCopy.push(data)
        props.setSelectedData(arCopy);
    };

    /**
     * Removes an item from the set of selected list items
     * @param data The item to be removed
     */
    const  removeFromSelection = (data: SelectedDataItem) => {
        props.setSelectedData(props.selectedData.filter((item) => {
            return item.key !== data.key;
        }));
    };

    /**
     * Method that handles clicking on a checkbox.
     * @param data The name of the list item key the checkbox was set for.
     */
    const checkboxHandler = (data: SelectedDataItem) => {
        //console.log(data);
        if (extractKeysFromSelection(props.selectedData).includes(data.key)) {
            removeFromSelection(data);
        } else {
            addToSelection(data)
            //console.log("new: " + extractKeysFromSelection(props.selectedData).includes(data.key));
        }

        //console.log(props.selectedData.values().next())
    };

    //not used anymore: {data.sort((a, b) => a.localeCompare(b)).map(renderListItem)}
    return (
        <StepFrame
            heading = "Datenauswahl"
            hintContent = {hintContents.dataSelection}
        >
            <Grid container justify="space-around" className={classes.elementLargeMargin}>
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
                <Grid item xs={12} className={classes.elementLargeMargin}>
                    <Typography variant="body1">
                        Bitte wählen sie alle von der API zu erfassenden Daten.
                    </Typography>
                </Grid>
                <Grid item xs={12} className={classes.elementLargeMargin}>
                    <Typography variant="body2">
                        Die Daten sehen fehlerhaft aus? Gehen sie einen Schritt zurück und prüfen sie Request und Key der API.
                    </Typography>
                </Grid>
                <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                    <Grid item>
                        <Button variant="contained" size="large" color="primary" onClick={props.backHandler}>
                            zurück
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonPrimary}>
                        <Button variant="contained" size="large" color="primary" disabled={props.selectedData.length===0} onClick={props.continueHandler}>
                            weiter
                        </Button>
                        <Button variant="contained" size="large" onClick={(event) => {setListItems(transformJSON(sample2))}}>Janek Test</Button>
                    </Grid>
                </Grid>
            </Grid>
        </StepFrame>
    )

}
