import React from "react";
import {
    BackendAudioType,
    FetchAllInfoProviderAnswer,
    FetchAllScenesAnswer,
    InfoProviderData,
    MinimalInfoProvider,
    SceneCardData
} from "./types";
import {centerNotifcationReducer, CenterNotification} from "../util/CenterNotification";
import {StepFrame} from "../CreateInfoProvider/StepFrame";
import {ComponentContext} from "../ComponentProvider";
import {VideoEditor} from "./VideoEditor";
import {InfoProviderSelection} from "./InfoProviderSelection";
import {
    Schedule,
    uniqueId
} from "../CreateInfoProvider/types";
import {ScheduleSelection} from "./ScheduleSelection";
import {useCallFetch} from "../Hooks/useCallFetch";

/**
 TODO:
 10: Option auf Bearbeitung einbinden

 DONE:
 1: Auslagerung Szenenerstellung in Unterkomponente für Gliederung in 3 Schritte
 2: Fetching aller Infoprovider
 3: Anzeigen Auswahl aller Infoprovider
 4: Abfragen aller ausgewählten Infoprovider und Laden von Daten
 5: Schedule-Auswahl schreiben (wie bei Historisierung mit neuer Option "einmalig")
 6: Absenden der Daten an das Backend mit Datenformat
 7: sessionStorage einbinden/ermöglichen
 8: alle Szenen aus dem Backend fetchen
 9: fehlende Docstrings hinzufügen
 */

/**
 * Wrapper component for the videoCreation process.
 */
