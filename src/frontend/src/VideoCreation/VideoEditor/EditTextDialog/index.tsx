import React from "react";
import {useStyles} from "../../style";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select"
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import {AudioElement} from "../../types";

interface EditTextDialogProps {
    sceneName: string;
    openEditTextDialog: boolean;
    setOpenEditTextDialog: (openEditTextDialog: boolean) => void;
    spokenText: Array<AudioElement>;
    setSpokenText: (newText: Array<AudioElement>) => void;
}

export const EditTextDialog: React.FC<EditTextDialogProps> = (props) => {
    const classes = useStyles();

    const [newPause, setNewPause] = React.useState<number | undefined>(0);

    const [audioElements, setAudioElements] = React.useState<Array<AudioElement>>([{
        type: "text",
        text: ""
    }]);

    const addNewText = () => {
        const arrCopy = audioElements.slice();
        arrCopy.push({
            type: "pause",
            duration: newPause
        }, {
            type: "text",
            text: ""
        });
        setAudioElements(arrCopy);
        setNewPause(0);
    }

    const renderEditElement = (id: string, audioElement: AudioElement) => {
        if(audioElement.type === "text" && audioElement.text !== undefined) {
            return (
                <Grid item xs={12}>
                    <TextField id={id} label="TTS-Text" multiline rowsMax={3} defaultValue={audioElement.text}/>
                </Grid>
            )
        } else if(audioElement.type === "pause" && audioElement.duration !== undefined) {
            return (
                <Grid item>
                    <TextField id={id} label="Pause in ms" type="number" defaultValue={audioElement.duration}/>
                </Grid>
            )
        }
    }

    return (
        <Dialog aria-labelledby="EditTextDialog-Title" open={props.openEditTextDialog}>
            <DialogTitle id="EditTextDialog-Title">Text für {props.sceneName} bearbeiten</DialogTitle>
            <DialogContent dividers>
                <Grid container>
                    <Grid item xs={12}>
                        Fügen Sie hier Texte und Pausen zur gewählten Szene {props.sceneName} hinzu.
                    </Grid>
                    <Grid container justify="space-between">
                        <Grid container xs={12} md={6}>
                            <Grid item>
                                <Typography variant="h5">Elemente</Typography>
                            </Grid>
                            {audioElements.map((audioElement: AudioElement, index: number) => renderEditElement(index.toString(), audioElement))}
                            <Grid item>
                                <Typography variant="h6">
                                    Neuer Text-Abschnitt
                                </Typography>
                            </Grid>
                            <TextField label="Pause vor nächstem Text in ms" type="number" defaultValue={0} onChange={event => setNewPause(event.target.value === "" ? undefined : Number(event.target.value))}/>
                            <Grid item className={classes.blockableButtonPrimary}>
                                <Button variant="contained" color="primary" disabled={newPause === undefined || newPause < 0} onClick={addNewText}>
                                    Neuen Abschnitt hinzufügen
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container xs={12} md={6}>
                            <Typography variant="h5">
                                API-Daten
                            </Typography>
                        </Grid>
                    </Grid>
                    </Grid>
            </DialogContent>
            <DialogActions>
                <Grid container justify="space-between">
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={() => props.setOpenEditTextDialog(false)}>
                            Abbrechen
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary">
                            Speichern
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    )
}