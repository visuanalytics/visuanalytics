import React from "react"
import { MuiPickersUtilsProvider, DatePicker, TimePicker } from "@material-ui/pickers"
import DateFnsUtils from "@date-io/date-fns"
import { de } from "date-fns/locale"

interface DateInputProps {
    date: Date | null;
    handler: ((date: Date | null) => void);
}

export const DateInputField: React.FC<DateInputProps> = (props: DateInputProps) => {
    return (
        <div>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={de}>
                <DatePicker
                    inputVariant="outlined"
                    disablePast
                    disableToolbar
                    variant="inline"
                    format="dd.MM.yyy"
                    margin="normal"
                    label="Datum auswählen"
                    value={props.date}
                    onChange={props.handler}
                />
            </MuiPickersUtilsProvider>
        </div>
    )
}

export const TimeInputField: React.FC<DateInputProps> = (props: DateInputProps) => {
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={de}>
            <TimePicker
                inputVariant="outlined"
                variant="inline"
                ampm={false}
                margin="normal"
                label="Uhrzeit auswählen"
                value={props.date}
                onChange={props.handler}
            />
        </MuiPickersUtilsProvider>
    )
}