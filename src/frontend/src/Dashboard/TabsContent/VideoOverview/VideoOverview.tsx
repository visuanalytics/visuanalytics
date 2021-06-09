import React from "react";
import {StepFrame} from "../../../CreateInfoProvider/StepFrame";
import {hintContents} from "../../../util/hintContents";
import {Grid} from "@material-ui/core";
import {useStyles} from "../../style";
import Button from "@material-ui/core/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {ComponentContext} from "../../../ComponentProvider";

interface VideoOverviewProps {
    test: string;
}

export const VideoOverview: React.FC<VideoOverviewProps> = (props) => {

    const classes = useStyles();
    const components = React.useContext(ComponentContext);

    return(
        <StepFrame
            heading="Willkommen bei VisuAnalytics!"
            hintContent={hintContents.videoOverview}
        >
            <Grid container justify="space-evenly" className={classes.elementLargeMargin}>
                <Grid item container xs={12}>
                    <Grid item xs={12}>
                        Video-Overview
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant={"contained"} size={"large"} color={"secondary"}
                                startIcon={<AddCircleIcon fontSize="small"/>}
                                onClick={() => components?.setCurrent("videoEditor")}>
                            Neuer Video-Job
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </StepFrame>
    );

}
