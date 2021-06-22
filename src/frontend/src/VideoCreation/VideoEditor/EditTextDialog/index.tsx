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

    const [audioElements, setAudioElements] = React.useState<Array<AudioElement>>([{
        type: "text",
        text: ""
    }]);

    const renderEditElement = (id: string, audioElement: AudioElement) => {
        if(audioElement.type === "text" && audioElement.text !== undefined) {
            return (
                <Grid item xs={12}>
                    <TextField id={id} multiline rowsMax={3} value={audioElement.text}/>
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
                    <Grid container>
                        {audioElements.map((audioElement: AudioElement, index: number) => renderEditElement(index.toString(), audioElement))}
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