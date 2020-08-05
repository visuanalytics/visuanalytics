import React from "react";
import {makeStyles, Button, Typography, Grid} from "@material-ui/core";
import { Topic } from "..";
import { useCallFetch } from "../../../Hooks/useCallFetch";
import { Param } from "../../../util/param";
import { getUrl } from "../../../util/fetchUtils";
import {HintButton} from "../../../util/HintButton";

interface TopicPanelProps {
    topic: Topic;
    topicId: number;
    selectTopicHandler: (topicId: number) => void;
    fetchParamHandler: (params: Param[]) => void;
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
    const fetchParams = useCallFetch(getUrl("/params/") + props.topic.topicId, {}, (data) => {
        props.fetchParamHandler(data);
    });

    return (
        <Button
            className={classes.panel}
            style={props.topic.topicId === props.topicId ? { border: "solid #00638D 7px" } : { border: "" }}
            onClick={() => {
                fetchParams();
                props.selectTopicHandler(props.topic.topicId);
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