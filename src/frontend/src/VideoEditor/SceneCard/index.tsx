import React from 'react'
import {Card, CardActions, CardContent, Input, Slider} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from "@material-ui/core/IconButton";
import {useStyles} from "../style";
import DeleteIcon from "@material-ui/icons/Delete";



export interface SceneCardProps {
    entryId: string;
    sceneName: string;
    moveLeft: () => void;
    moveRight: () => void;
    displayDuration: number;
    setDisplayDuration: (newDisplayDuration: number) => void;
    spokenText: string;
    setSpokenText: (newSpokenText: string) => void;
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
    //avoids too many rerenders
    const [localDisplayDuration, setLocalDisplayDuration] = React.useState(props.displayDuration);
    //timeout for setting the props value of displayDuration shortly after the user has stopped input
    const [timeoutDisplayDuration, setTimeoutDisplayDuration] = React.useState(0);

    const handleDurationSliderChange = (event: object, newDuration: number | number[]) => {
        setLocalDisplayDuration(Number(newDuration));
        changePropsDisplayDuration();
    }

    const handleDurationInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalDisplayDuration(Number(event.target.value))
        changePropsDisplayDuration();
    }

    /**
     * Method that changes the displayDuration state value of the higher component 200ms after the user has made a change.
     * Copies the local value into the higher components state. This avoids too many rerenders of the whole view.
     * When triggered again, it resets the timeout so there is a need for 200ms without an input.
     */
    const changePropsDisplayDuration = () => {
        window.clearTimeout(timeoutDisplayDuration);
        setTimeoutDisplayDuration(window.setTimeout(() => {
            props.setDisplayDuration(localDisplayDuration);
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
                        <IconButton onClick={() => props.removeScene()} className={classes.redDeleteIcon}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                    <Grid item container xs={12} className={classes.elementLargeMargin}>
                        <Grid item xs={3}>
                            <Typography variant="body1" id={props.sceneName + "-duration-input"}>
                                Dauer:
                            </Typography>
                        </Grid>
                        <Grid item xs={9}>
                                <Slider
                                    value={localDisplayDuration}
                                    getAriaValueText={() => props.displayDuration + " Sekunden"}
                                    onChange={handleDurationSliderChange}
                                    aria-labelledby={props.sceneName + "-duration-input"}
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
                                value={localDisplayDuration}
                                margin="dense"
                                onChange={handleDurationInputChange}
                                inputProps={{
                                    step: 1,
                                    min: 0,
                                    max: 300,
                                    type: 'number',
                                    "aria-labelledby": props.sceneName + "-duration-input",
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
                            Gesprochener Text: {props.spokenText}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Grid container justify="space-between">
                    <Grid item>
                        <IconButton disabled={props.leftDisabled} onClick={props.moveLeft}>
                            <ArrowBackIcon
                                fontSize="large"
                            />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton disabled={props.rightDisabled} onClick={props.moveRight}>
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
