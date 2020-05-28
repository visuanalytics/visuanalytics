import React from "react";
import {makeStyles} from "@material-ui/core";

interface Props {
    topic: string;
}

const useStyles = makeStyles({
    panel: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2E97C5",
        color: "white",
        fontSize: "x-large",
        width: 800,
        height: 80,
        transition: "0.2s",
        "&:hover": {
            backgroundColor: "#00638D",
        },
    }
});

export function TopicPanel({topic}: Props) {
    const classes = useStyles();
    return (
        <div className={classes.panel}>
            {topic}
        </div>
    )
}