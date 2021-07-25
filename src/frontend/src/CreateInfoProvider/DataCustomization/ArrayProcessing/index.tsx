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
import Radio from "@material-ui/core/Radio";
import DeleteIcon from "@material-ui/icons/Delete";
import {getListItemsNames} from "../../helpermethods";
import {
    ArrayProcessingData,
    Diagram,
    ListItemRepresentation,
    Operation,
    ProcessableArray,
    StringReplacementData
} from "../../types";
import {FormelObj} from "../CreateCustomData/CustomDataGUI/formelObjects/FormelObj";
import {hintContents} from "../../../util/hintContents";


interface ArrayProcessingProps {
    continueHandler: () => void;
    backHandler: (index: number) => void;
    reportError: (message: string) => void;
    arrayProcessingsList: Array<ArrayProcessingData>;
    setArrayProcessingsList: (processings: Array<ArrayProcessingData>) => void;
    stringReplacementList: Array<StringReplacementData>
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
    const [availableArrays, setAvailableArrays] = React.useState<Array<ProcessableArray>>([]);
    //index of the item currently to be removed
    const [currentRemoveIndex, setCurrentRemoveIndex] = React.useState(-1);
    //true when the dialog for confirming removal of processings is open
    const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false);


    //list of all available operations pair of internal name (should be unique) and display name
    const operations: Array<Operation> = [
        {name: "sum", displayName: "Summe"},
        {name: "mean", displayName: "Mittelwert"},
        {name: "max", displayName: "Maximum"},
        {name: "min", displayName: "Minimum"},
    ]

    /**
     * Method that goes trough all list items and searches all arrays that are processable.
     * Following arrays are processable: Numeric primitive Arrays (integer or floating point),
     * arrays with objects that contain a numeric attribute (each one will be shown on its own
     * @param listItems The listItems to be searched through. Necessary for recursive calls.
     * @param noArray True when the search is for an object inside an array and arrays should be ignored
     * @param keyPath Path of the array when recursively searching through objects inside an array
     * @param innerKeyPath Inner object path so far when recursively searching through objects inside an array
     */
    const getProcessableArrays = React.useCallback((listItems: Array<ListItemRepresentation>, noArray: boolean, keyPath: string = "", innerKeyPath: string = "") => {
        let compatibleArraysList: Array<ProcessableArray> = [];
        listItems.forEach((listItem) => {
            //check if the search is for arrays or only primitive values because its a recursive search inside an object in array
            if(noArray) {
                //only search for primitive numeric values and objects
                if(!listItem.arrayRep && !Array.isArray(listItem.value) && (listItem.value === "Zahl" || listItem.value === "Gleitkommazahl"))
                    compatibleArraysList.push({
                        valueInObject: true,
                        key: keyPath,
                        innerKey: innerKeyPath === "" ? listItem.keyName : innerKeyPath + "|" + listItem.keyName //this check should normally not be necessary since call with noArray === true will only be with a innerKeyPath
                    });
                else if(!listItem.arrayRep && Array.isArray(listItem.value)) {
                    //the element is an object, its children need to be searched through - dont check arrays in this search
                    //since this is only called when recursively searching through objects inside an array, update the innerKeyPath by appending the element itself
                    compatibleArraysList = compatibleArraysList.concat(getProcessableArrays(listItem.value, true, keyPath, innerKeyPath + "|" + listItem.keyName));
                }
            } else {
                //check if it is a primitive array containing
                if(listItem.arrayRep) {
                    //check for primitive arrays
                    if(!Array.isArray(listItem.value)) {
                        if(listItem.value === "Zahl" || listItem.value === "Gleitkommazahl")
                            compatibleArraysList.push({
                                valueInObject: false,
                                key: (listItem.parentKeyName === "" ? listItem.keyName : listItem.parentKeyName + "|" + listItem.keyName).replace("|0", ""),
                                innerKey: ""
                            });
                    } else {
                        //the array contains an object - search for all primitive numeric values in it  (subobjects are also supported)
                        //store the path of the array itself to use it as key
                        const keyPath = (listItem.parentKeyName === "" ? listItem.keyName : listItem.parentKeyName + "|" + listItem.keyName).replace("|0", "")
                        listItem.value.forEach((value: ListItemRepresentation) => {
                            if(value.value === "Zahl" || value.value === "Gleitkommazahl")
                                //since this is a primitive contained in an object, we need to split the path in key and innerKey
                                compatibleArraysList.push({
                                    valueInObject: true,
                                    key: keyPath,
                                    innerKey: value.keyName //this value will always be stored directly within an object inside an array and not nested so we can use the keyName alone
                                });
                            else if((!value.arrayRep) && Array.isArray(value.value)) {
                                //the object contains another object - recursive search happens here - pass the keyName as innerKeyPath since the inner search starts at this level
                                //search through variables but only care about primitives and subobjects, not arrays
                                compatibleArraysList = compatibleArraysList.concat(getProcessableArrays(value.value, true, keyPath, value.keyName));
                            }
                        })
                    }
                } else if(Array.isArray(listItem.value)) {
                    //the element is an object, its children need to be searched through - also mind arrays in this search
                    compatibleArraysList = compatibleArraysList.concat(getProcessableArrays(listItem.value, false));
                }
            }
        })
        return compatibleArraysList;
    }, []);

    //extract listItems from props to use in dependencies
    const listItems = props.listItems;

    /**
     * Load the list of processable arrays when mounting the component
     */
    React.useEffect(() => {
        setAvailableArrays(getProcessableArrays(listItems, false));
    }, [getProcessableArrays, listItems])


    /**
     * Method that checks if a name is already used by another processing,
     * api data or formula
     * @param name The name to be checked.
     */
    const checkNameDuplicate = (name: string) => {
        //check all array processings
        for (let index = 0; index < props.arrayProcessingsList.length; index++) {
            if(name === props.arrayProcessingsList[index].name) return true;
        }
        //check all string replacements
        for (let index = 0; index < props.stringReplacementList.length; index++) {
            if(name === props.stringReplacementList[index].name) return true;
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

        const arCopy = props.arrayProcessingsList.slice();
        arCopy.push({
            name: name,
            array: availableArrays[selectedArrayIndex],
            operation: operations[selectedOperationIndex]
        })
        props.setArrayProcessingsList(arCopy);
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
        //check all formulas wether they use this processing
        props.customData.forEach((formula) => {
            if(formula.usedFormulaAndApiData.includes(name)) formulasToRemove.current.push(formula.formelName);
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
        if(checkDeleteDependencies(props.arrayProcessingsList[index].name)) {
            setCurrentRemoveIndex(index);
            setRemoveDialogOpen(true);
            return;
        }
        removeProcessing(index);
    }


    //mutable list of formulas - used because multiple modifications in one render are necessary in two functions at the same time
    const newHistorizedData = React.useRef<Array<string>>([]);
    //mutable list of diagrams - used because multiple modifications in one render are necessary in two functions at the same time
    const newDiagrams = React.useRef<Array<Diagram>>([]);
    //mutable list of formulas - used because multiple modifications in one render are necessary in two functions at the same time
    const newCustomData = React.useRef<Array<FormelObj>>([]);

    /**
     * Method that finds all diagrams that depend on a certain formula, returns an array with their names.
     * @param formelName The name of the formula to search for.
     */
    const findDependentDiagrams = (formelName: string) => {
        const diagramsToRemove: Array<string> = [];
        //check for diagrams
        props.diagrams.forEach((diagram) => {
            if (diagram.sourceType === "Historized" && diagram.historizedObjects !== undefined) {
                for (let index = 0; index < diagram.historizedObjects.length; index++) {
                    const historized = diagram.historizedObjects[index];
                    //the dataSource name needs to be added in front of the formula name since historizedObjects has dataSource name in it paths too
                    if (props.apiName + "|" + formelName === historized.name) {
                        diagramsToRemove.push(diagram.name);
                        break;
                    }
                }
            }
        })
        return diagramsToRemove;
    }


    /**
     * Method that removes a processing as well as all
     * historized data, formulas and diagrams depending on it.
     * @param index The index of the element to be deleted.
     */
    const removeProcessing = (index: number) => {
        //initialize the lists of data to be edited
        newHistorizedData.current = props.historizedData.slice();
        newDiagrams.current = props.diagrams.slice();
        newCustomData.current = props.customData.slice();
        //remove the element from historizedData
        if(newHistorizedData.current.includes(props.arrayProcessingsList[index].name)) {
            newHistorizedData.current = newHistorizedData.current.filter((data) => {
                return data !== props.arrayProcessingsList[index].name;
            })
        }
        //remove the formulas using the processing
        if(formulasToRemove.current.length !== 0) {
            newCustomData.current = newCustomData.current.filter((formel) => {
               return !formulasToRemove.current.includes(formel.formelName);
            })
        }
        //remove the diagrams using the processing
        if(diagramsToRemove.current.length !== 0) {
            newDiagrams.current = props.diagrams.filter((diagram) => {
                return !diagramsToRemove.current.includes(diagram.name);
            })
        }
        //start the cascading deletion of formulas
        if(formulasToRemove.current.length > 0) {
            formulasToRemove.current.forEach((formula) => {
                deleteFormulaDependents(formula)
            })
        }
        //delete the data that resulted from the delete cascade
        props.setHistorizedData(newHistorizedData.current);
        props.setDiagrams(newDiagrams.current);
        props.setCustomData(newCustomData.current);
        //reset the list of formulas and diagrams to be removed
        formulasToRemove.current = [];
        diagramsToRemove.current = [];
        //remove the processing from the list of processings
        const arCopy = props.arrayProcessingsList.slice();
        arCopy.splice(index, 1);
        props.setArrayProcessingsList(arCopy);
    }


    /**
     * Method that searches all diagrams and formulas depending on a formula to delete them.
     * For each formula found, it will recursively repeat this process.
     * Also removes from historizedData.
     * @param formelName The formula to be deleted.
     */
    const deleteFormulaDependents = (formelName: string) => {
        //remove the formula from historized data if it is contained
        newHistorizedData.current = newHistorizedData.current.filter((data) => {
            return data !== formelName;
        })
        //search all diagrams and delete them
        const diagramsToRemove = findDependentDiagrams(formelName);
        if (diagramsToRemove.length > 0) {
            newDiagrams.current = newDiagrams.current.filter((diagram) => {
                return !diagramsToRemove.includes(diagram.name);
            })
        }
        //find all formulas depending on the formula
        const dependentFormulas: Array<string> = [];
        newCustomData.current.forEach((formula) => {
            if (formula.usedFormulaAndApiData.includes(formelName + " ") || formula.formelString.endsWith(formelName)) dependentFormulas.push(formula.formelName);
        })
        //remove all dependent formulas
        if (dependentFormulas.length > 0) {
            newCustomData.current = newCustomData.current.filter((formula) => {
                return !dependentFormulas.includes(formula.formelName);
            })
        }
        //for each dependent formula, recursively repeat this
        dependentFormulas.forEach((dependentFormula) => {
            deleteFormulaDependents(dependentFormula);
        })
    }


    /**
     * Method that renders an entry in the list of available arrays.
     * @param array The name of the array to be rendered.
     * @param index The index of the array in the list of all arrays.
     */
    const renderArrayListItem = (array: ProcessableArray, index: number) => {
        //construct the key by checking which type of processing this is (primitive array or complex array)
        const displayKey = array.valueInObject ? array.key + "|" + array.innerKey : array.key;
        return (
            <Grid item container xs={12} key={displayKey}>
                <Grid item xs={2}>
                    <Radio
                        checked={selectedArrayIndex === index}
                        onChange={() => setSelectedArrayIndex(index)}
                        value={index}
                        inputProps={{ 'aria-label': displayKey }}
                    />
                </Grid>
                <Grid item xs={10}>
                    <Typography variant="body1" className={classes.radioButtonListWrapText}>
                        {displayKey}
                    </Typography>
                </Grid>
            </Grid>
        )
    }

    /**
     * Method that renders an entry in the list of available operations
     * @param operation The operation object to be displayed
     * @param index The index of the operation in the list of all operations
     */
    const renderOperationListItem = (operation: Operation, index: number) => {
        return (
            <Grid item container xs={12} key={operation.name}>
                <Grid item xs={3}>
                    <Radio
                        checked={selectedOperationIndex === index}
                        onChange={() => setSelectedOperationIndex(index)}
                        value={index}
                        inputProps={{ 'aria-label': operation.displayName }}
                    />
                </Grid>
                <Grid item xs={9}>
                    <Typography variant="body1" className={classes.radioButtonListWrapText}>
                        {operation.displayName}
                    </Typography>
                </Grid>
            </Grid>
        )
    }


    /**
     * Method that renders an entry in the list of all processings created by the user.
     * @param processing The object of the processing to be displayed.
     * @param index The index of the entry in the list.
     */
    const renderProcessingsListEntry = (processing: ArrayProcessingData, index: number) => {
        return (
            <React.Fragment key={processing.name}>
                <Grid item container xs={12}>
                    <Grid item xs={8}>
                        <Typography className={classes.processingListingText}>
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
            hintContent={hintContents.arrayProcessing}
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
                        <Grid item container xs={12} className={classes.elementLargeMargin}>
                            <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.mediumListFrame}>
                                {availableArrays.map((array, index) => renderArrayListItem(array, index))}
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid item container xs={12} md={4} className={classes.elementLargeMargin}>
                        <Grid item xs={12}>
                            <Typography variant="h5">
                                Operationen
                            </Typography>
                        </Grid>
                        <Grid item xs={12} container className={classes.elementLargeMargin}>
                            <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.mediumListFrame}>
                                {operations.map((operation, index) => renderOperationListItem(operation, index))}
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
                            {props.arrayProcessingsList.map((processing, index) => renderProcessingsListEntry(processing, index))}
                        </Grid>
                    </Box>
                </Grid>
                <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                    <Grid item>
                        <Button variant="contained" size="large" color="primary" onClick={() => props.backHandler(1)}>
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
                <DialogTitle id="deleteDialog-title" className={classes.wrappedText}>
                    Löschen von "{currentRemoveIndex >= 0 ? props.arrayProcessingsList[currentRemoveIndex].name : ""}" bestätigen
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom className={classes.wrappedText}>
                        Durch das Löschen von "{currentRemoveIndex >= 0 ? props.arrayProcessingsList[currentRemoveIndex].name : ""}" müssen Formeln und/oder Diagramme gelöscht werden, die dieses nutzen.
                    </Typography>
                    <Typography gutterBottom className={classes.wrappedText}>
                        {formulasToRemove.current.length > 0 ? "Folgende Formeln sind betroffen: " + formulasToRemove.current.join(", ") : ""}
                    </Typography>
                    <Typography gutterBottom className={classes.wrappedText}>
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
                                        setRemoveDialogOpen(false);
                                        const index = currentRemoveIndex;
                                        setCurrentRemoveIndex(-1);
                                        removeProcessing(index);
                                        window.setTimeout(() => {
                                            formulasToRemove.current = []
                                            diagramsToRemove.current = [];
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
