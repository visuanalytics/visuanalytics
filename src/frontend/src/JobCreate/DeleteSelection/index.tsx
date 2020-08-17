import React from "react";
import {useStyles} from "../style";
import {Collapse, Divider, Fade, FormControlLabel, Radio, TextField} from "@material-ui/core";
import {DayHour, DeleteSchedule} from "../../util/deleteSchedule";
import {DayHourInputField} from "../../util/DayHourInputField";

interface DeleteSelectionProps {
    deleteSchedule: DeleteSchedule,
    selectDeleteScheduleHandler: (deleteSchedule: DeleteSchedule) => void;
}

export const DeleteSelection: React.FC<DeleteSelectionProps> = ({deleteSchedule, selectDeleteScheduleHandler}) => {
    const classes = useStyles();

    const handleSelectNoDeletion = () => {
        selectDeleteScheduleHandler({type: "noDeletion"})
    }

    const handleSelectOnDayHour = () => {
        selectDeleteScheduleHandler({type: "onDayHour", removalTime: {days: 0, hours: 0}})
    }

    const handleSelectKeepCount = () => {
        selectDeleteScheduleHandler({type: "keepCount", keepCount: 1})
    }

    const handleSelectFixNames = () => {
        selectDeleteScheduleHandler({type: "fixNames", count: 1})
    }

    const handleAddRemovalTime = (removalTime: DayHour) => {
        if (deleteSchedule.type === "onDayHour") {
            selectDeleteScheduleHandler({...deleteSchedule, removalTime: removalTime})
        }
    }

    const handleAddKeepCount = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (deleteSchedule.type === "keepCount" && event.target.value.trim() !== "") {
            selectDeleteScheduleHandler({...deleteSchedule, keepCount: Math.floor(Number(event.target.value))})
        }
    }

    const handleAddFixNames = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (deleteSchedule.type === "fixNames" && event.target.value.trim() !== "") {
            selectDeleteScheduleHandler({...deleteSchedule, count: Math.floor(Number(event.target.value))})
        }
    }

    const handleFocus = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        event.target.select();
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
                        />} label="nie"/>
                    </div>
                </div>
                <Divider/>
                <div className={classes.MPaddingTB}>
                    <div className={classes.centerDiv}>
                        <FormControlLabel value="onDayHour" control={<Radio
                            checked={deleteSchedule.type === "onDayHour"}
                            onChange={handleSelectOnDayHour}
                            value="onDayHour"
                        />} label="nach Zeit"/>
                    </div>
                    <Collapse in={deleteSchedule.type === "onDayHour"}>
                        <DayHourInputField
                            dayHour={deleteSchedule.type === "onDayHour" ? deleteSchedule.removalTime : undefined}
                            selectDayHourHandler={handleAddRemovalTime}
                        />
                    </Collapse>
                </div>
                <Divider/>
                <div className={classes.MPaddingTB}>
                    <div className={classes.centerDiv}>
                        <FormControlLabel value="keepCount" control={<Radio
                            checked={deleteSchedule.type === "keepCount"}
                            onChange={handleSelectKeepCount}
                            value="keepCount"
                        />} label="nach Anzahl"/>
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
                                onFocus={handleFocus}
                                value={deleteSchedule.type === "keepCount" ? deleteSchedule.keepCount : ""}
                                onChange={handleAddKeepCount}
                                InputProps={{
                                    classes: {input: classes.inputElement},
                                }}
                            />
                        </div>
                    </Collapse>
                </div>
                <Divider/>
                <div className={classes.MPaddingTB}>
                    <div className={classes.centerDiv}>
                        <FormControlLabel value="fixNames" control={<Radio
                            checked={deleteSchedule.type === "fixNames"}
                            onChange={handleSelectFixNames}
                            value="fixNames"
                        />} label="feste Namen"/>
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
                                onFocus={handleFocus}
                                value={deleteSchedule.type === "fixNames" ? deleteSchedule.count : ""}
                                onChange={handleAddFixNames}
                                InputProps={{
                                    classes: {input: classes.inputElement},
                                }}
                            />
                        </div>
                    </Collapse>
                </div>
            </div>
        </Fade>
    )
}
