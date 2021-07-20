import React from "react";
import {StepFrame} from "../../../CreateInfoProvider/StepFrame";
import {hintContents} from "../../../util/hintContents";
import {Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography} from "@material-ui/core";
import {useStyles} from "../../style";
import Button from "@material-ui/core/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {ComponentContext} from "../../../ComponentProvider";
import {BackendVideo, BackendVideoList} from "../../types";
import {VideoList} from "./VideoList";
import {useCallFetch} from "../../../Hooks/useCallFetch";
import {centerNotifcationReducer, CenterNotification} from "../../../util/CenterNotification";

interface VideoOverviewProps {
    videos: BackendVideoList;
}

export const VideoOverview: React.FC<VideoOverviewProps> = (props) => {

    const classes = useStyles();
    const components = React.useContext(ComponentContext);

    const [videos, setVideos] = React.useState<BackendVideoList>(props.videos);

    const [currentDeleteVideo, setCurrentDeleteVideo] = React.useState<BackendVideo>({} as BackendVideo);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

    /**
     * setup for error notification
     */
    const [message, dispatchMessage] = React.useReducer(centerNotifcationReducer, {
        open: false,
        message: "",
        severity: "error",
    });

    const reportError = (message: string) => {
        dispatchMessage({ type: "reportError", message: message });
    };

    const handleSuccessDelete = () => {

        setVideos(
            videos.filter((data) => {
                return data.videojob_id !== currentDeleteVideo.videojob_id
            })
        );

        setDeleteDialogOpen(false);

    }

    const handleErrorDelete = (err: Error) => {
        reportError("Ein Fehler ist aufgetreten!: " + err);
    }

    const deleteVideoInBackend = useCallFetch("visuanalytics/videojob/" + currentDeleteVideo.videojob_id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json\n"
            }
        }, handleSuccessDelete, handleErrorDelete
    );

    const handleDeleteVideo = (video: BackendVideo) => {
        setCurrentDeleteVideo(video);
        setDeleteDialogOpen(true);
    }

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
                        videos={videos}
                        handleDeleteVideo={(video: BackendVideo) => handleDeleteVideo(video)}
                    />
                </Grid>
            </Grid>
            <Dialog
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setCurrentDeleteVideo({} as BackendVideo)
                    window.setTimeout(() => {}, 200);}
                }
                aria-labelledby="deleteDialog-title"
                open={deleteDialogOpen}
            >
                <DialogTitle id="deleteDialog-title">
                    {currentDeleteVideo.videojob_name}
                </DialogTitle>
                <DialogContent dividers>
                    Wollen sie "{currentDeleteVideo.videojob_name}" wirklich löschen?
                </DialogContent>
                <DialogActions>
                    <Grid container justify="space-between">
                        <Grid item>
                            <Button variant="contained"
                                    color={"secondary"}
                                    onClick={() => setDeleteDialogOpen(false)}
                            >
                                Zurück
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained"
                                    className={classes.redDeleteButton}
                                    onClick={() => deleteVideoInBackend()}
                            >
                                Löschen
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
            <CenterNotification
                handleClose={() => dispatchMessage({type: "close"})}
                open={message.open}
                message={message.message}
                severity={message.severity}
            />
        </StepFrame>
    );

}
