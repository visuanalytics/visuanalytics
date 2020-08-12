import React from "react";
import { makeStyles, Button, Typography, Grid } from "@material-ui/core";
import { Topic } from "..";
import { HintButton } from "../../../util/HintButton"

interface TopicPanelProps {
    topic: Topic;
    topics: Topic[];
    selectTopicHandler: (topic: Topic) => void;
}

const useStyles = makeStyles({
    panel: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2E97C5",
        color: "white",
        fontSize: "x-large",
        width: '100%',
        height: 80,
        transition: "0.2s",
        "&:hover": {
            border: "solid #00638D 5px",
            backgroundColor: "#2E97C5",
        },
    }
});

export const TopicPanel: React.FC<TopicPanelProps> = (props) => {
    const classes = useStyles();
    const topicIds = props.topics.map(t => t.topicId);

    return (
        <Button
            className={classes.panel}
            style={topicIds.includes(props.topic.topicId) ? { border: "solid #00638D 7px" } : { border: "" }}
            onClick={() => {
                props.selectTopicHandler(props.topic);
            }
            }>
            <Grid item xs={1}></Grid>
            <Grid item xs={10}>
                {props.topic.topicName}
            </Grid>
            <Grid item xs={1}>
                <HintButton content={
                    <Typography gutterBottom>
                        {props.topic.topicInfo}
                    </Typography>}
                />
            </Grid>
        </Button>
    )
};