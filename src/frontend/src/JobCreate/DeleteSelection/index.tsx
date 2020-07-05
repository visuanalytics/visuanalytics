import React from "react";
import {useStyles} from "../style";
import {Collapse, Divider, Fade, FormControlLabel, Radio} from "@material-ui/core";
import {Schedule} from "../index";
import {TimeInputField} from "../ScheduleSelection/DateTimeInput";

interface DeleteSelectionProps {
    schedule: Schedule,
    deleteOldNewHandler: () => void;
    deleteOnTimeHandler: () => void;
    deleteTimeHandler: (date: Date | null) => void;
}

export const DeleteSelection: React.FC<DeleteSelectionProps> = (props) => {
    const classes = useStyles();

    return (
        <Fade in={true}>
            <div>
                <div className={classes.paddingSmall}>
                    <div className={classes.centerDiv}>
                        <FormControlLabel value="deleteOld" control={<Radio
                            checked={props.schedule.delete_old_on_new}
                            onChange={props.deleteOldNewHandler}
                            value="deleteOld"
                        />} label="Video bei Neugenerierung löschen" />
                    </div>
                </div>
                <Divider />
                <div className={classes.paddingSmall} >
                    <div className={classes.centerDiv}>
                        <FormControlLabel value="ontime" control={<Radio
                            checked={props.schedule.onTime}
                            onChange={props.deleteOnTimeHandler}
                            value="ontime"
                        />} label="nach bestimmter Zeit" />
                    </div>
                    <Collapse in={props.schedule.onTime}>
                        <TimeInputField date={props.schedule.removal_time} handler={props.deleteTimeHandler} />
                    </Collapse>
                </div>
            </div>
        </Fade>
    )
}
