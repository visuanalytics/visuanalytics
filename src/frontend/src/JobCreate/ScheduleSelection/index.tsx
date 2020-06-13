import React from "react";
import { useStyles } from "../style";
import { Divider, FormControlLabel, Radio } from "@material-ui/core";
import { WeekdayCheckboxes } from "./WeekdayCheckboxes";
import { DateInputField, TimeInputField } from "./DateTimeInput"
import { Schedule, Weekday } from "..";
import { datePickerDefaultProps } from "@material-ui/pickers/constants/prop-types";

interface ScheduleSelectionProps {
    schedule: Schedule,
    selectDailyHandler: () => void;
    selectWeeklyHandler: () => void;
    selectOnDateHandler: () => void;
    addWeekDayHandler: (_: Weekday) => void;
    removeWeekDayHandler: (_: Weekday) => void;
    selectDateHandler: (_: Date | null) => void;
    selectTimeHandler: (_: Date | null) => void;
}

export const ScheduleSelection: React.FC<ScheduleSelectionProps> = (props) => {
    const classes = useStyles();

    return (
        <div>
            <div className={classes.paddingSmall}>
                <FormControlLabel value="daily" control={<Radio
                    checked={props.schedule.daily}
                    onChange={props.selectDailyHandler}
                    value="daily"
                />} label="täglich" />
            </div>
            <Divider />
            <div className={classes.paddingSmall}>
                <FormControlLabel value="weekly" control={<Radio
                    checked={props.schedule.weekly}
                    onChange={props.selectWeeklyHandler}
                    value="weekly"
                />} label="wöchentlich" />
                {props.schedule.weekly &&
                    <WeekdayCheckboxes
                        schedule={props.schedule}
                        addWeekDayHandler={props.addWeekDayHandler}
                        removeWeekDayHandler={props.removeWeekDayHandler}
                    />
                }
            </div>
            <Divider />
            <div className={classes.paddingSmall} >
                <FormControlLabel value="onDate" control={<Radio
                    checked={props.schedule.onDate}
                    onChange={props.selectOnDateHandler}
                    value="onDate"
                />} label="Datum auswählen" />
                {props.schedule.onDate &&
                    <DateInputField date={props.schedule.date} handler={props.selectDateHandler} />
                }
            </div>
            <Divider />
            <div className={classes.paddingSmall} >
                <TimeInputField date={props.schedule.time} handler={props.selectTimeHandler} />
            </div>
        </div >
    );
}