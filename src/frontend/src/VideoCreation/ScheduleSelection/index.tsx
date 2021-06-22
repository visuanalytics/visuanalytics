import React from "react";
import Button from "@material-ui/core/Button";
import {MuiPickersUtilsProvider} from "@material-ui/pickers"
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import {KeyboardTimePicker} from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns"
import {de} from "date-fns/locale"
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {InputLabel} from "@material-ui/core";
import {Schedule} from "../../CreateInfoProvider/types";
import {useStyles} from "../style";
import {WeekdaySelector} from "../../CreateInfoProvider/HistorySelection/HistoryScheduleSelection/WeekdaySelector";

interface ScheduleSelectionProps {
    continueHandler: () => void;
    backHandler: () => void;
    schedule: Schedule;
    setSchedule: (schedule: Schedule) => void;
}


/**
 * Component for selecting the schedule a videojob should be displayed with.
 */
export const ScheduleSelection: React.FC<ScheduleSelectionProps> = (props) => {

    const classes = useStyles();

    //holds the currently selected time
    const [currentTimeSelection, setCurrentTimeSelection] = React.useState<MaterialUiPickersDate>(new Date())

    /**
     * Whenever the user enters a new time in the text field, the current time selection will be updated.
     * If the time is not null, the schedule object will be refreshed too, with the new time.
     * @param time The time, the user entered
     */
    const refreshCurrentTimeSelection = (time: MaterialUiPickersDate) => {
        setCurrentTimeSelection(time);
        if (time !== null) props.setSchedule({...props.schedule, time: setScheduleTime(time)});
    }

    /**
     * Converts a time of type Date to a readable String
     * This String is needed for the schedule object.
     * The String has the format hh:mm
     * @param time The time that should be converted to a String. If the time should be null, an empty String is returned.
     */
    const setScheduleTime = (time: MaterialUiPickersDate) => {
        if (time != null) {
            const hours = time.getHours() > 9 ? time.getHours().toString() : "0" + time.getHours();
            const minutes = time.getMinutes() > 9 ? time.getMinutes().toString() : "0" + time.getMinutes();
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
        props.setSchedule({...props.schedule, weekdays: props.schedule.weekdays?.concat([dayNumber])})
    }

    /**
     * This method removes a weekday from the weekday-Array of the schedule-object.
     * The method is called, whenever the user deselects a previously selected weekday.
     * @param dayNumber The numeric representation of a weekday that should be removed from the array. Numbers range from 0 to 6.
     */
    const removeDay = (dayNumber: number) => {
        props.setSchedule({
            ...props.schedule,
            weekdays: props.schedule.weekdays?.filter((value, index, arr) => value !== dayNumber)
        })
    }

    /**
     * Method, which handles the click on a weekday and calls the needed method. The called method is either addWeekday or removeWeekday
     * @param dayNumber The numeric representation of a weekday for which the corresponding method should be called. The range of the value is 0 to 6.
     */
    const toggleSelectedDay = (dayNumber: number) => {
        if (props.schedule.weekdays?.includes(dayNumber)) removeDay(dayNumber);
        else addDay(dayNumber);
    }

    /**
     * Method that switches the type-entry of the schedule object to weekly.
     * The method is called, when the user selects the corresponding radio button.
     */
    const changeToWeekly = () => {
        props.setSchedule({...props.schedule, type: "weekly", time: setScheduleTime(currentTimeSelection)});
    }

    /**
     * Method, that switches the type of the schedule object to daily.
     * It is called, when the user selects the corresponding radio button.
     */
    const changeToDaily = () => {
        props.setSchedule({...props.schedule, type: "daily", time: setScheduleTime(currentTimeSelection)});
    }

    /**
     * Method, that switches the type of the schedule object to single.
     * It is called, when the user selects the corresponding radio button.
     */
    const changeToSingle = () => {
        props.setSchedule({...props.schedule, type: "single", time: setScheduleTime(currentTimeSelection)});
    }

    /**
     * Method that switches the state of the schedule object to interval.
     * It is called, when a user selects the corresponding radio button.
     */
    const changeToInterval = () => {
        props.setSchedule({
            ...props.schedule,
            type: "interval",
            interval: props.schedule.interval === "" ? "minute" : props.schedule.interval,
            time: setScheduleTime(new Date())
        });
        setCurrentTimeSelection(new Date());
    }

    /**
     * Sets the selected interval from a user for the schedule object.
     * @param event
     */
    const setInterval = (event: React.ChangeEvent<{ value: unknown }>) => {
        props.setSchedule({...props.schedule, interval: event.target.value as string})
    }



    return (
        <Grid container>
            <Grid item xs={12}>
                <FormControlLabel value="single" control={
                    <Radio checked={props.schedule.type === "single"}
                           value="single"
                           onChange={changeToSingle}
                    />
                } label="Einmalig (sofort)"
                />
            </Grid>
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
                            <Select value={props.schedule.interval === "" ? "halfday" : props.schedule.interval}
                                    onChange={setInterval}>
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
                        value={currentTimeSelection}
                        onChange={refreshCurrentTimeSelection}
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
                    <Button variant="contained" size="large" color="primary" onClick={props.backHandler}>
                        zurück
                    </Button>
                </Grid>
                <Grid item className={classes.blockableButtonSecondary}>
                    <Button variant="contained" size="large" color="secondary" onClick={props.continueHandler}
                            disabled={(props.schedule.type === "weekly" && props.schedule.weekdays.length === 0) || (currentTimeSelection === null || isNaN(currentTimeSelection.getHours()) || isNaN(currentTimeSelection.getMinutes())) || props.schedule.type === ""}>
                         abschließen
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
};
