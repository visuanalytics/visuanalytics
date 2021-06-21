import React from "react";
import {SceneContainer} from "./VideoEditor/SceneContainer";
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
import {VideoEditor} from "./VideoEditor";

/**
 TODO:
 1: Auslagerung Szeneerstellung in Unterkomponente für Gliederung in 3 Schritte
 2: Fetching aller Infoprovider
 3: Anzeigen Auswahl aller Infoprovider
 4: Abfragen aller ausgewählten Infoprovider und Laden von Daten
 5: Schedule-Auswahl schreiben (wie bei Historisierung mit neuer Option "einmalig")
 6: Absenden der Daten an das Backend mit Datenformat
 7: sessionStorage einbinden/ermöglichen
 8: Option auf Bearbeitung einbinden
 9: fehlende Docstrings hinzufügen
 */


interface VideoCreationProps {

}


export const VideoCreation: React.FC<VideoCreationProps> = (/*{ infoProvId, infoProvider}*/) => {

    const classes = useStyles();
    const components = React.useContext(ComponentContext);

    //current step of the VideoCreation
    const [videoCreationStep, setVideoCreationStep] = React.useState(0)
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


    const continueHandler = () => {
        //TODO: additional steps needed?
        setVideoCreationStep(videoCreationStep -1)
    }


    const backHandler = () => {
        if(videoCreationStep == 0) {
            //clearSessionStorage()
            components?.setCurrent("dashboard")
        } else {
            setVideoCreationStep(videoCreationStep -1)
        }
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



    const selectContent = () => {
        switch(videoCreationStep) {
            case 0: {
                return (
                    <div></div>
                )
                break;
            }
            case 1: {
                return (
                    <VideoEditor
                        continueHandler={() => continueHandler()}
                        backHandler={() => backHandler()}
                        videoJobName={videoJobName}
                        setVideoJobName={(name: string) => setVideoJobName(name)}
                        sceneList={sceneList}
                        setSceneList={(sceneList: Array<SceneCardData>) => setSceneList(sceneList)}
                        availableScenes={availableScenes}
                        reportError={(message: string) => reportError(message)}
                    />
                )
            }
            case 2: {
                return (
                    <div></div>
                )
            }


        }
    }

    return (
        <StepFrame
            heading={"Video-Editor"}
            hintContent={null}
            large={true}
        >
            {selectContent()}
            <CenterNotification
                handleClose={() => dispatchMessage({type: "close"})}
                open={message.open}
                message={message.message}
                severity={message.severity}
            />
        </StepFrame>
    )
}
