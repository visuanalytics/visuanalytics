import React from "react";
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


interface DiagramOverviewProps {
    continueHandler: () => void;
    backHandler: () => void;
    createDiagramHandler: () => void;
    diagrams: Array<Diagram>;
    setDiagrams: (array: Array<Diagram>) => void;
};


function CloseIcon() {
    return null;
}

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
                    primary={item.name + " (" + resolveType(item.variant) + ")" + " - nutzt " + (item.sourceType==="Array"?"Arrays":"historisierte Daten")}
                    secondary={null}
                />
                <ListItemSecondaryAction>
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
        <Grid container justify="space-between">
            <Grid item xs={6}>
                <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.listFrame}>
                    <List>
                        {props.diagrams.map((item) => renderDiagramListItem(item))}
                    </List>
                </Box>
            </Grid>
            <Grid item xs={4}>
                <Button variant="outlined" size="large" color="primary" onClick={props.createDiagramHandler}>
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
        </Grid>
    )
};
