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
import { ComponentContext } from "../../ComponentProvider";
/*import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { ExpandMore } from "@material-ui/icons";
import { PageTemplate } from "../../PageTemplate";*/
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {useCallFetch} from "../../Hooks/useCallFetch";
import CircularProgress from "@material-ui/core/CircularProgress";
import Input from '@material-ui/core/Input';
import {WeekdaySelector} from "./WeekdaySelector";
import {Web} from "@material-ui/icons";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers"
import DateFnsUtils from "@date-io/date-fns"
import { de } from "date-fns/locale"
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";


interface HistoryScheduleSelectionProps {

};

/**
 * Component displaying the second step in the creation of a new Info-Provider.
 * The state of this component handles the input made to its children.
 */
export const HistoryScheduleSelection: React.FC<HistoryScheduleSelectionProps>  = (props) => {
    //holds the currently selected time
    const [currentTimeSelection, setCurrentTimeSelection] = React.useState<MaterialUiPickersDate>(new Date())
    //a set that holds all times added by the user
    const [times, setTimes] = React.useState(new Set<MaterialUiPickersDate>())
    //an array that holds a boolean value for each weekday, true means it has been selected by the user
    const [days, setDays] = React.useState(Array(7).fill(false));

    /**
     * Adds a new time to the set containing select times, if not already existant.
     * @param time The time to be added to the set.
     */
    const addToTimes = (time: MaterialUiPickersDate) => {
        setTimes(new Set(times).add(time));
    }

    const removeTimes = (time: MaterialUiPickersDate) => {
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

    //const components = React.useContext(ComponentContext);
    return (
        <div>
            <WeekdaySelector
                days={days}
                changeDay={changeDay}
             />
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={de}>
                <TimePicker
                value = {currentTimeSelection}
                onChange = {setCurrentTimeSelection}
                ampm = {false}
                inputVariant = "standard"
                variant = "inline"
                />
            </MuiPickersUtilsProvider>
            <Button variant="outlined" onClick={() => {addToTimes(currentTimeSelection); alert(times.size);}}>
                Zeit hinzufügen
            </Button>
        </div>
    )
};
