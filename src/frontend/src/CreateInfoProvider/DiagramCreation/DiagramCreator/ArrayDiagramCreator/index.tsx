import React from "react";
import { useStyles } from "../../style";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {ListItemRepresentation, diagramType, uniqueId} from "../../../index";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import Typography from "@material-ui/core/Typography";
import {BasicDiagramSettings} from "../BasicDiagramSettings";
import {CustomLabels} from "../CustomLabels";
import {ArrayDiagramProperties} from "../../index";
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
}

export const ArrayDiagramCreator: React.FC<ArrayDiagramCreatorProps> = (props) => {
    const classes = useStyles();

    //timeout counter used for delayed color change
    let timeOut = 0;

    //holds the currently selected arrayObject
    const [selectedArrayOrdinal, setSelectedArrayOrdinal] = React.useState<number>(0);
    //boolean flag used for opening and closing the preview dialog
    const [previewOpen, setPreviewOpen] = React.useState(false);
    //boolean flag used for opening and closing the cancel dialog
    const [cancelOpen, setCancelOpen] = React.useState(false);

    /**
     * Restore the selected ordinal from sessionStorage to not loose it on reload.
     */
    React.useEffect(() => {
        //diagramStep
        setSelectedArrayOrdinal(Number(sessionStorage.getItem("selectedArrayOrdinal-" + uniqueId) || 0));
    }, [])
    //store selectedArrayOrdinal in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("selectedArrayOrdinal-" + uniqueId, selectedArrayOrdinal.toString());
    }, [selectedArrayOrdinal])

    /**
     * Handler method for the back button.
     * Resets the settings and clears things from sessionStorage to avoid further problems.
     */
    const backHandler = () => {
        props.setAmount(1);
        props.setArrayObjects([]);
        props.setDiagramType("verticalBarChart");
        props.setDiagramName("");
        sessionStorage.removeItem("amount-" + uniqueId);
        sessionStorage.removeItem("arrayObjects-" + uniqueId);
        sessionStorage.removeItem("diagramType-" + uniqueId);
        sessionStorage.removeItem("diagramName-" + uniqueId);
        props.backHandler();
    }


    /**
     * Checks if proceeding is possible and returns true if this is the case.
     * Checks if properties are selected for each object and/or a string is typed for custom labels when it is selected
     */
    const checkProceed = () => {
        for (let i = 0; i < props.arrayObjects.length; i++) {
            const item = props.arrayObjects[i];
            //if it is an object, check if a numeric attribute is selected
            if(Array.isArray(item.listItem.value)&&item.numericAttribute==="") return false;
            //check if it is primitive or customLabels are selected
            if(!(Array.isArray(item.listItem.value))||item.customLabels) {
                for (let j = 0; j < item.labelArray.length; j++) {
                    if(item.labelArray[j]==="") return false;
                }
            } else {
                if(item.stringAttribute==="") return false;
            }
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
     * Toggles the customLabel property for the current array.
     */
    const toggleCustomLable = () => {
        let objCopy = {
            ...props.arrayObjects[selectedArrayOrdinal],
            customLabels: !(props.arrayObjects[selectedArrayOrdinal].customLabels)
        }
        //console.log(event.target.value);
        props.changeObjectInArrayObjects(objCopy, selectedArrayOrdinal);
    }


    /**
     * Handler method for a change in the color input element.
     * @param event The event caused by the input.
     */
    const colorChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        delayedColorChange(event.target.value)

    }

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
     * Searches the correct arrayObject and sets the selectedArray-state to it.
     */
    const selectedArrayChangeHandler = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedArrayOrdinal(Number(event.target.value));
        //get the object of the selected array
        /*for(let index = 0; index < props.arrayObjects.length; ++index) {
            const object = props.arrayObjects[index];
            if((object.listItem.parentKeyName===""?object.listItem.keyName:object.listItem.parentKeyName + "|" + object.listItem.keyName)==event.target.value) {
                setSelectedArrayOrdinal(index);
                break;
            }
        }*/
    }

    /**
     * Renders an item of the selection for all arrays that can be selected.
     * @param object The object the item is rendered from.
     * @param index Index of the item.
     */
    const renderArraySelectItem = (object: ArrayDiagramProperties, index: number) => {
        const keyString = object.listItem.parentKeyName===""?object.listItem.keyName:object.listItem.parentKeyName + "|" + object.listItem.keyName;
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
        objCopy.numericAttribute= event.target.value;
        //console.log(objCopy);
        props.changeObjectInArrayObjects(objCopy, selectedArrayOrdinal);
    };

    /**
     * Event handler that is called when the string attribute choice is changed.
     * @param event The change event caused by changing the attribute.
     */
    const stringAttributeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        let objCopy = {
            ...props.arrayObjects[selectedArrayOrdinal],
            stringAttribute: event.target.value
        }
        props.changeObjectInArrayObjects(objCopy, selectedArrayOrdinal);
    };

    /**
     * Renders an item to be displayed in the list of numeric attributes.
     * @param item The item to be displayed
     * Will not display the full path since the names are unique within one object.
     */
    const renderAttributeListItem = (item: ListItemRepresentation) => {
        return (
            <FormControlLabel value={item.keyName} control={
                <Radio
                />
            } label={item.keyName} key={item.keyName}
            />
        )
    }

    /**
     * Renders the currently necessary detailed selection by checking if the selected array contains objects or primitives
     */
    const renderSelections = () => {
        if(Array.isArray(props.arrayObjects[selectedArrayOrdinal].listItem.value)) {
            //selections for arrays containing objects
            return (
                <Grid item container xs={12} className={classes.elementLargeMargin}>
                    <Grid item xs={6}>
                        <Typography variant="body1">
                            Bitte wählen sie das Zahl-Attribut zur Darstellung im Diagramm:
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1">
                            {props.arrayObjects[selectedArrayOrdinal].customLabels?"Bitte wählen sie zu jedem Wert eine Beschriftung:":"Bitte wählen sie das String-Attribut zur Beschriftung der Werte:"}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                            <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.choiceListFrame}>
                                <FormControl>
                                    <RadioGroup value={props.arrayObjects[selectedArrayOrdinal].numericAttribute} onChange={numericAttributeChangeHandler}>
                                        {props.arrayObjects[selectedArrayOrdinal].numericAttributes.map((item) => renderAttributeListItem(item))}
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                    </Grid>
                    {getLabelSelection()}
                </Grid>
            )
        } else {
            //selections for arrays containing primitives
            return (
                <Grid item container xs={12}>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            Das gewählte Array enthält Zahlen - bitte wählen sie die Beschriftungen, die zu den einzelnen Werten angezeigt werden sollen:
                        </Typography>
                    </Grid>
                    <CustomLabels
                        amount={props.amount}
                        arrayObjects={props.arrayObjects}
                        selectedArrayOrdinal={selectedArrayOrdinal}
                        changeObjectInArrayObjects={props.changeObjectInArrayObjects}
                    />
                </Grid>
            )
        }
    }




    /**
     * Used for arrays with objects. Returns the currently selected label selection based on the state.
     * If the user has selected customLabels, then the input is offered, if not, the list of string attributes is displayed.
     */
    const getLabelSelection = () => {
        if(props.arrayObjects[selectedArrayOrdinal].customLabels) {
            return (
                <Grid item container xs={6}>
                    <CustomLabels
                        amount={props.amount}
                        arrayObjects={props.arrayObjects}
                        selectedArrayOrdinal={selectedArrayOrdinal}
                        changeObjectInArrayObjects={props.changeObjectInArrayObjects}
                    />
                </Grid>
            )
        } else {
            return (
                <Grid item xs={6}>
                    <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.choiceListFrame}>
                        <FormControl>
                            <RadioGroup value={props.arrayObjects[selectedArrayOrdinal].stringAttribute} onChange={stringAttributeChangeHandler}>
                                {props.arrayObjects[selectedArrayOrdinal].stringAttributes.map((item) => renderAttributeListItem(item))}
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </Grid>
            )
        }
    }

    return(
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
                        //value={props.arrayObjects[selectedArrayOrdinal].listItem.parentKeyName===""?props.arrayObjects[selectedArrayOrdinal].listItem.keyName:props.arrayObjects[selectedArrayOrdinal].listItem.parentKeyName + "|" + props.arrayObjects[selectedArrayOrdinal].listItem.keyName}
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
                    <Button disabled={!checkProceed()} variant="contained" size="large" color="secondary" onClick={previewHandler}>
                        Vorschau generieren
                    </Button>
                </Grid>
                    {(Array.isArray(props.arrayObjects[selectedArrayOrdinal].listItem.value)&&props.arrayObjects[selectedArrayOrdinal].stringAttributes.length===0)?(
                            <Grid item xs={4}>
                                <Typography variant="body1">
                                    Die Objekte des Arrays enthalten keine String-Attribute.
                                </Typography>
                            </Grid>

                        ):
                            (Array.isArray(props.arrayObjects[selectedArrayOrdinal].listItem.value)?(
                                <Grid item>
                                    <Button variant="contained" size="large" color="primary" onClick={() => toggleCustomLable()}>
                                        {props.arrayObjects[selectedArrayOrdinal].customLabels?"Attribut-Beschriftung":"eigene Beschriftungen"}
                                    </Button>
                                </Grid>
                            ):(
                                <React.Fragment>
                                </React.Fragment>
                            )
                        )
                    }
            </Grid>
            <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                <Grid item>
                    <Button variant="contained" size="large" color="primary" onClick={() => setCancelOpen(true)}>
                        zurück
                    </Button>
                </Grid>
                <Grid item className={classes.blockableButtonPrimary}>
                    <Button disabled={!checkProceed()} variant="contained" size="large" color="primary"  onClick={() => {sessionStorage.removeItem("selectedArrayOrdinal-" + uniqueId); props.continueHandler();}}>
                        weiter
                    </Button>
                </Grid>
            </Grid>
            <Dialog onClose={() => {
                setPreviewOpen(false);
                window.setTimeout(() => props.setImageURL(""), 200);
            }} aria-labelledby="deleteDialog-title" open={previewOpen}>
                <DialogTitle id="deleteDialog-title">
                    Vorschau des generierten Diagramm
                </DialogTitle>
                <DialogContent dividers>
                    <img width="500" height="600" alt="Vorschaubild Diagramm" src={props.imageURL}/>
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
            <Dialog onClose={() => setCancelOpen(false)} aria-labelledby="deleteDialog-title" open={cancelOpen}>
                <DialogTitle id="deleteDialog-title">
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
                            <Button variant="contained" onClick={() => setCancelOpen(false)}>
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
