import React from "react";
import { useStyles } from "../../style";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {ListItemRepresentation, diagramType, Schedule, uniqueId} from "../../../index";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import Typography from "@material-ui/core/Typography";
import {BasicDiagramSettings} from "../BasicDiagramSettings";
import {useCallFetch} from "../../../../Hooks/useCallFetch";
import {CustomLabels} from "../CustomLabels";
import {ArrayDiagramProperties, HistorizedDiagramProperties} from "../../index";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import {Dialog, DialogActions, DialogContent, DialogTitle, ListItemIcon} from "@material-ui/core";


interface HistorizedDiagramCreatorProps {
    continueHandler: () => void;
    backHandler: () => void;
    historizedObjects: Array<HistorizedDiagramProperties>;
    setHistorizedObjects: (historizedObjects: Array<HistorizedDiagramProperties>) => void;
    changeObjectInHistorizedObjects: (object: HistorizedDiagramProperties, ordinal: number) => void;
    diagramType: diagramType;
    setDiagramType: (type: diagramType) => void;
    setDiagramName: (name: string) => void;
    amount: number;
    setAmount: (amount: number) => void;
    reportError: (message: string) => void;
    schedule: Schedule;
    fetchPreviewImage: () => void;
    imageURL: string;
    setImageURL: (url: string) => void;
}

