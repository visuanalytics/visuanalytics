import React, {useCallback, useEffect, useRef} from "react";
import { useStyles } from "../style";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {Diagram, diagramType} from "../../index";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Box from "@material-ui/core/Box";
import {Dialog, DialogActions, DialogContent, DialogTitle, ListItemSecondaryAction} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import ImageIcon from '@material-ui/icons/Image';
import {fetchTimeOut, handleResponse} from "../../../util/fetchUtils";

interface DiagramOverviewProps {
    continueHandler: () => void;
    backHandler: () => void;
    createDiagramHandler: () => void;
    diagrams: Array<Diagram>;
    setDiagrams: (array: Array<Diagram>) => void;
    getTestImage: () => void;
    selectedDiagram: Diagram;
    setSelectedDiagram: (diagram: Diagram) => void;
};

/**
 * Component displaying the second step in the creation of a new Info-Provider.
 * The state of this component handles the input made to its children.
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
     * Prepares the necessary variables for being used with getTestImage
     */
    const openPreviewDialog = (name: string) => {
        //TODO: prepare data for sending to backend!
        //find the diagram with the given name and set is as current diagram
        for (let index=0; index < props.diagrams.length; index++) {
            if(props.diagrams[index].name===name) {
                props.setSelectedDiagram(props.diagrams[index]);
                break;
            }
        }
        //open the preview
        setPreviewOpen(true);
    }



    const selectedDiagram = props.selectedDiagram
    const getTestImage = props.getTestImage;
    const fetcher = React.useCallback(() => getTestImage(), [getTestImage])
    //whenever the preview is open, send a request to the backend for the selected diagram
    React.useEffect(() => {
        if(previewOpen&&Object.keys(selectedDiagram).length!==0) fetcher();
    }, [previewOpen, selectedDiagram, fetcher]);

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
        //reset the value with a small delay so the user doesnt see the string get empty
        window.setTimeout(() => setItemToRemove(""), 200);
    }

    /**
     * Resolves a diagramType variable to a string to be displayed to the user.
     * @param type The diagram variant to be resolved.
     */
    const resolveType = (type: diagramType) => {
        switch(type) {
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
                    primary={item.name + " (" + resolveType(item.variant) + ") - nutzt " + (item.sourceType==="Array"?"Arrays":"historisierte Daten")}
                    secondary={null}
                />
                <ListItemSecondaryAction>
                    <IconButton aria-label="preview" color="primary" onClick={() => openPreviewDialog(item.name)}>
                        <ImageIcon />
                    </IconButton>
                    <IconButton aria-label="edit" color="primary" onClick={() => console.log("EDIT NOT IMPLEMENTED YET")}>
                        <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" className={classes.redDeleteIcon} onClick={() => openDeleteDialog(item.name)}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        )
    }

    const handleClose = () => {
        setRemoveDialogOpen(false);
    };

    return(
        <Grid container justify="space-around">
            <Grid item xs={12}>
                <Typography variant="body1">
                    Folgende Diagramme wurde bereits erstellt:
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
            <Dialog onClose={() => setRemoveDialogOpen(false)} aria-labelledby="deleteDialog-title" open={removeDialogOpen}>
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
                            <Button variant="contained" onClick={() => setRemoveDialogOpen(false)}>
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
            <Dialog onClose={() => setPreviewOpen(false)} aria-labelledby="deleteDialog-title" open={previewOpen}>
                <DialogTitle id="deleteDialog-title">
                    Vorschau des generierten Diagramm
                </DialogTitle>
                <DialogContent dividers>
                    <img width="500" height="600" alt="Vorschaubild Diagramm" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Saeulendiagramm-Beispiel.svg/1024px-Saeulendiagramm-Beispiel.svg.png"/>
                </DialogContent>
                <DialogActions>
                    <Grid item>
                        <Button variant="contained" onClick={() => setPreviewOpen(false)}>
                            schließen
                        </Button>
                    </Grid>
                </DialogActions>
            </Dialog>
        </Grid>
    )
};
