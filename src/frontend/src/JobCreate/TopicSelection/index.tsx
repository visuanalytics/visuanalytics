import React, { useEffect } from "react";
import { ListItem, Divider, List, TextField, Button } from "@material-ui/core";
import { TopicPanel } from "./TopicPanel";
import { useStyles } from "../style";

interface TopicSelectionProps {
    selectedTopic: string,
    jobName: string,
    selectTopicHandler: (topicName: string) => void;
    enterJobNameHandler: (jobName: string) => void;
    selectCompleteHandler: (completed: boolean) => void;
}

export const TopicSelection: React.FC<TopicSelectionProps> = (props) => {
    // const topics: string[] = useFetch("/topics");
    const classes = useStyles();
    const topics: string[] = ["Wettervorhersage: Deutschland", "Wettervorhersage: lokal", "Bundesliga-Ergebnisse"]

    const jobName = props.jobName;
    const selectedTopic = props.selectedTopic;
    const selectCompleteHandler = props.selectCompleteHandler;
    useEffect(() => {
        const handleSelectComplete = () => {
            const selectCompleted = selectedTopic !== "" && jobName !== "";
            selectCompleteHandler(selectCompleted);
        };
        handleSelectComplete();
    }, [jobName, selectedTopic, selectCompleteHandler]);

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.enterJobNameHandler(event.target.value.trim());
    }

    const renderTopicPanel = (topic: string) => {
        return (
            <ListItem key={topic}>
                <TopicPanel
                    topic={topic}
                    selectedTopic={props.selectedTopic}
                    selectTopicHandler={props.selectTopicHandler} />
                <Divider />
            </ListItem>
        );
    }

    return (
        <div>
            <List>
                {topics.map(t => renderTopicPanel(t))}
            </List>
            <Divider />
            <div className={classes.paddingSmall}>
                <TextField className={classes.inputField}
                    value={props.jobName}
                    variant="outlined"
                    label="Job-Name"
                    onChange={handleInput}></TextField>
            </div>
        </div>
    );
};