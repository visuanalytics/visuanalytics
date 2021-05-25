import React from "react";
import {StepFrame} from "../../CreateInfoProvider/StepFrame";
import {Grid} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {useStyles} from "../style";
import Box from "@material-ui/core/Box";
import {FormelList} from "./FormelList";
import {formelObj} from "../../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/formelObj";
import {DataSource} from "../../CreateInfoProvider";

interface EditCustomDataProps {
    continueHandler: () => void;
    backHandler: () => void;
    editInfoProvider: () => void;
    infoProvDataSources: Array<DataSource>;
    selectedDataSource: number;
}

export const EditCustomData: React.FC<EditCustomDataProps> = (props) => {

    const classes = useStyles();

    return (
        <StepFrame heading={"Bearbeiten der Formeln"} hintContent={"Bearbeiten der Formeln!"}>
            <Grid container justify={"space-evenly"}>
                <Grid container justify="space-evenly" className={classes.elementLargeMargin}>
                    <Grid item xs={12}>
                        <Box borderColor="primary.main" border={6} borderRadius={5}
                             className={classes.listFrame}>
                            <FormelList
                                customDataEdit={props.infoProvDataSources[props.selectedDataSource].customData}
                            />
                        </Box>
                    </Grid>
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
