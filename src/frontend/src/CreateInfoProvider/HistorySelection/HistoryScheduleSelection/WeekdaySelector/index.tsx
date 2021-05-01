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
import { ComponentContext } from "../../../../ComponentProvider";
/*import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { ExpandMore } from "@material-ui/icons";
import { PageTemplate } from "../../PageTemplate";*/
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from "@material-ui/core/CircularProgress";
import Input from '@material-ui/core/Input';
import { Weekday, getWeekdayLabel } from "../../../../util/schedule";


interface WeekdaySelectorProps {
    days: boolean[];
    changeDay: (dayNumber: number) => void
};

/**
 * Component displaying the second step in the creation of a new Info-Provider.
 * The state of this component handles the input made to its children.
 */
export const WeekdaySelector: React.FC<WeekdaySelectorProps>  = (props) => {


    /**
     * Helper method that returns the ordinal/index of a provided weekday.
     * @param weekday That weekday whose ordinal should be returned.
     */
    const getDayIndex = (weekday: Weekday) => {
        switch(weekday) {
            case Weekday.MONDAY:
                return 0;
            case Weekday.TUESDAY:
                return 1;
            case Weekday.WEDNESDAY:
                return 2
            case Weekday.THURSDAY:
                return 3;
            case Weekday.FRIDAY:
                return 4;
            case Weekday.SATURDAY:
                return 5;
            case Weekday.SUNDAY:
                return 6;
        }
    }

    //array containing constants for all weekdays
    const weekdays = [
        Weekday.MONDAY,
        Weekday.TUESDAY,
        Weekday.WEDNESDAY,
        Weekday.THURSDAY,
        Weekday.FRIDAY,
        Weekday.SATURDAY,
        Weekday.SUNDAY
    ]

    //TODO: highlight button with class based on {props.days[getDayIndex(weekday)]?"true":"false"
    const renderWeekday = (weekday: Weekday) => {
        return (
            <Button key={getDayIndex(weekday)} variant="contained" size="small" onClick={() => {props.changeDay(weekday)}}>
                {getWeekdayLabel(weekday)}
            </Button>
        )
    }

    //TODO: Create a container that holds all the buttons
    //const components = React.useContext(ComponentContext);
    return (
        <div>
            {weekdays.map(renderWeekday)}
        </div>
    )
};
