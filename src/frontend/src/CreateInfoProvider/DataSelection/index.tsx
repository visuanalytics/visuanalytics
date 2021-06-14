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
import {FormelObj} from "../CreateCustomData/CustomDataGUI/formelObjects/FormelObj";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";

interface DataSelectionProps {
    continueHandler: () => void;
    backHandler: () => void;
    //apiData: any;
    selectedData: Array<SelectedDataItem>;
    setSelectedData: (array: Array<SelectedDataItem>) => void;
    listItems: Array<ListItemRepresentation>;
    setListItems: (array: Array<ListItemRepresentation>) => void; //TODO: only used for "janek test", remove in production
    historizedData: Array<string>;
    setHistorizedData: (array: Array<string>) => void;
    customData: Array<FormelObj>;
    setCustomData: (array: Array<FormelObj>) => void;
}


export const DataSelection: React.FC<DataSelectionProps>  = (props) => {
    const classes = useStyles();

    //a local variable is used since it will be reset to zero when re-rendering, this behavior is wanted
    let indexCounter = 0
    //save the value selectedData on loading to compare if any deletions were made
    const [oldSelectedData] = React.useState(props.selectedData);
    //save the formulas that need to be removed
    const [formulasToRemove, setFormulasToRemove] = React.useState<Array<string>>([]);
    //save the diagrams that need to be removed
    const [diagramsToRemove, setDiagramsToRemove] = React.useState<Array<string>>([]);
    //save the historized data that need to be removed
    const [historizedToRemove, setHistorizedToRemove] = React.useState<Array<string>>([]);
    //true when the dialog for deleting formulas and diagrams is open
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

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
            },
            "InnerObject": {
                "NoStringAttributeArray": {
                    "same_type": true,
                    "length": 3,
                    "object": {
                        "Zahl1": "Zahl",
                        "Zahl2": "Zahl"
                    }
                },
                "ArrayInObject": {
                    "same_type": true,
                    "length": 3,
                    "object": {
                        "Menge": "Zahl",
                        "Gewicht": "Zahl",
                        "Bezeichnung": "Text",
                        "Kürzel": "Text"
                    }
                },
                "NumericArray": {
                    "same_type": true,
                    "length": 6,
                    "type": "Zahl"
                },
                "TextArray": {
                    "same_type": true,
                    "length": 3,
                    "type": "Text"
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
        "Vorherige-Season": "Text",
        "Test-Zahl": "Zahl"
    };


    /**
     * Method to find the names of all formulas that use a specific data element.
     * Used to detect formulas to delete when the data they use is deleted/unchecked.
     * @param data Name of the data usages are searched for.
     */
    const getFormulasUsingData = (data: string) => {
        const formulas: Array<string> = [];
        props.customData.forEach((formula) => {
            //if the name is included, it is used by the formula
            if(formula.formelString.includes(data)) formulas.push(formula.formelName)
        })
        return formulas;
    }

    /**
     * Type used for returning the elements to be removed from the method calculateItemsToRemove.
     * Necessary since setting the state instead would require a new render.
     */
    type elementsToRemove = {
        historizedToRemove: Array<string>;
        formulasToRemove: Array<string>;
        diagramsToRemove: Array<string>;
    }

    /**
     * Checks if any items were removed from selectedData by comparing to the old value.
     * If this is the case, related entries in formula, diagrams and historizedData will be added to an object
     * which is returned.
     */
    const calculateItemsToRemove = () => {
        //check if anything was removed - list all removed items
        const removalObj: elementsToRemove = {
            historizedToRemove: [],
            formulasToRemove: [],
            diagramsToRemove: []
        }
        const oldSelection = extractKeysFromSelection(oldSelectedData);
        const newSelection = extractKeysFromSelection(props.selectedData);
        const missingSelections: Array<string> = [];
        oldSelection.forEach((oldItem) => {
            if(!newSelection.includes(oldItem)) missingSelections.push(oldItem)
        })
        if(missingSelections.length > 0) {
            //check if removal of formula is necessary
            let formulasToRemove: Array<string> = [];
            missingSelections.forEach((item) => {
                formulasToRemove = formulasToRemove.concat(getFormulasUsingData(item));
            })
            removalObj.formulasToRemove = formulasToRemove;
            //check if diagrams need to be deleted
            const diagramsToRemove: Array<string> = [];
            //TODO: implement searching all diagrams depending on the deleted items and deleted formula
            removalObj.diagramsToRemove = diagramsToRemove;
            //check if any historized data needs to be removed
            removalObj.historizedToRemove = props.historizedData.filter((item) => {
                return missingSelections.includes(item)||removalObj.formulasToRemove.includes(item);
            })
        }
        return removalObj;
    }

    /**
     * Method that removes everything form historizedData that needs to because of unchecking values.
     */
    const removeFromHistorized = (toRemove: Array<string>) => {
        const newHistorizedData = props.historizedData.filter((item) => {
            return !toRemove.includes(item);
        })
        props.setHistorizedData(newHistorizedData);
    }

    /**
     * Method that deletes all historizedData, formulas and diagrams from their
     * state in the wrapper component that need to be because of unchecking.
     * Uses formulasToRemove, diagramsToRemove and historizedToRemove to check which values these are.
     */
    const deleteDependentElements = () => {
        removeFromHistorized(historizedToRemove);
        props.setCustomData(props.customData.filter((formula) => {
            return !formulasToRemove.includes(formula.formelName);
        }));
        //TODO: delete diagrams

    }

    /**
     * Handler method for continuing to the next step.
     * If there are any for diagrams or formula, the user will be asked for confirmation and nothing will be deleted.
     * Returns true when everything is done, false when the user is asked for confirmation.
     * This method is called on proceed and not when clicking a checkbox to avoid too much computation.
     */
    const handleContinue = () => {
        const removalObj = calculateItemsToRemove();
        //if checkRemoval returns false, no removal dialog is necessary and proceeding is possible
        if(removalObj.formulasToRemove.length > 0 || removalObj.diagramsToRemove.length > 0) {
            setHistorizedToRemove(removalObj.historizedToRemove);
            setFormulasToRemove(removalObj.formulasToRemove);
            setDiagramsToRemove(removalObj.diagramsToRemove);
            setDeleteDialogOpen(true);
        } else {
            removeFromHistorized(removalObj.historizedToRemove);
            props.continueHandler();
        }
    }


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
                type: "Array",
                arrayValueType: data.value
            }
            //array that contains primitives with same_type false or true; or containing array
            //if the array includes another array or has same type false, no selection is allowed and no checkbox will be displayed
            return (
                <ListItem style={{marginLeft: level*30}} key={data.parentKeyName===""?data.keyName:data.parentKeyName + "|" + data.keyName} divider={true}>
                    <ListItemIcon>
                        { !(data.value === "[Array]" || data.value.includes(", ")) &&
                            <FormControlLabel
                                control={
                                    <Checkbox onClick={() => checkboxHandler(selectedDataObj)} checked={extractKeysFromSelection(props.selectedData).includes(selectedDataObj.key)}/>
                                }
                                label={''}
                            />
                        }
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
                            {props.listItems.map((item) => renderListItem(item, 0))}
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
                        <Button variant="contained" size="large" color="primary" disabled={props.selectedData.length===0} onClick={handleContinue}>
                            weiter
                        </Button>
                        <Button variant="contained" size="large" onClick={() => {props.setListItems(transformJSON(sample2))}}>Janek Test</Button>
                    </Grid>
                </Grid>
            </Grid>
            <Dialog onClose={() => {
                setDeleteDialogOpen(false);
                window.setTimeout(() => {
                    setDiagramsToRemove([]);
                    setFormulasToRemove([]);
                }, 200);
            }} aria-labelledby="deleteDialog-title"
                    open={deleteDialogOpen}>
                <DialogTitle id="deleteDialog-title">
                    Löschen von Formeln und Diagrammen bestätigen
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Durch das Abwählen einiger Daten müssen Formeln und Diagramme gelöscht werden, die diese Daten nutzen.
                    </Typography>
                    <Typography gutterBottom>
                        {formulasToRemove.length > 0 ? "Folgende Formeln sind betroffen: " + formulasToRemove.join(", ") : ""}
                    </Typography>
                    <Typography gutterBottom>
                        {diagramsToRemove.length > 0 ? "Folgende Diagramme sind betroffen: " + diagramsToRemove.join(", ") : ""}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Grid container justify="space-between">
                        <Grid item>
                            <Button variant="contained"
                                    onClick={() => {
                                        setDeleteDialogOpen(false);
                                        window.setTimeout(() => {
                                            setDiagramsToRemove([]);
                                            setFormulasToRemove([]);
                                        }, 200);
                                    }}>
                                abbrechen
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained"
                                    onClick={() => {
                                        deleteDependentElements();
                                        props.continueHandler();
                                    }}
                                    className={classes.redDeleteButton}>
                                Löschen bestätigen
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </StepFrame>
    )

}
