import React from "react";
import { useStyles } from "../style";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {Diagram} from "../../index";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Box from "@material-ui/core/Box";


interface DiagramOverviewProps {
    continueHandler: () => void;
    backHandler: () => void;
    createDiagramHandler: () => void;
    diagrams: Array<Diagram>;
};


/**
 * Component displaying the second step in the creation of a new Info-Provider.
 * The state of this component handles the input made to its children.
 */
export const DiagramOverview: React.FC<DiagramOverviewProps> = (props) => {
    const classes = useStyles();


    const renderDiagramListItem = (item: Diagram) => {
        return (
            <ListItem key={item.name}>
                <ListItemText>
                    primary=item.name
                    secondary=null
                </ListItemText>
            </ListItem>
        )
    }

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
        </Grid>
    )
};
