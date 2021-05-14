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

interface HistoryScheduleSelectionProps {
    handleProceed: () => void;
    handleBack: () => void;
    schedule: Schedule;
    selectSchedule: (schedule: Schedule) => void;
};

/**
 * Component displaying the second step in the creation of a new Info-Provider.
 * The state of this component handles the input made to its children.
 */
export const HistoryScheduleSelection: React.FC<HistoryScheduleSelectionProps>  = (props) => {

    //holds the currently selected time
    const [currentTimeSelection, setCurrentTimeSelection] = React.useState<MaterialUiPickersDate>(new Date())

    React.useEffect(() => {
        setScheduleTime(currentTimeSelection)
    }, [currentTimeSelection])

    /**
     * Adds a new time to the array containing select times, if not already contained.
     * @param time The time to be added to the array.
     * The Date will be converted to a string in the format 'hh:mm'.
     */
    const setScheduleTime = async (time: MaterialUiPickersDate) => {
        if(time!=null) {
            const hours = time.getHours()>9?time.getHours().toString():"0" + time.getHours();
            const minutes = time.getMinutes()>9?time.getMinutes().toString():"0" + time.getMinutes();
            console.log(hours);
            props.selectSchedule({...props.schedule, time: hours + ":" + minutes});
        }
    }

    /**
     * Method that toggles the boolean values for selected weekdays, should be called whenever the user selects or unselects.
     * @param dayNumber Numeric representation of the weekday that should be toggled on/off.
     */
    const addDay = (dayNumber: number) => {
        props.selectSchedule({...props.schedule, weekdays: props.schedule.weekdays?.concat([dayNumber])})
    }

    const removeDay = (dayNumber: number) => {
        props.selectSchedule({...props.schedule, weekdays: props.schedule.weekdays?.filter((value, index, arr) => value !== dayNumber)})
    }

    const toggleSelectedDay = (dayNumber: number) => {
        if(props.schedule.weekdays?.includes(dayNumber)) removeDay(dayNumber);
        else addDay(dayNumber);
    }

    const changeToWeekly = () => {
        props.selectSchedule({...props.schedule, type: "weekly"});
    }

    const changeToDaily = () => {
        props.selectSchedule({...props.schedule, type: "daily"});
    }

    const changeToInterval = () => {
        props.selectSchedule({...props.schedule, type: "interval"});
    }

    const setInterval = (event: React.ChangeEvent<{value: unknown}>) => {
        props.selectSchedule({...props.schedule, interval: event.target.value as string})
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
                    <FormControlLabel control={
                        <Select value={props.schedule.interval === "" ? "halfday" : props.schedule.interval} onChange={setInterval}>
                            <MenuItem value={"minute"}>Jede Minute</MenuItem>
                            <MenuItem value={"quarter"}>Alle 15 Minuten</MenuItem>
                            <MenuItem value={"half"}>Alle 30 Minuten</MenuItem>
                            <MenuItem value={"threequarter"}>Alle 45 Minuten</MenuItem>
                            <MenuItem value={"hour"}>Alle 60 Minuten</MenuItem>
                            <MenuItem value={"quartday"}>Alle 6 Stunden</MenuItem>
                            <MenuItem value={"halfday"}>Alle 12 Stunden</MenuItem>
                        </Select>
                    } label={"Intervallwahl"}
                    />
                </Collapse>
            </Grid>
            <Grid item xs={12}>
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
                <Grid item xs={12}>
                    <Typography variant="body2">
                        Bei der Historisierung in Intervallen wird automatisch die aktuellste Zeit gewählt.
                    </Typography>
                </Grid>
            </Collapse>
            <Grid item container xs={12} justify="space-between">
                <Grid item>
                    <Button variant="contained" size="large" color="primary" onClick={props.handleBack}>
                        zurück
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" size="large" color="primary" onClick={props.handleProceed}>
                        weiter
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
};
