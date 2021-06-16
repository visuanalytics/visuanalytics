import React from "react";
import {SceneContainer} from "./SceneContainer";
import {SceneCardData} from "./types";
import {centerNotifcationReducer, CenterNotification} from "../util/CenterNotification";
import {StepFrame} from "../CreateInfoProvider/StepFrame";
import {ComponentContext} from "../ComponentProvider";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import {ListItem, ListItemSecondaryAction, ListItemText, TextField} from "@material-ui/core";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import {useStyles} from "./style";


interface VideoEditorProps {

}


export const VideoEditor: React.FC<VideoEditorProps> = (/*{ infoProvId, infoProvider}*/) => {

    const classes = useStyles();
    const components = React.useContext(ComponentContext);

    // name of the videoJob
    const [videoJobName, setVideoJobName] = React.useState("");
    //list of the names of all scenes available - holds the data fetched from the backend
    const [availableScenes, setAvailableScenes] = React.useState<Array<string>>(["Wetter_heute", "Regen_Vorschau", "Fußball-Ergebnisse", "Begrüßung"]);
    // sorted list of all scenes that are selected for the video
    const [sceneList, setSceneList] = React.useState<Array<SceneCardData>>([
        {entryId: "Szene_1||0", sceneName: "Szene_1", durationType: "fixed", fixedDisplayDuration: 1, exceedDisplayDuration: 1, spokenText: "", visible: true},
        {entryId: "Szene_2||0", sceneName: "Szene_2", durationType: "fixed", fixedDisplayDuration: 1, exceedDisplayDuration: 1, spokenText: "", visible: true},
        {entryId: "Szene_3||0", sceneName: "Szene_3", durationType: "fixed", fixedDisplayDuration: 1, exceedDisplayDuration: 1, spokenText: "", visible: true},
        {entryId: "Szene_4||0", sceneName: "Szene_4", durationType: "fixed", fixedDisplayDuration: 1, exceedDisplayDuration: 1, spokenText: "", visible: true},
        {entryId: "Szene_5||0", sceneName: "Szene_5", durationType: "fixed", fixedDisplayDuration: 1, exceedDisplayDuration: 1, spokenText: "", visible: true},
        {entryId: "Szene_6||0", sceneName: "Szene_6", durationType: "fixed", fixedDisplayDuration: 1, exceedDisplayDuration: 1, spokenText: "", visible: true},
    ]);

    /**
     * setup for error notification
     */
    const [message, dispatchMessage] = React.useReducer(centerNotifcationReducer, {
        open: false,
        message: "",
        severity: "error",
    });

    const reportError = (message: string) => {
        dispatchMessage({type: "reportError", message: message});
    };

    /**
     * Method that appends a new scene to the list of scenes selected for the video.
     * @param sceneName The unique name of the scene to be appended
     */
    const addScene = (sceneName: string) => {
        //search all occurrences of this scene and find the highest id number to define the id of this scene
        let counter = 0;
        sceneList.forEach((sceneCard) => {
            if(sceneCard.sceneName === sceneName) counter++;
        })
        const arCopy = sceneList.slice();
        arCopy.push({
            entryId: sceneName + "||" + counter,
            sceneName: sceneName,
            durationType: "fixed",
            fixedDisplayDuration: 1,
            exceedDisplayDuration: 1,
            spokenText: "",
            visible: true
        })
        setSceneList(arCopy);
    }

    /**
     * Method that handles clicking the save button.
     */
    const saveHandler = () => {

    }

    /**
     * Takes the values of all states and creates the object for the
     * backend representing the video.
     */
    const createBackendFormat = () => {
        return {
            sequence: {
                type: "successively",
                transitions: 0.1
            }
        }
    }

    /**
     * Method that creates the object with all scenes necessary for the backend.
     */
    const createImagesObject = () => {
        //TODO: possibly find smarter solution without any type
        const imagesObject: any = {};
        sceneList.forEach((scene) => {
            imagesObject[scene.entryId] = {}
        })
        return imagesObject;
    }

    /**
     * Method that creates the object with all audios necessary for the backend.
     */
    const createAudioObject = () => {
        //TODO: possibly find smarter solution without any type
        const audioObject: any = {};
        sceneList.forEach((scene) => {
            audioObject[scene.entryId] = {
                parts: [
                    {
                        type: "text",
                        pattern: scene.spokenText
                    },
                    {
                        type: "silent",
                        duration: scene.exceedDisplayDuration
                    }
                ]
            }
        })
        return audioObject;
    }
    /**
     * Method that renders an available scene with the option to add it to the sceneList
     * @param name The name of the scene to be displayed.
     */
    const renderAvailableScene = (name: string) => {
        return (
            <ListItem key={name}>
                <ListItemText>
                    <Typography variant="body1">
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

    return (
        <StepFrame
            heading={"Video-Editor"}
            hintContent={null}
            large={true}
        >
            <Grid container>
                <Grid item container xs={12} justify="space-between">
                    <Grid item container xs={8}>
                        <Grid item xs={12}>
                            <TextField fullWidth margin="normal" variant="filled" color="primary"
                                       label={"Video-Job-Name"} value={videoJobName}
                                       onChange={(e) => setVideoJobName(e.target.value.replace(" ", "_"))}
                            />
                        </Grid>
                    </Grid>
                    <Grid item container xs={3} justify="flex-end">
                        <Grid item className={classes.verticalButtonAlignContainer}>
                            <Button disabled={sceneList.length === 0} variant="contained" color="primary"
                                    onClick={saveHandler} className={classes.alignedButton}>
                                zurück
                            </Button>
                        </Grid>
                        <Grid item className={classes.verticalButtonAlignContainer}>
                            <Button disabled={sceneList.length === 0} variant="contained" color="secondary"
                                    onClick={saveHandler} className={classes.blockableButtonSecondary}>
                                Speichern
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container xs={12} justify="space-between">
                    <Grid item container xs={9}>
                        <Grid container style={{width: "100%", margin: "auto"}}>
                            <Grid item xs={12}>
                                <SceneContainer
                                    sceneList={sceneList}
                                    setSceneList={(sceneList: Array<SceneCardData>) => setSceneList(sceneList)}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item container xs={3}>
                        <Grid item xs={12}>
                            <Box borderColor="primary.main" border={4} className={classes.availableScenesBox}>
                                <List>
                                    {availableScenes.map((scene) => renderAvailableScene(scene))}
                                </List>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <CenterNotification
                handleClose={() => dispatchMessage({type: "close"})}
                open={message.open}
                message={message.message}
                severity={message.severity}
            />
        </StepFrame>
    )
}
