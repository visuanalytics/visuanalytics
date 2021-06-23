import React from "react";
import {useStyles} from "../../style";
import {StepFrame} from "../../StepFrame";
import Grid from "@material-ui/core/Grid";


interface StringProcessingProps {
    continueHandler: () => void;
    backHandler: () => void;

}

/**
 * Component for processing of strings - offers the user to create string replacements.
 */
export const StringProcessing: React.FC<StringProcessingProps> = (props) => {

    const classes = useStyles();




    return(
        <StepFrame
            heading="String-Verarbeitung"
            hintContent={null}
        >
            <Grid container>

            </Grid>
        </StepFrame>
    );
}
