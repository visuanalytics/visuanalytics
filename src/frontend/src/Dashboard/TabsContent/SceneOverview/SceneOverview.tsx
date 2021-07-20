import React from "react";
import {StepFrame} from "../../../CreateInfoProvider/StepFrame";
import {hintContents} from "../../../util/hintContents";
import {Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography} from "@material-ui/core";
import {useStyles} from "../../style";
import Button from "@material-ui/core/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {BackendScene, FullScene, PreviewImage} from "../../types";
import {centerNotifcationReducer, CenterNotification} from "../../../util/CenterNotification";
import {SceneList} from "./SceneList";
import {useCallFetch} from "../../../Hooks/useCallFetch";
import {ComponentContext} from "../../../ComponentProvider";

interface SceneOverviewProps {
    scenes: Array<BackendScene>;
    previewImgList: Array<PreviewImage>;
}

export const SceneOverview: React.FC<SceneOverviewProps> = (props) => {

    const classes = useStyles();
    const components = React.useContext(ComponentContext);

    //TODO: add sessionStorage support

    const [scenes, setScenes] = React.useState<Array<BackendScene>>(props.scenes);

    const [previewImgList, setPreviewImgList] = React.useState<Array<PreviewImage>>(props.previewImgList);

    const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

    const [currentImg, setCurrentImg] = React.useState("");

    const [currentScene, setCurrentScene] = React.useState<BackendScene>({} as BackendScene)

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

    const handleFetchSceneSuccess = (jsonData: any) => {
        const data = jsonData as FullScene;
        //console.log(data);
        components?.setCurrent("sceneEditor", {sceneFromBackend: data, editId: currentScene.scene_id})
        //TODO: change component with the fetched Scene in props...
    };

    const handleErrorFetchSceneError = (err: Error) => {
        reportError("Ein Fehler ist aufgetreten!" + err);
    }

    const fetchSceneById = useCallFetch("visuanalytics/scene/" + currentScene.scene_id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json\n"
            }
        }, handleFetchSceneSuccess, handleErrorFetchSceneError
    );


    /**
     * this method is used to set currentScene and currentImg. These are used to display right information
     * in the detailDialog
     * @param data the jsonRefScene-Object that should be set to current.
     * @param index Index of the entry in the list
     */
    const setCurrent = (data: BackendScene, index: number) => {
        //TODO: implement method to find the right preview-image for the given SceneId
        //console.log(data.scene_id)
        setCurrentScene(data);
        setCurrentImg(previewImgList[index].URL);
    }

    const handleSuccessDelete = () => {

        setScenes(
            scenes.filter((data) => {
                return data.scene_id !== currentScene.scene_id
            })
        );

        //-1 because scene_id starts with 1.
        setPreviewImgList(previewImgList.splice((currentScene.scene_id - 1), 1));

        setDeleteDialogOpen(false);
        setDetailDialogOpen(false);
    }

    const handleErrorDelete = (err: Error) => {
        reportError("Ein Fehler ist aufgetreten!: " + err);
    }


    const deleteSceneInBackend = useCallFetch("visuanalytics/scene/" + currentScene.scene_id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json\n"
            }
        }, handleSuccessDelete, handleErrorDelete
    );

    return (
        <StepFrame
            heading="Willkommen bei VisuAnalytics!"
            hintContent={hintContents.sceneOverview}
        >
            <Grid container justify="space-evenly" className={classes.elementLargeMargin}>
                <Grid item xs={4}>
                    <Typography variant={"h5"}>
                        Angelegte Szenen:
                    </Typography>
                </Grid>
                <Grid item container xs={4} justify={"flex-end"}>
                    <Grid item>
                        <Button variant={"contained"} size={"large"} color={"secondary"}
                                startIcon={<AddCircleIcon fontSize="small"/>}
                                onClick={() => components?.setCurrent("sceneEditor")}
                        >
                            Neue Szene erstellen
                        </Button>
                    </Grid>
                </Grid>
                <Grid item container xs={12} justify={"center"}>
                    <SceneList
                        scenes={scenes}
                        previewImgList={previewImgList}
                        setDetailDialogOpen={(flag: boolean) => setDetailDialogOpen(flag)}
                        setCurrent={(data: BackendScene, index: number) => setCurrent(data, index)}
                    />
                </Grid>
            </Grid>
            <Dialog
                onClose={() => {
                    setDetailDialogOpen(false);
                    window.setTimeout(() => {}, 200);}
                }
                aria-labelledby="deleteDialog-title"
                open={detailDialogOpen}
                maxWidth={"md"}
                fullWidth={true}
            >
                <DialogTitle id="deleteDialog-title">
                    {currentScene.scene_name}
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container justify={"center"}>
                        <Grid item>
                            <img width="480" height="270" alt="Vorschaubild Diagramm" src={currentImg}/>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid container justify="space-between">
                        <Grid item>
                            <Button variant="contained"
                                    color={"secondary"}
                                    onClick={() => fetchSceneById()}
                            >
                                Bearbeiten
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color={"primary"} onClick={() => {
                                setDetailDialogOpen(false);
                            }}>
                                zurück
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained"
                                    className={classes.redDeleteButton}
                                    onClick={() => setDeleteDialogOpen(true)}
                            >
                                Löschen
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
            <Dialog
                onClose={() => {
                    setDeleteDialogOpen(false);
                    window.setTimeout(() => {}, 200);}
                }
                aria-labelledby="deleteDialog-title"
                open={deleteDialogOpen}
            >
                <DialogTitle id="deleteDialog-title">
                    {currentScene.scene_name}
                </DialogTitle>
                <DialogContent dividers>
                    Wollen sie "{currentScene.scene_name}" wirklich löschen?
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
                                    onClick={() => deleteSceneInBackend()}
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
