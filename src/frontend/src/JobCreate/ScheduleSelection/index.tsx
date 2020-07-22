import React from "react";
import { useStyles } from "../style";
import { Divider, FormControlLabel, Radio, Fade, Collapse } from "@material-ui/core";
import { WeekdayCheckboxes } from "./WeekdayCheckboxes";
import { DateInputField, TimeInputField } from "./DateTimeInput"
import { Schedule, Weekday } from "../../util/schedule";


interface ScheduleSelectionProps {
    schedule: Schedule,
    selectDailyHandler: () => void;
    selectWeeklyHandler: () => void;
    selectOnDateHandler: () => void;
    addWeekDayHandler: (day: Weekday) => void;
    removeWeekDayHandler: (day: Weekday) => void;
    selectDateHandler: (date: Date) => void;
    selectTimeHandler: (date: Date) => void;
}

export const ScheduleSelection: React.FC<ScheduleSelectionProps> = (props) => {
    const schedule = props.schedule;
    const classes = useStyles();

    const handleDateChange = (date: Date | null) => {
        if (date !== null) {
            props.selectDateHandler(date);
        }
    }

    const handleTimeChange = (date: Date | null) => {
        if (date !== null) {
            props.selectTimeHandler(date);
        }
    }

    return (
        <Fade in={true}>
            <div>
                <div className={classes.paddingSmall}>
                    <div className={classes.centerDiv}>
                        <FormControlLabel value="daily" control={<Radio
                            checked={schedule.type === "daily"}
                            onChange={props.selectDailyHandler}
                            value="daily"
                        />} label="täglich" />
                    </div>
                </div>
                <Divider />
                <div className={classes.paddingSmall}>
                    <div className={classes.centerDiv}>
                        <FormControlLabel value="weekly" control={<Radio
                            checked={schedule.type === "weekly"}
                            onChange={props.selectWeeklyHandler}
                            value="weekly"
                        />} label="wöchentlich" />
                    </div>
                    <Collapse in={schedule.type === "weekly"}>
                        <div>
                            <WeekdayCheckboxes
                                schedule={schedule}
                                addWeekDayHandler={props.addWeekDayHandler}
                                removeWeekDayHandler={props.removeWeekDayHandler}
                            />
                        </div>
                    </Collapse>
                </div>
                <Divider />
                <div className={classes.paddingSmall} >
                    <div className={classes.centerDiv}>
                        <FormControlLabel value="onDate" control={<Radio
                            checked={schedule.type === "onDate"}
                            onChange={props.selectOnDateHandler}
                            value="onDate"
                        />} label="an festem Datum" />
                    </div>
                    <Collapse in={schedule.type === "onDate"}>
                        <DateInputField date={schedule.type === "onDate" ? schedule.date : null} handler={handleDateChange} />
                    </Collapse>
                </div>
                <Divider />
                <div className={classes.paddingSmall} >
                    <TimeInputField date={schedule.time} handler={handleTimeChange} />
                </div>
            </div >
        </Fade>
    );
}