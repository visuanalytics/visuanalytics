import React from "react";
import {useStyles} from "../../style";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {
    diagramType,
    uniqueId,
    ArrayDiagramProperties,
    SelectedStringAttribute, ListItemRepresentation
} from "../../../types";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import Typography from "@material-ui/core/Typography";
import {BasicDiagramSettings} from "../BasicDiagramSettings";
import {CustomLabels} from "../CustomLabels";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";

interface ArrayDiagramCreatorProps {
    continueHandler: () => void;
    backHandler: () => void;
    arrayObjects: Array<ArrayDiagramProperties>;
    setArrayObjects: (arrayObjects: Array<ArrayDiagramProperties>) => void;
    changeObjectInArrayObjects: (object: ArrayDiagramProperties, ordinal: number) => void;
    diagramType: diagramType;
    setDiagramType: (type: diagramType) => void;
    setDiagramName: (name: string) => void;
    amount: number;
    setAmount: (amount: number) => void;
    reportError: (message: string) => void;
    fetchPreviewImage: () => void;
    imageURL: string;
    setImageURL: (url: string) => void;
    customLabels: boolean;
    setCustomLabels: (customLabels: boolean) => void;
    labelArray: Array<string>;
    setLabelArray: (labels: Array<string>) => void;
    selectedStringAttribute: SelectedStringAttribute;
    setSelectedStringAttribute: (stringAttribute: SelectedStringAttribute) => void;
}

/**
 * Component used for the creation of diagrams that use arrays as data.
 * Displays the basic diagram selection component and a selection for the numeric
 * attributes and labels of all arrays in the diagram.
 */
