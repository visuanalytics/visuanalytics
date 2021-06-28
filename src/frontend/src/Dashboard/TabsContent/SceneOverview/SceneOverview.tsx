import React, {useEffect, useRef} from "react";
import {StepFrame} from "../../../CreateInfoProvider/StepFrame";
import {hintContents} from "../../../util/hintContents";
import {Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography} from "@material-ui/core";
import {useStyles} from "../../style";
import Button from "@material-ui/core/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {fetchAllScenesAnswer, jsonRefScene} from "../../types";
import {centerNotifcationReducer, CenterNotification} from "../../../util/CenterNotification";
import {SceneList} from "./SceneList";

interface SceneOverviewProps {
}

export const SceneOverview: React.FC<SceneOverviewProps> = (props) => {

    const classes = useStyles();

    //saves all scenes
    const [scenes, setScenes] = React.useState(new Array<jsonRefScene>());
    //all image-URLs
    const [previewImgList, setPreviewImgList] = React.useState(new Array<string>());

    const allScenes = React.useRef<Array<jsonRefScene>>([]);

    const scenePreviewImgURLs = React.useRef<Array<string>>([]);

    const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);

    const [currentImg, setCurrentImg] = React.useState("");

    const [currentScene, setCurrentScene] = React.useState<jsonRefScene>({scene_id: -1, scene_name: ""})

    //this static value will be true as long as the component is still mounted
    //used to check if handling of a fetch request should still take place or if the component is not used anymore
    const isMounted = useRef(true);

    /**
     * setup for error notification
     */
    const [message, dispatchMessage] = React.useReducer(centerNotifcationReducer, {
        open: false,
        message: "",
        severity: "error",
    });

    /**
     * Method to fetch all scenes from the backend.
     * The standard hook "useCallFetch" is not used here since the fetch function has to be memorized
     * with useCallback in order to be used in useEffect.
     */
    const fetchAllScenes = React.useCallback(() => {
        let url = "/visuanalytics/scene/all"
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
            if (isMounted.current) {
                handleSuccessFetchAll(data)
            }
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted.current) handleErrorFetchAll(err)
        }).finally(() => clearTimeout(timer));
    }, [])

    //defines a cleanup method that sets isMounted to false when unmounting
    //will signal the fetchMethod to not work with the results anymore
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    /**
     * The list of scenes is generated automatically when the component is shown.
     */
    React.useEffect(() => {
            //console.log("Fetcher hook here")
            fetchAllScenes();
        }, [fetchAllScenes]
    );

    /**
     * Handles the error-message if an error appears.
     * @param err the shown error
     */
    const handleErrorFetchAll = (err: Error) => {
        dispatchMessage({type: "reportError", message: 'Fehler: ' + err});
    }

    /**
     * Handles the success of the fetchAllScenes()-method.
     * The json from the response will be transformed to an array of jsonRefScenes and saved in Scenes and allScenes.
     * @param jsonData the answer from the backend
     */
    const handleSuccessFetchAll = (jsonData: any) => {
        jsonData = [
            {"scene_id": 1, "scene_name": "tristan_der_aal"},
            {"scene_id": 2, "scene_name": "ein_szenen_test"},
            {"scene_id": 3, "scene_name": "und_noch_ein_test"},
            {"scene_id": 4, "scene_name": "ka_was_hier_stehen_soll"}
        ];

        const data = jsonData as fetchAllScenesAnswer;
        allScenes.current = data;
        setScenes(data);
    }

    /**
     * The method is used to fetch the preview-image at the given id. The answer will be transformed via blob() and shows
     * the right image-path.
     * @param id the id to find the right image
     */
    const fetchPreviewImgById = (id: number) => {
        //TODO: implement right route and cut "- 1"
        //"id - 1" is used here because the scene-id starts by 1 and the images-id ist starting by 0.
        //in the end the scene-id and the images-id will match
        //the right route has to be implemented in the backend
        console.log(id + " in fetchPreviewImgById");
        let url = "/visuanalytics/image/" + (id - 1)
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
            return res.status === 204 ? {} : res.blob();
        }).then((data) => {
            //success case - the data is passed to the handler
            //only called when the component is still mounted
            if (isMounted.current) {
                handleFetchImageByIdSuccess(data)
            }
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted.current) handleFetchImageByIdError(err)
        }).finally(() => clearTimeout(timer));
    }

    /**
     * The success-handle of fetchPreviewImgById(). The URL will be saved in previewImgURLs.
     * @param data the answer from fetchPreviewImgById()
     */
    const handleFetchImageByIdSuccess = (data: any) => {
        scenePreviewImgURLs.current.push(URL.createObjectURL(data));

        fetchPreviewImages();
    }

    /**
     * The error-handler of fetchPreviewImgById(). The Error will be shown to the user.
     * @param err the error form fetchPreviewImgById()
     */
    const handleFetchImageByIdError = (err: Error) => {
        console.log("Fehler: " + err)
    }

    /**
     * This method will call fetchPreviewImgById() for the first element of allScenes.
     */
    const fetchPreviewImages = () => {
        if (allScenes.current.length === 0) {
            setPreviewImgList(scenePreviewImgURLs.current);
            console.log("imgList: ----------> " + scenePreviewImgURLs.current);
        } else {
            const nextId = allScenes.current[0].scene_id;

            allScenes.current = allScenes.current.filter((scene) => {
                return scene.scene_id !== nextId;
            })

            fetchPreviewImgById(nextId);
        }
    }

    /**
     * this method is used to set currentScene and currentImg. These are used to display right information
     * in the detailDialog
     * @param data the jsonRefScene-Object that should be set to current.
     */
    const setCurrent = (data: jsonRefScene) => {
        //TODO: implement method to find the right preview-image for the given SceneId
        setCurrentScene(data);
        setCurrentImg(previewImgList[data.scene_id - 1]);
    }

    return (
        <StepFrame
            heading="Willkommen bei VisuAnalytics!"
            hintContent={hintContents.sceneOverview}
        >
            <Grid container justify="space-evenly" className={classes.elementLargeMargin}>
                <Grid item container xs={12}>
                    Scene-Overview
                </Grid>
                <Grid item xs={4}>
                    <Typography variant={"h5"}>
                        Angelegte Szenen:
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Button variant={"contained"} size={"large"} color={"secondary"}
                            onClick={fetchPreviewImages}
                    >
                        Szenen laden
                    </Button>
                </Grid>
                <Grid item container xs={4} justify={"flex-end"}>
                    <Grid item>
                        <Button variant={"contained"} size={"large"} color={"secondary"}
                                startIcon={<AddCircleIcon fontSize="small"/>}>
                            Neue Szene erstellen
                        </Button>
                    </Grid>
                </Grid>
                <Grid item container xs={12} justify={"center"}>
                    <SceneList
                        scenes={scenes}
                        previewImgList={previewImgList}
                        setDetailDialogOpen={(flag: boolean) => setDetailDialogOpen(flag)}
                        setCurrent={(data: jsonRefScene) => setCurrent(data)}
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
                                    onClick={() => dispatchMessage({type: "reportError", message: 'Edit not implemented'})}
                            >
                                Bearbeiten
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color={"primary"} onClick={() => setDetailDialogOpen(false)}>
                                zurück
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained"
                                    className={classes.redDeleteButton}
                                    onClick={() => dispatchMessage({type: "reportError", message: 'Delete not implemented'})}
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
