import React from "react";
import { useStyles } from "../style";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";


interface ArrayDiagramCreatorProps {
    continueHandler: () => void;
    backHandler: () => void;
};


/**
 * Component displaying the second step in the creation of a new Info-Provider.
 * The state of this component handles the input made to its children.
 */
export const ArrayDiagramCreator: React.FC<ArrayDiagramCreatorProps> = (props) => {
    const classes = useStyles();


    return(
        <Grid container justify="space-between">
            <Grid item>
                <Button variant="contained" size="large" color="primary" onClick={props.backHandler}>
                    zurück
                </Button>
            </Grid>
            <Grid item className={classes.blockableButtonPrimary}>
                <Button variant="contained" size="large" color="primary" onClick={props.continueHandler}>
                    weiter
                </Button>
            </Grid>
        </Grid>
    )
};
