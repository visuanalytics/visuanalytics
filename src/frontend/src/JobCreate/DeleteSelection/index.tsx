import React from "react";
import {useStyles} from "../style";
import {Collapse, Divider, Fade, FormControlLabel, Radio, TextField} from "@material-ui/core";
import {Schedule} from "../index";

interface DeleteSelectionProps {
    schedule: Schedule,
    deleteHandler: () => void;
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
                        <FormControlLabel value="nodelete" control={<Radio
                            checked={!props.schedule.delete}
                            onChange={props.deleteHandler}
                            value="nodelete"
                        />} label="nicht löschen" />
                    </div>
                </div>
                <Divider />
                <div className={classes.paddingSmall}>
                    <div className={classes.centerDiv}>
                        <FormControlLabel value="deleteOld" control={<Radio
                            checked={props.schedule.deleteOldOnNew}
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
                        />} label="nach Tagen" />
                    </div>
                    <Collapse in={props.schedule.onTime}>
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
