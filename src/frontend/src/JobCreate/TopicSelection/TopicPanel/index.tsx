import React from "react";
import {
  makeStyles,
  Button,
  Typography,
  Grid,
  Theme,
  createStyles,
} from "@material-ui/core";
import { Topic } from "..";
import { HintButton } from "../../../util/HintButton";

interface TopicPanelProps {
  topic: Topic;
  topics: Topic[];
  multipleTopics: boolean;
  selectTopicHandler: (topic: Topic) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panel: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.palette.primary.main,
      color: "white",
      fontSize: "x-large",
      width: "100%",
      height: 80,
      transition: "0.2s",
      "&:hover": {
        border: "solid #00638D 5px",
        backgroundColor: theme.palette.primary.main,
      },
    },
    panelNumbers: {
      textAlign: "left",
      fontSize: 15,
      maxHeight: "60px",
      display: "flex",
      flexDirection: "column-reverse",
      overflow: "auto",
    },
    panelText: {
      textAlign: "right",
      fontSize: 15,
    },
  })
);

type IndexedTopic = [Topic, number];
const toIndexedTopic = (topic: Topic, idx: number): IndexedTopic => {
  return [topic, idx];
};

export const TopicPanel: React.FC<TopicPanelProps> = (props) => {
  const classes = useStyles();
  const topicIds = props.topics.map((t) => t.topicId);
  const topic = props.topic;

  const pos = props.topics
    .map((t, idx) => toIndexedTopic(t, idx))
    .filter((ti) => ti[0].topicId === topic.topicId)
    .map((ti) => ti[1] + 1);

  return (
    <Button
      className={classes.panel}
      style={
        topicIds.includes(topic.topicId)
          ? { border: "solid #00638D 7px" }
          : { border: "" }
      }
      onClick={() => {
        props.selectTopicHandler(topic);
      }}
    >
      <Grid item xs={2} className={classes.panelNumbers}>
        {props.multipleTopics && String(pos).split(",").join(", ")}
      </Grid>
      <Grid item xs={10}>
        {topic.topicName}
      </Grid>
      <Grid item xs={2} className={classes.panelText}>
        <HintButton
          content={<Typography gutterBottom>{topic.topicInfo}</Typography>}
        />
      </Grid>
    </Button>
  );
};
