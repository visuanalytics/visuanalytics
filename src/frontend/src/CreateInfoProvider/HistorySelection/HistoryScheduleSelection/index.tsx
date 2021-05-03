import React, {ChangeEvent} from "react";
/*import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@material-ui/core";
import { JobList } from "../../JobList";
import { useStyles } from "./style";
import AddCircleIcon from "@material-ui/icons/AddCircle";*/
import { ComponentContext } from "../../../ComponentProvider";
/*import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { ExpandMore } from "@material-ui/icons";
import { PageTemplate } from "../../PageTemplate";*/
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from "@material-ui/core/CircularProgress";
import Input from '@material-ui/core/Input';
import {WeekdaySelector} from "./WeekdaySelector";
import {Web} from "@material-ui/icons";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers"
import DateFnsUtils from "@date-io/date-fns"
import { de } from "date-fns/locale"
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { TimeList } from "./TimeList";
import { KeyboardTimePicker } from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import {useStyles} from "../../style";

interface HistoryScheduleSelectionProps {
    handleProceed: () => void;
    handleBack: () => void;
};

/**
 * Component displaying the second step in the creation of a new Info-Provider.
 * The state of this component handles the input made to its children.
 */
export const HistoryScheduleSelection: React.FC<HistoryScheduleSelectionProps>  = (props) => {
    const classes = useStyles();

    //holds the currently selected time
    const [currentTimeSelection, setCurrentTimeSelection] = React.useState<MaterialUiPickersDate>(new Date())
    //a set that holds all times added by the user, formatted as "hh:mm" strings
    const [times, setTimes] = React.useState(new Set<string>())
    //an array that holds a boolean value for each weekday, true means it has been selected by the user
    const [days, setDays] = React.useState(Array(7).fill(false));

    /**
     * Adds a new time to the set containing select times, if not already contained.
     * @param time The time to be added to the set.
     * The Date will be converted to a string in the format 'hh:mm'.
     */
    const addToTimes = (time: MaterialUiPickersDate) => {
        if(time!=null) {
            const hours = time.getHours()>9?time.getHours().toString():"0" + time.getHours();
            const minutes = time.getMinutes()>9?time.getMinutes().toString():"0" + time.getMinutes();
            setTimes(new Set(times).add(hours + ":" + minutes));
        }
    }

    const removeTimes = (time: string) => {
        //two steps are necessary since delete returns a boolean
        const setCopy = new Set(times);
        setCopy.delete(time);
        setTimes(setCopy);
    }

    /**
     * Method that toggles the boolean values for selected weekdays, should be called whenever the user selects or unselects.
     * @param dayNumber Numeric representation of the weekday that should be toggled on/off.
     */
    const changeDay = (dayNumber: number) => {
        setDays(days.map((selected, index) =>
            index==dayNumber?!selected:selected
        ));
    }


    return (
        <Grid container>
            <Grid item xs={12}>
                <WeekdaySelector
                    days={days}
                    changeDay={changeDay}
                />
            </Grid>
            <Grid item xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={de}>
                    <KeyboardTimePicker
                        ampm={false}
                        placeholder="00:00"
                        mask="__:__"
                        value={currentTimeSelection}
                        onChange={setCurrentTimeSelection}
                        invalidDateMessage={'Falsches Datumsformat'}
                        cancelLabel={'Abbrechen'}
                    />
                </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={12}>
                <Button variant="outlined" onClick={() => addToTimes(currentTimeSelection)}>
                    Zeit hinzufügen
                </Button>
            </Grid>
            <Grid item xs={12}>
                <TimeList
                    times={times}
                    removeHandler={removeTimes}
                />
            </Grid>
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
