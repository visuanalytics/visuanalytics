import React from "react";
import { makeStyles, Button } from "@material-ui/core";

interface TopicPanelProps {
    topic: string;
    selectTopicHandler: (topicName: string) => void;
    selectCompleteHandler: (completed: boolean) => void;
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

export const TopicPanel: React.FC<TopicPanelProps> = (props) => {
    const classes = useStyles();
    return (
        <Button
            className={classes.panel}
            onClick={() => {
                props.selectTopicHandler(props.topic);
                props.selectCompleteHandler(true);
            }
            }>
            {props.topic}
        </Button>
    )
}