import React from "react";
import {StepFrame} from "../../CreateInfoProvider/StepFrame";
import {Grid} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {useStyles} from "../style";


interface EditDataSelectionProps {
    continueHandler: () => void;
    backHandler: () => void;
    editInfoProvider: () => void;
}

export const EditDataSelection: React.FC<EditDataSelectionProps> = (props) => {

    const classes = useStyles();

    return(
        <StepFrame heading={"Bearbeiten der Datenauswahl"} hintContent={"Bearbeiten der Datenauswahl!"}>
            <Grid container xs={12} justify={"space-evenly"}>
                DataSelection-List
                <Grid container justify="space-evenly" className={classes.elementLargeMargin}>
                    <Grid item container xs={12} justify={"space-between"}>
                        <Grid item>
                            <Button variant={"contained"} size={"large"} color={"primary"}
                                    onClick={props.backHandler}>
                                zurück
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color={"secondary"}
                                    onClick={() => props.editInfoProvider()}>
                                Speichern
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" size="large" color="primary"
                                    onClick={props.continueHandler}>
                                weiter
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </StepFrame>
    );
}
