import React from "react";
import {SceneContainer} from "./VideoEditor/SceneContainer";
import {fetchAllBackendAnswer, InfoProviderData, SceneCardData} from "./types";
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
import {InfoProviderSelection} from "./InfoProviderSelection";

/**
 TODO:
 4: Abfragen aller ausgewählten Infoprovider und Laden von Daten
 5: Schedule-Auswahl schreiben (wie bei Historisierung mit neuer Option "einmalig")
 6: Absenden der Daten an das Backend mit Datenformat
 7: sessionStorage einbinden/ermöglichen
 8: Option auf Bearbeitung einbinden
 9: fehlende Docstrings hinzufügen

 DONE:
 1: Auslagerung Szenenerstellung in Unterkomponente für Gliederung in 3 Schritte
 2: Fetching aller Infoprovider
 3: Anzeigen Auswahl aller Infoprovider
 */


interface VideoCreationProps {

}


export const VideoCreation: React.FC<VideoCreationProps> = (/*{ infoProvId, infoProvider}*/) => {

    const classes = useStyles();
    const components = React.useContext(ComponentContext);

    // current step of the VideoCreation
    const [videoCreationStep, setVideoCreationStep] = React.useState(0)
    // name of the videoJob
    const [videoJobName, setVideoJobName] = React.useState("");
    // list of all available infoproviders
    const [infoProviderList, setInfoProviderList] = React.useState<Array<InfoProviderData>>([]);
    // list of infoproviders selected by the user
    const [selectedInfoProvider, setSelectedInfoProvider] = React.useState<Array<InfoProviderData>>([]);
    // list of the names of all scenes available - holds the data fetched from the backend
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
     * Method block for fetching all infoproviders from the backend
     */

    /**
     * Handles the error-message if an error appears.
     * @param err the shown error
     */
    const handleErrorFetchInfoProvider = (err: Error) => {
        //console.log('error');
        reportError("Fehler: " + err)
    }

    /**
     * Handles the success of the fetchAllInfoprovider()-method.
     * The json from the response will be transformed to an array of jsonRefs and saved in infoprovider.
     * @param jsonData the answer from the backend
     */
    const handleSuccessFetchInfoProvider = (jsonData: any) => {
        const data = jsonData as fetchAllBackendAnswer;
        setInfoProviderList(data);
    }

    //this static value will be true as long as the component is still mounted
    //used to check if handling of a fetch request should still take place or if the component is not used anymore
    const isMounted = React.useRef(true);

    /**
     * Method to fetch all infoproviders from the backend.
     * The standard hook "useCallFetch" is not used here since the fetch function has to be memorized
     * with useCallback in order to be used in useEffect.
     */
    const fetchAllInfoprovider = React.useCallback(() => {
        let url = "/visuanalytics/infoprovider/all"
        //if this variable is set, add it to the url
        if (process.env.REACT_APP_VA_SERVER_URL) url = process.env.REACT_APP_VA_SERVER_URL + url
        //setup a timer to stop the request after 5 seconds
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 5000);
        //starts fetching the contents from the backend
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json\n"
            },
            signal: abort.signal
        }).then((res: Response) => {
            //handles the response and gets the data object from it
            if (!res.ok) throw new Error(`Network response was not ok, status: ${res.status}`);
            return res.status === 204 ? {} : res.json();
        }).then((data) => {
            //success case - the data is passed to the handler
            //only called when the component is still mounted
            if (isMounted.current) handleSuccessFetchInfoProvider(data)
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted.current) handleErrorFetchInfoProvider(err)
        }).finally(() => clearTimeout(timer));
    }, [])

    //defines a cleanup method that sets isMounted to false when unmounting
    //will signal the fetchMethod to not work with the results anymore
    React.useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    /**
     * The list of infoproviders is generated automatically when the component is shown.
     */
    React.useEffect(() => {
            //console.log("Fetcher hook here")
            fetchAllInfoprovider();
        }, [fetchAllInfoprovider]
    );


    /**
     * Method block for fetching all scenes from the backend
     */




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
                    <InfoProviderSelection
                        continueHandler={() => continueHandler()}
                        backHandler={() => backHandler()}
                        infoProviderList={infoProviderList}
                        selectedInfoProvider={selectedInfoProvider}
                        setSelectedInfoProvider={(selection: Array<InfoProviderData>) => setSelectedInfoProvider(selection)}
                        reportError={(message: string) => reportError(message)}
                    />
                )
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
