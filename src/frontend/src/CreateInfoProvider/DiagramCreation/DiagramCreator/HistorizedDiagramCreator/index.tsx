import React from "react";
import {useStyles} from "../../style";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {DataSource, diagramType, uniqueId, HistorizedDiagramProperties} from "../../../types";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import {BasicDiagramSettings} from "../BasicDiagramSettings";
import {CustomLabels} from "../CustomLabels";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import {getWeekdayString} from "../../../helpermethods";


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
    dataSources: Array<DataSource>
    fetchPreviewImage: () => void;
    imageURL: string;
    setImageURL: (url: string) => void;
    labelArray: Array<string>;
    setLabelArray: (labels: Array<string>) => void;
}

/**
 * Component used for the creation of diagrams that use historized data as data.
 * Displays the basic diagram selection component and a selection for the interval sizes
 * of each data element and labels of all historized data elements in the diagram.
 */
export const HistorizedDiagramCreator: React.FC<HistorizedDiagramCreatorProps> = (props) => {
    const classes = useStyles();

    //timeout counter used for delayed color change
    let timeOut = 0;

    //holds the index of the currently selected historizedObject
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
    //store selectedHistorizedOrdinal in sessionStorage
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
        props.setLabelArray(Array(1).fill(""));
        sessionStorage.removeItem("amount-" + uniqueId);
        sessionStorage.removeItem("historizedObjects-" + uniqueId);
        sessionStorage.removeItem("diagramType-" + uniqueId);
        sessionStorage.removeItem("diagramName-" + uniqueId);
        sessionStorage.removeItem("labelArray-" + uniqueId);
        props.backHandler();
    }


    /**
     * Checks if proceeding is possible and returns true if this is the case.
     * Checks if all customLabels are set.
     */
    const checkProceed = () => {
        for(let index = 0; index < props.labelArray.length; index++) {
            if(props.labelArray[index] === "") return false;
        }
        return true;
    }


    /**
     * Handler for clicking the preview button
     */
    const previewHandler = () => {
        //console.log("previewHandler")
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
                ...props.historizedObjects[selectedHistorizedOrdinal],
                color: color
            }
            //objCopy.color = color;
            //console.log(event.target.value);
            props.changeObjectInHistorizedObjects(objCopy, selectedHistorizedOrdinal);
        }, 200);
    }


    /**
     * Handler method for changing the selected historized data.
     * @param event The event caused by the change.
     */
    const selectedHistorizedChangeHandler = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedHistorizedOrdinal(Number(event.target.value));
    }

    /**
     * Renders an item of the selection for all historized data elements that can be selected.
     * @param object The object the item is rendered from.
     * @param index The index of the item.
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

    //both functions are not used right now since there is no support for date labels from the backend
    /**
     * Toggles the dateLabel property for the current historized data.
     */
    /*const toggleDateLabels = () => {
        let objCopy = {
            ...props.historizedObjects[selectedHistorizedOrdinal],
            dateLabels: !(props.historizedObjects[selectedHistorizedOrdinal].dateLabels)
        }
        //console.log(event.target.value);
        props.changeObjectInHistorizedObjects(objCopy, selectedHistorizedOrdinal);
    }*/

    /**
     * Handler for changing the date format used for displaying date labels.
     * @param event The change event holding the new format
     */
    /*const dateFormatChangeHandler = (event: React.ChangeEvent<{ value: unknown }>) => {
        if (event.target.value !== undefined) {
            let objCopy = {
                ...props.historizedObjects[selectedHistorizedOrdinal],
                dateFormat: event.target.value as string
            }
            //console.log(event.target.value);
            props.changeObjectInHistorizedObjects(objCopy, selectedHistorizedOrdinal);
        }
    }*/




    /**
     * Uses the schedule object passed as property to check what interval was selected for the corresponding values and returns a displaying string.
     */
    const getIntervalDisplay = () => {
        //search the dataSource that belongs to the current element
        let dataSource: DataSource = {} as DataSource;
        const currentDataSourceName = props.historizedObjects[selectedHistorizedOrdinal].name.split("|")[0];
        for (let index = 0; index < props.dataSources.length; index++) {
            const source = props.dataSources[index];
            if(source.apiName === currentDataSourceName) {
                dataSource = source;
                break;
            }
        }
        //extract the schedule from the dataSource
        const schedule = dataSource.schedule;
        //check for weekly
        if (schedule.type === "weekly") {
            if (schedule.weekdays !== undefined && schedule.weekdays.length !== 0) {
                //check if every day is selected
                if(schedule.weekdays.length === 7) {
                    return "24h";
                }
                const weekdayNumbers = schedule.weekdays.slice();
                weekdayNumbers.sort();
                let weekdayStrings = [getWeekdayString(weekdayNumbers[0])];
                for(let i = 1; i < weekdayNumbers.length; i++) {
                    weekdayStrings.push(getWeekdayString(weekdayNumbers[i]));
                }
                return "Wochentage ("  + weekdayStrings.join(", ") + ")";
            }
        }
        //check for daily
        else if (schedule.type === "daily") {
            return "24h"
        }
        //check for interval
        else if (schedule.type === "interval") {
            switch (schedule.interval) {
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
        return ""
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
                                <TextField type="number" inputProps={{min: 0}} variant="outlined" margin="normal"
                                           value={props.historizedObjects[selectedHistorizedOrdinal].intervalSizes[ordinal]}
                                           onChange={(e: React.ChangeEvent<HTMLInputElement>) => intervalSizeChangeHandler(e, ordinal)}
                                           className={classes.intervalInputField}
                                />
                            }
                            label={(ordinal + 1) + ":\u00A0 Aktueller Wert -"}
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
     * Renders the currently necessary detailed selection by checking
     * the attributes of the currently selected historizedObject.
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
                    <CustomLabels
                        amount={props.amount}
                        labelArray={props.labelArray}
                        setLabelArray={props.setLabelArray}
                    />
                </Grid>
            </Grid>
        )
    }


    return (
        <Grid container justify="space-between">
            <BasicDiagramSettings
                historizedObjects={props.historizedObjects}
                diagramType={props.diagramType}
                setDiagramType={props.setDiagramType}
                amount={props.amount}
                setAmount={props.setAmount}
            />
            <Grid item xs={8} className={classes.elementLargeMargin}>
                <FormControl fullWidth variant="outlined">
                    <Select
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
                    <Button disabled={!checkProceed()} variant="contained" size="large" color="secondary"
                            onClick={previewHandler}>
                        Vorschau generieren
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
                        sessionStorage.removeItem("selectedHistorizedOrdinal-" + uniqueId);
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
                aria-labelledby="deleteDialog-title"
                maxWidth={"md"}
                fullWidth={true}
                open={previewOpen}>
                <DialogTitle id="deleteDialog-title">
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
