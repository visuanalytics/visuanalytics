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
import {centerNotifcationReducer} from "../util/CenterNotification";
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

    const [displaySpinner, setDisplaySpinner] = React.useState(false);


    const allScenes = React.useRef<Array<BackendScene>>([]);

    const scenesToFetch = React.useRef<Array<BackendScene>>([]);

    const previewImgList = React.useRef<Array<PreviewImage>>([]);

    const currentFetchId = React.useRef<number>(-1);


    //this static value will be true as long as the component is still mounted
    //used to check if handling of a fetch request should still take place or if the component is not used anymore
    const isMounted = useRef(true);

    /* <========================================================================================================================================================>*/

    /**
     * setup for error notification
     */
    const [message, dispatchMessage] = React.useReducer(centerNotifcationReducer, {
        open: false,
        message: "",
        severity: "error",
    });

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
        /*jsonData = [
            {"scene_id": 1, "scene_name": "tristan_der_aal"},
            {"scene_id": 2, "scene_name": "ein_szenen_test"},
            {"scene_id": 3, "scene_name": "und_noch_ein_test"},
            {"scene_id": 4, "scene_name": "ka_was_hier_stehen_soll"}
        ];*/

        const data = jsonData as FetchAllScenesAnswer;
        allScenes.current = data;
        scenesToFetch.current = data;
        console.log(scenesToFetch.current)
        setDisplaySpinner(true);
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

    /* <========================================================================================================================================================>*/


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
        console.log("Fehler: " + err);
        setDisplaySpinner(false);
    }


    /**
     * This method will call fetchPreviewImgById() for the first element of allScenes.
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
