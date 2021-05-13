import React from "react";
import { useStyles } from "../style";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {ListItemRepresentation, diagramType, Schedule} from "../../index";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import Typography from "@material-ui/core/Typography";
import {BasicDiagramSettings} from "../BasicDiagramSettings";
import {useCallFetch} from "../../../Hooks/useCallFetch";
import {CustomLabels} from "../CustomLabels";
import {ArrayDiagramProperties, HistorizedDiagramProperties} from "../index";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";


interface HistorizedDiagramCreatorProps {
    continueHandler: () => void;
    backHandler: () => void;
    historizedObjects: Array<HistorizedDiagramProperties>;
    setHistorizedObjects: (historizedObjects: Array<HistorizedDiagramProperties>) => void;
    changeObjectInHistorizedObjects: (object: HistorizedDiagramProperties, ordinal: number) => void;
    diagramType: diagramType;
    setDiagramType: (type: diagramType) => void;
    amount: number;
    setAmount: (amount: number) => void;
    reportError: (message: string) => void;
    schedule: Schedule;
}

export const HistorizedDiagramCreator: React.FC<HistorizedDiagramCreatorProps> = (props) => {
    const classes = useStyles();

    //timeout counter used for delayed color change
    let timeOut = 0;

    //holds the currently selected arrayObject
    const [selectedHistorizedOrdinal, setSelectedHistorizedOrdinal] = React.useState<number>(0);



    /**
     * Checks if proceeding is possible and returns true if this is the case.
     * Checks if properties are selected for each object and/or a string is typed for custom labels when it is selected
     */
    const checkProceed = () => {
        for (let i = 0; i < props.historizedObjects.length; i++) {
            const item = props.historizedObjects[i];
            for (let j = 0; j < item.labelArray.length; j++) {
                if(item.labelArray[j]==="") return false;
            }
        }
        return true;
    }

    /**
     * Handler for the return of a successful call to the backend (posting test diagram)
     * @param jsonData The JSON-object delivered by the backend
     */
    const handleSuccess = (jsonData: any) => {
    }

    /**
     * Handler for unsuccessful call to the backend (posting test-diagram)
     * @param err The error returned by the backend
     */
    const handleError = (err: Error) => {
        props.reportError("Fehler: Senden des Diagramms an das Backend fehlgeschlagen! (" + err.message + ")");
    }

    /**
     * Method to post all settings for the Info-Provider made by the user to the backend.
     * The backend will use this data to create the desired Info-Provider.
     */
    const getTestImage = useCallFetch("/testdiagram",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

            })
        }, handleSuccess, handleError
    );







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
                    <Grid item xs={6}>
                        <Typography variant="body1">
                            {ordinal+1}: Aktueller Wert -
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField type="number" inputProps={{ min: 1}} variant="outlined" margin="normal"
                                   value={props.historizedObjects[selectedHistorizedOrdinal].intervalSizes[ordinal]}
                                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => intervalSizeChangeHandler(e, ordinal)}
                        />
                    </Grid>
                    <Grid item xs={3}>
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
            <Grid item container xs={12}>
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
                    <CustomLabels
                        amount={props.amount}
                        historizedObjects={props.historizedObjects}
                        selectedHistorizedOrdinal={selectedHistorizedOrdinal}
                        changeObjectInHistorizedObjects={props.changeObjectInHistorizedObjects}
                    />
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
            <Grid item xs={8}>
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
            <Grid item xs={4}>
                <input
                    type="color"
                    value={props.historizedObjects[selectedHistorizedOrdinal].color}
                    onChange={colorChangeHandler}
                />
            </Grid>
            <Grid item xs={12}>
                <Typography>
                    Dieser Wert verwendet eine Intervallgröße von: {getIntervalDisplay()}
                </Typography>
            </Grid>
            {renderSelections()}
            <Grid item container xs={12} justify="space-around">
                <Grid item>
                    <Button variant="contained" size="large" color="secondary" onClick={() => getTestImage()}>
                        Vorschau generieren
                    </Button>
                </Grid>
            </Grid>
            <Grid item container xs={12} justify="space-between">
                <Grid item>
                    <Button variant="contained" size="large" color="primary" onClick={props.backHandler}>
                        zurück
                    </Button>
                </Grid>
                <Grid item className={classes.blockableButtonPrimary}>
                    <Button disabled={!checkProceed()} variant="contained" size="large" color="primary"  onClick={props.continueHandler}>
                        weiter
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
};
