import React from "react";
import {SceneContainer} from "./SceneContainer";
import {MinimalInfoProvider, SceneCardData} from "../types";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import {ListItem, ListItemSecondaryAction, ListItemText, TextField} from "@material-ui/core";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import {useStyles} from "../style";
import { Alert } from "@material-ui/lab";




interface VideoEditorProps {
    continueHandler: () => void;
    backHandler: () => void;
    videoJobName: string;
    setVideoJobName: (name: string) => void;
    sceneList: Array<SceneCardData>
    setSceneList: (sceneList: Array<SceneCardData>) => void;
    availableScenes: Array<string>;
    reportError: (message: string) => void;
    minimalInfoproviders: Array<MinimalInfoProvider>;
}

/**
 * Component displaying the second step of the videoCreation, the editing of the video itself.
 */
export const VideoEditor: React.FC<VideoEditorProps> = (props) => {

    const classes = useStyles();

    /**
     * Method that appends a new scene to the list of scenes selected for the video.
     * @param sceneName The unique name of the scene to be appended
     */
    const addScene = (sceneName: string) => {
        //search all occurrences of this scene and find the highest id number to define the id of this scene
        let counter = 0;
        props.sceneList.forEach((sceneCard) => {
            if(sceneCard.sceneName === sceneName) counter++;
        })
        const arCopy = props.sceneList.slice();
        arCopy.push({
            entryId: sceneName + "||" + counter,
            sceneName: sceneName,
            exceedDisplayDuration: 1,
            spokenText: [],
            visible: true
        })
        props.setSceneList(arCopy);
    }


    /**
     * Method that renders an available scene with the option to add it to the sceneList
     * @param name The name of the scene to be displayed.
     */
    const renderAvailableScene = (name: string) => {
        return (
            <ListItem key={name}>
                <ListItemText>
                    <Typography variant="body1" className={classes.wrappedText}>
                        {name}
                    </Typography>
                </ListItemText>
                <ListItemSecondaryAction>
                    <IconButton color="primary" onClick={() => addScene(name)}>
                        <AddCircleOutlineIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        )
    }

    /**
     * This method checks if any of the scenes in the selected scenes includes spoken text
     * If any scene doesn't contain a spoken text, the continue button will be disabled
     * This is needed because the backend tool FFmpeg which generates the video expects atleast one audio per scene
     */
    const videoIncludesAudio = () => {
        for(let i = 0; i < props.sceneList.length; i++) {
            if(props.sceneList[i].spokenText.length === 0) return false;
        }
        return true;
    }

    return (
        <Grid container>
            <Grid item container xs={12} justify="space-between">
                <Grid item container xs={8}>
                    <Grid item xs={12}>
                        <TextField fullWidth margin="normal" variant="filled" color="primary"
                                   label={"Video-Job-Name"} value={props.videoJobName}
                                   onChange={(e) => props.setVideoJobName(e.target.value.replace(" ", "_"))}
                        />
                    </Grid>
                </Grid>
                <Grid item container xs={3} justify="flex-end">
                    <Grid item className={classes.verticalAlignBlockableButtonPrimary}>
                        <Button variant="contained" color="primary"
                                onClick={props.backHandler} className={classes.alignLeftButton}>
                            zurück
                        </Button>
                    </Grid>
                    <Grid item className={classes.verticalAlignBlockableButtonPrimary}>
                        <Button disabled={props.sceneList.length === 0 || !videoIncludesAudio() || props.videoJobName === ""} variant="contained" color="primary"
                                onClick={props.continueHandler} className={classes.alignRightButton}>
                            weiter
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item container xs={12} justify="space-between">
                <Grid item container xs={9}>
                    <Grid container style={{width: "100%", margin: "auto"}}>
                        <Grid item xs={12}>
                            <SceneContainer
                                sceneList={props.sceneList}
                                setSceneList={(sceneList: Array<SceneCardData>) => props.setSceneList(sceneList)}
                                minimalInfoproviders={props.minimalInfoproviders}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container xs={3}>
                    <Grid item xs={12}>
                        <Box borderColor="primary.main" border={4} className={classes.availableScenesBox}>
                            <List>
                                {props.availableScenes.map((scene) => renderAvailableScene(scene))}
                            </List>
                        </Box>
                    </Grid>
                </Grid>
                <Grid container item xs={12}>
                    <Grid item>
                        <Alert severity="info">Jede für das Video gewählte Szene muss einen TTS-Abschnitt enthalten. Dies ist aus technischen Gründen von Nöten.</Alert>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