export const HistorizedDiagramCreator: React.FC<HistorizedDiagramCreatorProps> = (props) => {
    const classes = useStyles();

    //timeout counter used for delayed color change
    let timeOut = 0;

    //holds the currently selected arrayObject
    const [selectedHistorizedOrdinal, setSelectedHistorizedOrdinal] = React.useState<number>(0);
    //boolean flag used for opening and closing the preview dialog
    const [previewOpen, setPreviewOpen] = React.useState(false);
    //boolean flag used for opening and closing the cancel dialog
    const [cancelOpen, setCancelOpen] = React.useState(false);

    /**
     * Restore the selected ordinal from sessionStorage to not loose it on reload.
     */
    React.useEffect(() => {
        //selectedHistorizedOrdinal
        setSelectedHistorizedOrdinal(Number(sessionStorage.getItem("selectedHistorizedOrdinal-" + uniqueId) || 0));
    }, [])
    //store selectedArrayOrdinal in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("selectedHistorizedOrdinal-" + uniqueId, selectedHistorizedOrdinal.toString());
    }, [selectedHistorizedOrdinal])


    /**
     * Handler method for the back button.
     * Resets the settings and clears things from sessionStorage to avoid further problems.
     */
    const backHandler = () => {
        props.setAmount(1);
        props.setHistorizedObjects([]);
        props.setDiagramType("verticalBarChart");
        props.setDiagramName("");
        sessionStorage.removeItem("amount-" + uniqueId);
        sessionStorage.removeItem("historizedObjects-" + uniqueId);
        sessionStorage.removeItem("diagramType-" + uniqueId);
        sessionStorage.removeItem("diagramName-" + uniqueId);
        props.backHandler();
    }


    /**
     * Checks if proceeding is possible and returns true if this is the case.
     * Checks if properties are selected for each object and/or a string is typed for custom labels when it is selected
     */
    const checkProceed = () => {
        for (let i = 0; i < props.historizedObjects.length; i++) {
            const item = props.historizedObjects[i];
            if(item.dateLabels) {
                if(item.dateFormat==="") return false;
            } else {
                for (let j = 0; j < item.labelArray.length; j++) {
                    if(item.labelArray[j]==="") return false;
                }
            }
        }
        return true;
    }


    /**
     * Handler for clicking the preview button
     */
    const previewHandler = () => {
        console.log("previewHandler")
        setPreviewOpen(true);
        props.fetchPreviewImage();
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
                ...props.historizedObjects[selectedHistorizedOrdinal],
                color: color
            }
            //objCopy.color = color;
            //console.log(event.target.value);
            props.changeObjectInHistorizedObjects(objCopy, selectedHistorizedOrdinal);
        }, 200);
    }


    /**
     * Handler method for changing the selected array.
     * @param event The event caused by the change.
     * Searches the correct arrayObject and sets the selectedArray-state to it.
     */
    const selectedHistorizedChangeHandler = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedHistorizedOrdinal(Number(event.target.value));
    }

    /**
     * Renders an item of the selection for all arrays that can be selected.
     * @param object
     */
    const renderHistorizedSelectItem = (object: HistorizedDiagramProperties, index: number) => {
        return (
            <MenuItem key={object.name} value={index}>
                {object.name}
            </MenuItem>
        )
    }

    /**
     * Handler method for changing the interval size.
     * @param event The event caused by the change, containing the new value.
     * @param ordinal The ordinal of the input the change was made to.
     */
    const intervalSizeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, ordinal: number) => {
        const newIntervalSizes = [...props.historizedObjects[selectedHistorizedOrdinal].intervalSizes];
        newIntervalSizes[ordinal] = Number(event.target.value);
        const objCopy = {
            ...props.historizedObjects[selectedHistorizedOrdinal],
            intervalSizes: newIntervalSizes
        }
        props.changeObjectInHistorizedObjects(objCopy, selectedHistorizedOrdinal);
    }


    /**
     * Toggles the dateLabel property for the current historized data.
     */
    const toggleDateLabels = () => {
        let objCopy = {
            ...props.historizedObjects[selectedHistorizedOrdinal],
            dateLabels: !(props.historizedObjects[selectedHistorizedOrdinal].dateLabels)
        }
        //console.log(event.target.value);
        props.changeObjectInHistorizedObjects(objCopy, selectedHistorizedOrdinal);
    }

    /**
     * Handler for changing the date format used for displaying date labels.
     * @param e The change event holding the new format
     */
    const dateFormatChangeHandler = (event: React.ChangeEvent<{value: unknown}>) => {
        if(event.target.value!==undefined) {
            let objCopy = {
                ...props.historizedObjects[selectedHistorizedOrdinal],
                dateFormat: event.target.value as string
            }
            //console.log(event.target.value);
            props.changeObjectInHistorizedObjects(objCopy, selectedHistorizedOrdinal);
        }

    }


    /**
     * Uses the schedule object passed as property to check what interval was selected for the corresponding values and returns a displaying string.
     */
    const getIntervalDisplay = () => {
        //check for weekly
        if(props.schedule.type==="weekly") {
            if(props.schedule.weekdays!==undefined&&props.schedule.weekdays.length!==0) {
                //check if every day is selected
                if(props.schedule.weekdays.reduce((sum, value) => sum+value)===21 &&props.schedule.weekdays.includes(0)) {
                    return "24h";
                }
                let weekdayString = "Wochentage (";
                let firstElement = true;
                if(props.schedule.weekdays.includes(0)) {
                    weekdayString += "MO";
                    firstElement=false;
                }
                if(props.schedule.weekdays.includes(1)) {
                    weekdayString += (firstElement?"":"/") + "DI";
                    firstElement=false;
                }
                if(props.schedule.weekdays.includes(2)) {
                    weekdayString += (firstElement?"":"/") + "MI";
                    firstElement=false;
                }
                if(props.schedule.weekdays.includes(3)) {
                    weekdayString += (firstElement?"":"/") + "DO";
                    firstElement=false;
                }
                if(props.schedule.weekdays.includes(4)) {
                    weekdayString += (firstElement?"":"/") + "FR";
                    firstElement=false;
                }
                if(props.schedule.weekdays.includes(5)) {
                    weekdayString += (firstElement?"":"/") + "SA";
                    firstElement=false;
                }
                if(props.schedule.weekdays.includes(6)) {
                    weekdayString += (firstElement?"":"/") + "SO";
                    firstElement=false;
                }
                weekdayString += ")";
                return weekdayString
            }
        }
        //check for daily
        else if(props.schedule.type==="daily") {
            return "24h"
        }
        //check for interval
        else if(props.schedule.type==="interval") {
            switch(props.schedule.interval) {
                case "minute": {
                    return "1m";
                }
                case "quarter": {
                    return "15m";
                }
                case "half": {
                    return "30m";
                }
                case "threequarter": {
                    return "45m";
                }
                case "hour": {
                    return "1h";
                }
                case "quartday": {
                    return "6h";
                }
                case "halfday": {
                    return "12h"
                }
            }
        }
    }
    
    /**
     * Renders a single item of the interval choice list.
     * @param ordinal The number of the rendered item.
     */
    const renderIntervallChoiceItem = (ordinal: number) => {
        return (
            <ListItem key={"Intervallgröße_" + (ordinal + 1)} divider={true}>
                <Grid item container xs={12} justify="space-between">
                    <Grid item xs={9}>
                        <FormControlLabel
                            className={classes.creatorFormControlLabel}
                            control={
                                <TextField type="number" inputProps={{ min: 1}} variant="outlined" margin="normal"
                                           value={props.historizedObjects[selectedHistorizedOrdinal].intervalSizes[ordinal]}
                                           onChange={(e: React.ChangeEvent<HTMLInputElement>) => intervalSizeChangeHandler(e, ordinal)}
                                           className={classes.intervalInputField}
                                />
                            }
                            label={(ordinal+1) + ":\u00A0 Aktueller Wert -"}
                            labelPlacement="start"
                        />
                    </Grid>
                    <Grid item xs={2} className={classes.intervalChoiceRightLabel}>
                        <Typography variant="body1">
                            Intervalle
                        </Typography>
                    </Grid>
                </Grid>
            </ListItem>
        )
    }

    /**
     * Renders the currently necessary detailed selection by checking if the selected array contains objects or primitives
     */
    const renderSelections = () => {
        return (
            <Grid item container xs={12} className={classes.elementLargeMargin}>
                <Grid item xs={6}>
                    <Typography variant="body1">
                        Bitte wählen sie für alle Werte die Zeitpunkte:
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="body1">
                        Bitte wählen sie zu jedem Wert eine Beschriftung:
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.choiceListFrame}>
                        <List>
                            {Array.from(Array(props.amount).keys()).map((ordinal) => renderIntervallChoiceItem(ordinal))}
                        </List>
                    </Box>
                </Grid>
                <Grid item container xs={6}>
                    {props.historizedObjects[selectedHistorizedOrdinal].dateLabels?
                        (<Box borderColor="primary.main" border={4} borderRadius={5} className={classes.choiceListFrame}>
                            <Grid item xs={12} className={classes.elementLargeMargin}>
                                <Typography variant="body1">
                                    Zu jedem Datenwert wird das Datum angezeigt, an dem er gespeichert wurde.<br/>Bitte wählen sie das Anzeigeformat:
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined" className={classes.elementLargeMargin}>
                                    <Select
                                        value={props.historizedObjects[selectedHistorizedOrdinal].dateFormat}
                                        onChange={dateFormatChangeHandler}
                                    >
                                        <MenuItem value={"dd.mm.yyyy"}>Tag.Monat.Jahr (tt:mm:jjjj)</MenuItem>
                                        <MenuItem value={"dd.mm"}>Tag.Monat (tt.mm)</MenuItem>
                                        <MenuItem value={"dd"}>Tag (tt)</MenuItem>
                                        <MenuItem value={"hh:mm"}>Stunde:Minute (ss:mm) Uhr</MenuItem>
                                        <MenuItem value={"hh"}>Stunde (ss) Uhr</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Box>):
                        (<CustomLabels
                            amount={props.amount}
                            historizedObjects={props.historizedObjects}
                            selectedHistorizedOrdinal={selectedHistorizedOrdinal}
                            changeObjectInHistorizedObjects={props.changeObjectInHistorizedObjects}
                        />)
                    }
                </Grid>
            </Grid>
        )
    }




    return(
        <Grid container justify="space-between">
            <BasicDiagramSettings
                diagramType={props.diagramType}
                setDiagramType={props.setDiagramType}
                amount={props.amount}
                setAmount={props.setAmount}
            />
            <Grid item xs={8} className={classes.elementLargeMargin}>
                <FormControl fullWidth variant="outlined">
                    <Select
                        //value={props.arrayObjects[selectedArrayOrdinal].listItem.parentKeyName===""?props.arrayObjects[selectedArrayOrdinal].listItem.keyName:props.arrayObjects[selectedArrayOrdinal].listItem.parentKeyName + "|" + props.arrayObjects[selectedArrayOrdinal].listItem.keyName}
                        value={selectedHistorizedOrdinal}
                        onChange={selectedHistorizedChangeHandler}
                    >
                        {props.historizedObjects.map((object, index) => renderHistorizedSelectItem(object, index))}
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
                        value={props.historizedObjects[selectedHistorizedOrdinal].color}
                        onChange={colorChangeHandler}
                        className={classes.colorTool}
                    />

                </Grid>
            </Grid>
            <Grid item xs={12} className={classes.elementLargeMargin}>
                <Typography>
                    Dieser Wert verwendet eine Intervallgröße von: {getIntervalDisplay()}
                </Typography>
            </Grid>
            {renderSelections()}
            <Grid item container xs={12} justify="space-around">
                <Grid item className={classes.blockableButtonSecondary}>
                    <Button disabled={!checkProceed()} variant="contained" size="large" color="secondary" onClick={previewHandler}>
                        Vorschau generieren
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" size="large" color="primary" onClick={() => toggleDateLabels()}>
                        {props.historizedObjects[selectedHistorizedOrdinal].dateLabels?"eigene Beschriftungen":"Datum-Beschriftungen"}
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
                    <Button disabled={!checkProceed()} variant="contained" size="large" color="primary" onClick={() => {sessionStorage.removeItem("selectedHistorizedOrdinal-" + uniqueId); props.continueHandler();}}>
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
                        <Button variant="contained" color="primary"  onClick={() => {
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
