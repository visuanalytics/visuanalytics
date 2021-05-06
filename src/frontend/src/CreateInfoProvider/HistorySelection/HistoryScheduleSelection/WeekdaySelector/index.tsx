import React from "react";
import { Weekday, getWeekdayLabel } from "../../../../util/schedule";
import Button from "@material-ui/core/Button";
import { useStyles } from "../../../style";


interface WeekdaySelectorProps {
    days?: number[];
    toggleSelectedDay: (dayNumber: number) => void;
}

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
            <Button key={getDayIndex(weekday)} variant="contained" size="small" onClick={() => props.toggleSelectedDay(weekday)} color={props.days?.includes(weekday) ? "primary" : "secondary"}>
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
