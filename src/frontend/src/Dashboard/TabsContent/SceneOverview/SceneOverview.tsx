import React, {useEffect, useRef} from "react";
import {StepFrame} from "../../../CreateInfoProvider/StepFrame";
import {hintContents} from "../../../util/hintContents";
import {Grid, Typography} from "@material-ui/core";
import {useStyles} from "../../style";
import Button from "@material-ui/core/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {fetchAllScenesAnswer, jsonRefScene} from "../../types";
import {centerNotifcationReducer, CenterNotification} from "../../../util/CenterNotification";
import {SceneList} from "./SceneList";

interface SceneOverviewProps {
    test: string;
}

export const SceneOverview: React.FC<SceneOverviewProps> = (props) => {

    const classes = useStyles();

    const [scenes, setScenes] = React.useState(new Array<jsonRefScene>());

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
     * Method to fetch all infoproviders from the backend.
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
     * The list of infoproviders is generated automatically when the component is shown.
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
        //console.log('error');
        dispatchMessage({type: "reportError", message: 'Fehler: ' + err});
    }

    /**
     * Handles the success of the fetchAllInfoprovider()-method.
     * The json from the response will be transformed to an array of jsonRefs and saved in infoprovider.
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
        setScenes(data);
    }

    return(
        <StepFrame
            heading="Willkommen bei VisuAnalytics!"
            hintContent={hintContents.sceneOverview}
        >
            <Grid container justify="space-evenly" className={classes.elementLargeMargin}>
                <Grid item container xs={12}>
                    Scene-Overview
                </Grid>
                <Grid item xs={6}>
                    <Typography variant={"h5"}>
                        Angelegte Szenen:
                    </Typography>
                </Grid>
                <Grid item container xs={6} justify={"flex-end"}>
                    <Grid item>
                        <Button variant={"contained"} size={"large"} color={"secondary"}
                                startIcon={<AddCircleIcon fontSize="small"/>}>
                            Neue Szene erstellen
                        </Button>
                    </Grid>
                </Grid>
                <Grid item container xs={12} justify={"center"}>
                    <SceneList scenes={scenes}/>
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
