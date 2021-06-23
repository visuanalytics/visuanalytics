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


interface ArrayProcessingProps {
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
 1: Alle Arrays durchsuchen und die auflisten, die primitiv sind und Zahl oder Gleitkommazahl als Inhalt haben
 2: Alle Aktionen auflisten, die möglich sind
 3: Eingabe: Nutzer wählt erst ein Array, dann eine Aktion
 4: Dazu muss ein Name gewählt werden - dann Button speichern

TODO:

 5: Namensprüfung auf Duplikate in listItems und customData
 6: Liste bereits erstellter Daten mit Button zum Löschen
 x: Beim Löschen einer angelegten Verarbeitung: Durchsuche alle Formeln, Diagramme und Historisierung nach Verwendung des Werts
 y: Nutzer mit Dialog um Bestätigung des Löschens bitten
 */

/**
 * Component for processing of arrays - offers the do operations like finding the maximum, sum, ...
 */
export const ArrayProcessing: React.FC<ArrayProcessingProps> = (props) => {

    const classes = useStyles();

    //name of the currently created element given by the user
    const [name, setName] = React.useState("");
    //index of the array selected for the current element
    const [selectedArrayIndex, setSelectedArrayIndex] = React.useState(-1);
    //index of the operation currently selected by the user
    const [selectedOperationIndex, setSelectedOperationIndex] = React.useState(-1);
    //list of all arrays available
    const [availableArrays, setAvailableArrays] = React.useState<Array<string>>(["array1", "array2", "array3"]);
    //list of all created processing pairs
    const [processingsList, setProcessingsList] = React.useState<Array<ArrayProcessing>>([]);
    //index of the item currently to be removed
    const [currentRemoveIndex, setCurrentRemoveIndex] = React.useState(-1);
    //true when the dialog for confirming removal of processings is open
    const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false);



    type ArrayProcessing = {
        name: string;
        array: string;
        operation: Operation;
    }

    type Operation = {
        name: string;
        displayName: string;
    }

    //TODO: consult backend to find out which operations are possible
    //list of all available operations pair of internal name (should be unique) and display name
    const operations: Array<Operation> = [
        {name: "sum", displayName: "Summe"},
        {name: "avg", displayName: "Durchschnitt"},
        {name: "max", displayName: "Maximum"},
        {name: "min", displayName: "Minimum"},
    ]

    /**
     * Method that checks if a name is already used by another processing,
     * api data or formula
     * @param name The name to be checked.
     */
    const checkNameDuplicate = (name: string) => {
        //check all processings
        for (let index = 0; index < processingsList.length; index++) {
            if(name === processingsList[index].name) return true;
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
     * Handler method for the "save" button that adds the current selection as a new processing
     * to the list of processings.
     */
    const addProcessing = () => {
        //check for name duplicate first
        if(checkNameDuplicate(name)) {
            props.reportError("Der gewählte Name ist bereits vergeben!")
            return;
        }

        const arCopy = processingsList.slice();
        arCopy.push({
            name: name,
            array: availableArrays[selectedArrayIndex],
            operation: operations[selectedOperationIndex]
        })
        setProcessingsList(arCopy);
        setName("");
        setSelectedArrayIndex(-1);
        setSelectedOperationIndex(-1);
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
     * Method that handles clicking the remove icon for a processing.
     * Checks if any delete dependencies exist - if so, a dialog will ask
     * for confirmation, otherwise, the value is deleted.
     * @param index The index of the element to be deleted.
     */
    const removeProcessingHandler = (index: number) => {
        //Clear lists - normally should be empty but it makes the method work on its own safer
        formulasToRemove.current = [];
        diagramsToRemove.current = [];
        if(checkDeleteDependencies(processingsList[index].name)) {
            //TODO: display dialog
            return;
        }
        removeProcessing(index);
    }

    /**
     * Method that removes a processing as well as all
     * historized data, formulas and diagrams depending on it.
     * @param index The index of the element to be deleted.
     */
    const removeProcessing = (index: number) => {
        //remove the element from historizedData
        if(props.historizedData.includes(processingsList[index].name)) {
            props.setHistorizedData(props.historizedData.filter((data) => {
                return data !== processingsList[index].name;
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
        const arCopy = processingsList.slice();
        arCopy.splice(index, 1);
        setProcessingsList(arCopy);
    }

    /**
     * Method that renders an entry in the list of available arrays.
     * @param array The name of the array to be rendered.
     * @param index The index of the array in the list of all arrays.
     */
    const renderArrayListItem = (array: string, index: number) => {
        return (
            <FormControlLabel value={index} control={
                <Radio
                />
            } label={array} key={array}
            />
        )
    }

    /**
     * Method that renders an entry in the list of available operations
     * @param operation The operation object to be displayed
     * @param index The index of the operation in the list of all operations
     */
    const renderOperationListItem = (operation: Operation, index: number) => {
        return (
            <FormControlLabel value={index} control={
                <Radio
                />
            } label={operation.displayName} key={operation.name}
            />
        )
    }


    /**
     * Method that renders an entry in the list of all processings created by the user.
     * @param processing The object of the processing to be displayed.
     */
    const renderProcessingsListEntry = (processing: ArrayProcessing, index: number) => {
        return (
            <React.Fragment key={processing.name}>
                <Grid item container xs={12}>
                    <Grid item xs={8}>
                        <Typography className={classes.typographyLineBreak}>
                            {processing.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <IconButton className={classes.redDeleteIcon}
                            onClick={() => removeProcessingHandler(index)}
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
                        Erstellen sie Array-Verarbeitungen als neue Datenwerte, indem sie das gewünschte Array und die durchzuführende Operation auswählen:
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
                    <Grid item container xs={12} md={7} className={classes.elementLargeMargin}>
                        <Grid item xs={12}>
                            <Typography variant="h5">
                                Arrays
                            </Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.elementLargeMargin}>
                            <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.mediumListFrame}>
                                <FormControl>
                                    <RadioGroup value={selectedArrayIndex}
                                                onChange={(e) => setSelectedArrayIndex(Number(e.target.value))}>
                                        {availableArrays.map((array, index) => renderArrayListItem(array, index))}
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid item container xs={12} md={4} className={classes.elementLargeMargin}>
                        <Grid item xs={12}>
                            <Typography variant="h5">
                                Operationen
                            </Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.elementLargeMargin}>
                            <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.mediumListFrame}>
                                <FormControl>
                                    <RadioGroup value={selectedOperationIndex}
                                                onChange={(e) => setSelectedOperationIndex(Number(e.target.value))}>
                                        {operations.map((operation, index) => renderOperationListItem(operation, index))}
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} justify="space-around" className={classes.elementLargeMargin}>
                        <Grid item className={classes.blockableButtonSecondary}>
                            <Button color="secondary" variant="contained" size="large"
                                    disabled={name === "" || selectedArrayIndex < 0 || selectedOperationIndex < 0}
                                    onClick={() => addProcessing()}
                            >
                                Speichern
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container xs={12} md={3}>
                    <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.listFrame}>
                        <Grid item container xs={12}>
                            {processingsList.map((processing, index) => renderProcessingsListEntry(processing, index))}
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
                    Löschen von "{currentRemoveIndex >= 0 ? processingsList[currentRemoveIndex].name : ""}" bestätigen
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Durch das Löschen von "{currentRemoveIndex >= 0 ? processingsList[currentRemoveIndex].name : ""}" müssen Formeln und/oder Diagramme gelöscht werden, die dieses nutzen.
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
                                        removeProcessing(currentRemoveIndex);
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
