import React, {useEffect, useRef} from "react";
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
import {InfoProviderFromBackend} from "../../../CreateInfoProvider/types";
import {transformBackendInfoProvider} from "../../../CreateInfoProvider/helpermethods";

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



    //TODO: document this

    //this static value will be true as long as the component is still mounted
    //used to check if handling of a fetch request should still take place or if the component is not used anymore
    const isMounted = useRef(true);

    const handleFetchInfoProviderSuccess = (jsonData: any, scene: FullScene) => {
        //get the infoprovider used by the scene and fetch its data
        const data = jsonData as InfoProviderFromBackend;
        //transform the infoProvider to frontend format
        const infoProvider = transformBackendInfoProvider(data);
        components?.setCurrent("sceneEditor", {sceneFromBackend: {
            ...scene,
            infoProvider: infoProvider
        }, editId: currentScene.scene_id})
    };

    const handleFetchInfoProviderError = (err: Error) => {
        reportError("Fehler beim Laden des Infoproviders: " + err);
    }

    /**
     * Method to send a diagram to the backend for testing.
     * The standard hook "useCallFetch" is not used here since we need an input parameter.
     */
    const fetchInfoProvider = (id: number, scene: FullScene) => {
        //console.log("fetcher called");
        let url = "/visuanalytics/infoprovider/" + id;
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
            if (isMounted.current) handleFetchInfoProviderSuccess(data, scene)
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted.current) handleFetchInfoProviderError(err)
        }).finally(() => clearTimeout(timer));
    }

    //defines a cleanup method that sets isMounted to false when unmounting
    //will signal the fetchMethod to not work with the results anymore
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleFetchSceneSuccess = (jsonData: any) => {
        const data = jsonData as FullScene;
        //console.log(data);
        //get the infoprovider used by the scene and fetch its data
        if(data.used_infoproviders[0] !== undefined) {
            fetchInfoProvider(data.used_infoproviders[0], data)
        } else {
            //for the case that in the future no infoproviders are allowed
            components?.setCurrent("sceneEditor", {sceneFromBackend: data, editId: currentScene.scene_id})
        }
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

        console.log(currentScene.scene_id + " SCENE_ID");
        console.log(previewImgList.length + " LÄNGE")

        setScenes(
            scenes.filter((data) => {
                return data.scene_id !== currentScene.scene_id
            })
        );

        setPreviewImgList(
            previewImgList.filter((data) => {
                return data.id !== currentScene.scene_id
            })
        );

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
