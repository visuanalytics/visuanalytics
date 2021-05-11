import React from "react";
import {StepFrame} from "../../CreateInfoProvider/StepFrame";
import {hintContents} from "../../util/hintContents";
import {Grid} from "@material-ui/core";
import {useStyles} from "../style";

interface VideoOverviewProps {
    test: string;
}

export const VideoOverview: React.FC<VideoOverviewProps> = (props) => {

    const classes = useStyles();

    return(
        <StepFrame
            heading="Willkommen bei VisuAnalytics!"
            hintContent={hintContents.videoOverview}
        >
            <Grid container justify="space-evenly" className={classes.elementLargeMargin}>
                <Grid item container xs={12}>
                    Video-Overview
                </Grid>
            </Grid>
        </StepFrame>
    );

}
