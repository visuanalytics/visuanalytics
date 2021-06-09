import React from "react";

import {ComponentContext} from "../ComponentProvider";

import {centerNotifcationReducer, CenterNotification} from "../util/CenterNotification";

import {StepFrame} from "../CreateInfoProvider/StepFrame";
import Grid from "@material-ui/core/Grid";
import {ListItem, ListItemText} from "@material-ui/core";

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {DraggableScene} from "./DraggableScene";
import {RemoveField} from "./RemoveField";
import {SceneContainer} from "./SceneContainer";

interface VideoEditorProps {

}


export const VideoEditor: React.FC<VideoEditorProps> = (/*{ infoProvId, infoProvider}*/) => {

    const components = React.useContext(ComponentContext);


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
            <DndProvider backend={HTML5Backend}>
                <Grid container style={{width: "100%", margin: "auto"}}>
                    <Grid item xs={12}>
                        <SceneContainer></SceneContainer>
                    </Grid>
                    <Grid item xs={12} style={{height: "100px"}}>
                        <RemoveField></RemoveField>
                    </Grid>
                </Grid>
            </DndProvider>
            <CenterNotification
                handleClose={() => dispatchMessage({type: "close"})}
                open={message.open}
                message={message.message}
                severity={message.severity}
            />
        </StepFrame>
    )
}
