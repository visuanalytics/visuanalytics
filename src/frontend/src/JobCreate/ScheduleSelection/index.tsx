import React from "react";
import { useStyles } from "../style";
import { Divider, Checkbox, FormControlLabel, FormControl, FormLabel, FormGroup, FormHelperText } from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider, KeyboardTimePicker } from "@material-ui/pickers";
import { ContinueButton } from "../ContinueButton";
import DateFnsUtils from '@date-io/date-fns';
import { de } from "date-fns/locale";

export const ScheduleSelection: React.FC = () => {
    const classes = useStyles();
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(
        new Date(),
    );
    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    }
    return (
        <div className={classes.jobCreateBox}>
            <div>
                <h3 className={classes.jobCreateHeader}>Zeitplan festlegen</h3>
                <p>Wann sollen neue Videos generiert werden?</p>
            </div>
            <Divider />
            <div className={classes.centerBox}>
                <FormControl component="fieldset">
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox name="gilad" />}
                            label="täglich" />
                    </FormGroup>
                </FormControl>
            </div>
            <Divider />
            <div className={classes.centerBox}>
                <FormControl component="fieldset" disabled>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox name="gilad" />}
                            label="montags"
                        />
                        <FormControlLabel
                            control={<Checkbox name="jason" />}
                            label="dienstags"
                        />
                        <FormControlLabel
                            control={<Checkbox name="antoine" />}
                            label="mittwochs"
                        />
                        <FormControlLabel
                            control={<Checkbox name="gilad" />}
                            label="donnerstags"
                        />
                        <FormControlLabel
                            control={<Checkbox name="jason" />}
                            label="freitags"
                        />
                        <FormControlLabel
                            control={<Checkbox name="antoine" />}
                            label="samstags"
                        />
                        <FormControlLabel
                            control={<Checkbox name="antoine" />}
                            label="sonntags"
                        />
                    </FormGroup>
                </FormControl>
            </div>
            <Divider />
            <div className={classes.paddingSmall} >
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={de}>
                    <KeyboardDatePicker
                        inputVariant="outlined"
                        disablePast
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        label="Datum festlegen"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </MuiPickersUtilsProvider>
            </div>
            <Divider />
            <div className={classes.paddingSmall} >
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={de}>
                    <KeyboardTimePicker
                        inputVariant="outlined"
                        ampm={false}
                        margin="normal"
                        label="Uhrzeit festlegen"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change time',
                        }}
                    />
                </MuiPickersUtilsProvider>
            </div>
            <Divider />
            <div className={classes.paddingSmall}>
                <ContinueButton>
                    WEITER
                </ContinueButton>
            </div>
        </div >
    );
}