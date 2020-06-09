import React from "react";
import { useStyles } from "../style";
import { Divider, FormControlLabel, Radio } from "@material-ui/core";
import { ContinueButton } from "../ContinueButton";
import { GreyDivider } from "../GreyDivider";
import { WeekdayCheckboxes } from "./WeekdayCheckboxes";
import { DateInputField, TimeInputField } from "./DateTimeInput"

export const ScheduleSelection: React.FC = () => {
    const classes = useStyles();

    const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());
    const [selectedSchedule, setSelectedSchedule] = React.useState("daily");

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    }
    const handleScheduleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedSchedule(event.target.value);
    };

    return (
        <div className={classes.jobCreateBox}>
            <div>
                <h3 className={classes.jobCreateHeader}>Zeitplan festlegen</h3>
                <p>Wann sollen neue Videos generiert werden?</p>
            </div>
            <GreyDivider />
            <div className={classes.paddingSmall}>
                <FormControlLabel value="daily" control={<Radio
                    checked={selectedSchedule === "daily"}
                    onChange={handleScheduleChange}
                    value="daily"
                />} label="täglich" />
            </div>
            <Divider />
            <div className={classes.paddingSmall}>
                <FormControlLabel value="weekly" control={<Radio
                    checked={selectedSchedule === "weekly"}
                    onChange={handleScheduleChange}
                    value="weekly"
                />} label="wöchentlich" />
                {selectedSchedule === "weekly" &&
                    <WeekdayCheckboxes />
                }
            </div>
            <Divider />
            <div className={classes.paddingSmall} >
                <FormControlLabel value="onDate" control={<Radio
                    checked={selectedSchedule === "onDate"}
                    onChange={handleScheduleChange}
                    value="onDate"
                />} label="Datum auswählen" />
                {selectedSchedule === "onDate" &&
                    <DateInputField date={selectedDate} handler={handleDateChange} />
                }
            </div>
            <Divider />
            <div className={classes.paddingSmall} >
                <TimeInputField date={selectedDate} handler={handleDateChange} />
            </div>
            <GreyDivider />
            <div className={classes.paddingSmall}>
                <ContinueButton>
                    WEITER
                </ContinueButton>
            </div>
        </div >
    );
}