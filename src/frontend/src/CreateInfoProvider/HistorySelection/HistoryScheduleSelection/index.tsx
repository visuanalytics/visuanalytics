import React from "react";
import {WeekdaySelector} from "./WeekdaySelector";
import Button from "@material-ui/core/Button";
import { MuiPickersUtilsProvider } from "@material-ui/pickers"
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { KeyboardTimePicker } from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns"
import { de } from "date-fns/locale"
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Collapse from "@material-ui/core/Collapse";
import {Schedule} from "../../index";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useStyles } from "../../style";
import FormControl from "@material-ui/core/FormControl";
import {InputLabel} from "@material-ui/core";

interface HistoryScheduleSelectionProps {
    handleProceed: () => void;
    handleBack: () => void;
    schedule: Schedule;
    selectSchedule: (schedule: Schedule) => void;
};


/**
 * This component holds the second step of step four in the creation of an Infoprovider (Teim selection for historisation)
 * @param props The passed properties from the parent
 */
export const HistoryScheduleSelection: React.FC<HistoryScheduleSelectionProps>  = (props) => {

    const classes = useStyles();

    //holds the currently selected time
    const [currentTimeSelection, setCurrentTimeSelection] = React.useState<MaterialUiPickersDate>(new Date())


    /**
     * Converts a time of type Date to a readable String
     * This String is needed for the schedule object.
     * The String has the format hh:mm
     * @param time The time that should be converted to a String. If the time should be null, an empty String is returned.
     */
    const setScheduleTime = (time: MaterialUiPickersDate) => {
        if(time!=null) {
            const hours = time.getHours()>9?time.getHours().toString():"0" + time.getHours();
            const minutes = time.getMinutes()>9?time.getMinutes().toString():"0" + time.getMinutes();
            return hours + ":" + minutes;
        }
        return "";
    }

    /**
     * This Method adds a weekday to the weekday-Array of the schedule-object.
     * The method is called, whenever the user selects a weekday that is not selected yet.
     * @param dayNumber The numeric representation of a weekday (0 to 6).
     */
    const addDay = (dayNumber: number) => {
        props.selectSchedule({...props.schedule, weekdays: props.schedule.weekdays?.concat([dayNumber])})
    }

    /**
     * This method removes a weekday from the weekday-Array of the schedule-object.
     * The method is called, whenever the user deselects a previously selected weekday.
     * @param dayNumber The numeric representation of a weekday that should be removed from the array. Numbers range from 0 to 6.
     */
    const removeDay = (dayNumber: number) => {
        props.selectSchedule({...props.schedule, weekdays: props.schedule.weekdays?.filter((value, index, arr) => value !== dayNumber)})
    }

    /**
     * Method, which handles the click on a weekday and calls the needed method. The called method is either addWeekday or removeWeekday
     * @param dayNumber The numeric representation of a weekday for which the coresponding method should be called. The range of the value is 0 to 6.
     */
    const toggleSelectedDay = (dayNumber: number) => {
        if(props.schedule.weekdays?.includes(dayNumber)) removeDay(dayNumber);
        else addDay(dayNumber);
    }

    /**
     * Method that switches the type-entry of the schedule object to weekly.
     * The method is called, when the user selects the coresponding radio button.
     */
    const changeToWeekly = () => {
        props.selectSchedule({...props.schedule, type: "weekly"});
    }

    /**
     * Method, that switches the type of the schedule object to daily.
     * It is called, when the user selects the coresponding radio button.
     */
    const changeToDaily = () => {
        props.selectSchedule({...props.schedule, type: "daily"});
    }

    /**
     * Method that switches the state of the schedule object to interval.
     * It is called, when a user selects the coresponding radio button.
     */
    const changeToInterval = () => {
        props.selectSchedule({...props.schedule, type: "interval"});
    }

    /**
     * Sets the selected interval from a user for the schedule object.
     * @param event
     */
    const setInterval = (event: React.ChangeEvent<{value: unknown}>) => {
        props.selectSchedule({...props.schedule, interval: event.target.value as string})
    }

    /**
     * Finishes the schedule object by setting the time selection of a user and then proceeds to the next step.
     */
    const handleProceed = () => {
        props.selectSchedule({...props.schedule, time: setScheduleTime(currentTimeSelection)});
        props.handleProceed();
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <FormControlLabel value="weekly" control={
                    <Radio
                        checked={props.schedule.type === "weekly"}
                        value="weekly"
                        onChange={changeToWeekly}
                    />
                } label={"Wochentag"}
                />
                <Collapse in={props.schedule.type === "weekly"}>
                    <Grid item xs={12}>
                        <WeekdaySelector
                            days={props.schedule.weekdays}
                            toggleSelectedDay={toggleSelectedDay}
                        />
                    </Grid>
                </Collapse>
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel value="daily" control={
                    <Radio checked={props.schedule.type === "daily"}
                           value="daily"
                           onChange={changeToDaily}
                    />
                } label="Täglich"
                />
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel value="interval" control={
                    <Radio
                        checked={props.schedule.type === "interval"}
                        value="interval"
                        onChange={changeToInterval}
                    />
                } label="Intervall"
                />
                <Collapse in={props.schedule.type === "interval"}>
                    <Grid item xs={12} className={classes.elementSmallMargin}>
                        <FormControl>
                            <InputLabel id="demo-simple-select-label">Intervallwahl</InputLabel>
                            <Select value={props.schedule.interval === "" ? "halfday" : props.schedule.interval} onChange={setInterval}>
                                <MenuItem value={"minute"}>Jede Minute</MenuItem>
                                <MenuItem value={"quarter"}>Alle 15 Minuten</MenuItem>
                                <MenuItem value={"half"}>Alle 30 Minuten</MenuItem>
                                <MenuItem value={"threequarter"}>Alle 45 Minuten</MenuItem>
                                <MenuItem value={"hour"}>Alle 60 Minuten</MenuItem>
                                <MenuItem value={"quartday"}>Alle 6 Stunden</MenuItem>
                                <MenuItem value={"halfday"}>Alle 12 Stunden</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Collapse>
            </Grid>
            <Grid item xs={12} className={classes.elementSmallMargin}>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={de}>
                    <KeyboardTimePicker
                        ampm={false}
                        placeholder="00:00"
                        mask="__:__"
                        value={props.schedule.type === "interval" ? new Date() : currentTimeSelection}
                        onChange={setCurrentTimeSelection}
                        invalidDateMessage={'Falsches Datumsformat'}
                        cancelLabel={'Abbrechen'}
                        disabled={props.schedule.type === "interval"}
                    />
                </MuiPickersUtilsProvider>
            </Grid>
            <Collapse in={props.schedule.type === "interval"}>
                <Grid item xs={12} className={classes.elementSmallMargin}>
                    <Typography variant="body2">
                        Bei der Historisierung in Intervallen wird automatisch die aktuellste Zeit gewählt.
                    </Typography>
                </Grid>
            </Collapse>
            <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                <Grid item>
                    <Button variant="contained" size="large" color="primary" onClick={props.handleBack}>
                        zurück
                    </Button>
                </Grid>
                <Grid item className={classes.blockableButtonPrimary}>
                    <Button variant="contained" size="large" color="primary" onClick={handleProceed} disabled={(props.schedule.type === "weekly" && props.schedule.weekdays.length === 0) || (currentTimeSelection === null || isNaN(currentTimeSelection.getHours()) || isNaN(currentTimeSelection.getMinutes()))}>
                        weiter
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
};
