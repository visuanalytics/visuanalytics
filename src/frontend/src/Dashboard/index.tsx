import React, {useEffect, useRef} from "react";
import {
    AppBar, Grid, Tab, Tabs
} from "@material-ui/core";
import {useStyles} from "./style";
import {
    AirplayRounded, CropOriginalRounded, OndemandVideoRounded
} from "@material-ui/icons";
import {InfoProviderOverview} from "./TabsContent/InfoProviderOverview/InfoProviderOverview";
import {SceneOverview} from "./TabsContent/SceneOverview/SceneOverview"
import {VideoOverview} from "./TabsContent/VideoOverview/VideoOverview"
import {FetchAllScenesAnswer, BackendScene, PreviewImage} from "./types";
import {centerNotifcationReducer, CenterNotification} from "../util/CenterNotification";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import {StepFrame} from "../CreateInfoProvider/StepFrame";

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

//TODO: possibly split the three definitions in separate files
/**
 * Component to render the content in one tab. Value and index are used to switch correct between all tabs.
 */
export const TabContent: React.FC<TabPanelProps> = (props) => {
    const {children, value, index} = props;

    return (
        <Grid item>
            {value === index && (
                <Grid item>
                    {children}
                </Grid>
            )}
        </Grid>
    );
}

/**
 * Renders the tabs shown in the dashboard. Main elements are the AppBar that is holding the tabs,
 * the tabs itself and the icons and content shown in one tab
 */
export const DashboardTabs = () =>  {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        if (newValue === 1) {
            fetchAllScenes();
        } else
            setValue(newValue);
    };

    //true if the spinner animation is displayed - used for waiting while the scenes are fetched
    const [displaySpinner, setDisplaySpinner] = React.useState(false);
    //moutable list of all scenes - fetched from the backend
    const allScenes = React.useRef<Array<BackendScene>>([]);
    //mutable list of scenes that still need to be fetched - fetching all previews works through this list
    const scenesToFetch = React.useRef<Array<BackendScene>>([]);
    //list of all preview images (one for each scene) with ID and image URL
    const previewImgList = React.useRef<Array<PreviewImage>>([]);
    //id of the currently fetched image
    const currentFetchId = React.useRef<number>(-1);


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

    const reportError = (message: string) => {
        dispatchMessage({ type: "reportError", message: message });
    };

    /**
     * Handler for errors for fetching all scenes from the backend.
     * @param err the shown error
     */
    const handleErrorFetchAll = (err: Error) => {
        reportError('Fehler: ' + err);
    }

    /**
     * Handles the success of the fetchAllScenes()-method.
     * The json from the response will be transformed to an array of BackendScene and saved in allScenes.
     * @param jsonData the answer from the backend
     */
    const handleSuccessFetchAll = (jsonData: any) => {
        const data = jsonData as FetchAllScenesAnswer;
        //save the answer in allScenes
        allScenes.current = data;
        //set the list of scenes to fetch
        scenesToFetch.current = data;
        //activate the spinner animation while loading
        setDisplaySpinner(true);
        //start fetching all preview images
        fetchPreviewImages();
    }

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
     * The method is used to fetch the preview-image at the given id. The answer will be transformed via blob() and shows
     * the right image-path.
     * @param id the id to find the right scene
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
     * The success-handle of fetchPreviewImgById(). The URL will be saved in previewImgList.
     * @param data the answer from fetchPreviewImgById()
     */
    const handleFetchImageByIdSuccess = (data: any) => {
        previewImgList.current.push({
            URL: URL.createObjectURL(data),
            id: currentFetchId.current
        });
        fetchPreviewImages();
    }

    /**
     * The error-handler of fetchPreviewImgById(). The Error will be shown to the user.
     * @param err the error form fetchPreviewImgById()
     */
    const handleFetchImageByIdError = (err: Error) => {
        reportError("Fehler: " + err);
        //deactivate the spinner to return to the previous dashboard tab
        setDisplaySpinner(false);
    }


    /**
     * Method that fetches all preview images for scenes from the backend.
     * Recursively goes through scenesToFetch and gets all scenes that are left.
     * When no scene is left, it disables the spinner and sets the value of the tab to scenes.
     */
    const fetchPreviewImages = () => {
        if (scenesToFetch.current.length === 0) {
            setDisplaySpinner(false);
            setValue(1);
        } else {
            const nextId = scenesToFetch.current[0].scene_id;
            scenesToFetch.current = scenesToFetch.current.filter((scene) => {
                return scene.scene_id !== nextId;
            })
            currentFetchId.current = nextId;
            fetchPreviewImgById(nextId);
        }
    }


    return (
        <Grid item xs={12}>
            <Grid item container xs={12} justify={"center"}>
                <AppBar position="static" className={classes.tab}>
                    <Tabs centered variant={'fullWidth'} value={value} onChange={handleChange}
                          className={classes.tabs} >
                        <Tab icon={<AirplayRounded/>} label="Info-Provider" className={classes.tabs}/>
                        <Tab icon={<CropOriginalRounded/>} label="Szenen" className={classes.tabs}/>
                        <Tab icon={<OndemandVideoRounded/>} label="Videojobs" className={classes.tabs}/>
                    </Tabs>
                </AppBar>
            </Grid>
            { displaySpinner &&
                <StepFrame
                    heading={"Willkommen bei Visuanalytics!"}
                    hintContent={null}
                >
                    <Grid item container xs={12} justify="space-around">
                        <Grid item xs={12}>
                            <Typography variant="h6">
                                Bitte warten, während die Szenen geladen werden ...
                            </Typography>
                        </Grid>
                        <Grid item xs={2} className={classes.elementLargeMargin}>
                            <CircularProgress size={100}/>
                        </Grid>

                    </Grid>

                </StepFrame>
            }
            { !displaySpinner &&
            <React.Fragment>
                <Grid item xs={12}>
                    <TabContent value={value} index={0}>
                        <InfoProviderOverview/>
                    </TabContent>
                </Grid>
                <Grid item xs={12}>
                    <TabContent value={value} index={1}>
                        <SceneOverview
                            scenes={allScenes.current}
                            previewImgList={previewImgList.current}
                        />
                    </TabContent>
                </Grid>
                <Grid item xs={12}>
                    <TabContent value={value} index={2}>
                        <VideoOverview test={'Videos'}/>
                    </TabContent>
                </Grid>
            </React.Fragment>
            }
            <CenterNotification
                handleClose={() => dispatchMessage({type: "close"})}
                open={message.open}
                message={message.message}
                severity={message.severity}
            />
        </Grid>
    );
}

/**
 * Used to put all together and renders dashboard within the other components.
 */
export const Dashboard = () => {
    const classes = useStyles();

    return (
        <Grid container justify="space-evenly" className={classes.elementLargeMargin}>
            <Grid item container xs={12}>
                {DashboardTabs()}
            </Grid>
        </Grid>

    );
};
