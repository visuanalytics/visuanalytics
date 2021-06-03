import React from "react";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import {useStyles} from "../../style";
import {FormelObj} from "../../CreateCustomData/CustomDataGUI/formelObjects/FormelObj";
import {Diagram, Schedule} from "../../types";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";

interface HistoryDataSelectionProps {
    handleProceed: () => void;
    handleSkipProceed: () => void;
    handleBack: () => void;
    selectedData: Array<string>;
    customData: Array<FormelObj>;
    historizedData: Array<string>;
    setHistorizedData: (array: Array<string>) => void;
    selectSchedule: (schedule: Schedule) => void;
    diagrams: Array<Diagram>;
    setDiagrams: (array: Array<Diagram>) => void;
    apiName: string;
}

/**
 * This component displays the available data for historisation and makes it selectable for the user.
 * @param props The passed properties from the parent
 */
export const HistoryDataSelection: React.FC<HistoryDataSelectionProps>  = (props) => {
    const classes = useStyles();

    //holds the selection on start to compare for diagram deletion detection
    const [oldHistorizedData] = React.useState(props.historizedData);

    //holds the names of all diagrams that need to be removed because of data removed from selection
    const [diagramsToRemove, setDiagramsToRemove] = React.useState<Array<string>>([]);

    //true when the dialog for deleting diagrams is opened
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(true);

    /**
     * Handler for clicking the proceed button.s
     * Calls checkDeletes() to check if diagrams need to be deleted because historizedData was removed.
     * If nothing has to be removed, it calls the method checkAndProceed() which evaluates if the user
     * skips the schedule selection because nothing was selected or not.
     */
    const ProceedHandler = () => {
        //when deletion is necessary, dont proceed
        if(checkDeletes()) return;
        checkAndProceed();
    }

    /**
     * Method that evaluates if the user has selected something or not.
     * Proceeds to schedule selection if he has, skips it if not.
     */
    const checkAndProceed = () => {
        //console.log(props.historizedData.length===0);
        if(props.historizedData.length===0) {
            props.handleSkipProceed();
        } else {
            props.handleProceed();
        }
    }

    /**
     * Method to check if any items where removed from selection to check if their removal forces the removal of diagrams.
     * If diagrams need to be removed, the user is shown a dialog for confirmation.
     * Returns true when something needs to be deleted
     */
    const checkDeletes = () => {
        const missingSelections: Array<string> = [];
        oldHistorizedData.forEach((item) => {
            if(!props.historizedData.includes(item)) missingSelections.push(item);
        })
        //return false when nothing was removed
        if(missingSelections.length===0) return false;
        const diagramsToRemove: Array<string> = [];
        missingSelections.forEach((missingItem) => {
            props.diagrams.forEach((diagram) => {
                //only diagrams with historizedData are relevant
                if(diagram.sourceType==="Historized"&&diagram.historizedObjects!==undefined) {
                    for (let index = 0; index < diagram.historizedObjects.length; index++) {
                        const historized = diagram.historizedObjects[index];
                        //the dataSource name needs to be added in front of the historized element name since historizedObjects has dataSource name in it paths too
                        //it is also checked if the same diagram has already been marked by another formula or historized data
                        if(props.apiName + "|" + missingItem===historized.name&&(!diagramsToRemove.includes(diagram.name))) {
                            diagramsToRemove.push(diagram.name);
                            break;
                        }
                    }
                }
            })
        })
        //also return false when no diagrams need to be removed
        if(diagramsToRemove.length===0) return false
        setDiagramsToRemove(diagramsToRemove);
        setDeleteDialogOpen(true);
        return true;
    }

    /**
     * Deletes all diagrams in the state diagramsToRemove
     * from the diagrams array passed as props.
     */
    const deleteDiagrams = () => {
        props.setDiagrams(props.diagrams.filter((diagram) => {
            return !diagramsToRemove.includes(diagram.name);
        }))
    }


    /**
     * Adds an item to the set of selected list items
     * @param data The item to be added
     */
    const addToHistorySelection = (data: string) => {
        const arCopy = props.historizedData.slice();
        arCopy.push(data);
        props.setHistorizedData(arCopy);
    };

    /**
     * Removes an item from the set of selected list items
     * @param data The item to be removed
     */
    const  removeFromHistorySelection = (data: string) => {
        props.setHistorizedData(props.historizedData.filter((item) => {
            return item!== data;
        }));
    };

    /**
     * Method that handles clicking on a checkbox.
     * If the user changes any checkbox, the schedule object is reset to default values.
     * @param data The name of the list item key the checkbox was set for.
     */
    const checkboxHandler = (data: string) => {
        console.log(data);
        console.log(props.historizedData.includes(data));
        if (props.historizedData.includes(data)) {
            removeFromHistorySelection(data);
        } else {
            addToHistorySelection(data)
            console.log("new: " + props.historizedData.includes(data));
        }
        //console.log(props.selectedData.values().next())
        props.selectSchedule({type: "", interval: "", time: "", weekdays: []});
    };


    /**
     * Renders an item of the list and returns the representation
     */
    const renderListItem = (item: string) => {
        return (
            <ListItem key={item} divider={true}>
                <ListItemIcon>
                    <FormControlLabel
                        control={
                            <Checkbox onClick={() => checkboxHandler(item)} checked={props.historizedData.includes(item)}/>
                        }
                        label={''}
                    />
                </ListItemIcon>
                <ListItemText
                    primary={item}
                    secondary={null}
                />
            </ListItem>
        )
    }

    //currently not containing custom data since it was not finished at that time
    return (
        <React.Fragment>
            <Grid container justify="space-around" className={classes.elementLargeMargin}>
                <Grid item xs={12}>
                    <Typography variant="body1">
                        Bitte wählen sie die zu historisierenden Daten aus:
                    </Typography>
                </Grid>
                <Grid item xs={10}>
                    <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.listFrame} key="listBox">
                        <List disablePadding={true} key="listRoot2">
                            {props.customData.map((item) => renderListItem(item.formelName))}
                            {props.selectedData.map((item) => renderListItem(item))}
                        </List>
                    </Box>
                </Grid>
                <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                    <Grid item>
                        <Button variant="contained" size="large" color="primary" onClick={props.handleBack}>
                            zurück
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" size="large" color="primary" onClick={ProceedHandler}>
                            weiter
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Dialog onClose={() => {
                setDeleteDialogOpen(false);
                window.setTimeout(() => {
                    setDiagramsToRemove([]);
                }, 200);
            }} aria-labelledby="deleteDialog-title"
                    open={deleteDialogOpen}>
                <DialogTitle id="deleteDialog-title">
                    Löschen von Formeln und Diagrammen bestätigen
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Durch das Abwählen einiger Daten müssen Diagramme gelöscht werden, die diese Daten nutzen.
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
                                        }, 200);
                                    }}>
                                abbrechen
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained"
                                    onClick={() => {
                                        deleteDiagrams();
                                        checkAndProceed();
                                    }}
                                    className={classes.redDeleteButton}>
                                Löschen bestätigen
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </React.Fragment>

    )
};
