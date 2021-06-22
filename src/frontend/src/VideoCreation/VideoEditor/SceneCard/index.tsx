import React from 'react'
import {Card, CardActions, CardContent, Input, Slider} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from "@material-ui/core/IconButton";
import {useStyles} from "../../style";
import DeleteIcon from "@material-ui/icons/Delete";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Collapse from "@material-ui/core/Collapse";
import FormControl from "@material-ui/core/FormControl";
import {AudioElement, DurationType} from "../../types";



export interface SceneCardProps {
    entryId: string;
    sceneName: string;
    moveLeft: () => void;
    moveRight: () => void;
    exceedDisplayDuration: number;
    setExceedDisplayDuration: (newExceedDisplayDuration: number) => void;
    spokenText: Array<AudioElement>;
    setSpokenText: (newSpokenText: Array<AudioElement>) => void;
    leftDisabled: boolean;
    rightDisabled: boolean;
    removeScene: () => void;
}

/**
 * Component for a draggable scene used in the interface of the videoEditor.
 */
export const SceneCard: React.FC<SceneCardProps> = (props) => {

    const classes = useStyles();

    //local copy of the displayDuration: sliding edits this while letting of the slider will edit the props value
    //avoids too many rerenders - for exceed duration
    const [localExceedDisplayDuration, setLocalExceedDisplayDuration] = React.useState(props.exceedDisplayDuration);
    //timeout for setting the props value of exceedDisplayDuration shortly after the user has stopped input
    const [timeoutExceedDisplayDuration, setTimeoutExceedDisplayDuration] = React.useState(0);



    const handleExceedDurationSliderChange = (event: object, newDuration: number | number[]) => {
        setLocalExceedDisplayDuration(Number(newDuration));
        changePropsExceedDisplayDuration();
    }

    const handleExceedDurationInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalExceedDisplayDuration(Number(event.target.value))
        changePropsExceedDisplayDuration();
    }


    /**
     * Method that changes the exceedDisplayDuration state value of the higher component 200ms after the user has made a change.
     * Copies the local value into the higher components state. This avoids too many rerenders of the whole view.
     * When triggered again, it resets the timeout so there is a need for 200ms without an input.
     */
    const changePropsExceedDisplayDuration = () => {
        window.clearTimeout(timeoutExceedDisplayDuration);
        setTimeoutExceedDisplayDuration(window.setTimeout(() => {
            props.setExceedDisplayDuration(localExceedDisplayDuration);
        }, 200));
    }

    /* INFORMATION:
     * There is the known issue that the Material UI slider causes a violation in the Dev Console since.
     * According to the GitHub issue regarding this, it is okay to leave it: https://github.com/mui-org/material-ui/issues/26456
     */

    return (
        <Card variant="outlined" color="primary" style={{width: "300px"}}>
            <CardContent>
                <Grid item container>
                    <Grid item xs={10}>
                        <Typography>
                            {props.sceneName}
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton aria-label="Szene löschen" onClick={() => props.removeScene()} className={classes.redDeleteIcon}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                    <Grid item container xs={12} className={classes.elementLargeMargin}>
                        <Grid item xs={3}>
                            <Typography variant="body1" id={props.sceneName + "-durationExceed-input"}>
                                Dauer:
                            </Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <Slider
                                value={localExceedDisplayDuration}
                                getAriaValueText={() => props.exceedDisplayDuration + " Sekunden"}
                                onChange={handleExceedDurationSliderChange}
                                aria-labelledby={props.sceneName + "-durationExceed-input"}
                                step={1}
                                min={0}
                                max={300}
                                valueLabelDisplay="auto"

                            />
                        </Grid>
                    </Grid>
                    <Grid item container xs={12}>
                        <Grid item xs={3}>
                            <Input
                                value={localExceedDisplayDuration}
                                margin="dense"
                                onChange={handleExceedDurationInputChange}
                                inputProps={{
                                    step: 1,
                                    min: 0,
                                    max: 300,
                                    type: 'number',
                                    "aria-labelledby": props.sceneName + "-durationExceed-input",
                                }}
                            />
                        </Grid>
                        <Grid item xs={9}>
                            <Typography variant="body1">
                                Sekunden
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} className={classes.elementLargeMargin}>
                        <Typography>
                            Gesprochener Text:
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Grid container justify="space-between">
                    <Grid item>
                        <IconButton aria-label="Szene nach links bewegen" disabled={props.leftDisabled} onClick={props.moveLeft}>
                            <ArrowBackIcon
                                fontSize="large"
                            />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton aria-label="Szene nach rechts bewegen" disabled={props.rightDisabled} onClick={props.moveRight}>
                            <ArrowForwardIcon
                                fontSize="large"
                            />
                        </IconButton>
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    )

}
