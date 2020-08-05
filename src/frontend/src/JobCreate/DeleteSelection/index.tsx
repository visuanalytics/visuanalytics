import React from "react";
import {useStyles} from "../style";
import {Collapse, Divider, Fade, FormControlLabel, Radio, TextField} from "@material-ui/core";
import {Schedule} from "../../util/schedule";

interface DeleteSelectionProps {
    schedule: Schedule,
    selectScheduleHandler: (schedule: Schedule) => void;
}

export const DeleteSelection: React.FC<DeleteSelectionProps> = ({ schedule, selectScheduleHandler }) => {
    const classes = useStyles();

    const handleSelectNoDelete = () => {
        selectScheduleHandler({ type: "noDelete", time: schedule.time})
    }

    const handleSelectOnTimeDelete = () => {
        selectScheduleHandler({ type: "onTime", removalTime: schedule.time, time: schedule.time})
    }

    const handleSelectOldOnNew = () => {
        selectScheduleHandler({ type: "oldOnNew", time: schedule.time})
    }

    return (
        <Fade in={true}>
            <div>
                <div className={classes.paddingSmall}>
                    <div className={classes.centerDiv}>
                        <FormControlLabel value="nodelete" control={<Radio
                            checked={schedule.type === "noDelete"}
                            onChange={handleSelectNoDelete}
                            value="nodelete"
                        />} label="nicht löschen" />
                    </div>
                </div>
                <Divider />
                <div className={classes.paddingSmall}>
                    <div className={classes.centerDiv}>
                        <FormControlLabel value="deleteOld" control={<Radio
                            checked={schedule.type === "oldOnNew"}
                            onChange={handleSelectOldOnNew}
                            value="deleteOld"
                        />} label="Video bei Neugenerierung löschen" />
                    </div>
                </div>
                <Divider />
                <div className={classes.paddingSmall} >
                    <div className={classes.centerDiv}>
                        <FormControlLabel value="ontime" control={<Radio
                            checked={schedule.type === "onTime"}
                            onChange={handleSelectOnTimeDelete}
                            value="ontime"
                        />} label="nach Tagen" />
                    </div>
                    <Collapse in={schedule.type === "onTime"}>
                        <TextField
                            label="Tage"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Collapse>
                </div>
            </div>
        </Fade>
    )
}
