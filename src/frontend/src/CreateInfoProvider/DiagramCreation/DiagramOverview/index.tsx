import React, {useEffect, useRef} from "react";
import {useStyles} from "../style";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {Diagram, diagramType, Plots} from "../../types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Box from "@material-ui/core/Box";
import {Dialog, DialogActions, DialogContent, DialogTitle, ListItemSecondaryAction} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import ImageIcon from '@material-ui/icons/Image';

interface DiagramOverviewProps {
    continueHandler: () => void;
    backHandler: () => void;
    createDiagramHandler: () => void;
    diagrams: Array<Diagram>;
    setDiagrams: (array: Array<Diagram>) => void;
    selectedDiagram: Diagram;
    setSelectedDiagram: (diagram: Diagram) => void;
    createPlots: (diagram: Diagram) => Array<Plots>;
    reportError: (message: string) => void;
    imageURL: string;
    setImageURL: (url: string) => void;
    infoProviderName: string;
}

/**
 * Component displaying first step of the diagram creation.
 * Displays an overview of all diagrams with the option for new diagrams, editing, deleting and preview.
 */
export const DiagramOverview: React.FC<DiagramOverviewProps> = (props) => {
    const classes = useStyles();

    //boolean flag used for opening and closing the remove dialog
    const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false);
    //name of the array that is currently to be removed, used for showing name in dialog
    const [itemToRemove, setItemToRemove] = React.useState("");
    //boolean flag used for opening and closing the preview dialog
    const [previewOpen, setPreviewOpen] = React.useState(false);


    /**
     * Opens the preview dialog for a selected diagram.
     * Prepares the necessary variables for being used with the fetcher
     */
    const openPreviewDialog = (name: string) => {
        //find the diagram with the given name and set is as current diagram
        for (let index = 0; index < props.diagrams.length; index++) {
            if (props.diagrams[index].name === name) {
                props.setSelectedDiagram(props.diagrams[index]);
                break;
            }
        }
        //open the preview
        setPreviewOpen(true);
    }

    /**
     * Handles the success of the getAll()-method.
     * The json from the response will be transformed to an array of jsonRefs and saved in infoprovider.
     * @param jsonData the answer from the backend
     */
    const handleSuccessDiagramPreview = React.useCallback((jsonData: any) => {
        //const data = jsonData;
        //console.log(data);
        //TODO: set the state that contains the current preview image path returned by the backend
    }, [])

    //extract method from props to use it in dependencies of handleErrorDiagramPreview
    const reportError = props.reportError
    /**
     * Handles the error-message if an error appears.
     * @param err the shown error
     */
    const handleErrorDiagramPreview = React.useCallback((err: Error) => {
        reportError("Fehler: Senden des Diagramms an das Backend fehlgeschlagen! (" + err.message + ")");
    }, [reportError])


    //this static value will be true as long as the component is still mounted
    //used to check if handling of a fetch request should still take place or if the component is not used anymore
    const isMounted = useRef(true);

    //creating none-props references to be used as dependency
    //this way, only when this specific props change the method is generated again
    const createPlots = props.createPlots;
    const selectedDiagram = props.selectedDiagram;
    const infoProviderName = props.infoProviderName;

    /**
     * Method to send a diagram to the backend for testing.
     * The standard hook "useCallFetch" is not used here since the fetch function has to be memorized
     * with useCallback in order to be used in useEffect.
     */
    const fetchDiagramPreview = React.useCallback(() => {
        //console.log("fetcher called");
        let url = "/visuanalytics/testdiagram"
        //if this variable is set, add it to the url
        if (process.env.REACT_APP_VA_SERVER_URL) url = process.env.REACT_APP_VA_SERVER_URL + url
        //setup a timer to stop the request after 5 seconds
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 5000);
        //starts fetching the contents from the backend
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json\n"
            },
            body: JSON.stringify({
                type: "diagram_custom",
                diagram_config: {
                    infoProviderName: infoProviderName,
                    type: "custom",
                    name: selectedDiagram.name,
                    plots: createPlots(selectedDiagram)
                }
            }),
            signal: abort.signal
        }).then((res: Response) => {
            //handles the response and gets the data object from it
            if (!res.ok) throw new Error(`Network response was not ok, status: ${res.status}`);
            return res.status === 204 ? {} : res.json();
        }).then((data) => {
            //success case - the data is passed to the handler
            //only called when the component is still mounted
            if (isMounted.current) handleSuccessDiagramPreview(data)
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted.current) handleErrorDiagramPreview(err)
        }).finally(() => clearTimeout(timer));
    }, [infoProviderName, selectedDiagram, createPlots, handleSuccessDiagramPreview, handleErrorDiagramPreview])

    //defines a cleanup method that sets isMounted to false when unmounting
    //will signal the fetchMethod to not work with the results anymore
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    //extract method from props to use it in dependencies of useEffect
    const setSelectedDiagram = props.setSelectedDiagram

    /**
     * Whenever the previewOpen state changes, this effect is called. If the preview is opened, a request is send to the backend.
     * Since selectedDiagram is in the dependencies and the fetcher method is also necessary as a dependency and has selectedDiagram as its own dependency,
     * it is necessary to check if the selectedDiagram is empty.
     * The rest of the component makes sure selectedDiagram is only set when a request to the backend is needed.
     */
    React.useEffect(() => {
            //console.log("effect");
            if (previewOpen && Object.keys(selectedDiagram).length !== 0) {
                fetchDiagramPreview();
                //after the first fetch happened, delete the selected diagram state
                //this will prevent an endless cycle of multiple rerender since fetchDiagramPreview
                setSelectedDiagram({} as Diagram)
            }
        }, [fetchDiagramPreview, previewOpen, selectedDiagram, setSelectedDiagram]
    );


    /**
     * Deletes a diagram selected by the user.
     * @param name The unique name of the diagram.
     */
    const openDeleteDialog = (name: string) => {
        setItemToRemove(name);
        setRemoveDialogOpen(true);
    }

    /**
     * Deletes the diagram currently selected in "itemToRemove"
     */
    const deleteDiagram = () => {
        props.setDiagrams(props.diagrams.filter((item) => {
            return item.name !== itemToRemove;
        }));
        setRemoveDialogOpen(false);
        //reset the value with a small delay so the user doesn't see the string get empty
        window.setTimeout(() => setItemToRemove(""), 200);
    }

    /**
     * Resolves a diagramType variable to a string to be displayed to the user.
     * @param type The diagram variant to be resolved.
     */
    const resolveType = (type: diagramType) => {
        switch (type) {
            case "verticalBarChart": {
                return "Säulendiagramm";
            }
            case "horizontalBarChart": {
                return "Balkendiagramm";
            }
            case "pieChart": {
                return "Tortendiagramm";
            }
            case "dotDiagram": {
                return "Punktdiagramm";
            }
            case "lineChart": {
                return "Liniendiagramm";
            }
        }
    }

    const renderDiagramListItem = (item: Diagram) => {
        return (
            <ListItem key={item.name} divider={true}>
                <ListItemText
                    primary={item.name + " (" + resolveType(item.variant) + ") - nutzt " + (item.sourceType === "Array" ? "Arrays" : "historisierte Daten")}
                    secondary={null}
                />
                <ListItemSecondaryAction>
                    <IconButton aria-label="preview" color="primary" onClick={() => openPreviewDialog(item.name)}>
                        <ImageIcon/>
                    </IconButton>
                    <IconButton aria-label="edit" color="primary"
                                onClick={() => console.log("EDIT NOT IMPLEMENTED YET")}>
                        <EditIcon/>
                    </IconButton>
                    <IconButton aria-label="delete" className={classes.redDeleteIcon}
                                onClick={() => openDeleteDialog(item.name)}>
                        <DeleteIcon/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        )
    }

    return (
        <Grid container justify="space-around">
            <Grid item xs={12}>
                <Typography variant="body1">
                    Folgende Diagramme wurden bereits erstellt:
                </Typography>
            </Grid>
            <Grid item xs={10}>
                <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.listFrame}>
                    <List>
                        {props.diagrams.map((item) => renderDiagramListItem(item))}
                    </List>
                </Box>
            </Grid>
            <Grid item>
                <Button variant="contained" size="large" color="secondary" onClick={props.createDiagramHandler}>
                    Diagramm hinzufügen
                </Button>
            </Grid>
            <Grid item container xs={12} justify="space-between">
                <Grid item>
                    <Button variant="contained" size="large" color="primary" onClick={props.backHandler}>
                        zurück
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" size="large" color="primary" onClick={props.continueHandler}>
                        weiter
                    </Button>
                </Grid>
            </Grid>
            <Dialog aria-labelledby="deleteDialog-title" open={removeDialogOpen}>
                <DialogTitle id="deleteDialog-title">
                    Diagramm '{itemToRemove}' wirklich löschen?
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Das erstellte Diagramm wird unwiderruflich gelöscht.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Grid container justify="space-between">
                        <Grid item>
                            <Button variant="contained" onClick={() => {
                                setRemoveDialogOpen(false);
                                window.setTimeout(() => setItemToRemove(""), 200);
                            }}>
                                abbrechen
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" onClick={deleteDiagram} className={classes.redDeleteButton}>
                                Löschen bestätigen
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
            <Dialog onClose={() => {
                setPreviewOpen(false);
                window.setTimeout(() => props.setImageURL(""), 200);
            }} aria-labelledby="previewDialog-title" open={previewOpen}>
                <DialogTitle id="previewDialog-title">
                    Vorschau des generierten Diagramm
                </DialogTitle>
                <DialogContent dividers>
                    <img width="500" height="600" alt="Vorschaubild Diagramm" src={props.imageURL}/>
                </DialogContent>
                <DialogActions>
                    <Grid item>
                        <Button variant="contained" onClick={() => {
                            setPreviewOpen(false);
                            window.setTimeout(() => props.setSelectedDiagram({} as Diagram), 200);
                        }}>
                            schließen
                        </Button>
                    </Grid>
                </DialogActions>
            </Dialog>
        </Grid>
    )
};
