import React from "react";

import {ComponentContext} from "../ComponentProvider";

import {centerNotifcationReducer, CenterNotification} from "../util/CenterNotification";

import {StepFrame} from "../CreateInfoProvider/StepFrame";
import Grid from "@material-ui/core/Grid";
import {ListItem, ListItemText} from "@material-ui/core";


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
            <Grid container style={{width: "100%", margin: "auto"}}>
                <Grid item xs={12}>
                    <SceneContainer></SceneContainer>
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
