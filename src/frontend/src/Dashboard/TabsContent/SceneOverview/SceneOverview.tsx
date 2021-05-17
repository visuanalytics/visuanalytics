import React from "react";
import {StepFrame} from "../../../CreateInfoProvider/StepFrame";
import {hintContents} from "../../../util/hintContents";
import {Grid} from "@material-ui/core";
import {useStyles} from "../../style";

interface SceneOverviewProps {
    test: string;
}

export const SceneOverview: React.FC<SceneOverviewProps> = (props) => {

    const classes = useStyles();

    return(
        <StepFrame
            heading="Willkommen bei VisuAnalytics!"
            hintContent={hintContents.sceneOverview}
        >
            <Grid container justify="space-evenly" className={classes.elementLargeMargin}>
                <Grid item container xs={12}>
                    Scene-Overview
                </Grid>
            </Grid>
        </StepFrame>
    );

}
