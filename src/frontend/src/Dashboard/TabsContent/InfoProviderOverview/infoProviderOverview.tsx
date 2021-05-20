import React, {useEffect, useRef} from "react";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography} from "@material-ui/core";
import {ComponentContext} from "../../../ComponentProvider";
import {hintContents} from "../../../util/hintContents";
import {StepFrame} from "../../../CreateInfoProvider/StepFrame";
import {useStyles} from "../../style";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {InfoProviderList} from "./InfoProviderList";
import {useCallFetch} from "../../../Hooks/useCallFetch";
import {centerNotifcationReducer, CenterNotification} from "../../../util/CenterNotification";

/**
 * This type is used to correctly handle each single infoprovider from the response from the backend.
 */
export type jsonRef = {
    infoprovider_id: number;
    infoprovider_name: string;
}

/**
 * This type is needed because the answer of the backend consists of a list of jsonRef's.
 */
type requestBackendAnswer = Array<jsonRef>

//bisher nur zum testen verwendet.
type answer = {
    err_msg: string;
}

/**
 * Renders the whole infoprovider-overview component except the infoprovider-list
 */
export const InfoProviderOverview: React.FC = () => {

    const classes = useStyles();

    const components = React.useContext(ComponentContext);

    /**
     * The Infoprovider that will be shown in the Component.
     */
    const [infoprovider, setInfoProvider] = React.useState(new Array<jsonRef>());

    /**
     * The id from the infoprovider that should be deleted.
     */
    const [currentDeleteId, setCurrentDeleteId] = React.useState(0);

    /**
     * The name from the infoprovider that should be deleted.
     */
    const [currentDeleteName, setCurrentDeleteName] = React.useState("");

    /**
     * The boolean is used to open the confirm-delete-dialog.
     */
    const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false);

    //TODO: possibly place in higher level component
    /**
     * setup for error notification
     */
    const [message, dispatchMessage] = React.useReducer(centerNotifcationReducer, {
        open: false,
        message: "",
        severity: "error",
    });

    //this static value will be true as long as the component is still mounted
    //used to check if handling of a fetch request should still take place or if the component is not used anymore
    const isMounted = useRef(true);

    /**
     * Method to fetch all infoproviders from the backend.
     * The standard hook "useCallFetch" is not used here since the fetch function has to be memorized
     * with useCallback in order to be used in useEffect.
     */
    const fetchAllInfoprovider = React.useCallback(() => {
        let url = "/visuanalytics/infoprovider/all"
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
            if (isMounted) handleSuccessFetchAll(data)
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted) handleErrorFetchAll(err)
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
            fetchAllInfoprovider();
        }, [fetchAllInfoprovider]
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
        const data = jsonData as requestBackendAnswer;
        setInfoProvider(data);
    }


    //Requests all infoproviders from the backend that are saved in the database.

    /*const getAll = useCallFetch("/visuanalytics/infoprovider/all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json\n"
            }
        }, handleSuccessFetchAll, handleErrorFetchAll
    );*/

    /*
    Wird für das bearbeiten eines Infoprovider gebraucht!
    React.useEffect(() => {
            ...;
        }, [currentEditId]
    );
    */

    /**
     * Handles the success of the deleteInfoprovider()-method.
     * The right infoprovider must also be deleted from the-infoprovider-constant to render the new list correctly.
     * @param jsonData the answer from the backend
     */
    const handleSuccessDelete = (jsonData: any) => {

        const data = jsonData as answer;

        if (data.err_msg) {
            console.log("handlesuccess: " + data.err_msg)
        }

        for (let i: number = 0; i <= infoprovider.length - 1; i++) {
            if (infoprovider[i].infoprovider_id === currentDeleteId) {
                const arCopy = infoprovider.slice();
                arCopy.splice(i, 1);
                setInfoProvider(arCopy);
                return
            }
        }

    }

    /**
     * Request to the backend to delete an infoprovider.
     */
    const deleteInfoProvider = useCallFetch("visuanalytics/infoprovider/" + currentDeleteId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json\n"
            }
        }, handleSuccessDelete, handleErrorFetchAll
    );

    //only for test-purposes
    //test method that you only have to use once
    //only if the database is deleted you have to use the method again
    //there is no need for a success-method because the backend will not send an answer
    const testInfo = useCallFetch("/visuanalytics/infprovtestdatensatz", {
            method: "GET",
            headers: {
                "Content-Type": "application/json\n"
            }
        }, () => {
        }, handleErrorFetchAll
    );

    /**
     * helper-method to set the right id and name to delete the right infoprovider.
     * The method will open an confirm-dialog.
     * @param infoProv is the infoprovider that has to be deleted
     */
    const handleDeleteButton = (infoProv: jsonRef) => {
        setCurrentDeleteId(infoProv.infoprovider_id);
        setCurrentDeleteName(infoProv.infoprovider_name)
        setRemoveDialogOpen(true);
    }

    /**
     * The method is triggered when the delete-button in the confirm-dialog is triggered.
     * The infoprovider will be deleted and the confirm-dialog will be closed.
     */
    const confirmDelete = () => {
        deleteInfoProvider();
        setRemoveDialogOpen(false);
        window.setTimeout(() => {
            setCurrentDeleteId(0)
            setCurrentDeleteName("");
        }, 200);
    }

    return (
        <StepFrame
            heading="Willkommen bei VisuAnalytics!"
            hintContent={hintContents.infoProviderOverview}
        >
            <Grid container justify="space-evenly" className={classes.elementLargeMargin}>
                <Grid item container xs={12}>
                    <Grid item xs={6}>
                        <Typography variant={"h5"}>
                            Angelegte Info-Provider:
                        </Typography>
                    </Grid>
                    <Grid item container xs={6} justify={"flex-end"}>
                        <Grid item>
                            <Button variant={"contained"} size={"large"} color={"secondary"}
                                    startIcon={<AddCircleIcon fontSize="small"/>}
                                    onClick={() => components?.setCurrent("createInfoProvider")}>
                                Neuer Info-Provider
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Box borderColor="primary.main" border={6} borderRadius={5}
                             className={classes.listFrame}>
                            <InfoProviderList
                                infoprovider={infoprovider}
                                handleDeleteButton={(data: jsonRef) => handleDeleteButton(data)}
                            />
                        </Box>
                    </Grid>
                    <Grid item container xs={12} justify={"space-evenly"}>
                        <Grid item>
                            <Button variant={"contained"} size={"large"} color={"primary"}>
                                Historisierungs-Datenbank
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant={"contained"} size={"large"} color={"primary"}
                                    onClick={() => testInfo()}>
                                Test-InfoProvider
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Dialog onClose={() => setRemoveDialogOpen(false)} aria-labelledby="deleteDialog-title"
                        open={removeDialogOpen}>
                    <DialogTitle id="deleteDialog-title">
                        Infoprovider "{currentDeleteName}" wirklich löschen?
                    </DialogTitle>
                    <DialogContent dividers>
                        <Typography gutterBottom>
                            "{currentDeleteName}" wird unwiderruflich gelöscht.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Grid container justify="space-between">
                            <Grid item>
                                <Button variant="contained" color={"secondary"}
                                        onClick={() => setRemoveDialogOpen(false)}>
                                    abbrechen
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained"
                                        onClick={() => confirmDelete()}
                                        className={classes.redDeleteButton}>
                                    Löschen bestätigen
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>
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
