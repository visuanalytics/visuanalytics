import React from "react";
import {useStyles} from "../style";
import {Collapse, Divider, Fade, FormControlLabel, Radio, TextField} from "@material-ui/core";
import {DayHour, DeleteSchedule} from "../../util/deleteSchedule";
import {DayHourInputField} from "../../util/DayHourInputField";

interface DeleteSelectionProps {
    deleteSchedule: DeleteSchedule,
    selectDeleteScheduleHandler: (deleteSchedule: DeleteSchedule) => void;
}

export const DeleteSelection: React.FC<DeleteSelectionProps> = ({ deleteSchedule, selectDeleteScheduleHandler }) => {
    const classes = useStyles();

    const [dayHour, setDayHour] = React.useState({days: 0, hours: 0});

    const handleSelectNoDeletion = () => {
        selectDeleteScheduleHandler({type: "noDeletion"})
    }

    const handleSelectOnDayHour = () => {
        selectDeleteScheduleHandler({type: "onDayHour", removalTime: dayHour })
    }

    const handleSelectKeepCount = () => {
        selectDeleteScheduleHandler({type: "keepCount", keepCount: 1})
    }

    const handleSelectFixNames = () => {
        selectDeleteScheduleHandler({type: "fixNames", count: 1})
    }

    const handleAddRemovalTime = (removalTime: DayHour) => {
        setDayHour(removalTime);
        if (deleteSchedule.type === "onDayHour") {
            selectDeleteScheduleHandler({...deleteSchedule, removalTime: dayHour})
        }
    }

    const handleAddKeepCount = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (deleteSchedule.type === "keepCount") {
            selectDeleteScheduleHandler({...deleteSchedule, keepCount: Number(event.target.value)})
        }
    }

    const handleAddFixNames = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (deleteSchedule.type === "fixNames") {
            selectDeleteScheduleHandler({...deleteSchedule, count: Number(event.target.value)})
        }
    }

    return (
        <Fade in={true}>
            <div>
                <div className={classes.MPaddingTB}>
                    <div className={classes.centerDiv}>
                        <FormControlLabel value="noDeletion" control={<Radio
                            checked={deleteSchedule.type === "noDeletion"}
                            onChange={handleSelectNoDeletion}
                            value="noDeletion"
                        />} label="nie" />
                    </div>
                </div>
                <Divider />
                <div className={classes.MPaddingTB}>
                    <div className={classes.centerDiv}>
                        <FormControlLabel value="onDayHour" control={<Radio
                            checked={deleteSchedule.type === "onDayHour"}
                            onChange={handleSelectOnDayHour}
                            value="onDayHour"
                        />} label="nach Zeit" />
                    </div>
                    <Collapse in={deleteSchedule.type === "onDayHour"}>
                        <DayHourInputField
                            dayHour={dayHour}
                            selectDayHourHandler={handleAddRemovalTime}
                        />
                    </Collapse>
                </div>
                <Divider />
                <div className={classes.MPaddingTB} >
                    <div className={classes.centerDiv}>
                        <FormControlLabel value="keepCount" control={<Radio
                            checked={deleteSchedule.type === "keepCount"}
                            onChange={handleSelectKeepCount}
                            value="keepCount"
                        />} label="nach Anzahl" />
                    </div>
                    <Collapse in={deleteSchedule.type === "keepCount"}>
                        <div className={classes.MPaddingTB}>
                            <TextField
                                label="Anzahl"
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                onChange={handleAddKeepCount}
                                InputProps={{
                                    classes: { input: classes.inputElement },
                                    inputProps: { min: 0}
                                }}
                            />
                        </div>
                    </Collapse>
                </div>
                <Divider />
                <div className={classes.MPaddingTB} >
                    <div className={classes.centerDiv}>
                        <FormControlLabel value="fixNames" control={<Radio
                            checked={deleteSchedule.type === "fixNames"}
                            onChange={handleSelectFixNames}
                            value="fixNames"
                        />} label="feste Namen" />
                    </div>
                    <Collapse in={deleteSchedule.type === "fixNames"}>
                        <div className={classes.MPaddingTB}>
                        <TextField
                            label="Anzahl"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            onChange={handleAddFixNames}
                            InputProps={{
                                classes: { input: classes.inputElement },
                                inputProps: { min: 0}
                            }}
                        />
                        </div>
                    </Collapse>
                </div>
            </div>
        </Fade>
    )
}
