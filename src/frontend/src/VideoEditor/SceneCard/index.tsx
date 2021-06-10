import React from 'react'
import {Card, CardActions, CardContent, Input, Slider} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from "@material-ui/core/IconButton";
import {useStyles} from "../style";



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
}

/**
 * Component for a draggable scene used in the interface of the videoEditor.
 */
export const SceneCard: React.FC<SceneCardProps> = (props) => {

    const classes = useStyles();

    const handleDurationSliderChange = (event: object, newDuration: number | number[]) => {
        props.setDisplayDuration(Number(newDuration));
    }

    const handleDurationInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setDisplayDuration(Number(event.target.value))
    }

    /* INFORMATION:
     * There is the known issue that the Material UI slider causes a violation in the Dev Console since.
     * According to the GitHub issue regarding this, it is okay to leave it: https://github.com/mui-org/material-ui/issues/26456
     */


    return (
        <Card variant="outlined" color="primary" style={{width: "300px"}}>
            <CardContent>
                <Grid item container>
                    <Grid item xs={12}>
                        <Typography>
                            {props.sceneName}
                        </Typography>
                    </Grid>
                    <Grid item container xs={12} className={classes.elementLargeMargin}>
                        <Grid item xs={3}>
                            <Typography variant="body1" id={props.sceneName + "-duration-input"}>
                                Dauer:
                            </Typography>
                        </Grid>
                        <Grid item xs={9}>
                                <Slider
                                    value={props.displayDuration}
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
                                value={props.displayDuration}
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
