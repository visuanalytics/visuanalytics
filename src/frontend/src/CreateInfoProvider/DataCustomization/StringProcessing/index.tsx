import React from "react";
import {useStyles} from "../../style";
import Grid from "@material-ui/core/Grid";
import {StepFrame} from "../../StepFrame";
import Box from "@material-ui/core/Box";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider,
    IconButton,
    TextField,
    Typography
} from "@material-ui/core";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import DeleteIcon from "@material-ui/icons/Delete";
import {getListItemsNames} from "../../helpermethods";
import {Diagram, ListItemRepresentation} from "../../types";
import {FormelObj} from "../CreateCustomData/CustomDataGUI/formelObjects/FormelObj";


interface StringProcessingProps {
    continueHandler: () => void;
    backHandler: () => void;
    reportError: (message: string) => void;
    listItems: Array<ListItemRepresentation>;
    customData: Array<FormelObj>;
    setCustomData: (customData: Array<FormelObj>) => void;
    diagrams: Array<Diagram>;
    setDiagrams: (diagrams: Array<Diagram>) => void;
    historizedData: Array<string>
    setHistorizedData: (historizedData: Array<string>) => void;
    apiName: string;
}

/**
 DONE:
 1: grundlegende Datenstrukturen für alle Strings sowie Operationen auf diesen anlegen
 2: Anzeige im Interface mit zwei Textfeldern für Ersetzung und einem Textfeld für den Namen
 3: Methode zum Hinzufügen neu erstellter Operationen
 4: Möglichkeit zum Löschen von Operationen
 5:
 6:

 */

/**
 * Component for processing of string - user can define replacing of certain sequences by others.
 */
