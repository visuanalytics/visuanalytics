import React from "react";
import {useStyles} from "../style";
import {StepFrame} from "../StepFrame";
import {hintContents} from "../../util/hintContents";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid, {GridSize} from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {transformJSON, extractKeysFromSelection} from "../helpermethods";
import {Diagram, ListItemRepresentation, SelectedDataItem, uniqueId} from "../types";
import {Dialog, DialogActions, DialogContent, DialogTitle, Divider} from "@material-ui/core";
import {FormelObj} from "../DataCustomization/CreateCustomData/CustomDataGUI/formelObjects/FormelObj";

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
    diagrams: Array<Diagram>
    setDiagrams: (array: Array<Diagram>) => void;
    apiName: string;
}


export const DataSelection: React.FC<DataSelectionProps>  = (props) => {
    const classes = useStyles();

    //save the value selectedData on loading to compare if any deletions were made
    const [oldSelectedData, setOldSelectedData] = React.useState(props.selectedData);
    //save the formulas that need to be removed
    const [formulasToRemove, setFormulasToRemove] = React.useState<Array<string>>([]);
    //save the diagrams that need to be removed
    const [diagramsToRemove, setDiagramsToRemove] = React.useState<Array<string>>([]);
    //save the historized data that need to be removed
    const [historizedToRemove, setHistorizedToRemove] = React.useState<Array<string>>([]);
    //true when the dialog for deleting formulas and diagrams is open
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

    //store the copy of the old selectedData in the sessionStorage
    React.useEffect(() => {
        if (sessionStorage.getItem("firstDataSelectionEntering-" + uniqueId) !== null) {
            setOldSelectedData(sessionStorage.getItem("oldSelectedData-" + uniqueId) === null ? [] : JSON.parse(sessionStorage.getItem("oldSelectedData-" + uniqueId)!))
        } else {
            //leave a marker in the sessionStorage to identify if this is the first entering
            sessionStorage.setItem("firstDataSelectionEntering-" + uniqueId, "false");
        }
    }, [])
    React.useEffect(() => {
        sessionStorage.setItem("oldSelectedData-" + uniqueId, JSON.stringify(oldSelectedData))
    }, [oldSelectedData])
    const clearSessionStorage = () => {
        sessionStorage.removeItem("oldSelectedData-" + uniqueId)
        sessionStorage.removeItem("firstDataSelectionEntering-" + uniqueId)
    }

    //sample JSON-data to test the different depth levels and parsing
    const sample2 = {
        "season_helper": {
            "Envelope": {
                "Body": {
                    "GetMatchByMatchIDResponseABCDEFGHIJKLMNOPQRSTUVWXYZ123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789": {
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
                        "Zahl1ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789": "Zahl",
                        "Zahl2": "Zahl"
                    }
                },
                "ArrayInObjectABCDEFGHIJKLMNOPQRSTUVWXYZ123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789": {
                    "same_type": true,
                    "length": 3,
                    "object": {
                        "MengeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA": "Zahl",
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
        "SpieleABCDEFGHIJKLMNOPQRSTUVWXYZ123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789": {
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
        "Test-ZahlABCDEFGHIJKLMNOPQRSTUVWXYZ123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789": "Zahl"
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
            //TODO: if another data that includes the name followed by a whitespace, there would be a match
            //possible solutions: no whitespaces or array of data for each formula
            if(formula.formelString.includes(data + " ") || formula.formelString.endsWith(data)) formulas.push(formula.formelName)
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
            //check if any historized data needs to be removed
            removalObj.historizedToRemove = props.historizedData.filter((item) => {
                return missingSelections.includes(item)||removalObj.formulasToRemove.includes(item);
            })
            const diagramsToRemove: Array<string> = [];
            //since arrays cannot be selected or be formula, we only need to check diagrams based on historized data
            removalObj.formulasToRemove.forEach((formula) => {
                //check for each formula if it is used in historized diagrams
                props.diagrams.forEach((diagram) => {
                    //only diagrams with historized data are relevant
                    if(diagram.sourceType==="Historized"&&diagram.historizedObjects!==undefined) {
                        for (let index = 0; index < diagram.historizedObjects.length; index++) {
                            const historized = diagram.historizedObjects[index];
                            //the dataSource name needs to be added in front of the formula name since historizedObjects has dataSource name in it paths too
                            //it is also checked if the same diagram has already been marked by another formula
                            if(props.apiName + "|" + formula===historized.name&&(!diagramsToRemove.includes(diagram.name))) {
                                diagramsToRemove.push(diagram.name);
                                break;
                            }
                        }
                    }
                })
            })
            //check the same for all historized data that has to be removed
            removalObj.historizedToRemove.forEach((historizedData) => {
                props.diagrams.forEach((diagram) => {
                    if(diagram.sourceType==="Historized"&&diagram.historizedObjects!==undefined) {
                        for (let index = 0; index < diagram.historizedObjects.length; index++) {
                            const historized = diagram.historizedObjects[index];
                            //the dataSource name needs to be added in front of the historized element name since historizedObjects has dataSource name in it paths too
                            //it is also checked if the same diagram has already been marked by another formula or historized data
                            if(props.apiName + "|" + historizedData===historized.name&&(!diagramsToRemove.includes(diagram.name))) {
                                diagramsToRemove.push(diagram.name);
                                break;
                            }
                        }
                    }
                })
            })
            removalObj.diagramsToRemove = diagramsToRemove;
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
        props.setDiagrams(props.diagrams.filter((diagram) => {
            return !diagramsToRemove.includes(diagram.name);
        }))
    }

    //true when the dialog for going back and reverting changes is open
    const [backDialogOpen, setBackDialogOpen] = React.useState(false);

    //TODO: document this and why it is needed
    /**
     * Handler method for clicking the back button.
     * Checks if any selections were removed - if so, it warns the user that all changes will be reverted.
     * This is necessary since without the user could unselect elements without deleting dependent diagrams.
     */
    const backHandler = () => {
        const missingSelections: Array<string> = [];
        oldSelectedData.forEach((item) => {
            if(!props.selectedData.includes(item)) missingSelections.push(item.key);
        })
        if(missingSelections.length===0) {
            clearSessionStorage();
            props.backHandler();
        }
        else setBackDialogOpen(true);
    }

    /**
     * Method called by the dialog for going back to the step before.
     * Resets the selection to its old value and goes back to the last step.
     */
    const revertAndBack= () => {
        props.setSelectedData(oldSelectedData);
        clearSessionStorage();
        props.backHandler();
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
            clearSessionStorage();
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
        const xsSize = level>0?11:12;
        if(Array.isArray(data.value)) {
            //object or array with same_type===true
            return (
                <Grid item container justify="flex-end" xs={xsSize as GridSize} className={classes.dataSelectionListItem} key={data.parentKeyName === "" ? data.keyName : data.parentKeyName + "|" + data.keyName}>
                    <Grid item container xs={12}>
                        <Grid item xs={12}>
                            <Typography className={classes.processingListingText}>
                                {data.arrayRep ? data.keyName + " (Array[0]), length: " + data.arrayLength : data.keyName + " (object)"}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} className={classes.elementLargeMargin}>
                        <Divider />
                    </Grid>
                    {data.value.map((item) => renderListItem(item, level + 1))}
                </Grid>
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
                <Grid item container justify="flex-end" xs={xsSize as GridSize} className={classes.dataSelectionListItem} key={data.parentKeyName===""?data.keyName:data.parentKeyName + "|" + data.keyName}>
                    <Grid item className={classes.dataSelectionCheckboxItem}>
                        { !(data.value === "[Array]" || data.value.includes(", ") || data.value === "different object types") &&
                            <FormControlLabel
                                control={
                                    <Checkbox onClick={() => checkboxHandler(selectedDataObj)} checked={extractKeysFromSelection(props.selectedData).includes(selectedDataObj.key)}/>
                                }
                                label={''}
                            />
                        }
                    </Grid>
                    <Grid item container xs={11}>
                        <Grid item xs={12}>
                            <Typography className={classes.processingListingText}>
                                {data.keyName + " (Array[0]), length: " + data.arrayLength +", content types: " + data.value}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} className={classes.elementLargeMargin}>
                        <Divider />
                    </Grid>
                </Grid>
            )
        } else {
            const selectedDataObj: SelectedDataItem = {
                key: data.parentKeyName===""?data.keyName:data.parentKeyName + "|" + data.keyName,
                type: data.value
            }
            return (
                <Grid item container justify="flex-end" xs={xsSize as GridSize} className={classes.dataSelectionListItem} key={data.parentKeyName===""?data.keyName:data.parentKeyName + "|" + data.keyName}>
                    <Grid item className={classes.dataSelectionCheckboxItem}>
                        <FormControlLabel
                            control={
                                <Checkbox onClick={() => checkboxHandler(selectedDataObj)} checked={extractKeysFromSelection(props.selectedData).includes(selectedDataObj.key)}/>
                            }
                            label={''}
                        />
                    </Grid>
                    <Grid item container xs={11}>
                        <Grid item xs={12}>
                            <Typography className={classes.processingListingText}>
                                {data.keyName + " - " + data.value}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} className={classes.elementLargeMargin}>
                        <Divider />
                    </Grid>
                </Grid>
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
                <Grid item container xs={10}>
                    <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.listFrame}>
                        <Grid item container xs={12} justify="flex-end">
                            <List disablePadding={true}  style={{width: "100%"}}>
                                {props.listItems.map((item) => renderListItem(item, 0))}
                            </List>
                        </Grid>
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
                        <Button variant="contained" size="large" color="primary" onClick={() => {
                            backHandler();
                        }}>
                            zurück
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonPrimary}>
                        <Button variant="contained" size="large" color="primary" disabled={props.selectedData.length===0} onClick={handleContinue}>
                            weiter
                        </Button>
                        {<Button variant="contained" size="large" onClick={() => {props.setListItems(transformJSON(sample2))}}>Janek Test</Button>}
                    </Grid>
                </Grid>
            </Grid>
            <Dialog onClose={() => {
                setBackDialogOpen(false);
            }} aria-labelledby="backDialog-title"
                    open={backDialogOpen}>
                <DialogTitle id="backDialog-title">
                    Verwerfen der Änderungen
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Das Zurückgehen zum vorherigen Schritt erfordert, dass alle neu gewählten oder abgewählten Daten verworfen werden.
                    </Typography>
                    <Typography gutterBottom>
                        Wirklich zurückgehen?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Grid container justify="space-between">
                        <Grid item>
                            <Button variant="contained"
                                    onClick={() => {
                                        setBackDialogOpen(false);
                                    }}>
                                abbrechen
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained"
                                    onClick={() => {
                                        revertAndBack()
                                    }}
                                    className={classes.redDeleteButton}>
                                zurück
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
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
                    <Typography gutterBottom className={classes.wrappedText}>
                        {formulasToRemove.length > 0 ? "Folgende Formeln sind betroffen: " + formulasToRemove.join(", ") : ""}
                    </Typography>
                    <Typography gutterBottom className={classes.wrappedText}>
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
                                        clearSessionStorage();
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
