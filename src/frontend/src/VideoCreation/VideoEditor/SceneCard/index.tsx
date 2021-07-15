import React from 'react'
import {Card, CardActions, CardContent, Input, Slider} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from "@material-ui/core/IconButton";
import {useStyles} from "../../style";
import DeleteIcon from "@material-ui/icons/Delete";
import {AudioElement, MinimalInfoProvider} from "../../types";
import {MessageOutlined} from "@material-ui/icons";
import {EditTextDialog} from "../EditTextDialog";


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
    minimalInfoproviders: Array<MinimalInfoProvider>;
}

/**
 * Component for a selected scene used in the interface of the videoEditor.
 */
export const SceneCard: React.FC<SceneCardProps> = (props) => {

    const classes = useStyles();

    //local copy of the displayDuration: sliding edits this while letting of the slider will edit the props value
    //avoids too many rerenders - for exceed duration
    const [localExceedDisplayDuration, setLocalExceedDisplayDuration] = React.useState(props.exceedDisplayDuration);
    //timeout for setting the props value of exceedDisplayDuration shortly after the user has stopped input
    const [timeoutExceedDisplayDuration, setTimeoutExceedDisplayDuration] = React.useState(0);
    //true when a dialog for editing the spokenText of a scene is opened
    const [openTextEditDialog, setOpenTextEditDialog] = React.useState(false)

    /**
     * Gets the beginning of the spoken text for the scene
     * If the spoken text is less then or equal to 20 characters, the whole text is printed, in all other cases the first 20 characters of the spoken text will be printed
     * Note that just the first part of text from the array of spokenText is used
     * If the scene does not contain any spoken text an empty string will be returned
     */
    const getSpokenTextBeginning = () => {
        if(props.spokenText.length === 0 || props.spokenText[0].type !== "text") return "";
        if (props.spokenText[0].text !== undefined) return props.spokenText[0].text.length <= 20 ? props.spokenText[0].text : props.spokenText[0].text.slice(0, 20) + "...";
    }

    /**
     * Handler method for change events on the slider input of this scene.
     * Sets the local value storing the duration and calls the method that starts the timer for overwriting parent state.
     * @param event The event caused by changing the slider.
     * @param newDuration The new duration selected in the slider component.
     */
    const handleExceedDurationSliderChange = (event: object, newDuration: number | number[]) => {
        setLocalExceedDisplayDuration(Number(newDuration));
        changePropsExceedDisplayDuration();
    }

    /**
     * Handler method for change events on the numeric input of this scene.
     * Sets the local value storing the duration and calls the method that starts the timer for overwriting parent state.
     * @param event The event caused by changing the numeric input.
     */
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
    //TODO: currently, names are displayed fully which will cause different card sizes for big names - possibly change this to hide overflow
    return (
        <React.Fragment>
            <Card variant="outlined" color="primary" className={classes.sceneCard}>
                <CardContent>
                    <Grid item container>
                        <Grid item xs={10}>
                            <Typography className={classes.wrappedText}>
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
                                Gesprochener Text: {getSpokenTextBeginning()}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Grid container justify="space-between">
                        <Grid item>
                            <IconButton aria-label="Text bearbeiten" onClick={() => setOpenTextEditDialog(true)}>
                                <MessageOutlined
                                    fontSize="large"
                                />
                            </IconButton>
                        </Grid>
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
            {openTextEditDialog &&
                <EditTextDialog
                sceneName={props.sceneName}
                openEditTextDialog={openTextEditDialog}
                setOpenEditTextDialog={setOpenTextEditDialog}
                spokenText={props.spokenText}
                setSpokenText={props.setSpokenText}
                minimalInfoproviders={props.minimalInfoproviders}
                />
            }
        </React.Fragment>
    );

}