export const StringProcessing: React.FC<StringProcessingProps> = (props) => {

    const classes = useStyles();

    //name of the currently created element given by the user
    const [name, setName] = React.useState("");
    //index of the string selected for the current replacement operation
    const [selectedStringIndex, setSelectedStringIndex] = React.useState(-1);
    //holds the string to be replaced
    const [replaceString, setReplaceString] = React.useState("");
    //holds to the string to be inserted instead
    const [withString, setWithString] = React.useState("");
    //list of all strings available
    const [availableStrings, setAvailableStrings] = React.useState<Array<string>>(["string_1", "string_2", "string_3"]);
    //list of all created processing pairs
    const [replacementList, setReplacementList] = React.useState<Array<StringReplacement>>([]);
    //index of the item currently to be removed
    const [currentRemoveIndex, setCurrentRemoveIndex] = React.useState(-1);
    //true when the dialog for confirming removal of processings is open
    const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false);


    type StringReplacement = {
        name: string;
        string: string;
        replace: string;
        with: string;
    }


    /**
     * Method that checks if a name is already used by another processing,
     * api data or formula
     * @param name The name to be checked.
     */
    const checkNameDuplicate = (name: string) => {
        //check all processings
        for (let index = 0; index < replacementList.length; index++) {
            if(name === replacementList[index].name) return true;
        }
        //check api data names
        if(getListItemsNames(props.listItems).includes(name)) return true;
        //check formula names
        for (let index = 0; index < props.customData.length; index++) {
            if(name === props.customData[index].formelName) return true;
        }
        return false;
    }

    /**
     * Handler method for the "save" button that adds the current replacement to the list
     * of created replacements.
     */
    const addReplacement = () => {
        //check for name duplicate first
        if(checkNameDuplicate(name)) {
            props.reportError("Der gewählte Name ist bereits vergeben!")
            return;
        }

        const arCopy = replacementList.slice();
        arCopy.push({
            name: name,
            string: availableStrings[selectedStringIndex],
            replace: replaceString,
            with: withString
        })
        setReplacementList(arCopy);
        setName("");
        setSelectedStringIndex(-1);
    }

    //both variables are useRef to be able to change values between renders
    //list of the names of all formulas to be removed with the currently deleted processing
    const formulasToRemove = React.useRef<Array<string>>([]);
    //list of the names of all diagrams to be removed with the currently deleted processing
    const diagramsToRemove = React.useRef<Array<string>>([]);

    /**
     * Checks if any delete dependencies exist for a given processing:
     * Returns true if formulas or diagrams need to be removed with the processing,
     * false if not.
     * @param name The name of the processing to search dependencies for
     */
    const checkDeleteDependencies = (name: string) => {
        //check all formulas if the use this processing
        props.customData.forEach((formula) => {
            if(formula.formelString.includes(name)) formulasToRemove.current.push(formula.formelName);
        })

        //check all diagrams if they use this processing
        props.diagrams.forEach((diagram) => {
            //only diagrams with historized data can use processings and need to be checked
            if(diagram.sourceType==="Historized"&&diagram.historizedObjects!==undefined) {
                for (let index = 0; index < diagram.historizedObjects.length; index++) {
                    const historized = diagram.historizedObjects[index];
                    //the dataSource name needs to be added in front of the processings name since historizedObjects has dataSource name in it paths too
                    if (props.apiName + "|" + name === historized.name) {
                        diagramsToRemove.current.push(diagram.name);
                        break;
                    }
                }
            }
        })

        return formulasToRemove.current.length !== 0 || diagramsToRemove.current.length !== 0;
    }

    /**
     * Method that handles clicking the remove icon for a replacement.
     * Checks if any delete dependencies exist - if so, a dialog will ask
     * for confirmation, otherwise, the value is deleted.
     * @param index The index of the element to be deleted.
     */
    const removeReplacementHandler = (index: number) => {
        //Clear lists - normally should be empty but it makes the method work on its own safer
        formulasToRemove.current = [];
        diagramsToRemove.current = [];
        if(checkDeleteDependencies(replacementList[index].name)) {
            //TODO: display dialog
            return;
        }
        removeReplacement(index);
    }

    /**
     * Method that removes a replacement as well as all
     * historized data, formulas and diagrams depending on it.
     * @param index The index of the element to be deleted.
     */
    const removeReplacement = (index: number) => {
        //remove the element from historizedData
        if(props.historizedData.includes(replacementList[index].name)) {
            props.setHistorizedData(props.historizedData.filter((data) => {
                return data !== replacementList[index].name;
            }))
        }
        //remove the formulas using the historizedData
        if(formulasToRemove.current.length !== 0) {
            props.setCustomData(props.customData.filter((formel) => {
                return !formulasToRemove.current.includes(formel.formelName);
            }))
        }
        //remove the diagrams using the historizedData
        if(diagramsToRemove.current.length !== 0) {
            props.setDiagrams(props.diagrams.filter((diagram) => {
                return !diagramsToRemove.current.includes(diagram.name);
            }))
        }
        //reset the list of formulas and diagrams to remove
        formulasToRemove.current = [];
        diagramsToRemove.current = [];
        //remove the processing from the list of processings
        const arCopy = replacementList.slice();
        arCopy.splice(index, 1);
        setReplacementList(arCopy);
    }

    /**
     * Method that renders an entry in the list of available strings.
     * @param stringName The name of the string to be rendered.
     * @param index The index of the string in the list of all strings.
     */
    const renderStringListItem = (stringName: string, index: number) => {
        return (
            <Grid item container xs={12} key={stringName}>
                <Grid item xs={2}>
                    <Radio
                        checked={selectedStringIndex === index}
                        onChange={(e) => setSelectedStringIndex(index)}
                        value={index}
                        inputProps={{ 'aria-label': stringName }}
                    />
                </Grid>
                <Grid item xs={10}>
                    <Typography variant="body1" className={classes.radioButtonListWrapText}>
                        {stringName}
                    </Typography>
                </Grid>
            </Grid>

        )
    }



    /**
     * Method that renders an entry in the list of all replacements created by the user.
     * @param processing The object of the replacement to be displayed.
     * @param index The index of the entry in the list.
     */
    const renderProcessingsListEntry = (replacement: StringReplacement, index: number) => {
        return (
            <React.Fragment key={replacement.name}>
                <Grid item container xs={12}>
                    <Grid item xs={8}>
                        <Typography className={classes.typographyLineBreak}>
                            {replacement.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <IconButton className={classes.redDeleteIcon}
                                    onClick={() => removeReplacementHandler(index)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
            </React.Fragment>
        )
    }


    return (
        <StepFrame
            heading="Array-Verarbeitung"
            hintContent={null}
        >
            <Grid container justify="space-between">
                <Grid item xs={12}>
                    <Typography variant="body1">
                        Eine String-Verarbeitung kann erstellt werden, indem man einen String aus der Liste auswählt und festlegt, welche Zeichenketten auf welche Art und Weise ersetzt werden sollen:
                    </Typography>
                </Grid>
                <Grid item container xs={12} md={8} justify="space-between" style={{height: "100%"}}>
                    <Grid item xs={12}>
                        <TextField fullWidth margin="normal" variant="filled" color="primary"
                                   label={"Name der Array-Verarbeitung"} value={name}
                                   onChange={(e) =>
                                       setName(e.target.value.replace(" ", "_"))
                                   }/>
                    </Grid>
                    <Grid item container xs={12} md={6} className={classes.elementLargeMargin}>
                        <Grid item xs={12}>
                            <Typography variant="h5">
                                Strings
                            </Typography>
                        </Grid>
                        <Grid item container xs={12} className={classes.elementLargeMargin}>
                            <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.mediumListFrame}>
                                {availableStrings.map((string, index) => renderStringListItem(string, index))}
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid item container xs={12} md={5} className={classes.elementLargeMargin}>
                        <Grid item xs={12} style={{height: "1%"}}>
                            <Typography variant="h5">
                                Ersetzen von:
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth margin="normal" variant="filled" color="primary"
                                       label={"Zu ersetzender Substring"} value={replaceString}
                                       onChange={(e) =>
                                           setReplaceString(e.target.value)
                                       }/>
                        </Grid>
                        <Grid item xs={12} style={{height: "1%"}}>
                            <Typography variant="h5">
                                Ersetzen mit:
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth margin="normal" variant="filled" color="primary"
                                       label={"Einzusetzender String"} value={withString}
                                       onChange={(e) =>
                                           setWithString(e.target.value)
                                       }/>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} justify="space-around" className={classes.elementLargeMargin}>
                        <Grid item className={classes.blockableButtonSecondary}>
                            <Button color="secondary" variant="contained" size="large"
                                    disabled={name === "" || selectedStringIndex < 0 || replaceString === ""}
                                    onClick={() => addReplacement()}
                            >
                                Speichern
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container xs={12} md={3}>
                    <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.listFrame}>
                        <Grid item container xs={12}>
                            {replacementList.map((processing, index) => renderProcessingsListEntry(processing, index))}
                        </Grid>
                    </Box>
                </Grid>
                <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                    <Grid item>
                        <Button variant="contained" size="large" color="primary" onClick={props.backHandler}>
                            zurück
                        </Button>
                    </Grid>
                    <Grid item >
                        <Button variant="contained" size="large" color="primary" onClick={props.continueHandler}>
                            weiter
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Dialog onClose={() => {
                setRemoveDialogOpen(false);
                window.setTimeout(() => {
                    formulasToRemove.current = []
                    diagramsToRemove.current = [];
                    setCurrentRemoveIndex(-1);
                }, 200);
            }} aria-labelledby="deleteDialog-title"
                    open={removeDialogOpen}>
                <DialogTitle id="deleteDialog-title">
                    Löschen von "{currentRemoveIndex >= 0 ? replacementList[currentRemoveIndex].name : ""}" bestätigen
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Durch das Löschen von "{currentRemoveIndex >= 0 ? replacementList[currentRemoveIndex].name : ""}" müssen Formeln und/oder Diagramme gelöscht werden, die dieses nutzen.
                    </Typography>
                    <Typography gutterBottom>
                        {formulasToRemove.current.length > 0 ? "Folgende Formeln sind betroffen: " + formulasToRemove.current.join(", ") : ""}
                    </Typography>
                    <Typography gutterBottom>
                        {diagramsToRemove.current.length > 0 ? "Folgende Diagramme sind betroffen: " + diagramsToRemove.current.join(", ") : ""}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Grid container justify="space-between">
                        <Grid item>
                            <Button variant="contained"
                                    onClick={() => {
                                        setRemoveDialogOpen(false);
                                        window.setTimeout(() => {
                                            formulasToRemove.current = []
                                            diagramsToRemove.current = [];
                                            setCurrentRemoveIndex(-1);
                                        }, 200);
                                    }}>
                                abbrechen
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained"
                                    onClick={() => {
                                        removeReplacement(currentRemoveIndex);
                                        window.setTimeout(() => {
                                            formulasToRemove.current = []
                                            diagramsToRemove.current = [];
                                            setCurrentRemoveIndex(-1);
                                        }, 200);
                                    }}
                                    className={classes.redDeleteButton}>
                                Löschen bestätigen
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </StepFrame>
    );
}
