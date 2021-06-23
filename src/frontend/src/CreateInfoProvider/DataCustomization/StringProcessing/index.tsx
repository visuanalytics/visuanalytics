import React from "react";
import {useStyles} from "../../style";


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
        <React.Fragment>
        </React.Fragment>
    );
}
