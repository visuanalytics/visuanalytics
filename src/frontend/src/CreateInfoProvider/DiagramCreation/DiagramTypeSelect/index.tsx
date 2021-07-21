import React from "react";
import {useStyles} from "../style";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Collapse from "@material-ui/core/Collapse";
import {ListItemRepresentation, uniqueId} from "../../types";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import {ArrayDiagramProperties, HistorizedDiagramProperties} from "../../types";


interface DiagramTypeSelectProps {
    continueArray: () => void;
    continueHistorized: () => void;
    backHandler: () => void;
    compatibleArrays: Array<ListItemRepresentation>
    compatibleHistorized: Array<string>;
    setArrayObjects: (arrayObjects: Array<ArrayDiagramProperties>) => void;
    setHistorizedObjects: (historizedObjects: Array<HistorizedDiagramProperties>) => void;
}

/**
 * Component displaying the second step of the diagram creation.
 * Lets the user choose between diagrams with arrays or historized data and select
 * the arrays or historized data to be used.
 */
export const DiagramTypeSelect: React.FC<DiagramTypeSelectProps> = (props) => {
    const classes = useStyles();
    //holds the currently selected type
    const [selectedType, setSelectedType] = React.useState("");
    //holds the keys of all selected arrays
    const [selectedArrays, setSelectedArrays] = React.useState<Array<string>>([]);
    //holds the historized data selected for the current diagram
    const [selectedHistorized, setSelectedHistorized] = React.useState<Array<string>>([]);


    /**
     * Restore the selection from sessionStorage to not loose it on reload.
     */
    React.useEffect(() => {
        //selectedType
        setSelectedType(sessionStorage.getItem("selectedType-" + uniqueId) || "");
        //selectedArrays
        setSelectedArrays(sessionStorage.getItem("selectedArrays-" + uniqueId) === null ? new Array<string>() : JSON.parse(sessionStorage.getItem("selectedArrays-" + uniqueId)!));
        //selectedHistorized
        setSelectedHistorized(sessionStorage.getItem("selectedHistorized-" + uniqueId) === null ? new Array<string>() : JSON.parse(sessionStorage.getItem("selectedHistorized-" + uniqueId)!));
    }, [])
    //store selectedType in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("selectedType-" + uniqueId, selectedType);
    }, [selectedType])
    //store selectedArrays in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("selectedArrays-" + uniqueId, JSON.stringify(selectedArrays));
    }, [selectedArrays])
    //store selectedHistorized in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("selectedHistorized-" + uniqueId, JSON.stringify(selectedHistorized));
    }, [selectedHistorized])

    /**
     * Handler method for back button. Clears the selection out of sessionStorage and goes back to overview.
     */
    const handleBack = () => {
        sessionStorage.removeItem("selectedArrays-" + uniqueId);
        sessionStorage.removeItem("selectedHistorized-" + uniqueId);
        sessionStorage.removeItem("selectedType-" + uniqueId);
        props.backHandler();
    }

    /**
     * Used for arrays that contain objects. Returns all attributes that are numeric to present them as a choice to the user.
     * @param object The object contained in the array.
     * @param baseArrayName Name of the array that is the basis of these numeric attributes. Used for keeping the same name in subobjects.
     */
    const getNumericAttributes = (object: Array<ListItemRepresentation>, baseArrayName: string = "") => {
        //if no baseArrayName is set, get it from the parentKeyName of the first element - necessary to set the same parent name for all nested objects
        if(baseArrayName === "") baseArrayName = object.length > 0 ? object[0].parentKeyName : "";
        let numericAttributes: Array<ListItemRepresentation> = [];
        for (let index = 0; index < object.length; ++index) {
            //console.log("checking: " + object[index].keyName);
            if (object[index].value === "Zahl" || object[index].value === "Gleitkommazahl") {
                //before pushing, we need to create a new object that has the full keyPath from the parent array on as its keyName
                //get the full keyName of the innerKey, then cut the array name from it
                const keyPath = (object[index].parentKeyName + "|" + object[index].keyName).substring(baseArrayName.length + 1);
                console.log(keyPath);
                numericAttributes.push({
                    ...object[index],
                    keyName: keyPath
                })
            }
            //check if this is an sub-object - we need to check it too then
            else if(Array.isArray(object[index].value) && !object[index].arrayRep) {
                //also pass the baseArrayName to let it be the same
                numericAttributes = numericAttributes.concat(getNumericAttributes(object[index].value as Array<ListItemRepresentation>, baseArrayName));
            }
        }
        console.log(numericAttributes)
        return numericAttributes;
    }

    /**
     * Used for arrays that contain objects. Returns all attributes that are strings/text to present them as a choice to the user.
     * @param object The object contained in the array.
     */
    const getStringAttributes = (object: Array<ListItemRepresentation>) => {
        let stringAttributes: Array<ListItemRepresentation> = []
        for (let index = 0; index < object.length; ++index) {
            //console.log("checking: " + object[index].keyName);
            if (object[index].value === "Text") stringAttributes.push(object[index]);
            //check if this is an sub-object - we need to check it too then
            else if(Array.isArray(object[index].value) && !object[index].arrayRep) {
                stringAttributes = stringAttributes.concat(getStringAttributes(object[index].value as Array<ListItemRepresentation>));
            }
        }
        return stringAttributes;
    }


    /**
     * Creates objects for all selected arrays and returns an array with them
     */
    const createArrayObjects = () => {
        //("creating the array objects");
        const arrayObjects: Array<ArrayDiagramProperties> = [];
        selectedArrays.forEach((array) => {
            let item: ListItemRepresentation = {} as ListItemRepresentation;
            //find the ListItemRepresentation in the compatible Arrays
            for (let index = 0; index < props.compatibleArrays.length; ++index) {
                const element: ListItemRepresentation = props.compatibleArrays[index];
                if ((element.parentKeyName === "" ? element.keyName : element.parentKeyName + "|" + element.keyName) === array) {
                    item = element;
                    break;
                }
            }
            //this check should always be true but is added for type reasons
            if (Object.keys(item).length !== 0) {
                const numericAttributes = Array.isArray(item.value) ? getNumericAttributes(item.value) : [];
                const stringAttributes = Array.isArray(item.value) ? getStringAttributes(item.value) : [];
                const arrayObject = {
                    listItem: item,
                    numericAttribute: "",
                    stringAttribute: "",
                    labelArray: new Array(1).fill(""),
                    color: "#000000",
                    numericAttributes: numericAttributes,
                    stringAttributes: stringAttributes,
                    customLabels: stringAttributes.length === 0
                }
                arrayObjects.push(arrayObject);
            }
        })
        return arrayObjects;
    }

    /**
     * Creates objects for all selected historized data and returns an array with them
     */
    const createHistorizedObjects = () => {
        //console.log("creating the historized objects");
        const historizedObjects: Array<HistorizedDiagramProperties> = [];
        selectedHistorized.forEach((item) => {
            const historizedObject = {
                name: item,
                labelArray: new Array(1).fill(""),
                color: "#000000",
                intervalSizes: new Array(1).fill(0),
                dateLabels: false,
                dateFormat: "dd.mm.yyyy"
            }
            historizedObjects.push(historizedObject);
        })
        return historizedObjects;
    }

    /**
     * Handler called when clicking the continue button.
     * Evaluates if array or historized data was selected and calls the corresponding handler method.
     * Also gets the ListItems that belong to the selected elements and creates their objects
     */
    const continueHandler = () => {
        if (selectedType === "Array") {
            props.setArrayObjects(createArrayObjects());
            props.continueArray();
        } else {
            props.setHistorizedObjects(createHistorizedObjects());
            props.continueHistorized();
        }
    }

    /**
     * Handler for type input change.
     * @param event The change event.
     */
    const typeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedType((event.target as HTMLInputElement).value);
    }

    /**
     * Adds an item to the set of selected arrays
     * @param data The item to be added
     */
    const addToArraysSelection = (data: string) => {
        const arCopy = selectedArrays.slice()
        arCopy.push(data)
        setSelectedArrays(arCopy);
    };

    /**
     * Removes an item from the set of selected arrays
     * @param data The item to be removed
     */
    const removeFromArraysSelection = (data: string) => {
        setSelectedArrays(selectedArrays.filter((item) => {
            return item !== data;
        }));
    };

    /**
     * Adds an item to the set of selected historized data
     * @param data The item to be added
     */
    const addToHistorizedSelection = (data: string) => {
        const arCopy = selectedHistorized.slice()
        arCopy.push(data)
        setSelectedHistorized(arCopy);
    };

    /**
     * Removes an item from the set of selected historized data
     * @param data The item to be removed
     */
    const removeFromHistorizedSelection = (data: string) => {
        setSelectedHistorized(selectedHistorized.filter((item) => {
            return item !== data;
        }));
    };


    /**
     * Method that handles clicking on a checkbox of an array.
     * @param data The name of the list item key the checkbox was set for.
     */
    const arrayCheckboxHandler = (data: string) => {
        if (selectedArrays.includes(data)) {
            removeFromArraysSelection(data);
        } else {
            addToArraysSelection(data)
        }
    };


    /**
     * Method that handles clicking on a checkbox of historized data.
     * @param data The name of the list item key the checkbox was set for.
     */
    const historizedCheckboxHandler = (data: string) => {
        if (selectedHistorized.includes(data)) {
            removeFromHistorizedSelection(data);
        } else {
            addToHistorizedSelection(data)
        }
    };


    /**
     * Renders an array to be displayed in the array list.
     * @param item The array to be displayed
     */
    const renderArrayListItem = (item: ListItemRepresentation) => {
        let keyString = item.parentKeyName === "" ? item.keyName : item.parentKeyName + "|" + item.keyName;
        //if it ends with |0, cut the rest
        //in the current state of the application, all arrays end with |0, this check is used for future compatibility
        return (
            <ListItem key={keyString}>
                <ListItemIcon>
                    <FormControlLabel
                        control={
                            <Checkbox onClick={() => arrayCheckboxHandler(keyString)}
                                      checked={selectedArrays.includes(keyString)}/>
                        }
                        label={''}
                    />
                </ListItemIcon>
                <ListItemText
                    primary={keyString}
                    secondary={null}
                    className={classes.wrappedText}
                />
            </ListItem>
        )
    }

    /**
     * Renders an item to be displayed in the historized data list.
     * @param item The item to be displayed
     */
    const renderHistorizedListItem = (item: string) => {
        return (
            <ListItem key={item}>
                <ListItemIcon>
                    <FormControlLabel
                        control={
                            <Checkbox onClick={() => historizedCheckboxHandler(item)}
                                      checked={selectedHistorized.includes(item)}/>
                        }
                        label={''}
                    />
                </ListItemIcon>
                <ListItemText
                    primary={item}
                    secondary={null}
                    className={classes.wrappedText}
                />
            </ListItem>
        )
    }


    return (

        <Grid container>
            <Grid item xs={12}>
                <Typography variant="body1">
                    Bitte wählen sie aus, ob das Diagramm aus einem Array oder historisierten Daten erstellt werden
                    soll:
                </Typography>
            </Grid>
            <Grid item xs={12} className={classes.elementLargeMargin}>
                <FormControl fullWidth>
                    <RadioGroup value={selectedType} onChange={typeChangeHandler}>
                        <Grid item xs={12}>
                            <FormControlLabel value="Array" control={
                                <Radio
                                />
                            } label={"Diagramm basierend auf einem Array"}
                            />
                            <Collapse in={selectedType === "Array"}>
                                <Grid item container xs={12}>
                                    <Grid item xs={12}>
                                        <Typography variant="body1">
                                            Folgende Arrays des Infoproviders sind kompatibel mit Diagrammen:
                                        </Typography>
                                    </Grid>
                                    <Grid item container xs={12}>
                                        <Box borderColor="primary.main" border={4} borderRadius={5}
                                             className={classes.choiceListFrame}>
                                            <Grid item xs={12}>
                                                <List disablePadding={true}>
                                                    {props.compatibleArrays.map((item) => renderArrayListItem(item))}
                                                </List>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Collapse>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel value="HistorizedData" control={
                                <Radio
                                />
                            } label={"Diagramm aus historisierten Daten"}
                            />
                            <Collapse in={selectedType === "HistorizedData"}>
                                <Grid item container xs={12}>
                                    <Grid item xs={12}>
                                        <Typography variant="body1">
                                            Folgende historisierte Daten sind für die Diagrammerstellung geeignet:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box borderColor="primary.main" border={4} borderRadius={5}
                                             className={classes.choiceListFrame}>
                                            <List disablePadding={true}>
                                                {props.compatibleHistorized.map((item) => renderHistorizedListItem(item))}
                                            </List>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Collapse>
                        </Grid>
                    </RadioGroup>
                </FormControl>
            </Grid>

            <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                <Grid item>
                    <Button variant="contained" size="large" color="primary" onClick={handleBack}>
                        zurück
                    </Button>
                </Grid>
                <Grid item className={classes.blockableButtonPrimary}>
                    <Button
                        disabled={!((selectedType === "Array" && selectedArrays.length !== 0) || (selectedType === "HistorizedData" && selectedHistorized.length !== 0))}
                        variant="contained" size="large" color="primary" onClick={continueHandler}>
                        weiter
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
};

