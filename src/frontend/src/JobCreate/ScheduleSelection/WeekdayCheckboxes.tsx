import React, { ChangeEvent } from "react"
import { FormControl, FormGroup, FormControlLabel, Checkbox } from "@material-ui/core"
import { Schedule, Weekday } from ".."

interface WeekdayCheckboxProps {
    schedule: Schedule;
    addWeekDayHandler: (_: Weekday) => void;
    removeWeekDayHandler: (_: Weekday) => void;
}

export const WeekdayCheckboxes: React.FC<WeekdayCheckboxProps> = (props) => {
    const weekdays = [
        Weekday.MONDAY,
        Weekday.TUESDAY,
        Weekday.WEDNESDAY,
        Weekday.THURSDAY,
        Weekday.FRIDAY,
        Weekday.SATURDAY,
        Weekday.SUNDAY
    ];

    const getLabel = (day: Weekday) => {
        switch (day) {
            case Weekday.MONDAY: return "Mo";
            case Weekday.TUESDAY: return "Di";
            case Weekday.WEDNESDAY: return "Mi"
            case Weekday.THURSDAY: return "Do";
            case Weekday.FRIDAY: return "Fr";
            case Weekday.SATURDAY: return "Sa";
            case Weekday.SUNDAY: return "So"
        }
    }

    const renderCheckBox = (day: Weekday) => {
        return (
            <FormControlLabel
                key={day}
                control={
                    <Checkbox
                        checked={props.schedule.weekdays.includes(day)}
                        value={day}
                        onChange={handleChange} />}
                label={getLabel(day)}
                labelPlacement="top"
            />
        )
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        const day = parseInt(event.target.value);
        checked ? props.addWeekDayHandler(day) : props.removeWeekDayHandler(day);
    }

    return (
        <div>
            <FormControl component="fieldset" >
                <FormGroup row>
                    {weekdays.map(renderCheckBox)}
                </FormGroup>
            </FormControl>
        </div>
    )
}