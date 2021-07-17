import React from "react";
import {StepFrame} from "../../../CreateInfoProvider/StepFrame";
import {hintContents} from "../../../util/hintContents";
import {Grid, Typography} from "@material-ui/core";
import {useStyles} from "../../style";
import Button from "@material-ui/core/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {ComponentContext} from "../../../ComponentProvider";
import {BackendVideoList} from "../../types";
import {VideoList} from "./VideoList";
import {centerNotifcationReducer, CenterNotification} from "../../../util/CenterNotification";

interface VideoOverviewProps {
    videos: BackendVideoList;
}

export const VideoOverview: React.FC<VideoOverviewProps> = (props) => {

    const classes = useStyles();
    const components = React.useContext(ComponentContext);

    //TODO: possibly place in higher level component
    /**
     * setup for error notification
     */
    const [message, dispatchMessage] = React.useReducer(centerNotifcationReducer, {
        open: false,
        message: "",
        severity: "error",
    });

    const reportError = React.useCallback((message: string) => {
        dispatchMessage({ type: "reportError", message: message });
    }, []);

    return(
        <StepFrame
            heading="Willkommen bei VisuAnalytics!"
            hintContent={hintContents.videoOverview}
        >
            <Grid container justify="space-evenly" className={classes.elementLargeMargin}>
                <Grid item xs={4}>
                    <Typography variant={"h5"}>
                        Erstellte Videojobs:
                    </Typography>
                </Grid>
                <Grid item container xs={4} justify={"flex-end"}>
                    <Grid item>
                        <Button variant={"contained"} size={"large"} color={"secondary"}
                                startIcon={<AddCircleIcon fontSize="small"/>}
                                onClick={() => components?.setCurrent("videoCreator")}
                        >
                            Neuen Videojob erstellen
                        </Button>
                    </Grid>
                </Grid>
                <Grid item container xs={12} justify={"center"}>
                    <VideoList
                        videos={props.videos}
                        reportError={(message: string) => reportError(message)}
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
    );

}
