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
import {answer, fetchAllBackendAnswer, jsonRef} from "../../types";
import {
    DataSource,
    Diagram,
    InfoProviderFromBackend, ListItemRepresentation,
    Schedule,
    SelectedDataItem
} from "../../../CreateInfoProvider/types";
import {FormelObj} from "../../../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/FormelObj";
import {transformBackendInfoProvider} from "../../../CreateInfoProvider/helpermethods";



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
     * The id from the infoprovider that should be edited
     */
    const [currentEditId, setCurrentEditId] = React.useState(0);

    /**
     * The name from the infoprovider that should be edited
     */
    const [currentEditName, setCurrentEditName] = React.useState("");

    /**
     * The boolean is used to open and close the confirm-delete-dialog.
     */
    const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false);

    /**
     * The boolean is used to open and close the confirm-edit-dialog.
     */
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);

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
        const data = jsonData as fetchAllBackendAnswer;
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
     * Handles the error-message if an error appears.
     * @param err the shown error
     */
    const handleErrorDelete = (err: Error) => {
        //console.log('error');
        dispatchMessage({type: "reportError", message: 'Fehler: ' + err});
    }

    /**
     * Request to the backend to delete an infoprovider.
     */
    const deleteInfoProvider = useCallFetch("visuanalytics/infoprovider/" + currentDeleteId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json\n"
            }
        }, handleSuccessDelete, handleErrorDelete
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

    /**
     * Handler method for successful calls to the backend for getting an infoprovider by id.
     * Takes the object of type InfoProviderFromBackend provided and transforms it to name/string, Array<DataSource>
     * and Array<Diagram> to use it in editing.
     * @param jsonData
     */
    const handleSuccessEdit = (jsonData: any) => {
        console.log(jsonData);
        const data = jsonData as InfoProviderFromBackend;
        //transform the infoProvider to frontend format
        const infoProvider = transformBackendInfoProvider(data);
        components?.setCurrent("editInfoProvider", {infoProvId: currentEditId, infoProvider: infoProvider})
    }

    /**
     * Handles the error-message if an error appears.
     * @param err the shown error
     */
    const handleErrorEdit = (err: Error) => {
        //console.log('error');
        dispatchMessage({type: "reportError", message: 'Fehler: ' + err});
    }

    const editInfoProvider = useCallFetch("/visuanalytics/infoprovider/" + currentEditId, {
            method: "GET"
        }, handleSuccessEdit, handleErrorEdit
    );

    const handleEditButton = (infoProv: jsonRef) => {
        setCurrentEditId(infoProv.infoprovider_id);
        setCurrentEditName(infoProv.infoprovider_name);
        setEditDialogOpen(true);
    }

    const confirmEdit = () => {
        console.log(currentEditId);
        editInfoProvider();
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
                                handleEditButton={(data: jsonRef) => handleEditButton(data)}
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
                <Dialog onClose={() => {
                    setRemoveDialogOpen(false);
                    window.setTimeout(() => {
                        setCurrentDeleteId(0)
                        setCurrentDeleteName("");
                    }, 200);
                }} aria-labelledby="deleteDialog-title"
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
                                        onClick={() => {
                                            setRemoveDialogOpen(false);
                                            window.setTimeout(() => {
                                                setCurrentDeleteName("");
                                            }, 200);
                                        }}>
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
                <Dialog onClose={() => setEditDialogOpen(false)} aria-labelledby="editDialog-title"
                        open={editDialogOpen}>
                    <DialogTitle id="editDialog-title">
                        "{currentEditName}" bearbeiten!
                    </DialogTitle>
                    <DialogContent dividers>
                        <Typography gutterBottom>
                            Wollen sie den Infoprovider: "{currentEditName}" bearbeiten?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Grid container justify="space-between">
                            <Grid item>
                                <Button variant="contained"
                                        onClick={() => setEditDialogOpen(false)}
                                        className={classes.redDeleteButton}>
                                    abbrechen
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color={"secondary"}
                                        onClick={() => confirmEdit()}
                                        >
                                    Bearbeiten
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