export const VideoCreation = () => {

    const components = React.useContext(ComponentContext);

    // current step of the VideoCreation
    const [videoCreationStep, setVideoCreationStep] = React.useState(0)
    // name of the videoJob
    const [videoJobName, setVideoJobName] = React.useState("");
    //schedule of the videojob
    const [schedule, setSchedule] = React.useState<Schedule>({type: "", interval: "", time: "", weekdays: []})
    // list of all available infoproviders
    const [infoProviderList, setInfoProviderList] = React.useState<Array<InfoProviderData>>([]);
    // list of infoproviders selected by the user
    const [selectedInfoProvider, setSelectedInfoProvider] = React.useState<Array<InfoProviderData>>([]);
    // list of all infoProvider objects selected by the user - reduced to the necessary minimum of information for the video creation
    const [minimalInfoProvObjects, setMinimalInfoProvObjects] = React.useState<Array<MinimalInfoProvider>>([]);
    // list of the names of all scenes available - holds the data fetched from the backend
    const [availableScenes, setAvailableScenes] = React.useState<Array<string>>(["Szene_1", "Szene_2", "Szene_3", "Szene_4", "Szene_5", "Szene_6"]);
    // sorted list of all scenes that are selected for the video
    const [sceneList, setSceneList] = React.useState<Array<SceneCardData>>([
        {entryId: "Szene_1||0", sceneName: "Szene_1", exceedDisplayDuration: 1, spokenText: [{type: "text", text: "hallo"}, {type: "pause", duration: 5}, {type: "text", text: "Janek"}], visible: true},
        {entryId: "Szene_2||0", sceneName: "Szene_2", exceedDisplayDuration: 1, spokenText: [], visible: true},
        {entryId: "Szene_3||0", sceneName: "Szene_3", exceedDisplayDuration: 1, spokenText: [], visible: true},
        {entryId: "Szene_4||0", sceneName: "Szene_4", exceedDisplayDuration: 1, spokenText: [], visible: true},
        {entryId: "Szene_5||0", sceneName: "Szene_5", exceedDisplayDuration: 1, spokenText: [], visible: true},
        {entryId: "Szene_6||0", sceneName: "Szene_6", exceedDisplayDuration: 1, spokenText: [], visible: true},
    ]);

    /**
     * Restores all data of the current session when the page is loaded. Used to not loose data on reloading the page.
     * The sets need to be converted back from Arrays that were parsed with JSON.stringify.
     */
    React.useEffect(() => {
        //videoCreationStep
        setVideoCreationStep(Number(sessionStorage.getItem("videoCreationStep-" + uniqueId) || 0));
        //videoJobName
        setVideoJobName(sessionStorage.getItem("videoJobName-" + uniqueId) || "");
        //schedule
        setSchedule(sessionStorage.getItem("schedule-" + uniqueId) === null ? {
            type: "",
            interval: "",
            time: "",
            weekdays: []
        } : JSON.parse(sessionStorage.getItem("schedule-" + uniqueId)!))
        //infoProviderList
        setInfoProviderList(sessionStorage.getItem("infoProviderList-" + uniqueId) === null ? new Array<InfoProviderData>() : JSON.parse(sessionStorage.getItem("infoProviderList-" + uniqueId)!));
        //selectedInfoProvider
        setSelectedInfoProvider(sessionStorage.getItem("selectedInfoProvider-" + uniqueId) === null ? new Array<InfoProviderData>() : JSON.parse(sessionStorage.getItem("selectedInfoProvider-" + uniqueId)!));
        //minimalInfoProvObjects
        setMinimalInfoProvObjects(sessionStorage.getItem("minimalInfoProvObjects-" + uniqueId) === null ? new Array<MinimalInfoProvider>() : JSON.parse(sessionStorage.getItem("minimalInfoProvObjects-" + uniqueId)!));
        //availableScenes
        setAvailableScenes(sessionStorage.getItem("availableScenes-" + uniqueId) === null ? ["Szene_1", "Szene_2", "Szene_3", "Szene_4", "Szene_5", "Szene_6"] : JSON.parse(sessionStorage.getItem("availableScenes-" + uniqueId)!));
        //sceneList
        setSceneList(sessionStorage.getItem("sceneList-" + uniqueId) === null ? [
            {entryId: "Szene_1||0", sceneName: "Szene_1", exceedDisplayDuration: 1, spokenText: [{type: "text", text: "hallo"}, {type: "pause", duration: 5}, {type: "text", text: "Janek"}], visible: true},
            {entryId: "Szene_2||0", sceneName: "Szene_2", exceedDisplayDuration: 1, spokenText: [], visible: true},
            {entryId: "Szene_3||0", sceneName: "Szene_3", exceedDisplayDuration: 1, spokenText: [], visible: true},
            {entryId: "Szene_4||0", sceneName: "Szene_4", exceedDisplayDuration: 1, spokenText: [], visible: true},
            {entryId: "Szene_5||0", sceneName: "Szene_5", exceedDisplayDuration: 1, spokenText: [], visible: true},
            {entryId: "Szene_6||0", sceneName: "Szene_6", exceedDisplayDuration: 1, spokenText: [], visible: true},
        ] : JSON.parse(sessionStorage.getItem("sceneList-" + uniqueId)!));
    }, [])

    //store videoCreationStep in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("videoCreationStep-" + uniqueId, videoCreationStep.toString());
    }, [videoCreationStep])
    //store videoJobName in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("videoJobName-" + uniqueId, videoJobName);
    }, [videoJobName])
    //store schedule in sessionStorage by using JSON.stringify on it
    React.useEffect(() => {
        sessionStorage.setItem("schedule-" + uniqueId, JSON.stringify(schedule));
    }, [schedule])
    //store infoProviderList in sessionStorage by using JSON.stringify on it
    React.useEffect(() => {
        sessionStorage.setItem("infoProviderList-" + uniqueId, JSON.stringify(infoProviderList));
    }, [infoProviderList])
    //store selectedInfoProvider in sessionStorage by using JSON.stringify on it
    React.useEffect(() => {
        sessionStorage.setItem("selectedInfoProvider-" + uniqueId, JSON.stringify(selectedInfoProvider));
    }, [selectedInfoProvider])
    //store minimalInfoProvObjects in sessionStorage by using JSON.stringify on it
    React.useEffect(() => {
        sessionStorage.setItem("minimalInfoProvObjects-" + uniqueId, JSON.stringify(minimalInfoProvObjects));
    }, [minimalInfoProvObjects])
    //store availableScenes in sessionStorage by using JSON.stringify on it
    React.useEffect(() => {
        sessionStorage.setItem("availableScenes-" + uniqueId, JSON.stringify(availableScenes));
    }, [availableScenes])
    //store availableScenes in sessionStorage by using JSON.stringify on it
    React.useEffect(() => {
        sessionStorage.setItem("sceneList-" + uniqueId, JSON.stringify(sceneList));
    }, [sceneList])

    /**
     * Removes all items of this component from the sessionStorage.
     */
    const clearSessionStorage = () => {
        sessionStorage.removeItem("videoCreationStep-" + uniqueId);
        sessionStorage.removeItem("videoJobName-" + uniqueId);
        sessionStorage.removeItem("schedule-" + uniqueId);
        sessionStorage.removeItem("infoProviderList-" + uniqueId);
        sessionStorage.removeItem("selectedInfoProvider-" + uniqueId);
        sessionStorage.removeItem("minimalInfoProvObjects-" + uniqueId);
        sessionStorage.removeItem("availableScenes-" + uniqueId);
        sessionStorage.removeItem("sceneList-" + uniqueId);
    }


    /**
     * setup for error notification
     */
    const [message, dispatchMessage] = React.useReducer(centerNotifcationReducer, {
        open: false,
        message: "",
        severity: "error",
    });

    const reportError = React.useCallback((message: string) => {
        dispatchMessage({type: "reportError", message: message});
    }, [dispatchMessage])

    /**
     * Handler method for the proceed/continue buttons. Increments the step by 1
     * and triggers sending the videojob to the backend when the end is reached.
     */
    const continueHandler = () => {
        if (videoCreationStep === 2) sendVideoToBackend();
        else setVideoCreationStep(videoCreationStep + 1);
    }

    /**
     * Handler method for back buttons. Decrements the step by 1 and returns
     * to the dashboard when clicking back on the first step.
     */
    const backHandler = () => {
        if(videoCreationStep === 0) {
            clearSessionStorage()
            components?.setCurrent("dashboard")
        } else {
            setVideoCreationStep(videoCreationStep -1)
        }
    }


    /**
     * Method block for fetching all infoproviders from the backend
     */

    /**
     * Handles the error-message if an error appears while fetching with fetchAllInfoprovider().
     * @param err The error returned by the backend
     */
    const handleErrorFetchInfoProvider = React.useCallback((err: Error) => {
        reportError("Fehler: " + err)
    }, [reportError])

    /**
     * Handles the success of the fetchAllInfoprovider()-method.
     * The json from the response will be transformed to an array of jsonRefs and saved in infoprovider.
     * @param jsonData the answer from the backend
     */
    const handleSuccessFetchInfoProvider = (jsonData: any) => {
        const data = jsonData as FetchAllInfoProviderAnswer;
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
    }, [handleErrorFetchInfoProvider])

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
     * Handles the success of the fetchAllScenes()-method.
     * The json from the response will be looped trough to copy all scene names to the availableScenes state.
     * Goes to the next step afterwards since it is called from the proceed of step 1.
     * @param jsonData the answer from the backend
     */
    const fetchAllScenesSuccess = (jsonData: any) => {
        const data = jsonData as FetchAllScenesAnswer;
        const availableScenes: Array<string> = [];
        data.forEach((scene) => availableScenes.push(scene.scene_name));
        //setAvailableScenes(availableScenes); //TODO: comment in once testing is done
        continueHandler();
    }

    /**
     * Handles errors of the fetchAllInfoprovider()-method by displaying an error message.
     * @param err The error that the backend sent
     */
    const fetchAllScenesError = (err: Error) => {
        reportError("Fehler beim Laden aller Szenen: " + err)
    }

    /**
     * Method that fetches all available scenes from the backend to
     * display them in the videoCreation.
     */
    const fetchAllScenes = useCallFetch("/visuanalytics/scene/all",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json\n"
            }
        },
        fetchAllScenesSuccess, fetchAllScenesError
    )


    /**
     * Method block for sending the created videojob to the backend.
     */

    /**
     * Method that creates the object with all scenes displayed as "images" necessary for the backend.
     */
    const createImagesObject = () => {
        console.trace()
        //TODO: possibly find smarter solution without any type
        const imagesObject: any = {};
        //index to label each scene - secures the ordering and allows use the same scene multiple times
        let index = 1;
        sceneList.forEach((scene) => {
            //find the frequency, take its value und increment it
            imagesObject[index++ + "_" + scene.sceneName] = {
                key: scene.sceneName
            }
        })
        console.log(imagesObject);
        return imagesObject;
    }

    /**
     * Method that creates the object with all audios necessary for the backend.
     */
    const createAudiosObject = () => {
        //TODO: possibly find smarter solution without any type
        const audioObject: any = {};
        let index = 1;
        sceneList.forEach((scene) => {
            const parts: Array<BackendAudioType> = [];
            //for each text and pause, add a part to the configuration
            scene.spokenText.forEach((audioElement) => {
                if(audioElement.type === "text") {
                    parts.push({
                        type: "text",
                        pattern: audioElement.text
                    })
                } else {
                    parts.push({
                        type: "silent",
                        duration: audioElement.duration
                    })
                }
            })
            //after all texts and pauses were included, add a silent track for the exceed duration
            if(scene.exceedDisplayDuration > 0) {
                parts.push({
                    type: "silent",
                    duration: scene.exceedDisplayDuration
                })
            }
            audioObject["audio" + index++] = {
                parts: parts
            }
        })
        return audioObject;
    }

    //TODO: check the status of the answer
    /**
     * Handler method for success on posting the video to the backend.
     * @param jsonData The answer returned by the backend.
     */
    const sendVideoSuccessHandler = (jsonData: any) => {
        components?.setCurrent("dashboard")
    }

    /**
     * Handler method for errors when posting the video to the backend.
     * @param err The error sent from the backend.
     */
    const sendVideoErrorHandler = (err: Error) => {
        reportError("Fehler beim Absenden des Videos: " + err)
    }

    /**
     * Method to send the completed videojob to the backend.
     * The standard hook "useCallFetch" is not used here because it caused calls of the functions
     * called inside of it on every render.
     */
    const sendVideoToBackend = () => {
        let url = "visuanalytics/videojob";
        //if this variable is set, add it to the url
        if (process.env.REACT_APP_VA_SERVER_URL) url = process.env.REACT_APP_VA_SERVER_URL + url
        //setup a timer to stop the request after 5 seconds
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 5000);
        //starts fetching the contents from the backend
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json\n"
            },
            body: JSON.stringify({
                videojob_name: videoJobName,
                images: createImagesObject(),
                audio: {
                    audios: createAudiosObject()
                },
                sequence: {
                    type: "successively",
                    transitions: 0.1
                },
                schedule: {
                    type: schedule.type,
                    time: schedule.time,
                    date: "",
                    time_interval: schedule.interval,
                    weekdays: schedule.weekdays
                }
            }),
            signal: abort.signal
        }).then((res: Response) => {
            //handles the response and gets the data object from it
            if (!res.ok) throw new Error(`Network response was not ok, status: ${res.status}`);
            return res.status === 204 ? {} : res.json();
        }).then((data) => {
            //success case - the data is passed to the handler
            //only called when the component is still mounted
            if (isMounted.current) sendVideoSuccessHandler(data)
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted.current) sendVideoErrorHandler(err)
        }).finally(() => clearTimeout(timer));
    }

    /**
     * Method that selects which component should be shown by evaluating the current step.
     */
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
                        setMinimalInfoProvObjects={(objects: Array<MinimalInfoProvider>) => setMinimalInfoProvObjects(objects)}
                        reportError={(message: string) => reportError(message)}
                        fetchAllScenes={() => fetchAllScenes()}
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
                        minimalInfoproviders={minimalInfoProvObjects}
                    />
                )
            }
            case 2: {
                return (
                    <ScheduleSelection
                        continueHandler={() => continueHandler()}
                        backHandler={() => backHandler()}
                        schedule={schedule}
                        setSchedule={(schedule: Schedule) => setSchedule(schedule)}
                    />
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
