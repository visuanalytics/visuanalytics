import React from "react";
import {useStyles} from "../../style";
import {hintContents} from "../../../util/hintContents";
import Grid from "@material-ui/core/Grid";
import {StepFrame} from "../../StepFrame";
import List from "@material-ui/core/List";
import Box from "@material-ui/core/Box";
import {Button, TextField, Typography} from "@material-ui/core";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import {uniqueId} from "../../types";


interface ArrayProcessingProps {
    continueHandler: () => void;
    backHandler: () => void;
}

/**
DONE:
 1: Alle Arrays durchsuchen und die auflisten, die primitiv sind und Zahl oder Gleitkommazahl als Inhalt haben
 2: Alle Aktionen auflisten, die möglich sind
 3: Eingabe: Nutzer wählt erst ein Array, dann eine Aktion
 4: Dazu muss ein Name gewählt werden - dann Button speichern

TODO:

 5: Namensprüfung auf Duplikate in listItems, customData -> beim Laden eine Liste aller Namen generieren und gegenprüfen? -> aktualisieren, wenn man etwas mitlöscht
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
     * Handler method for the "save" button that adds the current seleciton as a new processing
     * to the list of processings.
     */
    const addProcessing = () => {

    }


    const removeProcessing = (index: number) => {

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
    const renderProcessingsListEntry = (processing: ArrayProcessing) => {

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
                            >
                                Speichern
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container xs={12} md={3}>
                    <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.listFrame}>
                        <List disablePadding={true}>
                            {processingsList.map((processing) => renderProcessingsListEntry(processing))}
                        </List>
                    </Box>
                </Grid>
                <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                    <Grid item>
                        <Button variant="contained" size="large" color="primary">
                            zurück
                        </Button>
                    </Grid>
                    <Grid item >
                        <Button variant="contained" size="large" color="primary">
                            weiter
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </StepFrame>
    );
}
