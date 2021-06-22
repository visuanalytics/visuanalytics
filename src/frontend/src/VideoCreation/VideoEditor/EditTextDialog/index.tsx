import React from "react";
import {useStyles} from "../../style";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select"
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import {Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField} from "@material-ui/core";
import {AudioElement} from "../../types";
import DeleteIcon from "@material-ui/icons/Delete";


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

    const [audioElements, setAudioElements] = React.useState<Array<AudioElement>>(props.spokenText.length === 0 ? [{
        type: "text",
        text: ""
    }] : (props.spokenText[props.spokenText.length - 1].type === "pause" ? props.spokenText.concat({
        type: "text",
        text: ""
    }) : props.spokenText));

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

    const deleteText = (index: number) => {
        const arrCopy = audioElements.slice();
        if(index >= audioElements.length - 2) arrCopy.splice(index - 1, 2);
        else arrCopy.splice(index, 2);
        setAudioElements(arrCopy);
    }

    const changeElement = (event: React.ChangeEvent<HTMLInputElement>) => {
        const editedElement = Number(event.target.id);
        const arrCopy = audioElements.slice();
        if(arrCopy[editedElement].type === "text") arrCopy[editedElement].text = event.target.value;
        else if(arrCopy[editedElement].type === "pause") arrCopy[editedElement].duration = Number(event.target.value);
        setAudioElements(arrCopy);
    }

    const saveNewAudio = () => {
        props.setSpokenText(audioElements.slice());
        props.setOpenEditTextDialog(false);
    }

    const isInvalidCombination = () => {
        for(let i = 0; i < audioElements.length; i++) {
            if(audioElements[i].type === "text" && audioElements[i].text === "") return true;
            else if(audioElements[i].type === "pause" && (audioElements[i].duration === undefined || audioElements[i].duration! < 0)) return true;
        }
        return false;
    }

    const renderEditElement = (id: number, audioElement: AudioElement) => {
        if(audioElement.type === "text" && audioElement.text !== undefined) {
            return (
                <Grid container key={id} justify="space-between">
                    <Grid item xs={12} md={10}>
                        <TextField error={audioElement.text === ""} id={id.toString()} label="TTS-Text" multiline rowsMax={3} value={audioElement.text} onChange={changeElement}/>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <IconButton aria-label="Abschnitt löschen" disabled={audioElements.length <= 2} onClick={() => deleteText(id)}>
                            <DeleteIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
            )
        } else if(audioElement.type === "pause" && audioElement.duration !== undefined) {
            return (
                <Grid item>
                    <TextField error={audioElement.duration === undefined || audioElement.duration < 0} id={id.toString()} label="Pause in ms" type="number" defaultValue={audioElement.duration} onChange={changeElement}/>
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
                            {audioElements.map((audioElement: AudioElement, index: number) => renderEditElement(index, audioElement))}
                            <Grid item>
                                <Typography variant="h6">
                                    Neuer Text-Abschnitt
                                </Typography>
                            </Grid>
                            <TextField error={newPause === undefined || newPause < 0} label="Pause vor nächstem Text in ms" type="number" value={newPause} onChange={event => setNewPause(event.target.value === "" ? undefined : Number(event.target.value))}/>
                            <Grid item className={classes.blockableButtonPrimary}>
                                <Button variant="contained" color="primary" disabled={newPause === undefined || newPause < 0 || audioElements[audioElements.length - 1].text === ""} onClick={addNewText}>
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
            <DialogActions className={classes.elementLargeMargin}>
                <Grid container justify="space-between">
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={() => props.setOpenEditTextDialog(false)}>
                            Abbrechen
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" disabled={isInvalidCombination()} onClick={saveNewAudio}>
                            Speichern
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    )
}