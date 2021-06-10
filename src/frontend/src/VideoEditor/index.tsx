import React from "react";
import {SceneContainer} from "./SceneContainer";
import {SceneCardData} from "./types";
import {centerNotifcationReducer, CenterNotification} from "../util/CenterNotification";
import {StepFrame} from "../CreateInfoProvider/StepFrame";
import {ComponentContext} from "../ComponentProvider";
import Grid from "@material-ui/core/Grid";


interface VideoEditorProps {

}


export const VideoEditor: React.FC<VideoEditorProps> = (/*{ infoProvId, infoProvider}*/) => {

    const components = React.useContext(ComponentContext);

    //list of the names of all scenes available - holds the data fetched from the backend
    const [availableScenes, setAvailableScenes] = React.useState<Array<string>>([]);

    // sorted list of all scenes that are selected for the video
    const [sceneList, setSceneList] = React.useState<Array<SceneCardData>>([
        {entryId: "Szene_1||0", sceneName: "Szene_1", displayDuration: 5, spokenText: "", visible: true},
        {entryId: "Szene_2||0", sceneName: "Szene_2", displayDuration: 1, spokenText: "", visible: true},
        {entryId: "Szene_3||0", sceneName: "Szene_3", displayDuration: 1, spokenText: "", visible: true},
        {entryId: "Szene_4||0", sceneName: "Szene_4", displayDuration: 1, spokenText: "", visible: true},
        {entryId: "Szene_5||0", sceneName: "Szene_5", displayDuration: 1, spokenText: "", visible: true},
        {entryId: "Szene_6||0", sceneName: "Szene_6", displayDuration: 1, spokenText: "", visible: true},
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
    
    return (
        <StepFrame
            heading={"Video-Editor"}
            hintContent={null}
            large={true}
        >
            <Grid container style={{width: "100%", margin: "auto"}}>
                <Grid item xs={12}>
                    <SceneContainer
                        sceneList={sceneList}
                        setSceneList={(sceneList: Array<SceneCardData>) => setSceneList(sceneList)}
                    />
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
