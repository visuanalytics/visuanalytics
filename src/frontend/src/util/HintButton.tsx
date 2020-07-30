import React from "react";
import {IconButton, Tooltip} from "@material-ui/core";
import HelpIcon from '@material-ui/icons/Help';

interface Props {
    content: string,
}

export const HintButton: React.FC<Props> = ({content}) => {
    return (
        <Tooltip title={content}>
            <HelpIcon/>
        </Tooltip>
    )
}