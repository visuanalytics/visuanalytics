import React from "react";
import {StepFrame} from "../../CreateInfoProvider/StepFrame";
import {hintContents} from "../../util/hintContents";
import {Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {useStyles} from "../style";
import {ComponentContext} from "../../ComponentProvider";


interface EditSettingsOverviewProps {
    continueHandler: () => void;
    editInfoProvider: () => void;
}

export const EditSettingsOverview: React.FC<EditSettingsOverviewProps> = (props) => {

    const classes = useStyles();

    const components = React.useContext(ComponentContext);

    const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);

    const confirmCancel = () => {
        components?.setCurrent("dashboard")
    }

    return (
        <StepFrame
            heading={'Bearbeiten eines Infoproviders:'}
            hintContent={"Überblick"}>
            <Grid container justify={"space-evenly"}>
                Overview
                <Grid container justify="space-evenly" className={classes.elementLargeMargin}>
                    <Grid item container xs={12} justify={"space-between"}>
                        <Grid item>
                            <Button variant={"contained"} size={"large"}
                                    className={classes.redButton}
                                    onClick={() => setCancelDialogOpen(true)}>
                                Abbrechen
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color={"secondary"}
                                    onClick={() => props.editInfoProvider()}>
                                Speichern
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" size="large" color="primary" onClick={props.continueHandler}>
                                weiter
                            </Button>
                        </Grid>
                    </Grid>
                    <Dialog onClose={() => setCancelDialogOpen(false)} aria-labelledby="deleteDialog-title"
                            open={cancelDialogOpen}>
                        <DialogTitle id="deleteDialog-title">
                            Abbrechen!
                        </DialogTitle>
                        <DialogContent dividers>
                            <Typography gutterBottom>
                                Wollen sie wirklich abbrechen?
                                Ihre Änderungen gehen verloren!
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Grid container justify="space-between">
                                <Grid item>
                                    <Button variant="contained" color={"primary"}
                                            onClick={() => setCancelDialogOpen(false)}>
                                        zurück
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained"
                                            onClick={() => confirmCancel()}
                                            className={classes.redButton}>
                                        Abbrechen bestätigen
                                    </Button>
                                </Grid>
                            </Grid>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Grid>
        </StepFrame>
    )
}