export const ArrayDiagramCreator: React.FC<ArrayDiagramCreatorProps> = (props) => {
    const classes = useStyles();

    //timeout counter used for delayed color change
    let timeOut = 0;

    //holds the index of the currently selected arrayObject
    const [selectedArrayOrdinal, setSelectedArrayOrdinal] = React.useState<number>(0);
    //holds a list of all available string attributes
    const [availableStringAttributes, setAvailableStringAttributes] = React.useState<Array<SelectedStringAttribute>>([]);
    //holds the index of the selected stringAttribute
    const [stringAttributeIndex, setStringAttributeIndex] = React.useState(-1);
    //boolean flag used for opening and closing the preview dialog
    const [previewOpen, setPreviewOpen] = React.useState(false);
    //boolean flag used for opening and closing the cancel dialog
    const [cancelOpen, setCancelOpen] = React.useState(false);

    /**
     * Restore data from sessionStorage to not loose it on reload.
     */
    React.useEffect(() => {
        //selectedArrayOrdinal
        setSelectedArrayOrdinal(Number(sessionStorage.getItem("selectedArrayOrdinal-" + uniqueId) || 0));
        //availableStringAttributes
        setAvailableStringAttributes(sessionStorage.getItem("availableStringAttributes-" + uniqueId) === null ? [] : JSON.parse(sessionStorage.getItem("availableStringAttributes-" + uniqueId)!))
    }, [])
    //store selectedArrayOrdinal in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("selectedArrayOrdinal-" + uniqueId, selectedArrayOrdinal.toString());
    }, [selectedArrayOrdinal])
    //store availableStringAttributes in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("availableStringAttributes-" + uniqueId, JSON.stringify(availableStringAttributes));
    }, [availableStringAttributes])

    //extract arrayObjects from props to use in dependencies
    const arrayObjects = props.arrayObjects;

    /**
     * Create the list of available string attributes on the first render.
     */
    React.useEffect(() => {
        //console.log("generated list of available attributes")
        const availableStringAttributes: Array<SelectedStringAttribute> = [];
        arrayObjects.forEach((array) => {
            array.stringAttributes.forEach((stringAttribute) => {
                //calculate the path of the array without the dataSource in front of it to use it for cutting the innerKey name
                const arrayFull = array.listItem.parentKeyName === "" ? array.listItem.keyName : array.listItem.parentKeyName + "|" + array.listItem.keyName
                const arrayNoDataSource = arrayFull.substring(arrayFull.indexOf("|") + 1) + "|0|";
                //now get the innerKey without the parent to use it for generating
                const innerKeyFull = stringAttribute.parentKeyName + "|" + stringAttribute.keyName;
                const innerKeyNoParent = innerKeyFull.substring(arrayNoDataSource.length);
                availableStringAttributes.push({
                    key: innerKeyNoParent,
                    array: arrayFull
                })
            })
        })
        setAvailableStringAttributes(availableStringAttributes)
    }, [arrayObjects])


    /**
     * Handler method for the back button.
     * Resets the settings and clears things from sessionStorage to avoid further problems.
     */
    const backHandler = () => {
        props.setAmount(1);
        props.setArrayObjects([]);
        props.setDiagramType("verticalBarChart");
        props.setDiagramName("");
        props.setCustomLabels(true);
        props.setLabelArray(Array(1).fill(""));
        props.setSelectedStringAttribute({array: "", key: ""})
        sessionStorage.removeItem("amount-" + uniqueId);
        sessionStorage.removeItem("arrayObjects-" + uniqueId);
        sessionStorage.removeItem("diagramType-" + uniqueId);
        sessionStorage.removeItem("diagramName-" + uniqueId);
        sessionStorage.removeItem("customLabels-" + uniqueId);
        sessionStorage.removeItem("labelArray-" + uniqueId);
        sessionStorage.removeItem("selectedArrayOrdinal-" + uniqueId);
        sessionStorage.removeItem("selectedStringAttribute-" + uniqueId);
        sessionStorage.removeItem("availableStringAttributes-" + uniqueId);
        props.backHandler();
    }


    /**
     * Checks if proceeding is possible and returns true if this is the case.
     * Checks if properties are selected for each object and/or a string is typed for custom labels when it is selected
     */
    const checkProceed = () => {
        //check if custom labels are set when selected
        if (props.customLabels) {
            for (let j = 0; j < props.labelArray.length; j++) {
                if (props.labelArray[j] === "") return false;
            }
        } else {
            //check if a stringAttribute is selected when customLabels are not used
            if (props.selectedStringAttribute.key === "" || props.selectedStringAttribute.array === "") return false;
        }
        //go trough all arrays and heck if a numeric attribute is selected (only necessary for non-primitive arrays
        for (let i = 0; i < props.arrayObjects.length; i++) {
            const item = props.arrayObjects[i];
            //if it is an object, check if a numeric attribute is selected
            if (Array.isArray(item.listItem.value) && item.numericAttribute === "") return false;
        }
        return true;
    }


    /**
     * Handler for clicking the preview button
     */
    const previewHandler = () => {
        setPreviewOpen(true);
        props.fetchPreviewImage();
    }


    /**
     * Toggles between selection of customLabels and stringAttribute
     */
    const toggleCustomLabel = () => {
        props.setCustomLabels(!props.customLabels);
    }


    /**
     * Handler method for a change in the color input element.
     * @param event The event caused by the input.
     */
    const colorChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        delayedColorChange(event.target.value);
    }

    /**
     * Changes the color with a delay of 200ms.
     * This is used to only change the color state when there was no input for 200ms.
     * Without the delay, there are too many refreshes.
     * @param color The new color value.
     */
    const delayedColorChange = (color: string) => {
        window.clearTimeout(timeOut);
        timeOut = window.setTimeout(() => {
            let objCopy = {
                ...props.arrayObjects[selectedArrayOrdinal],
                color: color
            }
            //objCopy.color = color;
            //console.log(event.target.value);
            props.changeObjectInArrayObjects(objCopy, selectedArrayOrdinal);
        }, 200);
    }


    /**
     * Handler method for changing the selected array.
     * @param event The event caused by the change.
     */
    const selectedArrayChangeHandler = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedArrayOrdinal(Number(event.target.value));
    }

    /**
     * Renders an item of the selection for all arrays that can be selected.
     * @param object The object the item is rendered from.
     * @param index Index of the item.
     */
    const renderArraySelectItem = (object: ArrayDiagramProperties, index: number) => {
        const keyString = object.listItem.parentKeyName === "" ? object.listItem.keyName : object.listItem.parentKeyName + "|" + object.listItem.keyName;
        return (
            <MenuItem key={keyString} value={index}>
                {keyString}
            </MenuItem>
        )
    }

    /**
     * Event handler that is called when the numeric attribute choice is changed.
     * @param event The change event caused by changing the attribute.
     */
    const numericAttributeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        //console.log(props.arrayObjects);
        //console.log(event.target.value);
        let objCopy = {
            ...props.arrayObjects[selectedArrayOrdinal],
        }
        objCopy.numericAttribute = event.target.value;
        //console.log(objCopy);
        props.changeObjectInArrayObjects(objCopy, selectedArrayOrdinal);
    };

    /**
     * Event handler that is called when the string attribute choice is changed.
     * Sets the globally selected StringAttribute to the new selection and updates the selected index.
     * @param event The change event caused by changing the attribute.
     */
    const stringAttributeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const index = Number(event.target.value);
        props.setSelectedStringAttribute(availableStringAttributes[index]);
        setStringAttributeIndex(index);
    };

    /**
     * Renders an item to be displayed in the lists of numeric attributes and string attributes.
     * @param item The item to be displayed
     */
    const renderNumericAttributeItem = (item: ListItemRepresentation) => {
        return (
            <FormControlLabel className={classes.wrappedLabel} value={item.keyName} control={
                <Radio
                />
            } label={item.keyName} key={item.keyName}
            />
        )
    }

    /**
     * Renders an item to be displayed in the lists of numeric attributes and string attributes.
     * @param item The item to be displayed
     * @param index The index of the item in the list
     */
    const renderStringAttributeItem = (item: SelectedStringAttribute, index: number) => {
        return (
            <FormControlLabel className={classes.wrappedLabel} value={index} control={
                <Radio
                />
            } label={item.array + "|" + item.key} key={item.array + "|" + item.key}
            />
        )
    }

    /**
     * Renders the currently necessary detailed selection by checking if the selected array contains objects or primitives
     */
    const renderSelections = () => {
            //selections for arrays containing objects
            return (
                <Grid item container xs={12} className={classes.elementLargeMargin}>
                    <Grid item xs={6}>
                        <Typography variant="body1">
                            {Array.isArray(props.arrayObjects[selectedArrayOrdinal].listItem.value) ? "Bitte wählen sie das Zahl-Attribut zur Darstellung im Diagramm:" : "Das Array enthält primitive Werte, eine Attribut-Auswahl ist nicht notwendig."}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1">
                            {props.customLabels ? "Bitte wählen sie zu jedem Wert eine Beschriftung:" : "Bitte wählen sie das String-Attribut zur Beschriftung der Werte:"}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                            { Array.isArray(props.arrayObjects[selectedArrayOrdinal].listItem.value) &&
                                <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.choiceListFrame}>
                                    <FormControl>
                                        <RadioGroup value={props.arrayObjects[selectedArrayOrdinal].numericAttribute}
                                            onChange={numericAttributeChangeHandler}>
                                            {props.arrayObjects[selectedArrayOrdinal].numericAttributes.map((item) => renderNumericAttributeItem(item))}
                                        </RadioGroup>
                                    </FormControl>
                                </Box>
                            }
                    </Grid>
                    {getLabelSelection()}
                </Grid>
            )
    }


    /**
     * Used for arrays with objects. Returns the currently selected label selection based on the state.
     * If the user has selected customLabels, then the input is offered. If not, the list of string attributes is displayed.
     */
    const getLabelSelection = () => {
        if (props.customLabels) {
            return (
                <Grid item container xs={6}>
                    <CustomLabels
                        amount={props.amount}
                        labelArray={props.labelArray}
                        setLabelArray={props.setLabelArray}
                    />
                </Grid>
            )
        } else {
            return (
                <Grid item xs={6}>
                    <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.choiceListFrame}>
                        <FormControl>
                            <RadioGroup value={stringAttributeIndex}
                                        onChange={stringAttributeChangeHandler}>
                                {availableStringAttributes.map((item, index) => renderStringAttributeItem(item, index))}
                                { availableStringAttributes.length === 0 &&
                                    <Typography variant="body1">
                                        Die Objekte der gewählten Arrays enthalten keine String-Attribute.
                                    </Typography>
                                }
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </Grid>
            )
        }
    }

    return (
        <Grid container justify="space-between">
            <BasicDiagramSettings
                arrayObjects={props.arrayObjects}
                diagramType={props.diagramType}
                setDiagramType={props.setDiagramType}
                amount={props.amount}
                setAmount={props.setAmount}
            />
            <Grid item xs={8} className={classes.elementLargeMargin}>
                <FormControl fullWidth variant="outlined">
                    <Select
                        value={selectedArrayOrdinal}
                        onChange={selectedArrayChangeHandler}
                    >
                        {props.arrayObjects.map((object, index) => renderArraySelectItem(object, index))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item container xs={3} className={classes.elementLargeMargin} justify="space-around">
                <Grid item xs={6}>
                    <Typography variant="body1">
                        Farbe im Diagramm:
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <input
                        type="color"
                        value={props.arrayObjects[selectedArrayOrdinal].color}
                        onChange={colorChangeHandler}
                        className={classes.colorTool}
                    />

                </Grid>
            </Grid>
            {renderSelections()}
            <Grid item container xs={12} justify="space-around">
                <Grid item className={classes.blockableButtonSecondary}>
                    <Button disabled={!checkProceed()} variant="contained" size="large" color="secondary"
                            onClick={previewHandler}>
                        Vorschau generieren
                    </Button>
                </Grid>
                    <Grid item>
                        <Button variant="contained" size="large" color="primary"
                                onClick={() => toggleCustomLabel()}>
                            {props.customLabels ? "Attribut-Beschriftung" : "eigene Beschriftungen"}
                        </Button>
                    </Grid>
            </Grid>
            <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                <Grid item>
                    <Button variant="contained" size="large" color="primary" onClick={() => setCancelOpen(true)}>
                        zurück
                    </Button>
                </Grid>
                <Grid item className={classes.blockableButtonPrimary}>
                    <Button disabled={!checkProceed()} variant="contained" size="large" color="primary" onClick={() => {
                        sessionStorage.removeItem("selectedArrayOrdinal-" + uniqueId);
                        props.continueHandler();
                    }}>
                        weiter
                    </Button>
                </Grid>
            </Grid>
            <Dialog
                onClose={() => {
                setPreviewOpen(false);
                window.setTimeout(() => props.setImageURL(""), 200);
                }}
                aria-labelledby="previewDialog-title"
                maxWidth={"md"}
                fullWidth={true}
                open={previewOpen}>
                <DialogTitle id="previewDialog-title">
                    Vorschau des generierten Diagramm
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container justify={"center"}>
                        <Grid item>
                            <img width="640" height="480" alt="Vorschaubild Diagramm" src={props.imageURL}/>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={() => {
                            setPreviewOpen(false);
                            window.setTimeout(() => props.setImageURL(""), 200);
                        }}>
                            schließen
                        </Button>
                    </Grid>
                </DialogActions>
            </Dialog>
            <Dialog onClose={() => setCancelOpen(false)} aria-labelledby="leaveDialog-title" open={cancelOpen}>
                <DialogTitle id="leaveDialog-title">
                    Zurück zur Datenauswahl?
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Alle bisherigen Einstellungen gehen dabei verloren.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Grid container justify="space-between">
                        <Grid item>
                            <Button variant="contained" color={"primary"} onClick={() => setCancelOpen(false)}>
                                abbrechen
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" onClick={backHandler} className={classes.redDeleteButton}>
                                zurück
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </Grid>
    )
};
